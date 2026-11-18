"""
VidyaFloww Academics Services
"""

from django.db import transaction
from platform_services.audit.services import record_audit_event
from .models import AcademicSession, ClassSubjectMapping, GradeClass, Section, Subject


@transaction.atomic
def activate_academic_session(*, session: AcademicSession, actor_membership) -> AcademicSession:
    AcademicSession.objects.filter(school=session.school, is_current=True).exclude(id=session.id).update(
        is_current=False
    )
    session.is_current = True
    session.updated_by_id = actor_membership.user_id
    session.save(update_fields=["is_current", "updated_by_id", "updated_at"])

    school = session.school
    school.active_academic_session_label = session.name
    school.save(update_fields=["active_academic_session_label", "updated_at"])

    record_audit_event(
        school_id=school.id,
        tenant_id=school.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Settings",
        action="ACADEMIC_SESSION_ACTIVATED",
        target_type="AcademicSession",
        target_id=str(session.id),
        metadata={"session_name": session.name},
    )
    return session


@transaction.atomic
def create_or_update_class_subject(
    *,
    school,
    actor_membership,
    grade_class: GradeClass,
    subject_code: str,
    subject_name: str,
    curriculum_tier: str,
    weekly_periods: int,
    theory_marks: int,
    internal_marks: int,
    teacher_in_charge: str = "",
    syllabus_chapters: int = 12,
    prescribed_book: dict | None = None,
    status_val: str = "Active",
) -> ClassSubjectMapping:
    subject, _ = Subject.objects.get_or_create(
        school=school,
        code=subject_code.strip().upper(),
        defaults={
            "name": subject_name.strip(),
            "curriculum_tier": curriculum_tier,
            "is_elective": status_val == "Elective" or curriculum_tier == "Elective",
            "created_by_id": actor_membership.user_id,
        },
    )
    if subject.name != subject_name.strip():
        subject.name = subject_name.strip()
        subject.curriculum_tier = curriculum_tier
        subject.save(update_fields=["name", "curriculum_tier", "updated_at"])

    mapping, _ = ClassSubjectMapping.objects.update_or_create(
        school=school,
        grade_class=grade_class,
        subject=subject,
        defaults={
            "weekly_periods": weekly_periods,
            "theory_marks": theory_marks,
            "internal_marks": internal_marks,
            "teacher_in_charge": teacher_in_charge,
            "syllabus_chapters": syllabus_chapters,
            "prescribed_book_json": prescribed_book or {},
            "status": status_val,
            "updated_by_id": actor_membership.user_id,
        },
    )
    return mapping
