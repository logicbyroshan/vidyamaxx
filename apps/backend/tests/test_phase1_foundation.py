"""
Phase 1 Automated Tests — Identity, Multi-Tenancy, RBAC, Audit & Storage
"""

from datetime import timedelta
import uuid
import pytest
from django.core.exceptions import PermissionDenied, ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone

from common.permissions import evaluate_staff_responsibility
from common.validators import normalize_indian_phone
from core.permissions.models import ResponsibilityAssignmentHistory, StaffResponsibilityAssignment, WorkDivision
from core.permissions.services import assign_staff_responsibility, revoke_staff_responsibility
from core.sessions.models import DeviceSession
from core.users.models import Membership, UserType
from platform_services.audit.models import AuditEvent


@pytest.mark.django_db
def test_health_check(api_client):
    resp = api_client.get("/api/v1/health/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


@pytest.mark.django_db
def test_indian_phone_normalization():
    assert normalize_indian_phone("9876543210") == "+919876543210"
    assert normalize_indian_phone("+91 98765-43210") == "+919876543210"
    with pytest.raises(ValidationError):
        normalize_indian_phone("1234567890")


@pytest.mark.django_db
def test_auth_login_refresh_rotation_reuse_detection_and_logout(api_client, saas_ecosystem):
    # Bad password yields standardized error payload
    bad = api_client.post(
        "/api/v1/auth/login/",
        {"identifier": "admin.a@springfield.edu.in", "password": "wrong"},
        format="json",
    )
    assert bad.status_code == 401
    assert bad.json()["success"] is False
    assert bad.json()["code"] == "AUTH_INVALID_CREDENTIALS"

    # Valid login
    ok = api_client.post(
        "/api/v1/auth/login/",
        {"identifier": "admin.a@springfield.edu.in", "password": "StrongPassword!123"},
        format="json",
    )
    assert ok.status_code == 200
    data = ok.json()
    assert data["success"] is True
    assert "access_token" in data
    old_cookie = ok.cookies["vidyafloww_refresh"].value

    # Rotate refresh token
    ref1 = api_client.post("/api/v1/auth/token/refresh/", {"refresh": old_cookie}, format="json")
    assert ref1.status_code == 200
    new_access = ref1.json()["access_token"]

    # Replay stale refresh token -> must detect reuse and revoke session!
    replay = api_client.post("/api/v1/auth/token/refresh/", {"refresh": old_cookie}, format="json")
    assert replay.status_code == 401
    assert replay.json()["code"] == "AUTH_TOKEN_REUSE_DETECTED"
    assert DeviceSession.objects.filter(user=saas_ecosystem["school_admin_a"], revoked_at__isnull=True).count() == 0

    # Fresh login & logout
    ok2 = api_client.post(
        "/api/v1/auth/login/",
        {"identifier": "admin.a@springfield.edu.in", "password": "StrongPassword!123"},
        format="json",
    )
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {ok2.json()['access_token']}")
    logout_resp = api_client.post("/api/v1/auth/logout/", {}, format="json")
    assert logout_resp.status_code == 200
    assert DeviceSession.objects.filter(user=saas_ecosystem["school_admin_a"], revoked_at__isnull=True).count() == 0
    assert AuditEvent.objects.filter(action="LOGIN_SUCCESS").exists()
    assert AuditEvent.objects.filter(action="REFRESH_TOKEN_REUSE_BLOCKED").exists()


@pytest.mark.django_db
def test_otp_registration_password_reset_and_username_lookup(api_client, saas_ecosystem):
    # Register new staff member using School A short_code
    reg = api_client.post(
        "/api/v1/auth/register/",
        {
            "full_name": "Rohan Kapoor",
            "email": "rohan.k@springfield.edu.in",
            "phone": "9811122334",
            "school_code": "CBSE-DEL-401",
            "password": "StrongPassword!123",
            "user_type": "STAFF",
            "agreed_to_terms": True,
        },
        format="json",
    )
    assert reg.status_code == 201

    # Request + Verify OTP for password reset on owner account
    otp_req = api_client.post(
        "/api/v1/auth/otp/request/",
        {"identifier": "owner@vidyafloww.edu.in", "purpose": "password_reset"},
        format="json",
    )
    assert otp_req.status_code == 200
    dev_otp = otp_req.json()["dev_otp"]

    otp_ver = api_client.post(
        "/api/v1/auth/otp/verify/",
        {"identifier": "owner@vidyafloww.edu.in", "otp_code": dev_otp, "purpose": "password_reset"},
        format="json",
    )
    assert otp_ver.status_code == 200
    action_token = otp_ver.json()["action_token"]

    reset = api_client.post(
        "/api/v1/auth/password/reset/",
        {"action_token": action_token, "new_password": "BrandNewPassword!999"},
        format="json",
    )
    assert reset.status_code == 200

    # Login with phone + new password succeeds
    login_phone = api_client.post(
        "/api/v1/auth/login/",
        {"identifier": "+91 9876543210", "password": "BrandNewPassword!999"},
        format="json",
    )
    assert login_phone.status_code == 200

    # Username recovery via Phone + DOB + OTP action_token
    lu_otp = api_client.post(
        "/api/v1/auth/otp/request/",
        {"identifier": "+919876543210", "purpose": "username_lookup"},
        format="json",
    ).json()["dev_otp"]
    lu_token = api_client.post(
        "/api/v1/auth/otp/verify/",
        {"identifier": "+919876543210", "otp_code": lu_otp, "purpose": "username_lookup"},
        format="json",
    ).json()["action_token"]
    lookup = api_client.post(
        "/api/v1/auth/username/lookup/",
        {"phone": "9876543210", "date_of_birth": "1988-05-14", "action_token": lu_token},
        format="json",
    )
    assert lookup.status_code == 200
    assert lookup.json()["matched_user"]["username"] == "owner@vidyafloww.edu.in"


@pytest.mark.django_db
def test_cross_school_isolation_and_multi_school_membership(api_client, saas_ecosystem):
    # Admin A logs in
    tok_a = api_client.post(
        "/api/v1/auth/login/",
        {"identifier": "admin.a@springfield.edu.in", "password": "StrongPassword!123"},
        format="json",
    ).json()["access_token"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {tok_a}")

    # Access own School A
    ok = api_client.get(
        "/api/v1/schools/current/",
        HTTP_X_SCHOOL_ID=str(saas_ecosystem["school_a"].id),
    )
    assert ok.status_code == 200
    assert ok.json()["school"]["short_code"] == "CBSE-DEL-401"

    # Attempt cross-school spoof to School B -> BLOCKED 403 + AuditEvent logged
    spoof = api_client.get(
        "/api/v1/schools/current/",
        HTTP_X_SCHOOL_ID=str(saas_ecosystem["school_b"].id),
    )
    assert spoof.status_code == 403
    assert spoof.json()["code"] == "TENANT_ACCESS_DENIED"
    assert AuditEvent.objects.filter(action="CROSS_TENANT_ACCESS_BLOCKED", status="Blocked").exists()

    # Multi-school user requires explicit X-School-ID when multiple schools exist
    Membership.objects.create(
        user=saas_ecosystem["school_admin_a"],
        tenant=saas_ecosystem["school_b"].tenant,
        school=saas_ecosystem["school_b"],
        user_type=UserType.STAFF,
    )
    ambiguous = api_client.get("/api/v1/schools/current/")
    assert ambiguous.status_code == 403
    assert ambiguous.json()["code"] == "SCHOOL_HEADER_REQUIRED"


@pytest.mark.django_db
def test_super_executive_cannot_cancel_subscription_while_super_admin_can(api_client, saas_ecosystem):
    exec_tok = api_client.post(
        "/api/v1/auth/login/",
        {"identifier": "exec@vidyafloww.edu.in", "password": "StrongPassword!123"},
        format="json",
    ).json()["access_token"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {exec_tok}")

    # Super Executive can read subscription and update payment card
    assert api_client.get("/api/v1/platform/subscription/").status_code == 200
    upd = api_client.post(
        "/api/v1/platform/subscription/payment-method/",
        {"brand": "MASTERCARD", "last4": "8899"},
        format="json",
    )
    assert upd.status_code == 200
    assert upd.json()["subscription"]["payment_method_last4"] == "8899"

    # Super Executive MUST BE BLOCKED from cancelling subscription
    cancel_attempt = api_client.post(
        "/api/v1/platform/subscription/cancel/",
        {"reason": "Unauthorized attempt"},
        format="json",
    )
    assert cancel_attempt.status_code == 403

    # Super Admin CAN cancel subscription
    admin_tok = api_client.post(
        "/api/v1/auth/login/",
        {"identifier": "owner@vidyafloww.edu.in", "password": "StrongPassword!123"},
        format="json",
    ).json()["access_token"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {admin_tok}")
    cancel_ok = api_client.post(
        "/api/v1/platform/subscription/cancel/",
        {"reason": "Switching contract"},
        format="json",
    )
    assert cancel_ok.status_code == 200
    assert cancel_ok.json()["subscription"]["status"] == "CANCELLED"


@pytest.mark.django_db
def test_scoped_staff_responsibility_and_expiry_and_history(api_client, saas_ecosystem):
    m_staff = saas_ecosystem["m_staff_a"]
    c6 = saas_ecosystem["class_6_id"]
    c7 = saas_ecosystem["class_7_id"]
    sa = saas_ecosystem["sec_a_id"]
    sb = saas_ecosystem["sec_b_id"]

    # Initially STAFF has zero access
    assert not evaluate_staff_responsibility(m_staff, work_division=WorkDivision.ATTENDANCE, action="create", grade_class_id=str(c6))

    # Assign scoped Class 6-A Attendance access
    assignment = assign_staff_responsibility(
        school=saas_ecosystem["school_a"],
        actor_membership=saas_ecosystem["m_admin_a"],
        target_membership=m_staff,
        work_division=WorkDivision.ATTENDANCE,
        actions=["view", "create"],
        grade_class_ids=[c6],
        section_ids=[sa],
    )
    assert evaluate_staff_responsibility(
        m_staff, work_division=WorkDivision.ATTENDANCE, action="create", grade_class_id=str(c6), section_id=str(sa)
    )
    # Different class or section must be denied
    assert not evaluate_staff_responsibility(
        m_staff, work_division=WorkDivision.ATTENDANCE, action="create", grade_class_id=str(c7), section_id=str(sa)
    )
    assert not evaluate_staff_responsibility(
        m_staff, work_division=WorkDivision.ATTENDANCE, action="create", grade_class_id=str(c6), section_id=str(sb)
    )
    assert not evaluate_staff_responsibility(
        m_staff, work_division=WorkDivision.FEES_FINANCE, action="view"
    )

    # Expired temporary assignment returns False
    StaffResponsibilityAssignment.objects.create(
        school=saas_ecosystem["school_a"],
        membership=m_staff,
        work_division=WorkDivision.HOMEWORK,
        actions=["view"],
        valid_from=timezone.now() - timedelta(days=10),
        valid_until=timezone.now() - timedelta(days=1),
    )
    assert not evaluate_staff_responsibility(m_staff, work_division=WorkDivision.HOMEWORK, action="view")

    # Revoke creates history and revokes access immediately
    revoke_staff_responsibility(assignment=assignment, actor_membership=saas_ecosystem["m_admin_a"])
    assert not evaluate_staff_responsibility(
        m_staff, work_division=WorkDivision.ATTENDANCE, action="create", grade_class_id=str(c6), section_id=str(sa)
    )
    assert ResponsibilityAssignmentHistory.objects.filter(assignment_id=assignment.id, event_type="REVOKED").exists()


@pytest.mark.django_db
def test_audit_immutability_and_secure_file_storage(api_client, saas_ecosystem):
    evt = AuditEvent.objects.create(action="TEST_IMMUTABLE", actor_name="Test")
    with pytest.raises(PermissionDenied):
        evt.delete()
    evt.action = "TAMPERED"
    with pytest.raises(PermissionDenied):
        evt.save()

    # Admin A uploads valid PDF
    tok_a = api_client.post(
        "/api/v1/auth/login/",
        {"identifier": "admin.a@springfield.edu.in", "password": "StrongPassword!123"},
        format="json",
    ).json()["access_token"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {tok_a}")

    good_pdf = SimpleUploadedFile("tc_cert.pdf", b"%PDF-1.4\n%ValidTestContent", content_type="application/pdf")
    up = api_client.post(
        "/api/v1/storage/files/",
        {"file": good_pdf, "category": "certificate"},
        format="multipart",
        HTTP_X_SCHOOL_ID=str(saas_ecosystem["school_a"].id),
    )
    assert up.status_code == 201
    file_id = up.json()["file"]["id"]

    # Rejects spoofed executable masquerading as PDF
    bad_pdf = SimpleUploadedFile("malware.pdf", b"MZ\x90\x00ThisIsAnExe", content_type="application/pdf")
    bad_up = api_client.post(
        "/api/v1/storage/files/",
        {"file": bad_pdf},
        format="multipart",
        HTTP_X_SCHOOL_ID=str(saas_ecosystem["school_a"].id),
    )
    assert bad_up.status_code == 400
    assert bad_up.json()["code"] == "FILE_VALIDATION_ERROR"

    # Admin B CANNOT download School A's file!
    tok_b = api_client.post(
        "/api/v1/auth/login/",
        {"identifier": "admin.b@oakridge.edu.in", "password": "StrongPassword!123"},
        format="json",
    ).json()["access_token"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {tok_b}")
    cross_dl = api_client.get(
        f"/api/v1/storage/files/{file_id}/download/",
        HTTP_X_SCHOOL_ID=str(saas_ecosystem["school_b"].id),
    )
    assert cross_dl.status_code == 404
