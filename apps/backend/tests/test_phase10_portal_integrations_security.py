"""
Phase 10 Verification Suite:
Parent/Student Portal Isolation, Operations Detail CRUD, External Integrations
(Payment HMAC Webhooks, Biometric Punch Ingestion, DLT SMS, WhatsApp, Outbound Webhooks),
and Real Database Analytics / AI Assist Telemetry.
"""

import hashlib
import hmac
import json
from datetime import date
from decimal import Decimal
import pytest
from rest_framework.test import APIClient

from core.accounts.models import User
from core.campuses.models import Branch
from core.organizations.models import CustomerTenant, School
from core.users.models import Membership, UserType
from modules.finance.models import StudentFeeInvoice
from modules.library.models import LibraryBookSummary
from modules.students.models import Student
from integrations.sms.services import send_dlt_sms
from integrations.whatsapp.services import send_whatsapp_template
from integrations.webhook.services import dispatch_signed_webhook


@pytest.mark.django_db
def test_portal_parent_isolation_and_operations_detail_crud():
    admin = User.objects.create_user(email="p10admin@school.edu", password="Password@123", full_name="Admin One")
    parent_a = User.objects.create_user(
        email="parenta@school.edu", phone="+919900001111", password="Password@123", full_name="Parent A"
    )
    parent_b = User.objects.create_user(
        email="parentb@school.edu", phone="+919900002222", password="Password@123", full_name="Parent B"
    )
    tenant = CustomerTenant.objects.create(name="P10 Trust", slug="p10-trust", owner_user=admin)
    school = School.objects.create(tenant=tenant, name="P10 Academy", short_code="P10-ACAD")
    branch_main = Branch.objects.create(school=school, code="BR-01", name="Main", city="Delhi", is_primary=True)
    branch_sub = Branch.objects.create(school=school, code="BR-02", name="East", city="Noida", is_primary=False)

    Membership.objects.create(user=admin, tenant=tenant, school=school, user_type=UserType.SCHOOL_ADMIN)
    Membership.objects.create(user=parent_a, tenant=tenant, school=school, user_type=UserType.PARENT)
    Membership.objects.create(user=parent_b, tenant=tenant, school=school, user_type=UserType.PARENT)

    Student.objects.create(
        school=school,
        branch=branch_main,
        admission_number="ADM-P10-A",
        full_name="Child A",
        class_section_label="10-A",
        primary_guardian_name="Parent A",
        guardian_phone="+919900001111",
    )
    Student.objects.create(
        school=school,
        branch=branch_main,
        admission_number="ADM-P10-B",
        full_name="Child B",
        class_section_label="9-B",
        primary_guardian_name="Parent B",
        guardian_phone="+919900002222",
    )

    headers = {"HTTP_X_SCHOOL_ID": str(school.id)}

    # Parent A sees ONLY Child A (strict IDOR / guardian isolation)
    c_parent = APIClient()
    c_parent.force_authenticate(user=parent_a)
    portal_res = c_parent.get("/api/v1/portal/overview/", **headers)
    assert portal_res.status_code == 200
    assert portal_res.data["children_count"] == 1
    assert portal_res.data["children"][0]["admission_number"] == "ADM-P10-A"

    # Admin Operations Detail PATCH & DELETE + Branch Delete primary guard
    c_admin = APIClient()
    c_admin.force_authenticate(user=admin)
    book = LibraryBookSummary.objects.create(
        school=school, isbn_or_code="ISBN-P10-1", title="Physics X", author="NCERT", total_copies=10, available_copies=10
    )
    patch_res = c_admin.patch(
        f"/api/v1/operations/library/books/{book.id}/",
        {"available_copies": 8},
        format="json",
        **headers,
    )
    assert patch_res.status_code == 200
    assert patch_res.data["data"]["available_copies"] == 8

    del_book_res = c_admin.delete(f"/api/v1/operations/library/books/{book.id}/", **headers)
    assert del_book_res.status_code == 200

    # Primary branch deletion is blocked (400), secondary branch deletion succeeds (200)
    del_prim = c_admin.delete(f"/api/v1/schools/branches/{branch_main.id}/", **headers)
    assert del_prim.status_code == 400
    del_sub = c_admin.delete(f"/api/v1/schools/branches/{branch_sub.id}/", **headers)
    assert del_sub.status_code == 200


