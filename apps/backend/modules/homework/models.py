"""
VidyaFloww Homework Assignment & Student Submission Evaluation Models
"""

from django.db import models
from django.utils import timezone
from common.models import TenantScopedModel


class HomeworkAssignment(TenantScopedModel):
    """Homework or project assignment published for a class-section (backs /homework)."""

    class Status(models.TextChoices):
        ACTIVE = "Active", "Active"
        DUE_TODAY = "Due Today", "Due Today"
        CLOSED = "Closed", "Closed"
        DRAFT = "Draft", "Draft"

    assignment_code = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    class_section_label = models.CharField(max_length=40, db_index=True, default="Class 10-A")
    subject_name = models.CharField(max_length=120)
    teacher_name = models.CharField(max_length=150)
    assigned_date = models.DateField(default=timezone.localdate)
    due_date = models.DateField(db_index=True)
    max_marks = models.PositiveSmallIntegerField(default=20)
    submission_type = models.CharField(max_length=50, default="Digital PDF / Photo")
    total_students = models.PositiveSmallIntegerField(default=40)
    submitted_count = models.PositiveSmallIntegerField(default=0)
    evaluated_count = models.PositiveSmallIntegerField(default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    class Meta:
        db_table = "homework_assignment"
        ordering = ["-due_date", "-created_at"]


class HomeworkSubmission(TenantScopedModel):
    """Student submission and teacher grading record for a HomeworkAssignment."""

    class Status(models.TextChoices):
        SUBMITTED = "Submitted", "Submitted"
        PENDING = "Pending", "Pending"
        LATE = "Late", "Late"
        GRADED = "Graded", "Graded"

    assignment = models.ForeignKey(
        HomeworkAssignment, on_delete=models.CASCADE, related_name="submissions"
    )
    student = models.ForeignKey(
        "students.Student", on_delete=models.SET_NULL, null=True, blank=True, related_name="homework_submissions"
    )
    admission_number = models.CharField(max_length=50)
    student_name = models.CharField(max_length=150)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBMITTED)
    marks_obtained = models.PositiveSmallIntegerField(null=True, blank=True)
    grade_label = models.CharField(max_length=10, blank=True, default="A")
    teacher_feedback = models.CharField(max_length=255, blank=True, default="")
    attachment_url = models.URLField(blank=True, default="")

    class Meta:
        db_table = "homework_submission"
        constraints = [
            models.UniqueConstraint(
                fields=["assignment", "admission_number"], name="uq_hw_sub_assignment_admno"
            )
        ]
