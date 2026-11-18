"""
Phase 7, 8 & 9 Automated Verification Suite:
Governance, Executive Dashboard, Institutional Statistics, Reports (#27),
Statutory Compliance (#29), Cross-Platform AI Capability, and 12 Decoupled Subsystems Contract.
"""

import pytest
from rest_framework.test import APIClient

from core.accounts.models import User
from core.campuses.models import Branch
from core.organizations.models import CustomerTenant, School
from core.permissions.models import WorkDivision
from core.users.models import Membership, UserType


@pytest.fixture
def phase7_env(db):
    admin = User.objects.create(
        email="phase7.admin@vidyafloww.edu.in",
        phone="+919900667788",
        full_name="Dr. A. P. J. Abdul Kalam",
        is_verified=True,
        is_active=True,
    )
    admin.set_unusable_password()
    admin.save()

    tenant = CustomerTenant.objects.create(
        name="Kalam Vision Foundation",
        slug="kalam-vision",
        owner_user=admin,
    )
    school = School.objects.create(
        tenant=tenant,
        name="Kalam National Science Academy",
        short_code="KNSA-DEL-01",
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
        user=admin,
        tenant=tenant,
        school=school,
        default_branch=branch,
        user_type=UserType.SCHOOL_ADMIN,
    )

    client = APIClient()
    client.force_authenticate(user=admin)
    return {
        "client": client,
        "school": school,
        "headers": {"HTTP_X_SCHOOL_ID": str(school.id)},
    }


def test_dashboard_statistics_reports_compliance_ai_and_12_subsystems(phase7_env):
    client = phase7_env["client"]
    headers = phase7_env["headers"]

    # 1. Verify finalized 30 work divisions count & AI exclusion from WorkDivision enum
    assert len(WorkDivision.values) == 30
    assert "ai" not in [v.lower() for v in WorkDivision.values]

    # 2. Dashboard Command Summary
    dash_res = client.get("/api/v1/analytics/dashboard/", **headers)
    assert dash_res.status_code == 200
    assert dash_res.json()["data"]["work_divisions_count"] == 30

    # 3. Institutional Statistics
    stat_res = client.get("/api/v1/analytics/statistics/", **headers)
    assert stat_res.status_code == 200
    assert len(stat_res.json()["data"]["wing_breakdown"]) == 4

    # 4. Reports & Analytics (#27)
    rep_res = client.post(
        "/api/v1/analytics/reports/",
        {
            "report_code": "REP-2026-901",
            "domain": "students",
            "title": "Q2 Student Enrollment Audit Register",
            "export_format": "csv",
            "row_count": 420,
        },
        format="json",
        **headers,
    )
    assert rep_res.status_code == 201

    # 5. Statutory Compliance & Records (#29)
    comp_res = client.post(
        "/api/v1/analytics/compliance/",
        {
            "filing_code": "CBSE-OASIS-2026",
            "authority_name": "CBSE OASIS / UDISE+",
            "title": "Annual Faculty & Infrastructure Return 2026-27",
            "submission_status": "Compliant & Verified",
        },
        format="json",
        **headers,
    )
    assert comp_res.status_code == 201

    # 6. Cross-Platform AI Capability
    ai_res = client.post(
        "/api/v1/analytics/ai/assist/",
        {"capability": "lesson_plan", "prompt": "Laws of Motion & Inertia"},
        format="json",
        **headers,
    )
    assert ai_res.status_code == 200
    assert "Laws of Motion & Inertia" in ai_res.json()["data"]["suggestion"]

    # 7. 12 Decoupled Subsystems Integration Contract
    sub_res = client.get("/api/v1/analytics/subsystems/", **headers)
    assert sub_res.status_code == 200
    assert sub_res.json()["data"]["subsystems_count"] == 12
