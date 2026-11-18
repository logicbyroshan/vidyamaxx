from decimal import Decimal
from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from common.exceptions import ForbiddenActionError
from common.permissions import HasWorkDivisionAccess, IsAuthenticatedTenantMember, resolve_user_tenant_context
from core.permissions.models import WorkDivision
from modules.accounting.models import ChartOfAccount
from .models import FeeReceipt, FeeStructure, FeeTransaction, ScholarshipGrant, StudentFeeInvoice
from .services import collect_fee_payment, reverse_fee_receipt


class ChartOfAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChartOfAccount
        fields = ["id", "account_code", "account_name", "account_type", "balance_inr", "created_at"]
        read_only_fields = ["id", "created_at"]


class FeeStructureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeStructure
        fields = [
            "id",
            "academic_session",
            "grade_class_label",
            "base_tuition_inr",
            "lab_tech_fee_inr",
            "transport_fee_inr",
            "library_fee_inr",
            "annual_total_inr",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ScholarshipGrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScholarshipGrant
        fields = [
            "id",
            "student",
            "admission_number",
            "student_name",
            "scheme_name",
            "category",
            "waiver_pct",
            "waiver_amount_inr",
            "funding_agency",
            "sanction_ref",
            "status",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class FeeReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeReceipt
        fields = [
            "id",
            "receipt_number",
            "invoice",
            "admission_number",
            "student_name",
            "amount_inr",
            "payment_mode",
            "period_label",
            "cashier_name",
            "paid_at",
            "status",
            "reversal_reason",
            "reversed_at",
            "idempotency_key",
        ]
        read_only_fields = ["id", "paid_at", "status", "reversed_at"]


class FeeTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeTransaction
        fields = ["id", "invoice", "receipt", "transaction_type", "amount_inr", "narration", "created_at"]


class StudentFeeInvoiceSerializer(serializers.ModelSerializer):
    receipts = FeeReceiptSerializer(many=True, read_only=True)

    class Meta:
        model = StudentFeeInvoice
        fields = [
            "id",
            "invoice_number",
            "student",
            "admission_number",
            "student_name",
            "class_section_label",
            "payment_plan",
            "gross_fee_inr",
            "scholarship_relief_inr",
            "net_assessed_fee_inr",
            "paid_amount_inr",
            "due_amount_inr",
            "status",
            "receipts",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class CollectPaymentSerializer(serializers.Serializer):
    invoice_id = serializers.UUIDField()
    receipt_number = serializers.CharField(max_length=50)
    amount_inr = serializers.DecimalField(max_digits=12, decimal_places=2)
    payment_mode = serializers.CharField(max_length=50, required=False, default="UPI / QR Code")
    period_label = serializers.CharField(max_length=100, required=False, default="Installment Payment")
    idempotency_key = serializers.CharField(max_length=100, required=False, allow_null=True, default=None)


class ReverseReceiptSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=255)


class StudentFeeInvoiceListCreateView(APIView):
    work_division = WorkDivision.FEES_FINANCE
    serializer_class = StudentFeeInvoiceSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = StudentFeeInvoice.objects.for_school(request.school.id).prefetch_related("receipts")
        adm_no = request.query_params.get("admission_number")
        if adm_no:
            qs = qs.filter(admission_number=adm_no)
        payload = StudentFeeInvoiceSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = StudentFeeInvoiceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inv = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = StudentFeeInvoiceSerializer(inv).data
        return Response({"success": True, "data": payload, "invoice": payload}, status=status.HTTP_201_CREATED)


class FeePaymentCollectView(APIView):
    work_division = WorkDivision.FEES_FINANCE
    serializer_class = CollectPaymentSerializer
    permission_classes = [HasWorkDivisionAccess]

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = CollectPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        d = serializer.validated_data
        invoice = get_object_or_404(StudentFeeInvoice, id=d["invoice_id"], school=request.school)

        receipt, created = collect_fee_payment(
            invoice=invoice,
            actor_membership=membership,
            amount_inr=Decimal(str(d["amount_inr"])),
            receipt_number=d["receipt_number"],
            payment_mode=d.get("payment_mode", "UPI / QR Code"),
            period_label=d.get("period_label", "Installment Payment"),
            idempotency_key=d.get("idempotency_key"),
        )
        payload = {
            "receipt": FeeReceiptSerializer(receipt).data,
            "invoice": StudentFeeInvoiceSerializer(invoice).data,
            "idempotent_replay": not created,
        }
        return Response(
            {"success": True, "data": payload, **payload},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class FeeReceiptDetailView(APIView):
    work_division = WorkDivision.FEES_FINANCE
    serializer_class = FeeReceiptSerializer
    permission_classes = [HasWorkDivisionAccess]

    def delete(self, request, pk):
        resolve_user_tenant_context(request, require_school=True)
        receipt = get_object_or_404(FeeReceipt, id=pk, school=request.school)
        # Triggers FeeReceipt.delete() immutability guard -> 403 IMMUTABLE_FINANCIAL_RECORD
        receipt.delete()
        return Response({"success": False})


class FeeReceiptReverseView(APIView):
    work_division = WorkDivision.FEES_FINANCE
    required_action = "approve"
    serializer_class = ReverseReceiptSerializer
    permission_classes = [HasWorkDivisionAccess]

    def post(self, request, pk):
        membership = resolve_user_tenant_context(request, require_school=True)
        receipt = get_object_or_404(FeeReceipt, id=pk, school=request.school)
        serializer = ReverseReceiptSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reversed_rec = reverse_fee_receipt(
            receipt=receipt,
            actor_membership=membership,
            reason=serializer.validated_data["reason"],
        )
        payload = {
            "receipt": FeeReceiptSerializer(reversed_rec).data,
            "invoice": StudentFeeInvoiceSerializer(reversed_rec.invoice).data,
        }
        return Response({"success": True, "data": payload, **payload})


class ScholarshipGrantListCreateView(APIView):
    work_division = WorkDivision.FEES_FINANCE
    serializer_class = ScholarshipGrantSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = ScholarshipGrant.objects.for_school(request.school.id)
        adm_no = request.query_params.get("admission_number")
        if adm_no:
            qs = qs.filter(admission_number=adm_no)
        payload = ScholarshipGrantSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = ScholarshipGrantSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        grant = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = ScholarshipGrantSerializer(grant).data
        return Response({"success": True, "data": payload, "scholarship": payload}, status=status.HTTP_201_CREATED)


class ChartOfAccountListCreateView(APIView):
    work_division = WorkDivision.FEES_FINANCE
    serializer_class = ChartOfAccountSerializer

    def get_permissions(self):
        return [IsAuthenticatedTenantMember()] if self.request.method == "GET" else [HasWorkDivisionAccess()]

    def get(self, request):
        resolve_user_tenant_context(request, require_school=True)
        qs = ChartOfAccount.objects.for_school(request.school.id)
        payload = ChartOfAccountSerializer(qs, many=True).data
        return Response({"success": True, "data": payload, "results": payload})

    def post(self, request):
        membership = resolve_user_tenant_context(request, require_school=True)
        serializer = ChartOfAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        coa = serializer.save(
            school=request.school,
            branch=getattr(request, "branch", None),
            created_by_id=membership.user_id,
        )
        payload = ChartOfAccountSerializer(coa).data
        return Response({"success": True, "data": payload, "account": payload}, status=status.HTTP_201_CREATED)
