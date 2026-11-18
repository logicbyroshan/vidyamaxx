"""
VidyaFloww Student Enrollment, Promotion & Lifecycle Services
"""

from django.db import transaction
from rest_framework import status

from common.exceptions import ConflictError, VidyaFlowError
from modules.academics.models import AcademicSession, GradeClass, Section
from platform_services.audit.services import record_audit_event
from .models import Guardian, Student, StudentEnrollment, StudentGuardianLink, StudentLifecycleEvent


@transaction.atomic
def create_student_with_enrollment(
    *,
    school,
    branch,
    actor_membership,
    validated_data: dict,
    academic_session: AcademicSession | None = None,
    grade_class: GradeClass | None = None,
    section: Section | None = None,
) -> Student:
    adm_no = validated_data["admission_number"].strip()
    if Student.all_objects.filter(school=school, admission_number__iexact=adm_no).exists():
        raise ConflictError(
            message=f"Student with admission number '{adm_no}' already exists in this school.",
            code="DUPLICATE_ADMISSION_NUMBER",
            errors={"admission_number": ["This admission number already exists."]},
        )

    session = academic_session or AcademicSession.objects.filter(school=school, is_current=True).first()
    g_class = grade_class or validated_data.get("current_grade_class")
    sec = section or validated_data.get("current_section")

    class_sec_label = validated_data.get("class_section_label") or (
        f"{g_class.numeric_grade}-{sec.name}" if g_class and sec else (g_class.name if g_class else "10-A")
    )

    student = Student.objects.create(
        school=school,
        branch=branch,
        created_by_id=actor_membership.user_id if actor_membership else None,
        current_academic_session=session,
        current_grade_class=g_class,
        current_section=sec,
        class_section_label=class_sec_label,
        **{
            k: v
            for k, v in validated_data.items()
            if k not in {"current_academic_session", "current_grade_class", "current_section", "class_section_label"}
        },
    )

    if session and g_class:
        StudentEnrollment.objects.create(
            school=school,
            branch=branch,
            created_by_id=actor_membership.user_id if actor_membership else None,
            student=student,
            academic_session=session,
            grade_class=g_class,
            section=sec,
            roll_number=student.current_roll_number,
            house_name=student.house_name,
            enrollment_status=StudentEnrollment.EnrollmentStatus.ACTIVE,
        )

    if student.primary_guardian_name and student.guardian_phone:
        guardian = Guardian.objects.create(
            school=school,
            branch=branch,
            full_name=student.primary_guardian_name,
            phone=student.guardian_phone,
            email=student.guardian_email,
            occupation=student.guardian_occupation,
        )
        StudentGuardianLink.objects.create(
            school=school,
            branch=branch,
            student=student,
            guardian=guardian,
            relationship="father",
            is_primary_contact=True,
        )

    StudentLifecycleEvent.objects.create(
        school=school,
        branch=branch,
        created_by_id=actor_membership.user_id if actor_membership else None,
        student=student,
        event_type=StudentLifecycleEvent.EventType.ENROLLED,
        to_session_label=session.name if session else "",
        to_class_label=class_sec_label,
        reason="Initial student enrollment",
    )

    record_audit_event(
        school_id=school.id,
        tenant_id=school.tenant_id,
        actor_user_id=actor_membership.user_id if actor_membership else None,
        actor_name=actor_membership.user.full_name if actor_membership else "System",
        actor_role_label=actor_membership.user_type if actor_membership else "SYSTEM",
        category="Students",
        action="STUDENT_ENROLLED",
        target_type="Student",
        target_id=str(student.id),
        metadata={"admission_number": student.admission_number, "class_section": class_sec_label},
    )
    return student


