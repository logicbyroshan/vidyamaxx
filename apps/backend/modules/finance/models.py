"""
VidyaFloww Fees, Scholarships, Invoices & Immutable Financial Ledger Models
"""

from decimal import Decimal
from django.db import models
from django.utils import timezone
from common.exceptions import ForbiddenActionError
from common.models import TenantScopedModel


class FeeStructure(TenantScopedModel):
    """Per-class fee head schedule for an AcademicSession."""

    academic_session = models.ForeignKey(
        "academics.AcademicSession", on_delete=models.SET_NULL, null=True, blank=True
    )
    grade_class_label = models.CharField(max_length=60, default="Class 10")
    base_tuition_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("42000.00"))
    lab_tech_fee_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("5000.00"))
    transport_fee_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("4500.00"))
    library_fee_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("2500.00"))
    annual_total_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("54000.00"))

    class Meta:
        db_table = "finance_fee_structure"
        ordering = ["grade_class_label"]


class ScholarshipGrant(TenantScopedModel):
    """Student scholarship / fee concession grant (backs Student 360 Scholarship tab)."""

    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        ACTIVE = "Active Disbursed", "Active Disbursed"
        REVOKED = "Revoked", "Revoked"

    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, null=True, blank=True, related_name="scholarships"
    )
    admission_number = models.CharField(max_length=50, db_index=True)
    student_name = models.CharField(max_length=150)
    scheme_name = models.CharField(max_length=180)
    category = models.CharField(max_length=60, default="Academic Merit")
    waiver_pct = models.PositiveSmallIntegerField(default=50)
    waiver_amount_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("21000.00"))
    funding_agency = models.CharField(max_length=180, default="VidyaFloww Foundation Trust")
    sanction_ref = models.CharField(max_length=80, blank=True, default="")
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.ACTIVE)
    notes = models.TextField(blank=True, default="")

    class Meta:
        db_table = "finance_scholarship_grant"
        ordering = ["-created_at"]


class StudentFeeInvoice(TenantScopedModel):
    """Student fee ledger assessment (backs Student 360 Fees tab & Payments engine)."""

    class Status(models.TextChoices):
        CLEARED = "Cleared", "Cleared"
        PENDING = "Pending", "Pending"
        OVERDUE = "Overdue", "Overdue"

    invoice_number = models.CharField(max_length=50, db_index=True)
    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, null=True, blank=True, related_name="fee_invoices"
    )
    admission_number = models.CharField(max_length=50, db_index=True)
    student_name = models.CharField(max_length=150)
    class_section_label = models.CharField(max_length=40, default="10-A")
    payment_plan = models.CharField(max_length=60, default="Monthly Installments")
    gross_fee_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("54000.00"))
    scholarship_relief_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    net_assessed_fee_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("54000.00"))
    paid_amount_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    due_amount_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("54000.00"))
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)

    class Meta:
        db_table = "finance_student_invoice"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["school", "invoice_number"], name="uq_fin_invoice_school_no")
        ]


class FeeReceipt(TenantScopedModel):
    """
    Immutable fee payment receipt.
    Cannot be deleted; corrections require `reverse_fee_receipt` (Master Prompt Part 10.6).
    """

    class Status(models.TextChoices):
        ISSUED = "ISSUED", "Issued"
        REVERSED = "REVERSED", "Reversed"

    receipt_number = models.CharField(max_length=50, db_index=True)
    invoice = models.ForeignKey(StudentFeeInvoice, on_delete=models.PROTECT, related_name="receipts")
    admission_number = models.CharField(max_length=50, db_index=True)
    student_name = models.CharField(max_length=150)
    amount_inr = models.DecimalField(max_digits=12, decimal_places=2)
    payment_mode = models.CharField(max_length=50, default="UPI / QR Code")
    period_label = models.CharField(max_length=100, default="Installment Payment")
    cashier_name = models.CharField(max_length=150, default="Accounts Desk")
    paid_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ISSUED)
    reversal_reason = models.CharField(max_length=255, blank=True, default="")
    reversed_by_id = models.UUIDField(null=True, blank=True)
    reversed_at = models.DateTimeField(null=True, blank=True)
    idempotency_key = models.CharField(max_length=100, null=True, blank=True, db_index=True)

    class Meta:
        db_table = "finance_fee_receipt"
        ordering = ["-paid_at"]
        constraints = [
            models.UniqueConstraint(fields=["school", "receipt_number"], name="uq_fin_receipt_school_no")
        ]

    def delete(self, *args, **kwargs):
        raise ForbiddenActionError(
            message="Financial receipts are immutable and cannot be deleted. Use the reversal endpoint.",
            code="IMMUTABLE_FINANCIAL_RECORD",
        )


class FeeTransaction(TenantScopedModel):
    """Append-only double-entry financial transaction ledger row."""

    class TransactionType(models.TextChoices):
        CREDIT_COLLECTION = "CREDIT_COLLECTION", "Credit (Fee Collection)"
        DEBIT_REVERSAL = "DEBIT_REVERSAL", "Debit (Receipt Reversal)"

    invoice = models.ForeignKey(StudentFeeInvoice, on_delete=models.PROTECT, related_name="transactions")
    receipt = models.ForeignKey(FeeReceipt, on_delete=models.PROTECT, related_name="transactions")
    transaction_type = models.CharField(max_length=25, choices=TransactionType.choices)
    amount_inr = models.DecimalField(max_digits=12, decimal_places=2)
    narration = models.CharField(max_length=255)

    class Meta:
        db_table = "finance_fee_transaction"
        ordering = ["-created_at"]

    def delete(self, *args, **kwargs):
        raise ForbiddenActionError(
            message="Financial ledger transactions are append-only and cannot be deleted.",
            code="IMMUTABLE_FINANCIAL_RECORD",
        )
