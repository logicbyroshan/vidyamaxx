"""
VidyaFloww Student 360° Master, Guardian & Immutable Per-Session Enrollment Models
"""

from decimal import Decimal
from django.conf import settings
from django.db import models
from django.utils import timezone

from common.models import ActiveTenantManager, SoftDeleteMixin, TenantManager, TenantScopedModel


class Student(TenantScopedModel, SoftDeleteMixin):
    """
    Canonical student identity record.
    Historical class/section progression is stored in `StudentEnrollment` (1 row per AcademicSession)
    so promoting a student never overwrites past session history.
    """

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        INACTIVE = "inactive", "Inactive"
        GRADUATED = "graduated", "Graduated"
        SUSPENDED = "suspended", "Suspended"
        WITHDRAWN = "withdrawn", "Withdrawn"
        TRANSFERRED = "transferred", "Transferred"

    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"
        OTHER = "other", "Other"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="student_profiles",
    )
    admission_number = models.CharField(max_length=50, db_index=True)
    full_name = models.CharField(max_length=150, db_index=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=15, choices=Gender.choices, default=Gender.MALE)
    blood_group = models.CharField(max_length=10, blank=True, default="O+")
    category_quota = models.CharField(max_length=30, default="General")
    aadhaar_masked = models.CharField(max_length=25, blank=True, default="")
    avatar_url = models.URLField(blank=True, default="")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE, db_index=True)
    joined_date = models.DateField(default=timezone.localdate)

    # Current active session denormalized pointers for fast directory queries
    current_academic_session = models.ForeignKey(
        "academics.AcademicSession", on_delete=models.SET_NULL, null=True, blank=True
    )
    current_grade_class = models.ForeignKey(
        "academics.GradeClass", on_delete=models.SET_NULL, null=True, blank=True, related_name="current_students"
    )
    current_section = models.ForeignKey(
        "academics.Section", on_delete=models.SET_NULL, null=True, blank=True, related_name="current_students"
    )
    current_roll_number = models.CharField(max_length=20, blank=True, default="")
    class_section_label = models.CharField(max_length=40, blank=True, default="10-A")
    house_name = models.CharField(max_length=60, blank=True, default="Ashoka")
    class_teacher_name = models.CharField(max_length=120, blank=True, default="")

    # Family & contact summary
    primary_guardian_name = models.CharField(max_length=150, blank=True, default="")
    mother_name = models.CharField(max_length=150, blank=True, default="")
    guardian_phone = models.CharField(max_length=25, blank=True, default="", db_index=True)
    guardian_email = models.EmailField(blank=True, default="")
    guardian_occupation = models.CharField(max_length=120, blank=True, default="")
    address = models.TextField(blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")

    # Operational & academic summary indicators
    transport_route_label = models.CharField(max_length=120, blank=True, default="Self / Private")
    bus_stop_label = models.CharField(max_length=120, blank=True, default="")
    fee_status = models.CharField(max_length=30, default="Paid")
    fee_dues_inr = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    attendance_pct = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("95.00"))
    gpa = models.DecimalField(max_digits=4, decimal_places=2, default=Decimal("3.80"))
    medical_notes = models.TextField(blank=True, default="No known allergies")
    custom_fields_json = models.JSONField(default=dict, blank=True)

    objects = ActiveTenantManager()
    all_objects = TenantManager()

    class Meta:
        db_table = "students_student"
        ordering = ["admission_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["school", "admission_number"], name="uq_student_school_admno"
            )
        ]

    def __str__(self):
        return f"{self.full_name} ({self.admission_number})"


