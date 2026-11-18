"""
Idempotent development seed command for Phase 1 Foundation
(Tenant, Subscription, Invoices, School, Branches, SecurityPolicy, AuditEvents).
Uses strictly non-sensitive placeholder values (AGENTS.md Rule 6).
"""

from datetime import date, timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from core.accounts.models import User
from core.campuses.models import Branch
from core.organizations.models import (
    CustomerSubscription,
    CustomerTenant,
    PlatformInvoice,
    School,
    SubscriptionPlan,
)
from core.permissions.models import SecurityPolicy, WorkDivision
from core.permissions.services import assign_staff_responsibility
from core.users.models import Membership, UserType
from platform_services.audit.models import AuditEvent
from platform_services.notifications.models import InAppNotification


class Command(BaseCommand):
    help = "Seeds non-sensitive Phase 1 institutional foundation records for local development."

    @transaction.atomic
    def handle(self, *args, **options):
        admin_user, created = User.objects.get_or_create(
            email="principal@vidyafloww.edu.in",
            defaults={
                "phone": "+919876543210",
                "full_name": "Dr. Rajesh Sharma",
                "hindi_name": "डॉ. राजेश शर्मा",
                "date_of_birth": date(1980, 5, 14),
                "is_verified": True,
                "is_active": True,
                "is_staff": True,
            },
        )
        if created:
            admin_user.set_unusable_password()
            admin_user.save(update_fields=["password"])

        staff_user, _ = User.objects.get_or_create(
            email="faculty@vidyafloww.edu.in",
            defaults={
                "phone": "+919876500001",
                "full_name": "Ms. Anita Verma",
                "is_verified": True,
                "is_active": True,
            },
        )

        tenant, _ = CustomerTenant.objects.get_or_create(
            slug="vidyafloww-academy-trust",
            defaults={
                "name": "VidyaFloww Education Trust",
                "owner_user": admin_user,
                "contact_email": "office@vidyafloww.edu.in",
                "contact_phone": "+919876543210",
                "gstin": "07AAACV1234F1Z5",
            },
        )

        plan, _ = SubscriptionPlan.objects.get_or_create(
            code="ENTERPRISE_PLUS",
            defaults={
                "name": "VidyaFloww Enterprise Multi-Campus Tier",
                "max_schools": 10,
                "max_students": 15000,
                "price_monthly_inr": Decimal("24999.00"),
                "price_annual_inr": Decimal("240000.00"),
            },
        )

        sub, _ = CustomerSubscription.objects.get_or_create(
            tenant=tenant,
            plan=plan,
            defaults={
                "license_key_prefix": "VF-ENT-2026",
                "license_key_hash": "seeded-non-secret-hash",
                "status": CustomerSubscription.Status.ACTIVE,
                "current_period_start": date(2026, 4, 1),
                "current_period_end": date(2027, 3, 31),
                "payment_method_brand": "VISA",
                "payment_method_last4": "4242",
            },
        )

        PlatformInvoice.objects.get_or_create(
            invoice_number="INV-2026-0891",
            defaults={
                "subscription": sub,
                "billing_date": date(2026, 4, 1),
                "amount_inr": Decimal("240000.00"),
                "description": "Annual Enterprise License (AY 2026-27)",
                "payment_method_label": "Corporate NEFT / RTGS",
                "status": PlatformInvoice.Status.PAID,
                "paid_at": timezone.now() - timedelta(days=30),
            },
        )

        school, _ = School.objects.get_or_create(
            tenant=tenant,
            short_code="CBSE-DEL-401",
            defaults={
                "name": "VidyaFloww International Academy",
                "tagline": "Excellence in Academic & Holistic Leadership",
                "city": "New Delhi, India",
                "state": "Delhi",
                "pincode": "110001",
                "board_affiliation": School.BoardAffiliation.CBSE,
                "affiliation_number": "1630982",
                "established_year": "1994",
                "academic_level": "K-12 Senior Secondary",
                "principal_name": "Dr. Rajesh Sharma, Ph.D.",
                "active_academic_session_label": "2026-2027",
            },
        )

        branches_seed = [
            ("CMP-01", "VidyaFloww International Academy (Main Campus)", "New Delhi, India", "CBSE Affiliation #1630982", "Dr. Rajesh Sharma", True),
            ("CMP-02", "VidyaFloww International Academy (North Branch)", "Gurugram, Haryana", "CBSE / IB World", "Ms. Pooja Rao", False),
            ("CMP-03", "VidyaFloww International Academy (South Campus)", "Noida, Uttar Pradesh", "CBSE Affiliation #1630990", "Mr. Deepak Mishra", False),
        ]
        primary_branch = None
        for code, bname, city, board, principal, is_prim in branches_seed:
            b, _ = Branch.objects.get_or_create(
                school=school,
                code=code,
                defaults={
                    "name": bname,
                    "city": city,
                    "board": board,
                    "principal_name": principal,
                    "is_primary": is_prim,
                    "status": Branch.Status.ACTIVE,
                },
            )
            if is_prim:
                primary_branch = b

        SecurityPolicy.objects.get_or_create(
            school=school,
            defaults={
                "two_factor_enforced": True,
                "session_timeout_minutes": 30,
                "ip_whitelist_cidrs": ["103.21.244.0/24"],
            },
        )

        Membership.objects.get_or_create(
            user=admin_user,
            tenant=tenant,
            school=None,
            user_type=UserType.SUPER_ADMIN,
        )
        m_school_admin, _ = Membership.objects.get_or_create(
            user=admin_user,
            tenant=tenant,
            school=school,
            user_type=UserType.SCHOOL_ADMIN,
            defaults={"default_branch": primary_branch},
        )
        m_staff, _ = Membership.objects.get_or_create(
            user=staff_user,
            tenant=tenant,
            school=school,
            user_type=UserType.STAFF,
            defaults={"default_branch": primary_branch},
        )

        if not m_staff.responsibility_assignments.exists():
            assign_staff_responsibility(
                school=school,
                actor_membership=m_school_admin,
                target_membership=m_staff,
                work_division=WorkDivision.ATTENDANCE,
                actions=["view", "create", "edit"],
                notes="Class 6-A & 6-B Daily Attendance Responsibility",
            )

        if not AuditEvent.objects.filter(school_id=school.id).exists():
            AuditEvent.objects.create(
                tenant_id=tenant.id,
                school_id=school.id,
                actor_user_id=admin_user.id,
                actor_name=admin_user.full_name,
                actor_role_label="SCHOOL_ADMIN",
                category=AuditEvent.Category.SETTINGS,
                action="FOUNDATION_INITIALIZED",
                target_type="School",
                target_id=str(school.id),
                ip_address="127.0.0.1",
                status=AuditEvent.Status.SUCCESS,
            )

        if not InAppNotification.objects.filter(school=school).exists():
            InAppNotification.objects.create(
                school=school,
                branch=primary_branch,
                recipient_user_id=admin_user.id,
                title="Phase 1 Backend Foundation Active",
                description="Multi-tenant isolation, JWT rotation, and responsibility RBAC are online.",
                notification_type=InAppNotification.Type.SUCCESS,
            )

        self.stdout.write(self.style.SUCCESS(f"Seeded school '{school.name}' ({school.id}) successfully."))
