"""
Phase 6 Automated Verification Suite:
Engagement, Student Health, Confidential Counselling RBAC, Circulars, Surveys & Polls,
and Complaints & Grievances Helpdesk.
"""

import pytest
from rest_framework.test import APIClient

from core.accounts.models import User
from core.campuses.models import Branch
from core.organizations.models import CustomerTenant, School
from core.permissions.models import WorkDivision
from core.permissions.services import assign_staff_responsibility
from core.users.models import Membership, UserType


@pytest.fixture
def phase6_env(db):
    admin = User.objects.create(
        email="phase6.admin@vidyafloww.edu.in",
        phone="+919900556677",
        full_name="Dr. S. Radhakrishnan",
        is_verified=True,
        is_active=True,
    )
    admin.set_unusable_password()
    admin.save()

    teacher_user = User.objects.create(
        email="phase6.teacher@vidyafloww.edu.in",
        phone="+919900556678",
        full_name="Mr. General Faculty",
        is_verified=True,
        is_active=True,
    )

    tenant = CustomerTenant.objects.create(
        name="Radhakrishnan Education Trust",
        slug="radhakrishnan-trust",
        owner_user=admin,
    )
    school = School.objects.create(
        tenant=tenant,
        name="Radhakrishnan National Academy",
        short_code="RNA-CHN-01",
        city="Chennai",
    )
    branch = Branch.objects.create(
        school=school,
        code="MAIN",
        name="Main Campus",
        city="Chennai",
        is_primary=True,
    )
    m_admin = Membership.objects.create(
        user=admin,
        tenant=tenant,
        school=school,
        default_branch=branch,
        user_type=UserType.SCHOOL_ADMIN,
    )
    m_teacher = Membership.objects.create(
        user=teacher_user,
        tenant=tenant,
        school=school,
        default_branch=branch,
        user_type=UserType.STAFF,
    )

    # Give teacher TEACHING responsibility, but NOT COUNSELLING_SUPPORT
    assign_staff_responsibility(
        school=school,
        actor_membership=m_admin,
        target_membership=m_teacher,
        work_division=WorkDivision.TEACHING,
        actions=["view", "create", "edit"],
    )

    client = APIClient()
    client.force_authenticate(user=admin)
    return {
        "client": client,
        "teacher_user": teacher_user,
        "m_admin": m_admin,
        "m_teacher": m_teacher,
        "school": school,
        "headers": {"HTTP_X_SCHOOL_ID": str(school.id)},
    }


def test_confidential_counselling_rbac_blocks_general_faculty(phase6_env):
    client = phase6_env["client"]
    headers = phase6_env["headers"]

    # 1. School Admin creates confidential counselling record
    create_res = client.post(
        "/api/v1/engagement/counselling/records/",
        {
            "admission_number": "ADM-2026-001",
            "student_name": "Aarav Sharma",
            "counsellor_name": "Dr. Meera Krishnan (Psychologist)",
            "confidential_notes": "Student experiencing pre-board exam anxiety; weekly mindfulness sessions scheduled.",
        },
        format="json",
        **headers,
    )
    assert create_res.status_code == 201

    # 2. General teacher (who has TEACHING responsibility, NOT COUNSELLING_SUPPORT) MUST be denied 403 on GET!
    teacher_client = APIClient()
    teacher_client.force_authenticate(user=phase6_env["teacher_user"])

    denied_get = teacher_client.get("/api/v1/engagement/counselling/records/", **headers)
    assert denied_get.status_code == 403

    # 3. Grant COUNSELLING_SUPPORT view responsibility -> GET now succeeds (200)
    assign_staff_responsibility(
        school=phase6_env["school"],
        actor_membership=phase6_env["m_admin"],
        target_membership=phase6_env["m_teacher"],
        work_division=WorkDivision.COUNSELLING_SUPPORT,
        actions=["view"],
    )
    allowed_get = teacher_client.get("/api/v1/engagement/counselling/records/", **headers)
    assert allowed_get.status_code == 200
    assert len(allowed_get.json()["data"]) == 1


def test_health_circulars_surveys_and_grievance_helpdesk_workflow(phase6_env):
    client = phase6_env["client"]
    headers = phase6_env["headers"]

    # 1. Infirmary visit (#19 Student Health)
    assert client.post(
        "/api/v1/engagement/health/visits/",
        {
            "admission_number": "ADM-2026-001",
            "student_name": "Aarav Sharma",
            "symptoms": "Mild headache during sports period",
        },
        format="json",
        **headers,
    ).status_code == 201

    # 2. Circular broadcast (#21 Communication)
    assert client.post(
        "/api/v1/engagement/circulars/",
        {
            "circular_number": "CIR-2026-042",
            "title": "PTM Schedule for Term 1",
            "message_body": "Parent-Teacher Meeting scheduled for Saturday 09:00 AM.",
        },
        format="json",
        **headers,
    ).status_code == 201

    # 3. Survey creation & voting (#24 Surveys & Forms)
    surv_res = client.post(
        "/api/v1/engagement/surveys/",
        {
            "survey_code": "SURV-2026-501",
            "title": "STEM Lab Feedback Poll",
            "target_audience": "Students",
            "total_target": 200,
        },
        format="json",
        **headers,
    )
    assert surv_res.status_code == 201
    surv_id = surv_res.json()["data"]["id"]

    vote_res = client.post(f"/api/v1/engagement/surveys/{surv_id}/vote/", format="json", **headers)
    assert vote_res.status_code == 200
    assert vote_res.json()["data"]["responses_count"] == 1

    # 4. Grievance ticket lodge & resolution (#25 Complaints & Grievances)
    tkt_res = client.post(
        "/api/v1/engagement/complaints/",
        {
            "ticket_number": "TKT-2026-901",
            "complainant_type": "Parent",
            "complainant_name": "Rajesh Sharma",
            "category": "Transport",
            "subject": "Bus stop timing query",
            "priority": "High",
        },
        format="json",
        **headers,
    )
    assert tkt_res.status_code == 201
    tkt_id = tkt_res.json()["data"]["id"]

    resolve_res = client.patch(
        f"/api/v1/engagement/complaints/{tkt_id}/",
        {"status": "Resolved", "resolution_notes": "GPS route timing updated and shared with parent."},
        format="json",
        **headers,
    )
    assert resolve_res.status_code == 200
    assert resolve_res.json()["data"]["status"] == "Resolved"
