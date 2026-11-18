"""
VidyaFloww Examination Cycles & Lockable Student Marks Ledger Models
"""

from decimal import Decimal
from django.db import models
from common.models import TenantScopedModel


class ExaminationCycle(TenantScopedModel):
    """School examination cycle (Unit Test, Mid-Term, Pre-Board, Final Board)."""

    class Status(models.TextChoices):
        SCHEDULED = "Scheduled", "Scheduled"
        ONGOING = "Ongoing", "Ongoing"
        EVALUATION = "Evaluation", "Evaluation"
        PUBLISHED = "Published", "Published"

    academic_session = models.ForeignKey(
        "academics.AcademicSession", on_delete=models.SET_NULL, null=True, blank=True
    )
    code = models.CharField(max_length=40)
    name = models.CharField(max_length=150)
    term_label = models.CharField(max_length=60, default="Term 1")
    start_date = models.DateField()
    end_date = models.DateField()
    weightage_pct = models.PositiveSmallIntegerField(default=50)
    is_marks_locked = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)

    class Meta:
        db_table = "exams_cycle"
        ordering = ["-start_date"]
        constraints = [
            models.UniqueConstraint(fields=["school", "code"], name="uq_exam_cycle_school_code")
        ]


class StudentExamMark(TenantScopedModel):
    """
    Individual student subject marks entry.
    Cannot be edited once `examination.is_marks_locked` or `is_locked` is True (Master Prompt Part 10.5).
    """

    examination = models.ForeignKey(ExaminationCycle, on_delete=models.CASCADE, related_name="marks")
    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, null=True, blank=True, related_name="exam_marks"
    )
    admission_number = models.CharField(max_length=50, db_index=True)
    student_name = models.CharField(max_length=150)
    class_section_label = models.CharField(max_length=40, default="10-A")
    subject_code = models.CharField(max_length=30)
    subject_name = models.CharField(max_length=120)
    theory_marks = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
    max_theory_marks = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("80.00"))
    practical_marks = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
    max_practical_marks = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("20.00"))
    total_marks = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("0.00"))
    max_total_marks = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal("100.00"))
    grade = models.CharField(max_length=10, default="A1")
    is_absent = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    remarks = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        db_table = "exams_student_mark"
        constraints = [
            models.UniqueConstraint(
                fields=["examination", "admission_number", "subject_code"],
                name="uq_exam_mark_student_subject",
            )
        ]
