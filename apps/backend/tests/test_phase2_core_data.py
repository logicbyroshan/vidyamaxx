"""
Phase 2 Automated Verification Suite:
Core Institutional Data (Academics, Unified Staff HR, Student 360° & Multi-Session History, Admissions Pipeline).
"""

import pytest
from datetime import date
from decimal import Decimal
from rest_framework.test import APIClient

from core.accounts.models import User
from core.campuses.models import Branch
from core.organizations.models import CustomerTenant, School
from core.users.models import Membership, UserType
from modules.academics.models import AcademicSession, GradeClass, Section
from modules.admissions.models import AdmissionApplication
from modules.hr.models import StaffProfile
from modules.students.models import Student, StudentEnrollment


@pytest.fixture
def phase2_env(db):
    user = User.objects.create(
        email="phase2.admin@vidyafloww.edu.in",
        phone="+919900112233",
        full_name="Dr. Vikram Sarabhai",
        is_verified=True,
        is_active=True,
    )
    user.set_unusable_password()
    user.save()

    tenant = CustomerTenant.objects.create(
        name="Sarabhai Education Foundation",
        slug="sarabhai-edu",
        owner_user=user,
    )
    school = School.objects.create(
        tenant=tenant,
        name="Sarabhai Public School",
        short_code="SPS-AMD-01",
        city="Ahmedabad, Gujarat",
    )
    other_school = School.objects.create(
        tenant=tenant,
        name="Other Isolated School",
        short_code="OIS-MUM-02",
        city="Mumbai, Maharashtra",
    )
    branch = Branch.objects.create(
        school=school,
        code="MAIN",
        name="Main Campus",
        city="Ahmedabad",
        is_primary=True,
    )
    Membership.objects.create(
        user=user,
        tenant=tenant,
        school=school,
        default_branch=branch,
        user_type=UserType.SCHOOL_ADMIN,
    )

    session_26 = AcademicSession.objects.create(
        school=school,
        branch=branch,
        name="AY 2026-2027",
        code="2026-2027",
        start_date=date(2026, 4, 1),
        end_date=date(2027, 3, 31),
        is_current=True,
    )
    session_27 = AcademicSession.objects.create(
        school=school,
        branch=branch,
        name="AY 2027-2028",
        code="2027-2028",
        start_date=date(2027, 4, 1),
        end_date=date(2028, 3, 31),
        is_current=False,
    )
    cls_10 = GradeClass.objects.create(
        school=school,
        branch=branch,
        code="CLS-10",
        name="Class 10",
        numeric_grade=10,
        class_mentor_name="Dr. Vikram Sarabhai",
    )
    cls_11 = GradeClass.objects.create(
        school=school,
        branch=branch,
        code="CLS-11",
        name="Class 11",
        numeric_grade=11,
        class_mentor_name="Prof. Homi Bhabha",
    )
    sec_10a = Section.objects.create(
        school=school,
        branch=branch,
        grade_class=cls_10,
        name="A",
        code="CLS-10-A",
        capacity=40,
    )
    sec_11a = Section.objects.create(
        school=school,
        branch=branch,
        grade_class=cls_11,
        name="A",
        code="CLS-11-A",
        capacity=40,
    )

    client = APIClient()
    client.force_authenticate(user=user)
    return {
        "client": client,
        "user": user,
        "school": school,
        "other_school": other_school,
        "branch": branch,
        "session_26": session_26,
        "session_27": session_27,
        "cls_10": cls_10,
        "cls_11": cls_11,
        "sec_10a": sec_10a,
        "sec_11a": sec_11a,
    }