class StudentEnrollment(TenantScopedModel):
    """
    Immutable per-session academic enrollment record.
    Moving a student to a new AcademicSession inserts a new row and marks the prior row PROMOTED,
    preserving full longitudinal academic history.
    """

    class EnrollmentStatus(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        PROMOTED = "PROMOTED", "Promoted"
        DETAINED = "DETAINED", "Detained"
        TRANSFERRED = "TRANSFERRED", "Transferred"
        WITHDRAWN = "WITHDRAWN", "Withdrawn"
        GRADUATED = "GRADUATED", "Graduated"

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="enrollments")
    academic_session = models.ForeignKey(
        "academics.AcademicSession", on_delete=models.PROTECT, related_name="student_enrollments"
    )
    grade_class = models.ForeignKey(
        "academics.GradeClass", on_delete=models.PROTECT, related_name="student_enrollments"
    )
    section = models.ForeignKey(
        "academics.Section",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="student_enrollments",
    )
    roll_number = models.CharField(max_length=20, blank=True, default="")
    house_name = models.CharField(max_length=60, blank=True, default="")
    enrollment_status = models.CharField(
        max_length=20, choices=EnrollmentStatus.choices, default=EnrollmentStatus.ACTIVE
    )
    promoted_from = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="promoted_to"
    )
    final_gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    final_attendance_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    remarks = models.TextField(blank=True, default="")

    class Meta:
        db_table = "students_enrollment"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["student", "academic_session"], name="uq_student_enrollment_per_session"
            )
        ]


class Guardian(TenantScopedModel):
    """Parent or legal guardian profile (may be linked to multiple siblings)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="guardian_profiles",
    )
    full_name = models.CharField(max_length=150)
    relationship = models.CharField(max_length=30, default="father")
    phone = models.CharField(max_length=25, db_index=True)
    email = models.EmailField(blank=True, default="")
    occupation = models.CharField(max_length=120, blank=True, default="")
    annual_income_inr = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    is_emergency_contact = models.BooleanField(default=True)

    class Meta:
        db_table = "students_guardian"


class StudentGuardianLink(TenantScopedModel):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="guardian_links")
    guardian = models.ForeignKey(Guardian, on_delete=models.CASCADE, related_name="student_links")
    relationship = models.CharField(max_length=30, default="father")
    is_primary_contact = models.BooleanField(default=True)

    class Meta:
        db_table = "students_guardian_link"
        constraints = [
            models.UniqueConstraint(fields=["student", "guardian"], name="uq_student_guardian_pair")
        ]


class StudentLifecycleEvent(TenantScopedModel):
    """Append-only lifecycle audit log for promotions, transfers, withdrawals, and re-admissions."""

    class EventType(models.TextChoices):
        ENROLLED = "ENROLLED", "Enrolled"
        PROMOTED = "PROMOTED", "Promoted"
        TRANSFERRED = "TRANSFERRED", "Transferred"
        WITHDRAWN = "WITHDRAWN", "Withdrawn"
        READMITTED = "READMITTED", "Re-Admitted"

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="lifecycle_events")
    event_type = models.CharField(max_length=25, choices=EventType.choices)
    from_session_label = models.CharField(max_length=50, blank=True, default="")
    to_session_label = models.CharField(max_length=50, blank=True, default="")
    from_class_label = models.CharField(max_length=60, blank=True, default="")
    to_class_label = models.CharField(max_length=60, blank=True, default="")
    reason = models.TextField(blank=True, default="")

    class Meta:
        db_table = "students_lifecycle_event"
        ordering = ["-created_at"]


class StudentDossierFieldConfig(TenantScopedModel):
    """Customizable Student 360° dossier fields per school (backs /students field configurator)."""

    field_key = models.CharField(max_length=60)
    label = models.CharField(max_length=120)
    category = models.CharField(max_length=30, default="personal")  # personal | family | operations
    field_type = models.CharField(max_length=20, default="text")
    is_visible = models.BooleanField(default=True)
    is_custom = models.BooleanField(default=True)

    class Meta:
        db_table = "students_dossier_field_config"
        constraints = [
            models.UniqueConstraint(fields=["school", "field_key"], name="uq_student_dossier_school_key")
        ]
