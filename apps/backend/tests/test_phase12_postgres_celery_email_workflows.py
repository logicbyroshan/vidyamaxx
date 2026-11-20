"""
Phase 12 — Real PostgreSQL, Celery Tasks, Transactional Email & End-to-End Business Workflow Suite.
"""

from datetime import date
from decimal import Decimal
import pytest
from django.core import mail
from rest_framework.test import APIClient

from core.accounts.models import User
from core.organizations.models import CustomerTenant, School
from core.users.models import Membership, UserType
from integrations.email.services import send_transactional_email
from integrations.webhook.tasks import deliver_outbound_webhook_task
from modules.communication.models import CircularBroadcast
from modules.communication.tasks import dispatch_circular_notifications_task
from platform_services.notifications.models import InAppNotification
from platform_services.reports.tasks import generate_scheduled_report_task


def _client(user: User, school: School) -> APIClient:
    c = APIClient()
    c.force_authenticate(user=user)
    c.credentials(HTTP_X_SCHOOL_ID=str(school.id))
    return c


@pytest.mark.django_db
class TestPhase12PostgresCeleryEmailAndWorkflows:
    def _seed_school(self):
        admin = User.objects.create_user(email="p12admin@school.edu.in", password="Password@123", full_name="P12 Principal")
        staff = User.objects.create_user(email="p12staff@school.edu.in", password="Password@123", full_name="P12 Teacher")
        tenant = CustomerTenant.objects.create(name="P12 Trust", slug="p12-trust", owner_user=admin)
        school = School.objects.create(tenant=tenant, name="P12 Academy", short_code="P12-AC")
        Membership.objects.create(user=admin, tenant=tenant, school=school, user_type=UserType.SCHOOL_ADMIN)
        Membership.objects.create(user=staff, tenant=tenant, school=school, user_type=UserType.STAFF)
        return school, admin, staff

    def test_end_to_end_admission_to_enrollment_to_fee_to_reversal_and_stats(self):
        school, admin, _ = self._seed_school()
        c = _client(admin, school)

        # 1. Create Admission Application
        app_resp = c.post(
            "/api/v1/admissions/applications/",
            {
                "application_number": "ADM-P12-001",
                "applied_grade_label": "Class 10-A",
                "candidate_name": "Meera Nair",
                "date_of_birth": "2011-04-12",
                "gender": "Female",
                "primary_guardian_name": "Rajeev Nair",
                "guardian_phone": "+919876543210",
                "guardian_email": "rajeev.nair@example.com",
            },
            format="json",
        )
        assert app_resp.status_code == 201
        app_id = app_resp.data["data"]["id"]

        # 2. Approve Application
        appr = c.post(f"/api/v1/admissions/applications/{app_id}/approve/", {"remarks": "Merit selected"}, format="json")
        assert appr.status_code == 200
        assert appr.data["data"]["stage"] == "approved"

        # 3. Enroll Applicant into Student Directory
        enr = c.post(
            f"/api/v1/admissions/applications/{app_id}/enroll/",
            {"admission_number": "VF-2026-P12", "roll_number": "12", "house_name": "Tagore"},
            format="json",
        )
        assert enr.status_code == 201
        student_id = enr.data["student_id"]

        # 4. Create Fee Invoice with Decimal precision
        inv_resp = c.post(
            "/api/v1/finance/invoices/",
            {
                "invoice_number": "INV-P12-001",
                "student": student_id,
                "admission_number": "VF-2026-P12",
                "student_name": "Meera Nair",
                "class_section_label": "Class 10-A",
                "gross_fee_inr": "45000.50",
                "net_assessed_fee_inr": "45000.50",
                "due_amount_inr": "45000.50",
            },
            format="json",
        )
        assert inv_resp.status_code == 201
        inv_id = inv_resp.data["data"]["id"]

        # 5. Collect Fee Payment with Idempotency-Key (verify replay safety)
        pay_payload = {
            "invoice_id": inv_id,
            "receipt_number": "REC-P12-001",
            "amount_inr": "20000.25",
            "payment_mode": "UPI / QR Code",
            "period_label": "Term 1",
            "idempotency_key": "idem-p12-001",
        }
        p1 = c.post("/api/v1/finance/collect/", pay_payload, format="json")
        assert p1.status_code == 201
        assert Decimal(p1.data["invoice"]["due_amount_inr"]) == Decimal("25000.25")
        receipt_id = p1.data["receipt"]["id"]

        # Replay with same idempotency_key must NOT double-charge
        p2 = c.post("/api/v1/finance/collect/", pay_payload, format="json")
        assert p2.status_code == 200
        assert p2.data["idempotent_replay"] is True
        assert Decimal(p2.data["invoice"]["due_amount_inr"]) == Decimal("25000.25")

        # 6. Receipt Deletion must be blocked (403 Immutable Financial Record)
        assert c.delete(f"/api/v1/finance/receipts/{receipt_id}/").status_code == 403

        # 7. Receipt Reversal restores balance accurately with Decimal precision
        rev = c.post(f"/api/v1/finance/receipts/{receipt_id}/reverse/", {"reason": "UPI bounce"}, format="json")
        assert rev.status_code == 200
        assert Decimal(rev.data["invoice"]["due_amount_inr"]) == Decimal("45000.50")

        # 8. Enriched Statistics Endpoint reflects real DB counts
        stats = c.get("/api/v1/analytics/statistics/")
        assert stats.status_code == 200
        assert stats.data["total_students"] >= 1
        assert stats.data["admissions_summary"]["enrolled"] >= 1
        assert stats.data["finance_summary"]["invoices_count"] >= 1
        assert "attendance_summary" in stats.data
        assert "exam_summary" in stats.data
        assert "academics_summary" in stats.data

    def test_celery_background_tasks_and_transactional_email_adapter(self):
        school, admin, _ = self._seed_school()

        # 1. Transactional Email Adapter (via Django test outbox)
        mail.outbox.clear()
        em = send_transactional_email(
            to_emails=["parent@example.com"],
            subject="Fee Receipt Issued",
            text_body="Your payment of INR 20,000 has been received.",
            html_body="<p>Your payment of <strong>INR 20,000</strong> has been received.</p>",
        )
        assert em["success"] is True
        assert len(mail.outbox) == 1
        assert mail.outbox[0].subject == "Fee Receipt Issued"

        # 2. Celery Task: Circular Notification + Email Broadcast
        circ = CircularBroadcast.objects.create(
            school=school,
            circular_number="CIR-CEL-01",
            title="Annual Sports Day",
            audience="All School",
            channel="App · Email",
            message_body="Sports day starts at 8 AM.",
            status="Published",
        )
        res_circ = dispatch_circular_notifications_task.delay(str(circ.id)).get()
        assert res_circ["success"] is True
        assert res_circ["notifications_created"] == 2
        assert InAppNotification.objects.filter(school=school, title__icontains="CIR-CEL-01").count() == 2

        # 3. Celery Task: Scheduled Institutional Report Generation
        res_rep = generate_scheduled_report_task.delay(str(school.id), "students", "Nightly Roster").get()
        assert res_rep["success"] is True
        assert res_rep["report_id"]

        # 4. Celery Task: Outbound Signed Webhook (dry_run mode verifies HMAC signing without external DNS)
        res_wh = deliver_outbound_webhook_task.delay(
            "https://example.invalid/hook",
            "fee.paid",
            {"amount": "100.00"},
            "test-secret",
            True,
        ).get()
        assert res_wh["delivered"] is True and res_wh["mode"] == "dry_run" and len(res_wh["signature"]) == 64