@transaction.atomic
def promote_student_to_session(
    *,
    student: Student,
    target_session: AcademicSession,
    target_grade_class: GradeClass,
    target_section: Section | None,
    new_roll_number: str = "",
    final_gpa=None,
    final_attendance_pct=None,
    remarks: str = "",
    actor_membership=None,
) -> StudentEnrollment:
    """
    Promotes a student to a new AcademicSession without overwriting prior session enrollment rows.
    """
    if target_session.school_id != student.school_id or target_grade_class.school_id != student.school_id:
        raise VidyaFlowError(
            message="Target session or class belongs to a different school.",
            code="CROSS_SCHOOL_PROMOTION_FORBIDDEN",
            status_code=status.HTTP_403_FORBIDDEN,
        )

    if StudentEnrollment.objects.filter(student=student, academic_session=target_session).exists():
        raise ConflictError(
            message=f"Student is already enrolled in session '{target_session.name}'.",
            code="ALREADY_ENROLLED_IN_SESSION",
        )

    prior_enrollment = (
        StudentEnrollment.objects.filter(student=student, enrollment_status=StudentEnrollment.EnrollmentStatus.ACTIVE)
        .order_by("-created_at")
        .first()
    )
    old_session_label = prior_enrollment.academic_session.name if prior_enrollment else ""
    old_class_label = student.class_section_label

    if prior_enrollment:
        prior_enrollment.enrollment_status = StudentEnrollment.EnrollmentStatus.PROMOTED
        prior_enrollment.final_gpa = final_gpa if final_gpa is not None else student.gpa
        prior_enrollment.final_attendance_pct = (
            final_attendance_pct if final_attendance_pct is not None else student.attendance_pct
        )
        prior_enrollment.save(
            update_fields=["enrollment_status", "final_gpa", "final_attendance_pct", "updated_at"]
        )

    new_enrollment = StudentEnrollment.objects.create(
        school=student.school,
        branch=student.branch,
        created_by_id=actor_membership.user_id if actor_membership else None,
        student=student,
        academic_session=target_session,
        grade_class=target_grade_class,
        section=target_section,
        roll_number=new_roll_number or student.current_roll_number,
        house_name=student.house_name,
        enrollment_status=StudentEnrollment.EnrollmentStatus.ACTIVE,
        promoted_from=prior_enrollment,
        remarks=remarks,
    )

    new_class_label = (
        f"{target_grade_class.numeric_grade}-{target_section.name}"
        if target_section
        else target_grade_class.name
    )
    student.current_academic_session = target_session
    student.current_grade_class = target_grade_class
    student.current_section = target_section
    if new_roll_number:
        student.current_roll_number = new_roll_number
    student.class_section_label = new_class_label
    student.updated_by_id = actor_membership.user_id if actor_membership else None
    student.save(
        update_fields=[
            "current_academic_session",
            "current_grade_class",
            "current_section",
            "current_roll_number",
            "class_section_label",
            "updated_by_id",
            "updated_at",
        ]
    )

    StudentLifecycleEvent.objects.create(
        school=student.school,
        branch=student.branch,
        created_by_id=actor_membership.user_id if actor_membership else None,
        student=student,
        event_type=StudentLifecycleEvent.EventType.PROMOTED,
        from_session_label=old_session_label,
        to_session_label=target_session.name,
        from_class_label=old_class_label,
        to_class_label=new_class_label,
        reason=remarks or "Session promotion",
    )

    record_audit_event(
        school_id=student.school_id,
        tenant_id=student.school.tenant_id,
        actor_user_id=actor_membership.user_id if actor_membership else None,
        actor_name=actor_membership.user.full_name if actor_membership else "System",
        actor_role_label=actor_membership.user_type if actor_membership else "SYSTEM",
        category="Students",
        action="STUDENT_PROMOTED",
        target_type="Student",
        target_id=str(student.id),
        metadata={"from_class": old_class_label, "to_class": new_class_label, "session": target_session.name},
    )
    return new_enrollment


@transaction.atomic
def change_student_lifecycle_status(
    *,
    student: Student,
    new_status: str,
    event_type: str,
    reason: str = "",
    actor_membership=None,
) -> Student:
    student.status = new_status
    student.updated_by_id = actor_membership.user_id if actor_membership else None
    student.save(update_fields=["status", "updated_by_id", "updated_at"])

    StudentLifecycleEvent.objects.create(
        school=student.school,
        branch=student.branch,
        created_by_id=actor_membership.user_id if actor_membership else None,
        student=student,
        event_type=event_type,
        from_class_label=student.class_section_label,
        to_class_label=student.class_section_label if new_status == Student.Status.ACTIVE else new_status.upper(),
        reason=reason,
    )

    record_audit_event(
        school_id=student.school_id,
        tenant_id=student.school.tenant_id,
        actor_user_id=actor_membership.user_id if actor_membership else None,
        category="Students",
        action=f"STUDENT_{event_type}",
        target_type="Student",
        target_id=str(student.id),
        metadata={"new_status": new_status, "reason": reason},
    )
    return student
