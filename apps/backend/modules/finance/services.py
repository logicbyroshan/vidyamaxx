"""
VidyaFloww Atomic Fee Collection, Immutable Receipt Reversal & Webhook Idempotency Services
"""

from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from rest_framework import status

from common.exceptions import ConflictError, VidyaFlowError
from platform_services.audit.services import record_audit_event
from .models import FeeReceipt, FeeTransaction, StudentFeeInvoice


def _recalculate_invoice_status(invoice: StudentFeeInvoice) -> None:
    invoice.due_amount_inr = max(Decimal("0.00"), invoice.net_assessed_fee_inr - invoice.paid_amount_inr)
    if invoice.due_amount_inr <= Decimal("0.00"):
        invoice.status = StudentFeeInvoice.Status.CLEARED
    else:
        invoice.status = StudentFeeInvoice.Status.PENDING
    invoice.save(update_fields=["paid_amount_inr", "due_amount_inr", "status", "updated_at"])

    if invoice.student_id:
        stu = invoice.student
        stu.fee_dues_inr = invoice.due_amount_inr
        stu.fee_status = "Paid" if invoice.status == StudentFeeInvoice.Status.CLEARED else "Pending"
        stu.save(update_fields=["fee_dues_inr", "fee_status", "updated_at"])


@transaction.atomic
def collect_fee_payment(
    *,
    invoice: StudentFeeInvoice,
    actor_membership,
    amount_inr: Decimal,
    receipt_number: str,
    payment_mode: str = "UPI / QR Code",
    period_label: str = "Installment Payment",
    idempotency_key: str | None = None,
) -> tuple[FeeReceipt, bool]:
    """
    Atomically issues a FeeReceipt + FeeTransaction(CREDIT_COLLECTION) and updates the invoice balance.
    If `idempotency_key` has already been processed for this school, returns `(existing_receipt, False)`
    without double-crediting the invoice.
    """
    if idempotency_key:
        existing_receipt = FeeReceipt.objects.filter(
            school=invoice.school, idempotency_key=idempotency_key
        ).first()
        if existing_receipt:
            return existing_receipt, False

    if amount_inr <= Decimal("0.00"):
        raise VidyaFlowError(
            message="Payment amount must be greater than zero.",
            code="INVALID_PAYMENT_AMOUNT",
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    if amount_inr > invoice.due_amount_inr:
        raise VidyaFlowError(
            message=f"Payment amount ({amount_inr}) exceeds current invoice due balance ({invoice.due_amount_inr}).",
            code="OVERPAYMENT_NOT_ALLOWED",
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    actor_id = actor_membership.user_id if actor_membership else None
    actor_name = actor_membership.user.full_name if actor_membership else "Payment Gateway"

    receipt = FeeReceipt.objects.create(
        school=invoice.school,
        branch=invoice.branch,
        created_by_id=actor_id,
        receipt_number=receipt_number,
        invoice=invoice,
        admission_number=invoice.admission_number,
        student_name=invoice.student_name,
        amount_inr=amount_inr,
        payment_mode=payment_mode,
        period_label=period_label,
        cashier_name=actor_name,
        status=FeeReceipt.Status.ISSUED,
        idempotency_key=idempotency_key,
    )

    FeeTransaction.objects.create(
        school=invoice.school,
        branch=invoice.branch,
        created_by_id=actor_id,
        invoice=invoice,
        receipt=receipt,
        transaction_type=FeeTransaction.TransactionType.CREDIT_COLLECTION,
        amount_inr=amount_inr,
        narration=f"Fee collection via {payment_mode} ({receipt.receipt_number})",
    )

    invoice.paid_amount_inr += amount_inr
    _recalculate_invoice_status(invoice)

    record_audit_event(
        school_id=invoice.school_id,
        tenant_id=invoice.school.tenant_id,
        actor_user_id=actor_id,
        actor_name=actor_name,
        actor_role_label=actor_membership.user_type if actor_membership else "WEBHOOK",
        category="Finance",
        action="FEE_PAYMENT_COLLECTED",
        target_type="FeeReceipt",
        target_id=str(receipt.id),
        metadata={
            "receipt_number": receipt.receipt_number,
            "admission_number": invoice.admission_number,
            "amount_inr": str(amount_inr),
        },
    )
    return receipt, True


@transaction.atomic
def reverse_fee_receipt(
    *,
    receipt: FeeReceipt,
    actor_membership,
    reason: str,
) -> FeeReceipt:
    """
    Enforces Master Prompt Part 10.6:
    Paid receipts are never deleted; reversals create a compensating debit transaction,
    mark the receipt REVERSED, and restore the student invoice due balance.
    """
    if receipt.status == FeeReceipt.Status.REVERSED:
        raise ConflictError(
            message=f"Receipt '{receipt.receipt_number}' has already been reversed.",
            code="RECEIPT_ALREADY_REVERSED",
        )

    if not reason.strip():
        raise VidyaFlowError(
            message="A reversal reason is required for financial audit compliance.",
            code="REVERSAL_REASON_REQUIRED",
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    receipt.status = FeeReceipt.Status.REVERSED
    receipt.reversal_reason = reason.strip()
    receipt.reversed_by_id = actor_membership.user_id
    receipt.reversed_at = timezone.now()
    receipt.updated_by_id = actor_membership.user_id
    receipt.save(
        update_fields=["status", "reversal_reason", "reversed_by_id", "reversed_at", "updated_by_id", "updated_at"]
    )

    invoice = receipt.invoice
    FeeTransaction.objects.create(
        school=receipt.school,
        branch=receipt.branch,
        created_by_id=actor_membership.user_id,
        invoice=invoice,
        receipt=receipt,
        transaction_type=FeeTransaction.TransactionType.DEBIT_REVERSAL,
        amount_inr=-receipt.amount_inr,
        narration=f"Reversal of {receipt.receipt_number}: {reason.strip()}",
    )

    invoice.paid_amount_inr = max(Decimal("0.00"), invoice.paid_amount_inr - receipt.amount_inr)
    _recalculate_invoice_status(invoice)

    record_audit_event(
        school_id=receipt.school_id,
        tenant_id=receipt.school.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Finance",
        action="FEE_RECEIPT_REVERSED",
        target_type="FeeReceipt",
        target_id=str(receipt.id),
        status="Warning",
        metadata={
            "receipt_number": receipt.receipt_number,
            "reversed_amount_inr": str(receipt.amount_inr),
            "reason": reason.strip(),
        },
    )
    return receipt
