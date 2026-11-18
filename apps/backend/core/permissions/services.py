"""
VidyaFloww Responsibility Assignment & Security Policy Services
"""

from django.db import transaction
from django.utils import timezone
from rest_framework import status

from common.exceptions import VidyaFlowError
from core.users.models import Membership, UserType
from platform_services.audit.services import record_audit_event
from .models import (
    ALLOWED_ACTIONS,
    ResponsibilityAssignmentHistory,
    SecurityPolicy,
    StaffResponsibilityAssignment,
)


def _snapshot(assignment: StaffResponsibilityAssignment) -> dict:
    return {
        "work_division": assignment.work_division,
        "submodule_code": assignment.submodule_code,
        "actions": assignment.actions,
        "branch_ids": [str(x) for x in (assignment.branch_ids or [])],
        "grade_class_ids": [str(x) for x in (assignment.grade_class_ids or [])],
        "section_ids": [str(x) for x in (assignment.section_ids or [])],
        "subject_ids": [str(x) for x in (assignment.subject_ids or [])],
        "student_ids": [str(x) for x in (assignment.student_ids or [])],
        "valid_from": assignment.valid_from.isoformat() if assignment.valid_from else None,
        "valid_until": assignment.valid_until.isoformat() if assignment.valid_until else None,
        "revoked_at": assignment.revoked_at.isoformat() if assignment.revoked_at else None,
    }


@transaction.atomic
def assign_staff_responsibility(
    *,
    school,
    actor_membership: Membership,
    target_membership: Membership,
    work_division: str,
    actions: list[str],
    submodule_code: str = "*",
    branch_ids: list | None = None,
    grade_class_ids: list | None = None,
    section_ids: list | None = None,
    subject_ids: list | None = None,
    student_ids: list | None = None,
    valid_from=None,
    valid_until=None,
    notes: str = "",
) -> StaffResponsibilityAssignment:
    if target_membership.school_id != school.id:
        raise VidyaFlowError(
            message="Target membership does not belong to the active school.",
            code="CROSS_SCHOOL_MEMBERSHIP",
            status_code=status.HTTP_403_FORBIDDEN,
        )

    if target_membership.user_type != UserType.STAFF:
        raise VidyaFlowError(
            message="Work responsibilities can only be assigned to STAFF memberships.",
            code="INVALID_TARGET_USER_TYPE",
        )

    invalid_actions = [a for a in actions if a not in ALLOWED_ACTIONS]
    if not actions or invalid_actions:
        raise VidyaFlowError(
            message=f"Invalid permission actions: {invalid_actions or 'none provided'}.",
            code="VALIDATION_ERROR",
        )

    assignment = StaffResponsibilityAssignment.objects.create(
        school=school,
        created_by_id=actor_membership.user_id,
        granted_by_id=actor_membership.user_id,
        membership=target_membership,
        work_division=work_division,
        submodule_code=submodule_code,
        actions=actions,
        branch_ids=[str(x) for x in (branch_ids or [])],
        grade_class_ids=[str(x) for x in (grade_class_ids or [])],
        section_ids=[str(x) for x in (section_ids or [])],
        subject_ids=[str(x) for x in (subject_ids or [])],
        student_ids=[str(x) for x in (student_ids or [])],
        valid_from=valid_from or timezone.now(),
        valid_until=valid_until,
        notes=notes,
    )

    ResponsibilityAssignmentHistory.objects.create(
        school_id=school.id,
        assignment_id=assignment.id,
        membership_id=target_membership.id,
        event_type=ResponsibilityAssignmentHistory.EventType.GRANTED,
        actor_user_id=actor_membership.user_id,
        snapshot_json=_snapshot(assignment),
    )

    record_audit_event(
        school_id=school.id,
        tenant_id=school.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Permissions",
        action="RESPONSIBILITY_ASSIGNED",
        target_type="StaffResponsibilityAssignment",
        target_id=str(assignment.id),
        metadata={"staff_user_id": str(target_membership.user_id), "division": work_division, "actions": actions},
    )
    return assignment


@transaction.atomic
def revoke_staff_responsibility(*, assignment: StaffResponsibilityAssignment, actor_membership: Membership) -> StaffResponsibilityAssignment:
    if assignment.revoked_at is not None:
        return assignment

    assignment.revoked_at = timezone.now()
    assignment.revoked_by_id = actor_membership.user_id
    assignment.save(update_fields=["revoked_at", "revoked_by_id", "updated_at"])

    ResponsibilityAssignmentHistory.objects.create(
        school_id=assignment.school_id,
        assignment_id=assignment.id,
        membership_id=assignment.membership_id,
        event_type=ResponsibilityAssignmentHistory.EventType.REVOKED,
        actor_user_id=actor_membership.user_id,
        snapshot_json=_snapshot(assignment),
    )

    record_audit_event(
        school_id=assignment.school_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Permissions",
        action="RESPONSIBILITY_REVOKED",
        target_type="StaffResponsibilityAssignment",
        target_id=str(assignment.id),
    )
    return assignment


@transaction.atomic
def update_security_policy(*, school, actor_membership: Membership, validated_data: dict) -> SecurityPolicy:
    policy, _ = SecurityPolicy.objects.get_or_create(school=school)
    for k, v in validated_data.items():
        setattr(policy, k, v)
    policy.updated_by_id = actor_membership.user_id
    policy.save()

    record_audit_event(
        school_id=school.id,
        tenant_id=school.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Settings",
        action="SECURITY_POLICY_UPDATED",
        target_type="SecurityPolicy",
        target_id=str(policy.id),
        metadata=validated_data,
    )
    return policy
