"""
VidyaFloww Payment Gateway API & Signed Webhook Receiver
"""

from decimal import Decimal
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from common.exceptions import ForbiddenActionError, VidyaFlowError
from common.permissions import HasWorkDivisionAccess, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from core.users.models import Membership
from modules.finance.models import StudentFeeInvoice
from modules.finance.services import collect_fee_payment
from .services import create_payment_order, verify_razorpay_signature


class CreatePaymentOrderSerializer(serializers.Serializer):
    invoice_id = serializers.UUIDField()
    amount_inr = serializers.DecimalField(max_digits=12, decimal_places=2)
    provider = serializers.ChoiceField(choices=["razorpay", "cashfree"], default="razorpay")


class PaymentWebhookInputSerializer(serializers.Serializer):
    invoice_id = serializers.UUIDField()
    payment_id = serializers.CharField(max_length=100)
    amount_inr = serializers.DecimalField(max_digits=12, decimal_places=2)
    payment_mode = serializers.CharField(max_length=50, default="Razorpay Online")
    event_id = serializers.CharField(max_length=100)


class PaymentOrderCreateView(APIView):
    work_division = WorkDivision.FEES_FINANCE
    permission_classes = [HasWorkDivisionAccess]
    serializer_class = CreatePaymentOrderSerializer

    @extend_schema(operation_id="v1_integrations_payment_create_order")
    def post(self, request):
        resolve_user_tenant_context(request, require_school=True)
        serializer = CreatePaymentOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        invoice = get_object_or_404(StudentFeeInvoice, id=d["invoice_id"], school=request.school)
        if d["amount_inr"] <= 0:
            raise VidyaFlowError(message="Order amount must be positive.", code="INVALID_AMOUNT")
        order_payload, is_live = create_payment_order(
            invoice_number=invoice.invoice_number,
            amount_inr=Decimal(str(d["amount_inr"])),
            provider=d["provider"],
        )
        return Response({"success": True, "live_gateway": is_live, "order": order_payload}, status=status.HTTP_201_CREATED)


class PaymentGatewayWebhookView(APIView):
    """
    Trusted server-to-server webhook endpoint verifying X-Razorpay-Signature HMAC
    before atomically posting an idempotent FeeReceipt.
    """

    permission_classes = [AllowAny]
    serializer_class = PaymentWebhookInputSerializer

    @extend_schema(operation_id="v1_integrations_payment_webhook")
    def post(self, request):
        signature = request.META.get("HTTP_X_RAZORPAY_SIGNATURE", "")
        if not verify_razorpay_signature(request.body, signature):
            raise ForbiddenActionError(
                message="Invalid or missing payment gateway HMAC signature.",
                code="INVALID_WEBHOOK_SIGNATURE",
            )
        serializer = PaymentWebhookInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data

        invoice = get_object_or_404(StudentFeeInvoice, id=d["invoice_id"])
        system_actor = (
            Membership.objects.select_related("user")
            .filter(school_id=invoice.school_id, is_active=True)
            .first()
        )
        if not system_actor:
            raise VidyaFlowError(message="No active school membership to record receipt.", code="TENANT_CONFIG_ERROR")

        receipt, created = collect_fee_payment(
            invoice=invoice,
            actor_membership=system_actor,
            amount_inr=Decimal(str(d["amount_inr"])),
            receipt_number=f"GW-{d['payment_id'][:32]}",
            payment_mode=d.get("payment_mode", "Razorpay Online"),
            period_label="Online Gateway Webhook Settlement",
            idempotency_key=f"webhook:{d['event_id']}",
        )
        return Response(
            {
                "success": True,
                "receipt_id": str(receipt.id),
                "receipt_number": receipt.receipt_number,
                "idempotent_replay": not created,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
