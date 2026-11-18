"""
VidyaFloww Admissions & Intake Models
"""

from decimal import Decimal
from django.db import models
from common.models import TenantScopedModel


class AdmissionEnquiry(TenantScopedModel):
    """Initial parent enquiry/lead before formal application submission."""

    class Status(models.TextChoices):
        OPEN = "OPEN", "Open"
        FOLLOW_UP = "FOLLOW_UP", "Follow-Up"
        CONVERTED = "CONVERTED", "Converted"
        CLOSED = "CLOSED", "Closed"

    enquiry_number = models.CharField(max_length=50)
    candidate_name = models.CharField(max_length=150)
    applied_grade_label = models.CharField(max_length=60)
    guardian_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=25)
    email = models.EmailField(blank=True, default="")
    source = models.CharField(max_length=50, default="Walk-In")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    follow_up_notes = models.TextField(blank=True, default="")
    next_follow_up_date = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "admissions_enquiry"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["school", "enquiry_number"], name="uq_adm_enquiry_school_no")
        ]


class AdmissionApplication(TenantScopedModel):
    """
    Formal applicant dossier.
    Never materializes in `students_student` until `stage == APPROVED` and `enroll_applicant_to_student` completes.
    """

    class Stage(models.TextChoices):
        PENDING = "pending", "Pending"
        UNDER_REVIEW = "under_review", "Under Review"
        INTERVIEW_SCHEDULED = "interview_scheduled", "Interview Scheduled"
        APPROVED = "approved", "Approved"
        WAITLISTED = "waitlisted", "Waitlisted"
        REJECTED = "rejected", "Rejected"
        ENROLLED = "enrolled", "Enrolled"

    application_number = models.CharField(max_length=50, db_index=True)
    academic_session = models.ForeignKey(
        "academics.AcademicSession", on_delete=models.SET_NULL, null=True, blank=True
    )
    applied_class = models.ForeignKey(
        "academics.GradeClass", on_delete=models.SET_NULL, null=True, blank=True
    )
    applied_grade_label = models.CharField(max_length=60, default="Class 6")

    candidate_name = models.CharField(max_length=150, db_index=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=15, default="male")
    blood_group = models.CharField(max_length=10, blank=True, default="O+")
    category_quota = models.CharField(max_length=30, default="General")
    previous_school_name = models.CharField(max_length=200, blank=True, default="")
    previous_score_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    primary_guardian_name = models.CharField(max_length=150)
    primary_guardian_relation = models.CharField(max_length=30, default="father")
    guardian_phone = models.CharField(max_length=25)
    guardian_email = models.EmailField(blank=True, default="")
    guardian_occupation = models.CharField(max_length=120, blank=True, default="")
    address = models.TextField(blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")

    merit_score = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
    documents_verified = models.BooleanField(default=False)
    stage = models.CharField(max_length=25, choices=Stage.choices, default=Stage.PENDING, db_index=True)

    enrolled_student = models.OneToOneField(
        "students.Student",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="source_application",
    )
    decision_remarks = models.TextField(blank=True, default="")
    decided_by_id = models.UUIDField(null=True, blank=True)
    decided_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "admissions_application"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["school", "application_number"], name="uq_adm_app_school_no")
        ]


class ApplicantDocument(TenantScopedModel):
    class VerificationStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"

    application = models.ForeignKey(
        AdmissionApplication, on_delete=models.CASCADE, related_name="documents"
    )
    document_type = models.CharField(max_length=80)
    stored_file = models.ForeignKey(
        "platform_storage.StoredFile", on_delete=models.SET_NULL, null=True, blank=True
    )
    verification_status = models.CharField(
        max_length=20, choices=VerificationStatus.choices, default=VerificationStatus.PENDING
    )
    verified_by_id = models.UUIDField(null=True, blank=True)
    remarks = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        db_table = "admissions_applicant_document"


class AdmissionInterview(TenantScopedModel):
    application = models.ForeignKey(
        AdmissionApplication, on_delete=models.CASCADE, related_name="interviews"
    )
    interviewer_name = models.CharField(max_length=150)
    scheduled_date = models.DateField()
    score = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
    recommendation = models.CharField(max_length=60, default="Recommend")
    remarks = models.TextField(blank=True, default="")

    class Meta:
        db_table = "admissions_interview"
