"""
VidyaFloww Admissions Workflow & Atomic Student Enrollment Service
"""

from django.db import transaction
from django.utils import timezone
from rest_framework import status

from common.exceptions import ConflictError, VidyaFlowError
from modules.academics.models import Section
from modules.students.services import create_student_with_enrollment
from platform_services.audit.services import record_audit_event
from .models import AdmissionApplication


@transaction.atomic
def approve_admission_application(
    *,
    application: AdmissionApplication,
    actor_membership,
    remarks: str = "",
) -> AdmissionApplication:
    if application.stage == AdmissionApplication.Stage.ENROLLED:
        raise ConflictError(message="Applicant is already enrolled as a student.")

    application.stage = AdmissionApplication.Stage.APPROVED
    application.decision_remarks = remarks
    application.decided_by_id = actor_membership.user_id
    application.decided_at = timezone.now()
    application.updated_by_id = actor_membership.user_id
    application.save(
        update_fields=["stage", "decision_remarks", "decided_by_id", "decided_at", "updated_by_id", "updated_at"]
    )

    record_audit_event(
        school_id=application.school_id,
        tenant_id=application.school.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Students",
        action="ADMISSION_APPROVED",
        target_type="AdmissionApplication",
        target_id=str(application.id),
        metadata={"application_number": application.application_number, "candidate": application.candidate_name},
    )
    return application


@transaction.atomic
def enroll_applicant_to_student(
    *,
    application: AdmissionApplication,
    actor_membership,
    admission_number: str,
    section: Section | None = None,
    roll_number: str = "",
    house_name: str = "Ashoka",
) -> AdmissionApplication:
    """
    Strictly enforces Master Prompt Section 10.1:
    An applicant cannot become an active Student unless the application is APPROVED
    and the authorized enrollment workflow is completed.
    """
    if application.stage == AdmissionApplication.Stage.ENROLLED or application.enrolled_student_id:
        raise ConflictError(
            message="This application has already been enrolled into the student directory.",
            code="ALREADY_ENROLLED",
        )

    if application.stage != AdmissionApplication.Stage.APPROVED:
        raise VidyaFlowError(
            message="Only APPROVED applications can be enrolled as active students.",
            code="APPLICATION_NOT_APPROVED",
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    student = create_student_with_enrollment(
        school=application.school,
        branch=application.branch,
        actor_membership=actor_membership,
        academic_session=application.academic_session,
        grade_class=application.applied_class,
        section=section,
        validated_data={
            "admission_number": admission_number,
            "full_name": application.candidate_name,
            "date_of_birth": application.date_of_birth,
            "gender": application.gender,
            "blood_group": application.blood_group,
            "category_quota": application.category_quota,
            "current_roll_number": roll_number,
            "house_name": house_name,
            "primary_guardian_name": application.primary_guardian_name,
            "guardian_phone": application.guardian_phone,
            "guardian_email": application.guardian_email,
            "guardian_occupation": application.guardian_occupation,
            "address": application.address,
            "city": application.city,
        },
    )

    application.stage = AdmissionApplication.Stage.ENROLLED
    application.enrolled_student = student
    application.updated_by_id = actor_membership.user_id
    application.save(update_fields=["stage", "enrolled_student", "updated_by_id", "updated_at"])

    record_audit_event(
        school_id=application.school_id,
        tenant_id=application.school.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Students",
        action="APPLICANT_CONVERTED_TO_STUDENT",
        target_type="Student",
        target_id=str(student.id),
        metadata={"application_number": application.application_number, "admission_number": student.admission_number},
    )
    return application
