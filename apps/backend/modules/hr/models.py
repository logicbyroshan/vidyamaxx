"""
VidyaFloww Unified Staff Master & Academic Allocation Models
"""

from decimal import Decimal
from django.conf import settings
from django.db import models
from django.utils import timezone

from common.models import ActiveTenantManager, SoftDeleteMixin, TenantManager, TenantScopedModel


class StaffProfile(TenantScopedModel, SoftDeleteMixin):
    """
    Canonical employee record for all teaching and non-teaching staff.
    Links to `accounts.User` and a `Membership(user_type=STAFF)`.
    Never uses job-title auth roles; capabilities come from `StaffResponsibilityAssignment`.
    """

    class EmploymentStatus(models.TextChoices):
        ACTIVE = "Active", "Active"
        ON_LEAVE = "On Leave", "On Leave"
        RESIGNED = "Resigned", "Resigned"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="staff_profiles",
    )
    membership = models.OneToOneField(
        "core_users.Membership",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="staff_profile",
    )
    employee_code = models.CharField(max_length=40, db_index=True)
    full_name = models.CharField(max_length=150)
    avatar_url = models.URLField(blank=True, default="")
    designation_title = models.CharField(max_length=120, default="Faculty")
    department_name = models.CharField(max_length=120, default="Academics")
    primary_subject = models.CharField(max_length=120, blank=True, default="")
    secondary_subject = models.CharField(max_length=120, blank=True, default="")
    qualification = models.CharField(max_length=180, blank=True, default="")
    experience_years = models.PositiveSmallIntegerField(default=1)
    joining_date = models.DateField(default=timezone.localdate)
    phone = models.CharField(max_length=25, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    class_mentor_label = models.CharField(max_length=60, blank=True, default="")
    room_number = models.CharField(max_length=40, blank=True, default="")
    weekly_periods_load = models.PositiveSmallIntegerField(default=24)
    max_weekly_periods = models.PositiveSmallIntegerField(default=30)
    employment_status = models.CharField(
        max_length=20, choices=EmploymentStatus.choices, default=EmploymentStatus.ACTIVE
    )
    base_salary_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("65000.00"))
    bank_account_masked = models.CharField(max_length=40, blank=True, default="")
    assigned_classes_json = models.JSONField(default=list, blank=True)
    custom_fields_json = models.JSONField(default=dict, blank=True)

    objects = ActiveTenantManager()
    all_objects = TenantManager()

    class Meta:
        db_table = "hr_staff_profile"
        ordering = ["employee_code"]
        constraints = [
            models.UniqueConstraint(fields=["school", "employee_code"], name="uq_staff_school_empcode")
        ]

    def __str__(self):
        return f"{self.full_name} [{self.employee_code}]"


class StaffAcademicAssignment(TenantScopedModel):
    """Links a StaffProfile to a GradeClass, Section, and Subject for an AcademicSession."""

    staff = models.ForeignKey(StaffProfile, on_delete=models.CASCADE, related_name="academic_assignments")
    academic_session = models.ForeignKey(
        "academics.AcademicSession", on_delete=models.SET_NULL, null=True, blank=True
    )
    grade_class = models.ForeignKey("academics.GradeClass", on_delete=models.CASCADE)
    section = models.ForeignKey("academics.Section", on_delete=models.SET_NULL, null=True, blank=True)
    subject = models.ForeignKey("academics.Subject", on_delete=models.CASCADE)
    weekly_periods = models.PositiveSmallIntegerField(default=6)
    is_class_mentor = models.BooleanField(default=False)

    class Meta:
        db_table = "hr_staff_academic_assignment"


class StaffDossierFieldConfig(TenantScopedModel):
    """Per-school customizable staff dossier field definitions (backs /teachers field configurator)."""

    field_key = models.CharField(max_length=60)
    label = models.CharField(max_length=120)
    category = models.CharField(max_length=30, default="personal")  # personal | academic | payroll
    field_type = models.CharField(max_length=20, default="text")
    is_visible = models.BooleanField(default=True)
    is_custom = models.BooleanField(default=True)

    class Meta:
        db_table = "hr_staff_dossier_field_config"
        constraints = [
            models.UniqueConstraint(fields=["school", "field_key"], name="uq_staff_dossier_school_key")
        ]
