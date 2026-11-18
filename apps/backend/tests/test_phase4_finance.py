"""
Phase 4 Automated Verification Suite:
Financial Operations (Invoices, Scholarships, Chart of Accounts, Payment Idempotency,
Immutable Receipts, and Controlled Reversal Ledger).
"""

import pytest
from decimal import Decimal
from rest_framework.test import APIClient

from core.accounts.models import User
from core.campuses.models import Branch
from core.organizations.models import CustomerTenant, School
from core.users.models import Membership, UserType
from modules.finance.models import FeeTransaction
from platform_services.audit.models import AuditEvent


@pytest.fixture
def phase4_env(db):
    user = User.objects.create(
        email="phase4.finance@vidyafloww.edu.in",
        phone="+919900334455",
        full_name="Mr. Arvind Gupta",
        is_verified=True,
        is_active=True,
    )
    user.set_unusable_password()
    user.save()

    tenant = CustomerTenant.objects.create(
        name="Gupta Educational Trust",
        slug="gupta-trust",
        owner_user=user,
    )
    school = School.objects.create(
        tenant=tenant,
        name="Gupta International School",
        short_code="GIS-DEL-01",
        city="New Delhi",
    )
    branch = Branch.objects.create(
        school=school,
        code="MAIN",
        name="Main Campus",
        city="New Delhi",
        is_primary=True,
    )
    Membership.objects.create(
        user=user,
        tenant=tenant,
        school=school,
        default_branch=branch,
        user_type=UserType.SCHOOL_ADMIN,
    )

    client = APIClient()
    client.force_authenticate(user=user)
    return {
        "client": client,
        "school": school,
        "headers": {"HTTP_X_SCHOOL_ID": str(school.id)},
    }


def test_fee_collection_idempotency_immutability_and_reversal_ledger(phase4_env):
    client = phase4_env["client"]
    school = phase4_env["school"]
    headers = phase4_env["headers"]

    # 1. Create Chart of Account & Scholarship Grant
    coa_res = client.post(
        "/api/v1/finance/accounts/",
        {
            "account_code": "INC-1001",
            "account_name": "Tuition Fee Revenue",
            "account_type": "INCOME",
            "balance_inr": "0.00",
        },
        format="json",
        **headers,
    )
    assert coa_res.status_code == 201

    sch_res = client.post(
        "/api/v1/finance/scholarships/",
        {
            "admission_number": "ADM-2026-001",
            "student_name": "Aarav Sharma",
            "scheme_name": "NSP Merit Scholarship",
            "waiver_pct": 50,
            "waiver_amount_inr": "21000.00",
        },
        format="json",
        **headers,
    )
    assert sch_res.status_code == 201

    # 2. Create Student Fee Invoice (Net Assessed = 33,000)
    inv_res = client.post(
        "/api/v1/finance/invoices/",
        {
            "invoice_number": "INV-STU-2026-001",
            "admission_number": "ADM-2026-001",
            "student_name": "Aarav Sharma",
            "class_section_label": "10-A",
            "gross_fee_inr": "54000.00",
            "scholarship_relief_inr": "21000.00",
            "net_assessed_fee_inr": "33000.00",
            "paid_amount_inr": "0.00",
            "due_amount_inr": "33000.00",
            "status": "Pending",
        },
        format="json",
        **headers,
    )
    assert inv_res.status_code == 201
    invoice_id = inv_res.json()["data"]["id"]

    # 3. Collect first installment (15,000) with idempotency_key
    pay_res = client.post(
        "/api/v1/finance/collect/",
        {
            "invoice_id": invoice_id,
            "receipt_number": "REC-2026-8801",
            "amount_inr": "15000.00",
            "payment_mode": "UPI / QR Code",
            "idempotency_key": "IDEM-PAY-001",
        },
        format="json",
        **headers,
    )
    assert pay_res.status_code == 201
    receipt_id = pay_res.json()["data"]["receipt"]["id"]
    assert Decimal(pay_res.json()["data"]["invoice"]["paid_amount_inr"]) == Decimal("15000.00")
    assert Decimal(pay_res.json()["data"]["invoice"]["due_amount_inr"]) == Decimal("18000.00")

    # 4. Replay identical payment request with same idempotency_key -> must NOT double-credit!
    replay_res = client.post(
        "/api/v1/finance/collect/",
        {
            "invoice_id": invoice_id,
            "receipt_number": "REC-2026-8801",
            "amount_inr": "15000.00",
            "payment_mode": "UPI / QR Code",
            "idempotency_key": "IDEM-PAY-001",
        },
        format="json",
        **headers,
    )
    assert replay_res.status_code == 200
    assert replay_res.json()["data"]["idempotent_replay"] is True
    assert Decimal(replay_res.json()["data"]["invoice"]["paid_amount_inr"]) == Decimal("15000.00")

    # 5. Attempting to DELETE a financial receipt MUST fail with 403 IMMUTABLE_FINANCIAL_RECORD
    del_res = client.delete(f"/api/v1/finance/receipts/{receipt_id}/", **headers)
    assert del_res.status_code == 403
    assert del_res.json()["code"] == "IMMUTABLE_FINANCIAL_RECORD"

    # 6. Controlled reversal appends compensating DEBIT_REVERSAL transaction and restores due balance
    rev_res = client.post(
        f"/api/v1/finance/receipts/{receipt_id}/reverse/",
        {"reason": "Cheque/UPI dishonour reversal"},
        format="json",
        **headers,
    )
    assert rev_res.status_code == 200
    assert rev_res.json()["data"]["receipt"]["status"] == "REVERSED"
    assert Decimal(rev_res.json()["data"]["invoice"]["paid_amount_inr"]) == Decimal("0.00")
    assert Decimal(rev_res.json()["data"]["invoice"]["due_amount_inr"]) == Decimal("33000.00")

    txns = FeeTransaction.objects.filter(invoice_id=invoice_id).order_by("created_at")
    assert txns.count() == 2
    credit_tx, debit_tx = list(txns)
    assert credit_tx.transaction_type == FeeTransaction.TransactionType.CREDIT_COLLECTION
    assert credit_tx.amount_inr == Decimal("15000.00")
    assert debit_tx.transaction_type == FeeTransaction.TransactionType.DEBIT_REVERSAL
    assert debit_tx.amount_inr == Decimal("-15000.00")

    assert AuditEvent.objects.filter(school_id=school.id, action="FEE_RECEIPT_REVERSED").exists()
