"""
VidyaFloww Daily Attendance, Immutable Correction Log & Leave Application Models
"""

from django.db import models
from django.utils import timezone
from common.models import TenantScopedModel


class StudentAttendanceRecord(TenantScopedModel):
    """Daily student attendance record with correction history tracking."""

    class Status(models.TextChoices):
        PRESENT = "present", "Present"
        ABSENT = "absent", "Absent"
        LATE = "late", "Late"
        HALF_DAY = "half_day", "Half Day"
        MEDICAL_LEAVE = "medical_leave", "Medical Leave"

    academic_session = models.ForeignKey(
        "academics.AcademicSession", on_delete=models.SET_NULL, null=True, blank=True
    )
    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, null=True, blank=True, related_name="attendance_records"
    )
    admission_number = models.CharField(max_length=50, db_index=True)
    student_name = models.CharField(max_length=150)
    roll_number = models.CharField(max_length=20, blank=True, default="")
    class_section_label = models.CharField(max_length=40, db_index=True, default="10-A")
    attendance_date = models.DateField(default=timezone.localdate, db_index=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PRESENT, db_index=True)
    check_in_time = models.CharField(max_length=25, blank=True, default="07:50 AM")
    remarks = models.CharField(max_length=255, blank=True, default="")
    is_locked = models.BooleanField(default=False)

    class Meta:
        db_table = "attendance_student_record"
        ordering = ["-attendance_date", "roll_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["school", "admission_number", "attendance_date"],
                name="uq_att_school_admno_date",
            )
        ]


class AttendanceCorrectionLog(TenantScopedModel):
    """
    Append-only audit trail created whenever an already-marked attendance record
    is modified (Master Prompt Section 10.3).
    """

    record = models.ForeignKey(
        StudentAttendanceRecord, on_delete=models.CASCADE, related_name="correction_logs"
    )
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    reason = models.CharField(max_length=255, default="Administrative correction")

    class Meta:
        db_table = "attendance_correction_log"
        ordering = ["-created_at"]


class LeaveApplication(TenantScopedModel):
    """Student or staff leave application with approval workflow."""

    class ApplicantType(models.TextChoices):
        STUDENT = "STUDENT", "Student"
        STAFF = "STAFF", "Staff"

    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        APPROVED = "Approved", "Approved"
        REJECTED = "Rejected", "Rejected"

    applicant_type = models.CharField(
        max_length=15, choices=ApplicantType.choices, default=ApplicantType.STUDENT
    )
    applicant_code = models.CharField(max_length=50)
    applicant_name = models.CharField(max_length=150)
    class_or_dept = models.CharField(max_length=80, default="10-A")
    leave_type = models.CharField(max_length=60, default="Medical Leave")
    from_date = models.DateField()
    to_date = models.DateField()
    days_count = models.PositiveSmallIntegerField(default=1)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    decided_by_id = models.UUIDField(null=True, blank=True)
    decision_remarks = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        db_table = "attendance_leave_application"
        ordering = ["-created_at"]