def test_academics_subjects_and_milestones(phase2_env):
    client = phase2_env["client"]
    school = phase2_env["school"]
    headers = {"HTTP_X_SCHOOL_ID": str(school.id)}

    # Upsert subject mapping on Class 10
    res = client.post(
        "/api/v1/academics/class-subjects/",
        {
            "class_code": "CLS-10",
            "subject_code": "PHY-10",
            "subject_name": "Foundation Physics",
            "curriculum_tier": "Core Science",
            "weekly_periods": 6,
            "theory_marks": 80,
            "internal_marks": 20,
            "teacher_in_charge": "Dr. Vikram Sarabhai",
            "syllabus_chapters": 15,
        },
        format="json",
        **headers,
    )
    assert res.status_code == 200
    assert res.json()["data"]["subject_code"] == "PHY-10"

    # Fetch classes with nested subjects & sections
    cls_res = client.get("/api/v1/academics/classes/", **headers)
    assert cls_res.status_code == 200
    classes_data = cls_res.json()["data"]
    assert len(classes_data) == 2

    # Create milestone
    ms_res = client.post(
        "/api/v1/academics/milestones/",
        {
            "class_code": "CLS-10",
            "title": "Term 1 Physics Diagnostic",
            "term": "Term 1",
            "start_date": "2026-07-01",
            "end_date": "2026-07-15",
            "target_syllabus_coverage": 40,
            "assessment_type": "Periodic Test",
            "status": "Upcoming",
        },
        format="json",
        **headers,
    )
    assert ms_res.status_code == 201
    assert ms_res.json()["data"]["title"] == "Term 1 Physics Diagnostic"


def test_unified_staff_profile_crud_and_soft_delete(phase2_env):
    client = phase2_env["client"]
    school = phase2_env["school"]
    headers = {"HTTP_X_SCHOOL_ID": str(school.id)}

    create_res = client.post(
        "/api/v1/staff/",
        {
            "employee_code": "EMP-T501",
            "full_name": "Prof. Satish Dhawan",
            "designation_title": "Senior PGT Mathematics",
            "department_name": "Mathematics",
            "primary_subject": "Calculus",
            "phone": "+919811122334",
            "email": "s.dhawan@vidyafloww.edu.in",
            "weekly_periods_load": 24,
        },
        format="json",
        **headers,
    )
    assert create_res.status_code == 201
    staff_id = create_res.json()["data"]["id"]

    # Duplicate employee code in same school must be rejected
    dup_res = client.post(
        "/api/v1/staff/",
        {"employee_code": "EMP-T501", "full_name": "Duplicate Staff"},
        format="json",
        **headers,
    )
    assert dup_res.status_code == 400
    assert dup_res.json()["error"]["code"] == "DUPLICATE_EMPLOYEE_CODE"

    # Soft delete staff profile
    del_res = client.delete(f"/api/v1/staff/{staff_id}/", **headers)
    assert del_res.status_code == 200
    assert StaffProfile.objects.filter(id=staff_id).count() == 0
    assert StaffProfile.all_objects.filter(id=staff_id, deleted_at__isnull=False).count() == 1


