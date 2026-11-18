"""
Phase 5 Automated Verification Suite:
School Operational Domains (Certificates & Documents, Library, Transport, Hostel,
Inventory, Fixed Assets & Maintenance, Events & Calendar, Student Activities, Front Office).
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
def phase5_env(db):
    admin = User.objects.create(
        email="phase5.ops@vidyafloww.edu.in",
        phone="+919900445566",
        full_name="Ms. Pooja Rao",
        is_verified=True,
        is_active=True,
    )
    admin.set_unusable_password()
    admin.save()

    staff_user = User.objects.create(
        email="phase5.staff@vidyafloww.edu.in",
        phone="+919900445567",
        full_name="Mr. Ramesh Kumar",
        is_verified=True,
        is_active=True,
    )

    tenant = CustomerTenant.objects.create(
        name="Rao Academy Trust",
        slug="rao-trust",
        owner_user=admin,
    )
    school = School.objects.create(
        tenant=tenant,
        name="Rao International School",
        short_code="RIS-HYD-01",
        city="Hyderabad",
    )
    branch = Branch.objects.create(
        school=school,
        code="MAIN",
        name="Main Campus",
        city="Hyderabad",
        is_primary=True,
    )
    m_admin = Membership.objects.create(
        user=admin,
        tenant=tenant,
        school=school,
        default_branch=branch,
        user_type=UserType.SCHOOL_ADMIN,
    )
    m_staff = Membership.objects.create(
        user=staff_user,
        tenant=tenant,
        school=school,
        default_branch=branch,
        user_type=UserType.STAFF,
    )

    client = APIClient()
    client.force_authenticate(user=admin)
    return {
        "client": client,
        "staff_user": staff_user,
        "m_admin": m_admin,
        "m_staff": m_staff,
        "school": school,
        "headers": {"HTTP_X_SCHOOL_ID": str(school.id)},
    }


def test_all_school_operational_domains_and_staff_division_rbac(phase5_env):
    client = phase5_env["client"]
    headers = phase5_env["headers"]

    # 1. Certificates & Compliance Documents (#12)
    assert client.post(
        "/api/v1/operations/certificates/templates/",
        {"code": "TMPL-TC-01", "title": "CBSE Transfer Certificate", "certificate_type": "TC"},
        format="json",
        **headers,
    ).status_code == 201

    assert client.post(
        "/api/v1/operations/certificates/issued/",
        {
            "serial_number": "TC-2026-0091",
            "certificate_type": "TC",
            "recipient_code": "ADM-2026-001",
            "recipient_name": "Aarav Sharma",
        },
        format="json",
        **headers,
    ).status_code == 201

    assert client.post(
        "/api/v1/operations/documents/",
        {
            "owner_code": "ADM-2026-001",
            "owner_name": "Aarav Sharma",
            "document_name": "Aadhaar KYC Proof",
            "verification_status": "Verified",
        },
        format="json",
        **headers,
    ).status_code == 201

    # 2. Library (#13), Transport (#14), Hostel (#15)
    assert client.post(
        "/api/v1/operations/library/books/",
        {"isbn_or_code": "ISBN-978-81-7450", "title": "NCERT Physics Part I", "total_copies": 25, "available_copies": 20},
        format="json",
        **headers,
    ).status_code == 201

    assert client.post(
        "/api/v1/operations/transport/routes/",
        {"route_code": "RT-01", "route_name": "Vasant Kunj – Main Campus"},
        format="json",
        **headers,
    ).status_code == 201

    assert client.post(
        "/api/v1/operations/hostel/allocations/",
        {"room_number": "B-204", "admission_number": "ADM-2026-001", "student_name": "Aarav Sharma"},
        format="json",
        **headers,
    ).status_code == 201

    # 3. Inventory (#16) & Fixed Assets (#17)
    assert client.post(
        "/api/v1/operations/inventory/items/",
        {"sku_code": "LAB-CHM-01", "item_name": "Titration Burettes 50ml", "quantity_on_hand": 40},
        format="json",
        **headers,
    ).status_code == 201

    assert client.post(
        "/api/v1/operations/assets/",
        {"asset_tag": "AST-PROJ-101", "asset_name": "Smart Interactive Flat Panel 75-inch"},
        format="json",
        **headers,
    ).status_code == 201

    # 4. Events (#22), Student Activities (#23), Front Office (#26)
    assert client.post(
        "/api/v1/operations/events/",
        {"title": "Annual Science Exhibition", "start_date": "2026-11-15", "end_date": "2026-11-16"},
        format="json",
        **headers,
    ).status_code == 201

    assert client.post(
        "/api/v1/operations/activities/",
        {"activity_name": "Robotics & AI Olympiad Squad", "club_or_house": "Raman House"},
        format="json",
        **headers,
    ).status_code == 201

    # 5. Verify unified STAFF user without FRONT_OFFICE responsibility is blocked from creating visitor pass,
    #    then succeeds once assigned FRONT_OFFICE responsibility!
    staff_client = APIClient()
    staff_client.force_authenticate(user=phase5_env["staff_user"])

    denied_res = staff_client.post(
        "/api/v1/operations/front-office/visitors/",
        {"pass_number": "VP-1001", "visitor_name": "Rajesh Sharma", "visitor_phone": "+919876543210"},
        format="json",
        **headers,
    )
    assert denied_res.status_code == 403

    assign_staff_responsibility(
        school=phase5_env["school"],
        actor_membership=phase5_env["m_admin"],
        target_membership=phase5_env["m_staff"],
        work_division=WorkDivision.FRONT_OFFICE,
        actions=["view", "create"],
    )

    allowed_res = staff_client.post(
        "/api/v1/operations/front-office/visitors/",
        {"pass_number": "VP-1001", "visitor_name": "Rajesh Sharma", "visitor_phone": "+919876543210"},
        format="json",
        **headers,
    )
    assert allowed_res.status_code == 201
