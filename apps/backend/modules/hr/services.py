"""
VidyaFloww Staff Master Creation & Provisioning Services
"""

from django.db import transaction
from rest_framework import status
from common.exceptions import VidyaFlowError
from core.accounts.models import User
from core.users.models import Membership, UserType
from platform_services.audit.services import record_audit_event
from .models import StaffProfile


@transaction.atomic
def create_staff_member(*, school, branch, actor_membership, validated_data: dict) -> StaffProfile:
    emp_code = validated_data["employee_code"].strip()
    if StaffProfile.all_objects.filter(school=school, employee_code__iexact=emp_code).exists():
        raise VidyaFlowError(
            message=f"Staff member with employee code '{emp_code}' already exists in this school.",
            code="DUPLICATE_EMPLOYEE_CODE",
            status_code=status.HTTP_400_BAD_REQUEST,
            errors={"employee_code": ["This employee code already exists."]},
        )

    email = (validated_data.get("email") or "").strip().lower() or None
    phone = (validated_data.get("phone") or "").strip() or None
    full_name = validated_data["full_name"].strip()

    user = None
    membership = None
    if email:
        user = User.objects.filter(email__iexact=email).first()
        if not user:
            user = User.objects.create_user(
                email=email,
                phone=phone if phone and not User.objects.filter(phone=phone).exists() else None,
                full_name=full_name,
                is_verified=True,
            )
        membership, _ = Membership.objects.get_or_create(
            user=user,
            tenant=school.tenant,
            school=school,
            user_type=UserType.STAFF,
            defaults={"default_branch": branch, "is_active": True},
        )

    staff = StaffProfile.objects.create(
        school=school,
        branch=branch,
        created_by_id=actor_membership.user_id,
        user=user,
        membership=membership,
        **validated_data,
    )

    record_audit_event(
        school_id=school.id,
        tenant_id=school.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Settings",
        action="STAFF_PROFILE_CREATED",
        target_type="StaffProfile",
        target_id=str(staff.id),
        metadata={"employee_code": staff.employee_code, "full_name": staff.full_name},
    )
    return staff