def test_student_360_lifecycle_and_multi_session_promotion_preserves_history(phase2_env):
    client = phase2_env["client"]
    school = phase2_env["school"]
    other_school = phase2_env["other_school"]
    headers = {"HTTP_X_SCHOOL_ID": str(school.id)}

    # 1. Create student in AY 2026-2027 (Class 10-A)
    stu_res = client.post(
        "/api/v1/students/",
        {
            "admission_number": "ADM-2026-501",
            "full_name": "Aarav Mehta",
            "gender": "male",
            "grade_class_id": str(phase2_env["cls_10"].id),
            "section_id": str(phase2_env["sec_10a"].id),
            "roll_number": "101",
            "class_section_label": "10-A",
            "house_name": "Ashoka House",
            "primary_guardian_name": "Ramesh Mehta",
            "guardian_phone": "+919899001122",
        },
        format="json",
        **headers,
    )
    assert stu_res.status_code == 201
    stu_id = stu_res.json()["data"]["id"]

    # 2. Verify cross-school isolation: student from another school is never visible
    Student.objects.create(
        school=other_school,
        admission_number="ADM-OTHER-999",
        full_name="Isolated Student",
    )
    list_res = client.get("/api/v1/students/", **headers)
    assert list_res.status_code == 200
    adm_nos = [s["admission_number"] for s in list_res.json()["data"]]
    assert "ADM-2026-501" in adm_nos
    assert "ADM-OTHER-999" not in adm_nos

    # 3. Promote student to AY 2027-2028 (Class 11-A) and verify 2026-2027 enrollment is preserved!
    promo_res = client.post(
        f"/api/v1/students/{stu_id}/promote/",
        {
            "target_session_id": str(phase2_env["session_27"].id),
            "target_grade_class_id": str(phase2_env["cls_11"].id),
            "target_section_id": str(phase2_env["sec_11a"].id),
            "new_roll_number": "201",
            "final_gpa": "3.92",
            "final_attendance_pct": "97.50",
        },
        format="json",
        **headers,
    )
    assert promo_res.status_code == 200

    # Verify both historical (2026-2027 PROMOTED) and current (2027-2028 ACTIVE) enrollments exist!
    enrollments = StudentEnrollment.objects.filter(student_id=stu_id).order_by("academic_session__start_date")
    assert enrollments.count() == 2
    enr_26, enr_27 = list(enrollments)
    assert enr_26.academic_session_id == phase2_env["session_26"].id
    assert enr_26.grade_class_id == phase2_env["cls_10"].id
    assert enr_26.enrollment_status == StudentEnrollment.EnrollmentStatus.PROMOTED
    assert enr_26.final_gpa == Decimal("3.92")

    assert enr_27.academic_session_id == phase2_env["session_27"].id
    assert enr_27.grade_class_id == phase2_env["cls_11"].id
    assert enr_27.enrollment_status == StudentEnrollment.EnrollmentStatus.ACTIVE
    assert enr_27.promoted_from_id == enr_26.id


def test_admissions_pipeline_enforces_approval_before_enrollment(phase2_env):
    client = phase2_env["client"]
    school = phase2_env["school"]
    headers = {"HTTP_X_SCHOOL_ID": str(school.id)}

    # 1. Submit admission application (starts in stage='pending')
    app_res = client.post(
        "/api/v1/admissions/applications/",
        {
            "application_number": "APP-2026-777",
            "candidate_name": "Neha Kulkarni",
            "applied_grade_label": "Class 10",
            "applied_class_id": str(phase2_env["cls_10"].id),
            "primary_guardian_name": "Anil Kulkarni",
            "guardian_phone": "+919822334455",
            "merit_score": "94.5",
        },
        format="json",
        **headers,
    )
    assert app_res.status_code == 201
    app_id = app_res.json()["data"]["id"]
    assert app_res.json()["data"]["stage"] == AdmissionApplication.Stage.PENDING

    # 2. Attempting to enroll an unapproved application MUST fail with 400 APPLICATION_NOT_APPROVED
    premature_enroll = client.post(
        f"/api/v1/admissions/applications/{app_id}/enroll/",
        {"admission_number": "ADM-2026-777"},
        format="json",
        **headers,
    )
    assert premature_enroll.status_code == 400
    assert premature_enroll.json()["error"]["code"] == "APPLICATION_NOT_APPROVED"

    # 3. Approve the application
    approve_res = client.post(
        f"/api/v1/admissions/applications/{app_id}/approve/",
        {"remarks": "Cleared entrance test and document verification"},
        format="json",
        **headers,
    )
    assert approve_res.status_code == 200
    assert approve_res.json()["data"]["stage"] == AdmissionApplication.Stage.APPROVED

    # 4. Atomically enroll the approved applicant into Student + StudentEnrollment + Guardian
    enroll_res = client.post(
        f"/api/v1/admissions/applications/{app_id}/enroll/",
        {
            "admission_number": "ADM-2026-777",
            "grade_class_id": str(phase2_env["cls_10"].id),
            "section_id": str(phase2_env["sec_10a"].id),
            "roll_number": "108",
        },
        format="json",
        **headers,
    )
    assert enroll_res.status_code == 201
    data = enroll_res.json()["data"]
    assert data["stage"] == AdmissionApplication.Stage.ENROLLED
    assert data["admission_number"] == "ADM-2026-777"
    assert Student.objects.filter(school=school, admission_number="ADM-2026-777").exists()
