"""
VidyaFloww Tenant, School & Subscription Domain Services
"""

from django.db import transaction
from django.utils import timezone
from rest_framework import status

from common.exceptions import ForbiddenActionError, VidyaFlowError
from core.users.models import Membership, UserType
from platform_services.audit.services import record_audit_event
from .models import CustomerSubscription, School


@transaction.atomic
def update_school_profile(*, school: School, actor_membership: Membership, validated_data: dict) -> School:
    for field, value in validated_data.items():
        setattr(school, field, value)
    school.save()

    record_audit_event(
        school_id=school.id,
        tenant_id=school.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Settings",
        action="SCHOOL_PROFILE_UPDATED",
        target_type="School",
        target_id=str(school.id),
        metadata={"updated_fields": list(validated_data.keys())},
    )
    return school


@transaction.atomic
def update_subscription_payment_method(*, subscription: CustomerSubscription, actor_membership: Membership, brand: str, last4: str) -> CustomerSubscription:
    """Both Super Admin and delegated Super Executive may update payment methods."""
    if actor_membership.user_type not in {UserType.SUPER_ADMIN, UserType.SUPER_EXECUTIVE}:
        raise ForbiddenActionError(message="Platform administrative access required.")

    subscription.payment_method_brand = brand[:40]
    subscription.payment_method_last4 = last4[-4:]
    subscription.save(update_fields=["payment_method_brand", "payment_method_last4", "updated_at"])

    record_audit_event(
        tenant_id=subscription.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Finance",
        action="SUBSCRIPTION_PAYMENT_METHOD_UPDATED",
        target_type="CustomerSubscription",
        target_id=str(subscription.id),
        metadata={"brand": subscription.payment_method_brand, "last4": subscription.payment_method_last4},
    )
    return subscription


@transaction.atomic
def cancel_customer_subscription(*, subscription: CustomerSubscription, actor_membership: Membership, reason: str = "") -> CustomerSubscription:
    """
    Strictly enforces Master Prompt Section 7.1:
    Super Executive must NOT be able to cancel the subscription.
    Only Super Admin owning/governing the CustomerTenant can cancel.
    """
    if actor_membership.user_type != UserType.SUPER_ADMIN:
        record_audit_event(
            tenant_id=subscription.tenant_id,
            actor_user_id=actor_membership.user_id,
            actor_name=actor_membership.user.full_name,
            actor_role_label=actor_membership.user_type,
            category="Permissions",
            action="SUBSCRIPTION_CANCEL_DENIED",
            target_type="CustomerSubscription",
            target_id=str(subscription.id),
            status="Blocked",
            metadata={"attempted_by_type": actor_membership.user_type},
        )
        raise ForbiddenActionError(
            message="Super Executives are prohibited from cancelling platform subscriptions. Only the Super Admin may cancel.",
            code="SUPER_ADMIN_REQUIRED",
        )

    if subscription.status == CustomerSubscription.Status.CANCELLED:
        raise VidyaFlowError(
            message="Subscription is already cancelled.",
            code="ALREADY_CANCELLED",
            status_code=status.HTTP_409_CONFLICT,
        )

    subscription.status = CustomerSubscription.Status.CANCELLED
    subscription.cancelled_at = timezone.now()
    subscription.cancelled_by = actor_membership.user
    subscription.cancellation_reason = reason
    subscription.save(
        update_fields=["status", "cancelled_at", "cancelled_by", "cancellation_reason", "updated_at"]
    )

    record_audit_event(
        tenant_id=subscription.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Finance",
        action="SUBSCRIPTION_CANCELLED",
        target_type="CustomerSubscription",
        target_id=str(subscription.id),
    )
    return subscription
