"""
VidyaFloww Scoped Work Responsibility & Security Policy Models

Implements the 30 finalized School Workspace Work Divisions and granular
branch/class/section/subject/student scoped assignments for unified STAFF users.
"""

from django.db import models
from django.db.models import F, Q
from django.utils import timezone

from common.models import TenantScopedModel, TimestampedModel


class WorkDivision(models.TextChoices):
    # Group 1 — Students
    ADMISSIONS = "admissions", "Admissions"
    STUDENTS = "students", "Students"
    ACADEMICS = "academics", "Academics"
    TIMETABLE = "timetable", "Timetable"
    ATTENDANCE = "attendance", "Attendance"
    # Group 2 — Learning
    TEACHING = "teaching", "Teaching"
    HOMEWORK = "homework", "Homework"
    EXAMINATIONS = "examinations", "Examinations"
    LEARNING_RESOURCES = "learning_resources", "Learning Resources"
    ONLINE_CLASSES = "online_classes", "Online Classes"
    # Group 3 — School Operations
    FEES_FINANCE = "fees_finance", "Fees & Finance"
    DOCUMENTS_CERTIFICATES = "documents_certificates", "Documents & Certificates"
    LIBRARY = "library", "Library"
    TRANSPORT = "transport", "Transport"
    HOSTEL = "hostel", "Hostel"
    INVENTORY = "inventory", "Inventory"
    ASSETS_MAINTENANCE = "assets_maintenance", "Assets & Maintenance"
    # Group 4 — People
    STAFF_HR = "staff_hr", "Staff & HR"
    STUDENT_HEALTH = "student_health", "Student Health"
    COUNSELLING_SUPPORT = "counselling_support", "Counselling & Support"
    # Group 5 — Engagement
    COMMUNICATION = "communication", "Communication"
    EVENTS_CALENDAR = "events_calendar", "Events & Calendar"
    STUDENT_ACTIVITIES = "student_activities", "Student Activities"
    SURVEYS_FORMS = "surveys_forms", "Surveys & Forms"
    COMPLAINTS_GRIEVANCES = "complaints_grievances", "Complaints & Grievances"
    FRONT_OFFICE = "front_office", "Front Office"
    # Group 6 — Governance
    REPORTS_ANALYTICS = "reports_analytics", "Reports & Analytics"
    SCHOOL_ADMINISTRATION = "school_administration", "School Administration"
    COMPLIANCE_RECORDS = "compliance_records", "Compliance & Records"
    SECURITY_AUDIT = "security_audit", "Security & Audit"


ALLOWED_ACTIONS = ("view", "create", "edit", "delete", "approve", "export", "manage")


class StaffResponsibilityAssignment(TenantScopedModel):
    """
    Grants scoped operational capability inside a school to a STAFF Membership.
    Supports division-level, sub-module, action, branch, class, section, subject,
    student, and time-bounded temporary assignments.
    """

    membership = models.ForeignKey(
        "core_users.Membership",
        on_delete=models.CASCADE,
        related_name="responsibility_assignments",
    )
    work_division = models.CharField(max_length=40, choices=WorkDivision.choices, db_index=True)
    submodule_code = models.CharField(max_length=60, default="*")
    actions = models.JSONField(default=list)  # e.g. ["view", "create", "edit"]

    # Data scope filters (empty list => unrestricted within school)
    branch_ids = models.JSONField(default=list, blank=True)
    grade_class_ids = models.JSONField(default=list, blank=True)
    section_ids = models.JSONField(default=list, blank=True)
    subject_ids = models.JSONField(default=list, blank=True)
    student_ids = models.JSONField(default=list, blank=True)

    # Validity window for temporary/acting duties
    valid_from = models.DateTimeField(default=timezone.now)
    valid_until = models.DateTimeField(null=True, blank=True)
    revoked_at = models.DateTimeField(null=True, blank=True, db_index=True)
    revoked_by_id = models.UUIDField(null=True, blank=True)
    granted_by_id = models.UUIDField(null=True, blank=True)
    notes = models.TextField(blank=True, default="")

    class Meta:
        db_table = "core_staff_responsibility_assignment"
        indexes = [
            models.Index(
                fields=["school", "membership", "work_division"],
                name="idx_resp_school_member_div",
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=Q(valid_until__isnull=True) | Q(valid_until__gt=F("valid_from")),
                name="chk_resp_valid_window",
            )
        ]

    @property
    def is_currently_active(self) -> bool:
        if self.revoked_at is not None:
            return False
        now = timezone.now()
        if self.valid_from > now:
            return False
        return not (self.valid_until and self.valid_until <= now)

    def __str__(self):
        return f"{self.membership.user.full_name} -> {self.work_division}:{self.submodule_code}"


class ResponsibilityAssignmentHistory(TimestampedModel):
    """Append-only history log of granted, modified, and revoked staff responsibilities."""

    class EventType(models.TextChoices):
        GRANTED = "GRANTED", "Granted"
        UPDATED = "UPDATED", "Updated"
        REVOKED = "REVOKED", "Revoked"

    school_id = models.UUIDField(db_index=True)
    assignment_id = models.UUIDField(db_index=True)
    membership_id = models.UUIDField(db_index=True)
    event_type = models.CharField(max_length=20, choices=EventType.choices)
    actor_user_id = models.UUIDField(null=True, blank=True)
    snapshot_json = models.JSONField(default=dict)

    class Meta:
        db_table = "core_responsibility_history"
        ordering = ["-created_at"]


class SecurityPolicy(TimestampedModel):
    """Per-school network & authentication security policy (backing /security UI)."""

    school = models.OneToOneField(
        "organizations.School",
        on_delete=models.CASCADE,
        related_name="security_policy",
    )
    two_factor_enforced = models.BooleanField(default=True)
    session_timeout_minutes = models.PositiveIntegerField(default=30)
    ip_whitelist_cidrs = models.JSONField(default=list, blank=True)
    updated_by_id = models.UUIDField(null=True, blank=True)

    class Meta:
        db_table = "core_security_policy"

    def __str__(self):
        return f"SecurityPolicy({self.school.short_code})"
