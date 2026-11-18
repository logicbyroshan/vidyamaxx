"""
Phase 3 Automated Verification Suite:
Daily Academic Operations (Timetable Conflict Detection, Attendance & Correction Log,
Teaching Workspace, Homework & Submissions, Lockable Examination Marks Ledger).
"""

import pytest
from datetime import date
from decimal import Decimal
from django.utils import timezone
from rest_framework.test import APIClient

from core.accounts.models import User
from core.campuses.models import Branch
from core.organizations.models import CustomerTenant, School
from core.users.models import Membership, UserType
from modules.attendance.models import AttendanceCorrectionLog


@pytest.fixture
def phase3_env(db):
    user = User.objects.create(
        email="phase3.admin@vidyafloww.edu.in",
        phone="+919900223344",
        full_name="Dr. C. V. Raman",
        is_verified=True,
        is_active=True,
    )
    user.set_unusable_password()
    user.save()

    tenant = CustomerTenant.objects.create(
        name="Raman Science Academy Trust",
        slug="raman-trust",
        owner_user=user,
    )
    school = School.objects.create(
        tenant=tenant,
        name="Raman Public School",
        short_code="RPS-BLR-01",
        city="Bengaluru, Karnataka",
    )
    branch = Branch.objects.create(
        school=school,
        code="MAIN",
        name="Bengaluru Main Campus",
        city="Bengaluru",
        is_primary=True,
    )
    Membership.objects.create(
        user=user,
        tenant=tenant,
        school=school,
        default_branch=branch,
        user_type=UserType.SCHOOL_ADMIN,
    )

    client = APIClient()
    client.force_authenticate(user=user)
    return {
        "client": client,
        "user": user,
        "school": school,
        "branch": branch,
        "headers": {"HTTP_X_SCHOOL_ID": str(school.id)},
    }


def test_timetable_conflict_detection_for_teacher_and_room(phase3_env):
    client = phase3_env["client"]
    headers = phase3_env["headers"]

    # 1. Assign Class 10-A Monday Period 1 to Dr. Raman in Lab 201
    res1 = client.post(
        "/api/v1/timetable/entries/",
        {
            "class_section_label": "10-A",
            "day_of_week": "Monday",
            "period_number": 1,
            "subject_name": "Physics",
            "teacher_name": "Dr. C. V. Raman",
            "room_label": "Lab 201",
            "entry_type": "Lab",
        },
        format="json",
        **headers,
    )
    assert res1.status_code == 201

    # 2. Attempting to book Dr. C. V. Raman in Class 10-B on Monday Period 1 MUST fail (409 TEACHER_DOUBLE_BOOKED)
    teacher_conflict_res = client.post(
        "/api/v1/timetable/entries/",
        {
            "class_section_label": "10-B",
            "day_of_week": "Monday",
            "period_number": 1,
            "subject_name": "Optics",
            "teacher_name": "Dr. C. V. Raman",
            "room_label": "Room 105",
            "entry_type": "Core",
        },
        format="json",
        **headers,
    )
    assert teacher_conflict_res.status_code == 409
    assert teacher_conflict_res.json()["code"] == "TEACHER_DOUBLE_BOOKED"

    # 3. Attempting to book Lab 201 for Class 10-B on Monday Period 1 with a different teacher MUST fail (409 ROOM_DOUBLE_BOOKED)
    room_conflict_res = client.post(
        "/api/v1/timetable/entries/",
        {
            "class_section_label": "10-B",
            "day_of_week": "Monday",
            "period_number": 1,
            "subject_name": "Chemistry Lab",
            "teacher_name": "Prof. S. N. Bose",
            "room_label": "Lab 201",
            "entry_type": "Lab",
        },
        format="json",
        **headers,
    )
    assert room_conflict_res.status_code == 409
    assert room_conflict_res.json()["code"] == "ROOM_DOUBLE_BOOKED"

    # 4. Proxy substitution creation succeeds
    sub_res = client.post(
        "/api/v1/timetable/substitutions/",
        {
            "substitution_date": "2026-08-20",
            "class_section_label": "10-A",
            "period_number": 2,
            "subject_name": "Mathematics",
            "absent_teacher_name": "Prof. S. N. Bose",
            "substitute_teacher_name": "Dr. C. V. Raman",
        },
        format="json",
        **headers,
    )
    assert sub_res.status_code == 201


def test_attendance_bulk_marking_correction_audit_log_and_leaves(phase3_env):
    client = phase3_env["client"]
    headers = phase3_env["headers"]

    # 1. Initial bulk attendance mark
    res1 = client.post(
        "/api/v1/attendance/mark-bulk/",
        {
            "attendance_date": "2026-08-20",
            "class_section_label": "10-A",
            "entries": [
                {"admission_number": "ADM-2026-101", "student_name": "Aarav Sharma", "roll_number": "101", "status": "present"},
                {"admission_number": "ADM-2026-102", "student_name": "Diya Patel", "roll_number": "102", "status": "absent"},
            ],
        },
        format="json",
        **headers,
    )
    assert res1.status_code == 200
    assert AttendanceCorrectionLog.objects.count() == 0

    # 2. Modify Aarav's status from 'present' -> 'late' and verify AttendanceCorrectionLog is appended!
    res2 = client.post(
        "/api/v1/attendance/mark-bulk/",
        {
            "attendance_date": "2026-08-20",
            "class_section_label": "10-A",
            "correction_reason": "Late bus arrival verified",
            "entries": [
                {"admission_number": "ADM-2026-101", "student_name": "Aarav Sharma", "roll_number": "101", "status": "late"},
            ],
        },
        format="json",
        **headers,
    )
    assert res2.status_code == 200
    logs = AttendanceCorrectionLog.objects.all()
    assert logs.count() == 1
    log = logs.first()
    assert log.previous_status == "present"
    assert log.new_status == "late"
    assert log.reason == "Late bus arrival verified"

    # 3. Leave application submission and approval
    leave_res = client.post(
        "/api/v1/attendance/leaves/",
        {
            "applicant_type": "STUDENT",
            "applicant_code": "ADM-2026-102",
            "applicant_name": "Diya Patel",
            "class_or_dept": "10-A",
            "leave_type": "Medical Leave",
            "from_date": "2026-08-20",
            "to_date": "2026-08-21",
            "days_count": 2,
            "reason": "Viral fever",
        },
        format="json",
        **headers,
    )
    assert leave_res.status_code == 201
    leave_id = leave_res.json()["data"]["id"]

    decide_res = client.post(
        f"/api/v1/attendance/leaves/{leave_id}/decide/",
        {"status": "Approved", "remarks": "Medical certificate verified"},
        format="json",
        **headers,
    )
    assert decide_res.status_code == 200
    assert decide_res.json()["data"]["status"] == "Approved"


