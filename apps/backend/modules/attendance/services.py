"""
VidyaFloww Bulk Attendance Marking & Correction Audit Services
"""

from datetime import date
from django.db import transaction
from common.exceptions import ConflictError
from modules.students.models import Student
from platform_services.audit.services import record_audit_event
from .models import AttendanceCorrectionLog, LeaveApplication, StudentAttendanceRecord


@transaction.atomic
def mark_bulk_student_attendance(
    *,
    school,
    branch,
    actor_membership,
    attendance_date: date,
    class_section_label: str,
    entries: list[dict],
    correction_reason: str = "Teacher register update",
) -> list[StudentAttendanceRecord]:
    """
    Marks or updates daily student attendance for a class-section.
    If an existing record's status changes, appends an immutable `AttendanceCorrectionLog`.
    """
    saved_records: list[StudentAttendanceRecord] = []

    for item in entries:
        adm_no = str(item["admission_number"]).strip()
        new_status = str(item.get("status", StudentAttendanceRecord.Status.PRESENT)).lower()
        existing = StudentAttendanceRecord.objects.filter(
            school=school, admission_number=adm_no, attendance_date=attendance_date
        ).first()

        if existing:
            if existing.is_locked:
                raise ConflictError(
                    message=f"Attendance for {adm_no} on {attendance_date} is locked.",
                    code="ATTENDANCE_LOCKED",
                )
            old_status = existing.status
            if old_status != new_status:
                AttendanceCorrectionLog.objects.create(
                    school=school,
                    branch=branch,
                    created_by_id=actor_membership.user_id,
                    record=existing,
                    previous_status=old_status,
                    new_status=new_status,
                    reason=item.get("remarks") or correction_reason,
                )
            existing.status = new_status
            existing.check_in_time = item.get("check_in_time", existing.check_in_time)
            existing.remarks = item.get("remarks", existing.remarks)
            existing.updated_by_id = actor_membership.user_id
            existing.save(update_fields=["status", "check_in_time", "remarks", "updated_by_id", "updated_at"])
            saved_records.append(existing)
        else:
            student_obj = Student.objects.filter(school=school, admission_number=adm_no).first()
            rec = StudentAttendanceRecord.objects.create(
                school=school,
                branch=branch,
                created_by_id=actor_membership.user_id,
                student=student_obj,
                admission_number=adm_no,
                student_name=item.get("student_name") or (student_obj.full_name if student_obj else adm_no),
                roll_number=item.get("roll_number") or (student_obj.current_roll_number if student_obj else ""),
                class_section_label=class_section_label,
                attendance_date=attendance_date,
                status=new_status,
                check_in_time=item.get("check_in_time", "07:50 AM"),
                remarks=item.get("remarks", ""),
            )
            saved_records.append(rec)

    record_audit_event(
        school_id=school.id,
        tenant_id=school.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Academics",
        action="ATTENDANCE_BULK_MARKED",
        target_type="ClassSection",
        target_id=class_section_label,
        metadata={"date": str(attendance_date), "count": len(saved_records)},
    )
    return saved_records


@transaction.atomic
def decide_leave_application(
    *,
    leave_app: LeaveApplication,
    actor_membership,
    decision: str,
    remarks: str = "",
) -> LeaveApplication:
    leave_app.status = decision
    leave_app.decided_by_id = actor_membership.user_id
    leave_app.decision_remarks = remarks
    leave_app.updated_by_id = actor_membership.user_id
    leave_app.save(update_fields=["status", "decided_by_id", "decision_remarks", "updated_by_id", "updated_at"])

    record_audit_event(
        school_id=leave_app.school_id,
        tenant_id=leave_app.school.tenant_id,
        actor_user_id=actor_membership.user_id,
        actor_name=actor_membership.user.full_name,
        actor_role_label=actor_membership.user_type,
        category="Academics",
        action=f"LEAVE_{decision.upper()}",
        target_type="LeaveApplication",
        target_id=str(leave_app.id),
        metadata={"applicant": leave_app.applicant_name, "decision": decision},
    )
    return leave_app
