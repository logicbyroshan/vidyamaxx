from drf_spectacular.utils import extend_schema
from rest_framework import serializers as drf_serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.exceptions import VidyaFlowError
from common.permissions import (
    HasWorkDivisionAccess,
    IsAuthenticatedPlatformUser,
    IsAuthenticatedTenantMember,
    IsSuperAdminOnly,
    resolve_user_tenant_context,
)
from core.permissions.models import WorkDivision
from .models import CustomerSubscription
from .serializers import SchoolSerializer, SubscriptionSerializer
from .services import cancel_customer_subscription, update_school_profile, update_subscription_payment_method


class CurrentSchoolView(APIView):
    """GET/PATCH active school profile & branding (backs /settings)."""

    work_division = WorkDivision.SCHOOL_ADMINISTRATION
    serializer_class = SchoolSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticatedTenantMember()]
        return [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        return Response({"success": True, "school": SchoolSerializer(request.school).data})

    def patch(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = SchoolSerializer(request.school, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        school = update_school_profile(
            school=request.school,
            actor_membership=membership,
            validated_data=serializer.validated_data,
        )
        return Response({"success": True, "school": SchoolSerializer(school).data})


class PlatformSubscriptionView(APIView):
    """GET active SaaS subscription & billing invoices (backs /license)."""

    permission_classes = [IsAuthenticatedPlatformUser]
    serializer_class = SubscriptionSerializer

    def get(self, request):
        membership = resolve_user_tenant_context(request, require_school=False)
        sub = (
            CustomerSubscription.objects.select_related("plan", "tenant")
            .prefetch_related("invoices")
            .filter(tenant_id=membership.tenant_id)
            .order_by("-created_at")
            .first()
        )
        if not sub:
            raise VidyaFlowError(
                message="No subscription record found for this tenant.",
                code="SUBSCRIPTION_NOT_FOUND",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        return Response({"success": True, "subscription": SubscriptionSerializer(sub).data})


class PaymentMethodUpdateInputSerializer(drf_serializers.Serializer):
    brand = drf_serializers.CharField(max_length=40, default="VISA")
    last4 = drf_serializers.CharField(max_length=4)


class SubscriptionCancelInputSerializer(drf_serializers.Serializer):
    reason = drf_serializers.CharField(required=False, allow_blank=True, default="")


@extend_schema(request=PaymentMethodUpdateInputSerializer, responses={200: SubscriptionSerializer})
class SubscriptionPaymentMethodView(APIView):
    """Allows Super Admin or delegated Super Executive to update payment card summary."""

    permission_classes = [IsAuthenticatedPlatformUser]

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=False)
        sub = CustomerSubscription.objects.filter(tenant_id=membership.tenant_id).order_by("-created_at").first()
        if not sub:
            raise VidyaFlowError(message="Subscription not found.", code="SUBSCRIPTION_NOT_FOUND", status_code=404)
        brand = str(request.data.get("brand", "VISA"))
        last4 = str(request.data.get("last4", ""))
        if len(last4) < 4 or not last4[-4:].isdigit():
            raise VidyaFlowError(message="Valid last 4 digits required.", code="VALIDATION_ERROR")
        updated = update_subscription_payment_method(
            subscription=sub, actor_membership=membership, brand=brand, last4=last4
        )
        return Response({"success": True, "subscription": SubscriptionSerializer(updated).data})


@extend_schema(request=SubscriptionCancelInputSerializer, responses={200: SubscriptionSerializer})
class SubscriptionCancelView(APIView):
    """Strictly Super Admin only; Super Executive receives 403 Forbidden."""

    permission_classes = [IsSuperAdminOnly]

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=False)
        sub = CustomerSubscription.objects.filter(tenant_id=membership.tenant_id).order_by("-created_at").first()
        if not sub:
            raise VidyaFlowError(message="Subscription not found.", code="SUBSCRIPTION_NOT_FOUND", status_code=404)
        updated = cancel_customer_subscription(
            subscription=sub,
            actor_membership=membership,
            reason=str(request.data.get("reason", "")),
        )
        return Response({"success": True, "subscription": SubscriptionSerializer(updated).data})