def test_teaching_workspace_homework_and_lockable_examinations(phase3_env):
    client = phase3_env["client"]
    headers = phase3_env["headers"]

    # 1. Create Lesson Plan, Diary, Learning Resource & Online Class
    lp_res = client.post(
        "/api/v1/teaching/lesson-plans/",
        {
            "plan_code": "LP-2026-01",
            "class_section_label": "Class 10-A",
            "subject_name": "Physics",
            "teacher_name": "Dr. C. V. Raman",
            "unit_title": "Unit III: Light",
            "topic_title": "Raman Scattering & Refraction",
            "completion_pct": 85,
            "status": "In Progress",
        },
        format="json",
        **headers,
    )
    assert lp_res.status_code == 201

    res_obj = client.post(
        "/api/v1/teaching/resources/",
        {
            "resource_code": "RES-101",
            "title": "Optics Lab Manual PDF",
            "subject_name": "Physics",
            "class_label": "Class 10",
        },
        format="json",
        **headers,
    )
    assert res_obj.status_code == 201

    oc_res = client.post(
        "/api/v1/teaching/online-classes/",
        {
            "session_code": "LIVE-101",
            "title": "Doubt Clearing Session",
            "class_section_label": "Class 10-A",
            "subject_name": "Physics",
            "teacher_name": "Dr. C. V. Raman",
            "scheduled_start": timezone.now().isoformat(),
        },
        format="json",
        **headers,
    )
    assert oc_res.status_code == 201

    # 2. Create Homework Assignment & Grade Submission
    hw_res = client.post(
        "/api/v1/homework/assignments/",
        {
            "assignment_code": "HW-10-PHY-01",
            "title": "Refraction Numericals",
            "class_section_label": "Class 10-A",
            "subject_name": "Physics",
            "teacher_name": "Dr. C. V. Raman",
            "due_date": "2026-09-10",
            "max_marks": 20,
        },
        format="json",
        **headers,
    )
    assert hw_res.status_code == 201
    hw_id = hw_res.json()["data"]["id"]

    sub_res = client.post(
        f"/api/v1/homework/assignments/{hw_id}/submissions/",
        {
            "admission_number": "ADM-2026-101",
            "student_name": "Aarav Sharma",
            "status": "Graded",
            "marks_obtained": 19,
            "grade_label": "A+",
            "teacher_feedback": "Excellent ray diagrams!",
        },
        format="json",
        **headers,
    )
    assert sub_res.status_code == 201
    assert sub_res.json()["data"]["marks_obtained"] == 19

    # 3. Create Examination Cycle, Enter Marks, Lock Cycle & Verify Locked Marks Cannot Be Modified
    cycle_res = client.post(
        "/api/v1/examinations/cycles/",
        {
            "code": "MIDTERM-2026",
            "name": "Mid-Term Examination 2026",
            "term_label": "Term 1",
            "start_date": str(date(2026, 9, 15)),
            "end_date": str(date(2026, 9, 28)),
        },
        format="json",
        **headers,
    )
    assert cycle_res.status_code == 201
    cycle_id = cycle_res.json()["data"]["id"]

    mark_res = client.post(
        "/api/v1/examinations/marks/",
        {
            "examination": cycle_id,
            "admission_number": "ADM-2026-101",
            "student_name": "Aarav Sharma",
            "class_section_label": "10-A",
            "subject_code": "PHY-10",
            "subject_name": "Physics",
            "theory_marks": "74.50",
            "practical_marks": "19.00",
            "grade": "A1",
        },
        format="json",
        **headers,
    )
    assert mark_res.status_code == 201
    assert Decimal(mark_res.json()["data"]["total_marks"]) == Decimal("93.50")

    # Lock examination marks
    lock_res = client.post(
        f"/api/v1/examinations/cycles/{cycle_id}/lock/",
        {"locked": True},
        format="json",
        **headers,
    )
    assert lock_res.status_code == 200
    assert lock_res.json()["data"]["is_marks_locked"] is True

    # Attempting to overwrite marks while locked MUST fail with 409 MARKS_LOCKED
    locked_edit_res = client.post(
        "/api/v1/examinations/marks/",
        {
            "examination": cycle_id,
            "admission_number": "ADM-2026-101",
            "student_name": "Aarav Sharma",
            "subject_code": "PHY-10",
            "subject_name": "Physics",
            "theory_marks": "80.00",
            "practical_marks": "20.00",
        },
        format="json",
        **headers,
    )
    assert locked_edit_res.status_code == 409
    assert locked_edit_res.json()["code"] == "MARKS_LOCKED"
