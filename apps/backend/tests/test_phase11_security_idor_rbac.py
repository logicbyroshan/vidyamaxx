"""
Phase 11 — Security, Cross-Tenant IDOR & 7-Role RBAC Regression Suite
"""

from datetime import date
from decimal import Decimal
import pytest
from rest_framework.test import APIClient

from core.accounts.models import User
from core.organizations.models import CustomerTenant, School
from core.permissions.models import StaffResponsibilityAssignment, WorkDivision
from core.users.models import Membership, UserType
from modules.examinations.models import ExaminationCycle, StudentExamMark
from modules.finance.models import StudentFeeInvoice
from modules.hostel.models import HostelAllocationRecord
from modules.students.models import Student
from modules.welfare.models import CounsellingRecord


def _auth_client(user: User, school: School | None = None) -> APIClient:
    client = APIClient()
    client.force_authenticate(user=user)
    if school is not None:
        client.credentials(HTTP_X_SCHOOL_ID=str(school.id))
    return client


@pytest.mark.django_db
class TestPhase11SecurityIDORAndRBAC:
    def _setup_two_tenants(self):
        admin1 = User.objects.create_user(email="admin1@alpha.edu.in", password="Password@123", full_name="Alpha Principal")
        t1 = CustomerTenant.objects.create(name="Alpha Trust", slug="alpha-trust-sec", owner_user=admin1)
        s1 = School.objects.create(tenant=t1, name="Alpha Public School", short_code="APS-01")
        Membership.objects.create(user=admin1, tenant=t1, school=s1, user_type=UserType.SCHOOL_ADMIN)

        admin2 = User.objects.create_user(email="admin2@beta.edu.in", password="Password@123", full_name="Beta Principal")
        t2 = CustomerTenant.objects.create(name="Beta Trust", slug="beta-trust-sec", owner_user=admin2)
        s2 = School.objects.create(tenant=t2, name="Beta International School", short_code="BIS-01")
        Membership.objects.create(user=admin2, tenant=t2, school=s2, user_type=UserType.SCHOOL_ADMIN)

        return (t1, s1, admin1), (t2, s2, admin2)

    def test_cross_tenant_idor_blocked_across_operations_and_portal(self):
        (_, s1, _admin1), (_, s2, admin2) = self._setup_two_tenants()

        # Create tenant-1 sensitive records
        hostel_s1 = HostelAllocationRecord.objects.create(
            school=s1,
            hostel_block="Block A",
            room_number="A-101",
            admission_number="ADM-ALP-01",
            student_name="Alpha Student",
            warden_name="Warden A",
        )
        Student.objects.create(
            school=s1,
            admission_number="ADM-ALP-01",
            full_name="Alpha Student",
            class_section_label="Class 10-A",
            guardian_email="parent@alpha.edu.in",
        )
        StudentFeeInvoice.objects.create(
            school=s1,
            invoice_number="INV-ALP-01",
            admission_number="ADM-ALP-01",
            student_name="Alpha Student",
            class_section_label="Class 10-A",
            gross_fee_inr=Decimal("50000.00"),
            net_assessed_fee_inr=Decimal("50000.00"),
            due_amount_inr=Decimal("50000.00"),
        )

        # Tenant-2 admin tries to read/patch/delete Tenant-1's hostel record by UUID
        c2 = _auth_client(admin2, s2)
        assert c2.get(f"/api/v1/operations/hostel/allocations/{hostel_s1.id}/").status_code == 404
        assert c2.patch(
            f"/api/v1/operations/hostel/allocations/{hostel_s1.id}/",
            {"room_number": "HACKED"},
            format="json",
        ).status_code == 404
        assert c2.delete(f"/api/v1/operations/hostel/allocations/{hostel_s1.id}/").status_code == 404

        # Tenant-2 admin tries forging X-School-ID to Tenant-1's school ID
        forged_client = _auth_client(admin2, s1)
        assert forged_client.get("/api/v1/students/").status_code == 403
        assert forged_client.get("/api/v1/finance/invoices/").status_code == 403
        assert forged_client.get("/api/v1/portal/overview/").status_code == 403
        assert forged_client.get("/api/v1/analytics/statistics/").status_code == 403

        # Tenant-1 record remains completely intact
        hostel_s1.refresh_from_db()
        assert hostel_s1.room_number == "A-101"

    def test_all_seven_user_types_permission_boundaries(self):
        (t1, s1, admin1), _ = self._setup_two_tenants()

        # Create remaining 6 roles
        super_admin = User.objects.create_user(email="sa@vidya.in", password="Password@123", full_name="Platform Super Admin")
        Membership.objects.create(user=super_admin, tenant=t1, school=s1, user_type=UserType.SUPER_ADMIN)

        super_exec = User.objects.create_user(email="se@vidya.in", password="Password@123", full_name="Platform Super Exec")
        Membership.objects.create(user=super_exec, tenant=t1, school=s1, user_type=UserType.SUPER_EXECUTIVE)

        school_exec = User.objects.create_user(email="schoolexec@alpha.edu.in", password="Password@123", full_name="School Exec")
        Membership.objects.create(user=school_exec, tenant=t1, school=s1, user_type=UserType.SCHOOL_EXECUTIVE)

        staff_basic = User.objects.create_user(email="staff@alpha.edu.in", password="Password@123", full_name="General Teacher")
        staff_membership = Membership.objects.create(user=staff_basic, tenant=t1, school=s1, user_type=UserType.STAFF)

        parent_user = User.objects.create_user(email="parent@alpha.edu.in", phone="+919999000011", password="Password@123", full_name="Parent One")
        Membership.objects.create(user=parent_user, tenant=t1, school=s1, user_type=UserType.PARENT)

        student_user = User.objects.create_user(email="student@alpha.edu.in", password="Password@123", full_name="Student One")
        Membership.objects.create(user=student_user, tenant=t1, school=s1, user_type=UserType.STUDENT)

        # Confidential counselling record
        CounsellingRecord.objects.create(
            school=s1,
            admission_number="ADM-100",
            student_name="Student One",
            counsellor_name="Dr. Counsellor",
            session_date=date(2026, 8, 1),
            category="Emotional Wellbeing",
            confidential_notes="Strictly confidential session notes",
        )

        # 1. General STAFF without counselling responsibility cannot read or write confidential counselling
        c_staff = _auth_client(staff_basic, s1)
        assert c_staff.get("/api/v1/engagement/counselling/records/").status_code == 403
        assert c_staff.post(
            "/api/v1/operations/transport/routes/",
            {"route_code": "R99", "route_name": "Unauthorized", "vehicle_number": "DL-01-XX-0001"},
            format="json",
        ).status_code == 403

        # 2. Granting scoped TRANSPORT responsibility allows transport create, still denies counselling
        StaffResponsibilityAssignment.objects.create(
            school=s1,
            membership=staff_membership,
            work_division=WorkDivision.TRANSPORT,
            actions=["view", "create", "edit"],
            granted_by_id=admin1.id,
        )
        assert c_staff.post(
            "/api/v1/operations/transport/routes/",
            {"route_code": "R10", "route_name": "Authorized Route", "vehicle_number": "DL-01-AA-1234"},
            format="json",
        ).status_code == 201
        assert c_staff.get("/api/v1/engagement/counselling/records/").status_code == 403

        # 3. PARENT and STUDENT can view /portal/overview/ (200) but cannot create admin resources (403)
        for u in (parent_user, student_user):
            cu = _auth_client(u, s1)
            assert cu.get("/api/v1/portal/overview/").status_code == 200
            assert cu.post(
                "/api/v1/operations/library/books/",
                {"isbn_or_code": "ISBN-999", "title": "Unauthorized Book", "author": "Anon"},
                format="json",
            ).status_code == 403
            assert cu.get("/api/v1/engagement/counselling/records/").status_code == 403

        # 4. SCHOOL_ADMIN, SUPER_ADMIN, and SCHOOL_EXECUTIVE have counselling division access
        for u in (admin1, super_admin, school_exec):
            ca = _auth_client(u, s1)
            assert ca.get("/api/v1/engagement/counselling/records/").status_code == 200

        # 5. SUPER_EXECUTIVE can view dashboard telemetry cleanly
        c_se = _auth_client(super_exec, s1)
        assert c_se.get("/api/v1/analytics/dashboard/").status_code == 200

    def test_statistics_endpoint_computes_real_pass_rate_from_exam_marks(self):
        (_, s1, admin1), _ = self._setup_two_tenants()
        cycle = ExaminationCycle.objects.create(
            school=s1,
            code="TERM-1-2026",
            name="Term 1 Assessment",
            term_label="Term 1",
            start_date=date(2026, 9, 1),
            end_date=date(2026, 9, 15),
        )
        StudentExamMark.objects.create(
            school=s1,
            examination=cycle,
            admission_number="ADM-1",
            student_name="Aarav",
            class_section_label="Class 10-A",
            subject_code="MATH",
            subject_name="Mathematics",
            theory_marks=Decimal("70.00"),
            practical_marks=Decimal("18.00"),
            total_marks=Decimal("88.00"),
            max_total_marks=Decimal("100.00"),
            grade="A1",
        )
        StudentExamMark.objects.create(
            school=s1,
            examination=cycle,
            admission_number="ADM-2",
            student_name="Rohan",
            class_section_label="Class 10-A",
            subject_code="MATH",
            subject_name="Mathematics",
            theory_marks=Decimal("20.00"),
            practical_marks=Decimal("5.00"),
            total_marks=Decimal("25.00"),
            max_total_marks=Decimal("100.00"),
            grade="E",
        )
        client = _auth_client(admin1, s1)
        resp = client.get("/api/v1/analytics/statistics/")
        assert resp.status_code == 200
        assert resp.data["board_pass_rate"] == "50.0%"
