"""
Pytest configuration and shared multi-tenant fixtures for VidyaFloww Backend.
"""

from datetime import date, timedelta
from decimal import Decimal
import uuid

import pytest
from django.utils import timezone
from rest_framework.test import APIClient

from core.accounts.models import User
from core.campuses.models import Branch
from core.organizations.models import (
    CustomerSubscription,
    CustomerTenant,
    PlatformInvoice,
    School,
    SubscriptionPlan,
)
from core.users.models import Membership, UserType


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def saas_ecosystem(db):
    """Creates two isolated Schools (School A and School B) and platform/school/staff users."""
    super_admin = User.objects.create_user(
        email="owner@vidyafloww.edu.in",
        phone="9876543210",
        password="StrongPassword!123",
        full_name="Tenant Owner",
        date_of_birth=date(1988, 5, 14),
        is_verified=True,
    )
    super_exec = User.objects.create_user(
        email="exec@vidyafloww.edu.in",
        password="StrongPassword!123",
        full_name="Platform Executive",
        is_verified=True,
    )
    school_admin_a = User.objects.create_user(
        email="admin.a@springfield.edu.in",
        password="StrongPassword!123",
        full_name="Principal A",
        is_verified=True,
    )
    school_admin_b = User.objects.create_user(
        email="admin.b@oakridge.edu.in",
        password="StrongPassword!123",
        full_name="Principal B",
        is_verified=True,
    )
    staff_a = User.objects.create_user(
        email="teacher.a@springfield.edu.in",
        password="StrongPassword!123",
        full_name="Anita Verma",
        is_verified=True,
    )

    tenant = CustomerTenant.objects.create(
        name="Springfield Education Trust",
        slug="springfield-trust",
        owner_user=super_admin,
        contact_email="billing@springfield.edu.in",
    )
    plan = SubscriptionPlan.objects.create(
        code="ENTERPRISE_K12",
        name="Enterprise K-12 Multi-Branch",
        max_schools=10,
        max_students=10000,
        price_monthly_inr=Decimal("24999.00"),
        price_annual_inr=Decimal("249999.00"),
    )
    sub = CustomerSubscription.objects.create(
        tenant=tenant,
        plan=plan,
        license_key_prefix="VF-ENT-9918",
        license_key_hash="sha256-placeholder",
        status=CustomerSubscription.Status.ACTIVE,
        current_period_end=timezone.localdate() + timedelta(days=365),
        payment_method_brand="VISA",
        payment_method_last4="4242",
    )
    PlatformInvoice.objects.create(
        subscription=sub,
        invoice_number="INV-VF-2026-001",
        billing_date=timezone.localdate(),
        amount_inr=Decimal("24999.00"),
        description="Annual Enterprise SaaS License",
        status=PlatformInvoice.Status.PAID,
    )

    school_a = School.objects.create(
        tenant=tenant,
        name="Springfield Academy",
        short_code="CBSE-DEL-401",
        city="New Delhi",
    )
    branch_a1 = Branch.objects.create(
        school=school_a,
        code="CMP-01",
        name="Springfield Main Campus",
        city="New Delhi",
        is_primary=True,
    )

    tenant_b = CustomerTenant.objects.create(
        name="Oakridge Trust",
        slug="oakridge-trust",
        contact_email="admin@oakridge.edu.in",
    )
    school_b = School.objects.create(
        tenant=tenant_b,
        name="Oakridge International",
        short_code="CBSE-BLR-909",
        city="Bengaluru",
    )
    branch_b1 = Branch.objects.create(
        school=school_b,
        code="OAK-01",
        name="Oakridge Main Campus",
        city="Bengaluru",
        is_primary=True,
    )

    m_super_admin = Membership.objects.create(
        user=super_admin, tenant=tenant, school=None, user_type=UserType.SUPER_ADMIN
    )
    m_super_exec = Membership.objects.create(
        user=super_exec, tenant=tenant, school=None, user_type=UserType.SUPER_EXECUTIVE
    )
    m_admin_a = Membership.objects.create(
        user=school_admin_a, tenant=tenant, school=school_a, default_branch=branch_a1, user_type=UserType.SCHOOL_ADMIN
    )
    m_admin_b = Membership.objects.create(
        user=school_admin_b, tenant=tenant_b, school=school_b, default_branch=branch_b1, user_type=UserType.SCHOOL_ADMIN
    )
    m_staff_a = Membership.objects.create(
        user=staff_a, tenant=tenant, school=school_a, default_branch=branch_a1, user_type=UserType.STAFF
    )

    return {
        "super_admin": super_admin,
        "super_exec": super_exec,
        "school_admin_a": school_admin_a,
        "school_admin_b": school_admin_b,
        "staff_a": staff_a,
        "tenant": tenant,
        "subscription": sub,
        "school_a": school_a,
        "school_b": school_b,
        "branch_a1": branch_a1,
        "branch_b1": branch_b1,
        "m_super_admin": m_super_admin,
        "m_super_exec": m_super_exec,
        "m_admin_a": m_admin_a,
        "m_admin_b": m_admin_b,
        "m_staff_a": m_staff_a,
        "class_6_id": uuid.uuid4(),
        "class_7_id": uuid.uuid4(),
        "sec_a_id": uuid.uuid4(),
        "sec_b_id": uuid.uuid4(),
    }
