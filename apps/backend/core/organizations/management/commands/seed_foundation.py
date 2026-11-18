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
from modules.academics.models import (
    AcademicMilestone,
    AcademicSession,
    ClassSubjectMapping,
    Department,
    GradeClass,
    House,
    Section,
    Stream,
    Subject,
)
from modules.admissions.models import AdmissionApplication
from modules.hr.models import StaffProfile
from modules.students.models import Guardian, Student, StudentEnrollment, StudentGuardianLink
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

        # ─── Phase 2 Seed: Academics, Staff, Students, Admissions ───────────
        session_2627, _ = AcademicSession.objects.get_or_create(
            school=school,
            code="2026-2027",
            defaults={
                "branch": primary_branch,
                "name": "Academic Session 2026-2027",
                "start_date": date(2026, 4, 1),
                "end_date": date(2027, 3, 31),
                "is_current": True,
            },
        )
        AcademicSession.objects.get_or_create(
            school=school,
            code="2027-2028",
            defaults={
                "branch": primary_branch,
                "name": "Academic Session 2027-2028",
                "start_date": date(2027, 4, 1),
                "end_date": date(2028, 3, 31),
                "is_current": False,
            },
        )

        dept_math, _ = Department.objects.get_or_create(
            school=school,
            code="DEPT-MATH",
            defaults={"branch": primary_branch, "name": "Mathematics", "head_staff_name": "Dr. R. K. Verma"},
        )
        dept_sci, _ = Department.objects.get_or_create(
            school=school,
            code="DEPT-SCI",
            defaults={"branch": primary_branch, "name": "Physics & Science", "head_staff_name": "Ms. S. Nair"},
        )
        House.objects.get_or_create(
            school=school, code="ASHOKA", defaults={"name": "Ashoka House", "color_hex": "#2563EB"}
        )
        Stream.objects.get_or_create(
            school=school, code="SCIENCE", defaults={"name": "Science (PCM/PCB)"}
        )

        classes_seed = [
            ("CLS-09", "Class 9", "कक्षा 9", 9, GradeClass.Stage.SECONDARY, "Dr. R. K. Verma"),
            ("CLS-10", "Class 10", "कक्षा 10", 10, GradeClass.Stage.SECONDARY, "Ms. S. Nair"),
            ("CLS-11", "Class 11 (Science)", "कक्षा 11 (विज्ञान)", 11, GradeClass.Stage.SENIOR, "Prof. A. K. Gupta"),
            ("CLS-12", "Class 12 (Science)", "कक्षा 12 (विज्ञान)", 12, GradeClass.Stage.SENIOR, "Dr. P. Sharma"),
        ]
        cls_10_obj = None
        sec_10a_obj = None
        for c_code, c_name, c_hindi, c_order, c_stage, c_mentor in classes_seed:
            gc, _ = GradeClass.objects.get_or_create(
                school=school,
                code=c_code,
                defaults={
                    "branch": primary_branch,
                    "name": c_name,
                    "hindi_name": c_hindi,
                    "numeric_grade": c_order,
                    "stage": c_stage,
                    "class_mentor_name": c_mentor,
                    "room_number": f"R-{c_order}01",
                    "display_order": c_order,
                },
            )
            sec_a, _ = Section.objects.get_or_create(
                school=school,
                grade_class=gc,
                name="A",
                defaults={
                    "branch": primary_branch,
                    "code": f"{c_code}-A",
                    "room_number": f"R-{c_order}01",
                    "capacity": 40,
                },
            )
            Section.objects.get_or_create(
                school=school,
                grade_class=gc,
                name="B",
                defaults={
                    "branch": primary_branch,
                    "code": f"{c_code}-B",
                    "room_number": f"R-{c_order}02",
                    "capacity": 40,
                },
            )
            if c_code == "CLS-10":
                cls_10_obj = gc
                sec_10a_obj = sec_a

        subjects_seed = [
            ("MATH-101", "Mathematics Standard", dept_math, Subject.Tier.CORE_COMPULSORY, False, 6, 80, 20, "Dr. R. K. Verma"),
            ("SCI-102", "Integrated Science (Phy/Chem/Bio)", dept_sci, Subject.Tier.CORE_SCIENCE, False, 7, 80, 20, "Ms. S. Nair"),
            ("ENG-103", "English Language & Literature", None, Subject.Tier.LANGUAGE_COMMS, False, 5, 80, 20, "Mr. V. Singh"),
            ("SST-104", "Social Studies & Civics", None, Subject.Tier.HUMANITIES_CORE, False, 5, 80, 20, "Ms. K. Iyer"),
            ("AI-417", "Artificial Intelligence & Coding", None, Subject.Tier.SKILL_IT, True, 4, 50, 50, "Prof. A. K. Gupta"),
        ]
        for s_code, s_name, s_dept, s_tier, s_elec, s_hrs, s_th, s_pr, s_tchr in subjects_seed:
            subj, _ = Subject.objects.get_or_create(
                school=school,
                code=s_code,
                defaults={
                    "branch": primary_branch,
                    "name": s_name,
                    "department": s_dept,
                    "curriculum_tier": s_tier,
                    "is_elective": s_elec,
                },
            )
            if cls_10_obj:
                ClassSubjectMapping.objects.get_or_create(
                    school=school,
                    grade_class=cls_10_obj,
                    subject=subj,
                    defaults={
                        "branch": primary_branch,
                        "weekly_periods": s_hrs,
                        "theory_marks": s_th,
                        "internal_marks": s_pr,
                        "teacher_in_charge": s_tchr,
                    },
                )

        if cls_10_obj:
            milestones_seed = [
                ("Term 1 — Unit I & II Foundation", "Term 1", date(2026, 4, 1), date(2026, 7, 31), 100, AcademicMilestone.AssessmentType.PERIODIC, AcademicMilestone.Status.COMPLETED),
                ("Mid-Term — Half-Yearly Syllabus", "Term 1", date(2026, 8, 1), date(2026, 10, 31), 94, AcademicMilestone.AssessmentType.MID_TERM, AcademicMilestone.Status.COMPLETED),
                ("Term 2 — Core Modules V to VII", "Term 2", date(2026, 11, 1), date(2027, 1, 31), 72, AcademicMilestone.AssessmentType.PRE_BOARD, AcademicMilestone.Status.IN_PROGRESS),
                ("Pre-Board Revision & Practicals", "Term 2", date(2027, 2, 1), date(2027, 3, 25), 35, AcademicMilestone.AssessmentType.FINAL_BOARD, AcademicMilestone.Status.UPCOMING),
            ]
            for m_title, m_term, m_start, m_end, m_pct, m_assess, m_stat in milestones_seed:
                AcademicMilestone.objects.get_or_create(
                    school=school,
                    grade_class=cls_10_obj,
                    academic_session=session_2627,
                    title=m_title,
                    defaults={
                        "branch": primary_branch,
                        "term": m_term,
                        "start_date": m_start,
                        "end_date": m_end,
                        "target_syllabus_coverage": m_pct,
                        "assessment_type": m_assess,
                        "status": m_stat,
                    },
                )

        staff_seed = [
            ("FAC-101", "Dr. Rajesh Kumar Verma", "HOD - Mathematics", "Mathematics", "Mathematics", "Ph.D. Mathematics, B.Ed.", 14, "+919811122001", "r.verma@vidyafloww.edu.in", ["Class 10-A", "Class 12-A"], 24, StaffProfile.EmploymentStatus.ACTIVE, m_school_admin),
            ("FAC-102", "Ms. Sunita Nair", "Senior PGT - Physics", "Physics & Science", "Physics", "M.Sc. Physics, M.Ed.", 9, "+919811122002", "s.nair@vidyafloww.edu.in", ["Class 11-A", "Class 12-B"], 22, StaffProfile.EmploymentStatus.ACTIVE, m_staff),
            ("FAC-103", "Mr. Vikramaditya Singh", "TGT - English Literature", "Languages", "English", "M.A. English, B.Ed.", 6, "+919811122003", "v.singh@vidyafloww.edu.in", ["Class 9-A", "Class 10-B"], 26, StaffProfile.EmploymentStatus.ACTIVE, None),
        ]
        for emp_code, fn, desig, dept_lbl, prim_subj, qual, exp_y, ph, em, cls_list, wl, st, mem_obj in staff_seed:
            StaffProfile.objects.get_or_create(
                school=school,
                employee_code=emp_code,
                defaults={
                    "branch": primary_branch,
                    "membership": mem_obj,
                    "full_name": fn,
                    "designation_title": desig,
                    "department_name": dept_lbl,
                    "primary_subject": prim_subj,
                    "qualification": qual,
                    "experience_years": exp_y,
                    "joining_date": date(2020, 6, 15),
                    "phone": ph,
                    "email": em,
                    "assigned_classes_json": cls_list,
                    "weekly_periods_load": wl,
                    "employment_status": st,
                },
            )

        students_seed = [
            ("ADM-2024-089", "Aarav Sharma", "Rajesh Sharma", "+919876543210", "Paid", "96.4", "Ashoka House", Student.Status.ACTIVE, Student.Gender.MALE),
            ("ADM-2024-092", "Diya Patel", "Vikram Patel", "+919876543211", "Pending", "91.0", "Tagore House", Student.Status.ACTIVE, Student.Gender.FEMALE),
            ("ADM-2024-104", "Rohan Verma", "Suresh Verma", "+919876543212", "Paid", "88.5", "Raman House", Student.Status.ACTIVE, Student.Gender.MALE),
        ]
        for idx, (adm_no, f_name, g_name, g_phone, f_stat, att_str, h_lbl, st_lbl, gender_val) in enumerate(students_seed, start=1):
            stu, _ = Student.objects.get_or_create(
                school=school,
                admission_number=adm_no,
                defaults={
                    "branch": primary_branch,
                    "full_name": f_name,
                    "gender": gender_val,
                    "date_of_birth": date(2011, 5, 10 + idx),
                    "blood_group": "O+",
                    "joined_date": date(2024, 4, 1),
                    "current_academic_session": session_2627,
                    "current_grade_class": cls_10_obj,
                    "current_section": sec_10a_obj,
                    "current_roll_number": str(idx),
                    "class_section_label": "10-A",
                    "house_name": h_lbl,
                    "primary_guardian_name": g_name,
                    "guardian_phone": g_phone,
                    "fee_status": f_stat,
                    "attendance_pct": Decimal(att_str),
                    "status": st_lbl,
                },
            )
            if cls_10_obj and sec_10a_obj:
                StudentEnrollment.objects.get_or_create(
                    school=school,
                    student=stu,
                    academic_session=session_2627,
                    defaults={
                        "branch": primary_branch,
                        "grade_class": cls_10_obj,
                        "section": sec_10a_obj,
                        "roll_number": str(idx),
                        "house_name": h_lbl,
                        "enrollment_status": StudentEnrollment.EnrollmentStatus.ACTIVE,
                    },
                )
            guardian, _ = Guardian.objects.get_or_create(
                school=school,
                full_name=g_name,
                phone=g_phone,
                defaults={
                    "branch": primary_branch,
                    "relationship": "father",
                },
            )
            StudentGuardianLink.objects.get_or_create(
                school=school,
                student=stu,
                guardian=guardian,
                defaults={"branch": primary_branch, "is_primary_contact": True},
            )

        if cls_10_obj:
            AdmissionApplication.objects.get_or_create(
                school=school,
                application_number="APP-2026-001",
                defaults={
                    "branch": primary_branch,
                    "academic_session": session_2627,
                    "applied_class": cls_10_obj,
                    "applied_grade_label": "Class 10",
                    "candidate_name": "Kavya Iyer",
                    "gender": "female",
                    "date_of_birth": date(2011, 8, 21),
                    "primary_guardian_name": "Subramanian Iyer",
                    "guardian_phone": "+919876543299",
                    "stage": AdmissionApplication.Stage.APPROVED,
                    "decided_by_id": admin_user.id,
                    "decided_at": timezone.now(),
                },
            )

        self.stdout.write(self.style.SUCCESS(f"Seeded school '{school.name}' ({school.id}) with Phase 1 + Phase 2 data successfully."))