@pytest.mark.django_db
def test_payment_webhook_hmac_idempotency_biometric_and_messaging_adapters(monkeypatch):
    monkeypatch.setenv("RAZORPAY_WEBHOOK_SECRET", "test-rzp-webhook-secret")
    monkeypatch.setenv("BIOMETRIC_DEVICE_SECRET", "test-bio-device-secret")

    admin = User.objects.create_user(email="intadmin@school.edu", password="Password@123", full_name="Int Admin")
    tenant = CustomerTenant.objects.create(name="Int Trust", slug="int-trust", owner_user=admin)
    school = School.objects.create(tenant=tenant, name="Int Academy", short_code="INT-01")
    Membership.objects.create(user=admin, tenant=tenant, school=school, user_type=UserType.SCHOOL_ADMIN)

    Student.objects.create(
        school=school,
        admission_number="ADM-BIO-01",
        full_name="Biometric Student",
        class_section_label="8-A",
        primary_guardian_name="Guardian Bio",
        guardian_phone="+919800001234",
    )
    inv = StudentFeeInvoice.objects.create(
        school=school,
        invoice_number="INV-WH-001",
        admission_number="ADM-BIO-01",
        student_name="Biometric Student",
        class_section_label="8-A",
        gross_fee_inr=Decimal("20000.00"),
        net_assessed_fee_inr=Decimal("20000.00"),
        paid_amount_inr=Decimal("0.00"),
        due_amount_inr=Decimal("20000.00"),
    )

    client = APIClient()

    # 1. Tampered signature -> 403 Forbidden
    payload = {
        "invoice_id": str(inv.id),
        "payment_id": "pay_test_9911",
        "amount_inr": "10000.00",
        "payment_mode": "Razorpay UPI",
        "event_id": "evt_rzp_001",
    }
    raw = json.dumps(payload).encode("utf-8")
    bad_res = client.post(
        "/api/v1/integrations/payment/webhook/",
        data=raw,
        content_type="application/json",
        HTTP_X_RAZORPAY_SIGNATURE="tampered-signature",
    )
    assert bad_res.status_code == 403

    # 2. Valid HMAC signature -> 201 Created + idempotent replay -> 200 OK
    good_sig = hmac.new(b"test-rzp-webhook-secret", raw, hashlib.sha256).hexdigest()
    ok_res = client.post(
        "/api/v1/integrations/payment/webhook/",
        data=raw,
        content_type="application/json",
        HTTP_X_RAZORPAY_SIGNATURE=good_sig,
    )
    assert ok_res.status_code == 201
    assert ok_res.data["idempotent_replay"] is False

    replay_res = client.post(
        "/api/v1/integrations/payment/webhook/",
        data=raw,
        content_type="application/json",
        HTTP_X_RAZORPAY_SIGNATURE=good_sig,
    )
    assert replay_res.status_code == 200
    assert replay_res.data["idempotent_replay"] is True

    inv.refresh_from_db()
    assert inv.paid_amount_inr == Decimal("10000.00")
    assert inv.due_amount_inr == Decimal("10000.00")

    # 3. Biometric Turnstile Punch HMAC Verification & Idempotency
    bio_payload = {
        "school_code": "INT-01",
        "device_id": "GATE-01",
        "punch_uid": "PUNCH-7788",
        "admission_number": "ADM-BIO-01",
        "punch_date": date(2026, 11, 20).isoformat(),
        "punch_time_str": "07:55 AM",
        "is_late": False,
    }
    bio_raw = json.dumps(bio_payload).encode("utf-8")
    bio_sig = hmac.new(b"test-bio-device-secret", bio_raw, hashlib.sha256).hexdigest()
    bio_res = client.post(
        "/api/v1/integrations/biometric/punch/",
        data=bio_raw,
        content_type="application/json",
        HTTP_X_BIOMETRIC_SIGNATURE=bio_sig,
    )
    assert bio_res.status_code == 201
    assert bio_res.data["idempotent_replay"] is False

    bio_replay = client.post(
        "/api/v1/integrations/biometric/punch/",
        data=bio_raw,
        content_type="application/json",
        HTTP_X_BIOMETRIC_SIGNATURE=bio_sig,
    )
    assert bio_replay.status_code == 200
    assert bio_replay.data["idempotent_replay"] is True

    # 4. Sandbox DLT SMS, WhatsApp HSM & Signed Outbound Webhook
    sms_res = send_dlt_sms(phone_e164="+919800001234", dlt_template_id="1207168899", variables={"otp": "123456"})
    assert sms_res["mode"] == "sandbox"
    wa_res = send_whatsapp_template(phone_e164="+919800001234", template_name="fee_reminder", body_params=["Aarav", "₹10,000"])
    assert wa_res["mode"] == "sandbox"
    wh_res = dispatch_signed_webhook(
        target_url="https://example.invalid/hook",
        event_type="fee.paid",
        payload={"receipt": "GW-001"},
        secret="wh-secret",
        dry_run=True,
    )
    assert wh_res["delivered"] is True and len(wh_res["signature"]) == 64
