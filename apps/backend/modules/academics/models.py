"""
VidyaFloww Academics & Curriculum Domain Models
"""

from django.db import models
from django.db.models import F, Q

from common.models import TenantScopedModel


class AcademicSession(TenantScopedModel):
    """School-scoped academic year (e.g., 2026-2027)."""

    name = models.CharField(max_length=50)
    code = models.CharField(max_length=30)
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField(default=False, db_index=True)

    class Meta:
        db_table = "academics_session"
        ordering = ["-start_date"]
        constraints = [
            models.UniqueConstraint(fields=["school", "code"], name="uq_acad_session_school_code"),
            models.CheckConstraint(condition=Q(end_date__gt=F("start_date")), name="chk_acad_session_dates"),
        ]

    def __str__(self):
        return f"{self.name} ({self.school.short_code})"


class Department(TenantScopedModel):
    """Academic department (e.g., Science, Mathematics, Humanities)."""

    code = models.CharField(max_length=30)
    name = models.CharField(max_length=120)
    head_staff_name = models.CharField(max_length=150, blank=True, default="")

    class Meta:
        db_table = "academics_department"
        constraints = [
            models.UniqueConstraint(fields=["school", "code"], name="uq_acad_dept_school_code")
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"


class House(TenantScopedModel):
    """Student house squad (e.g., Ashoka, Tagore, Raman, Shivaji)."""

    code = models.CharField(max_length=30)
    name = models.CharField(max_length=100)
    color_hex = models.CharField(max_length=15, default="#3b82f6")
    motto = models.CharField(max_length=200, blank=True, default="")

    class Meta:
        db_table = "academics_house"
        constraints = [
            models.UniqueConstraint(fields=["school", "code"], name="uq_acad_house_school_code")
        ]


class Stream(TenantScopedModel):
    """Senior secondary academic stream (Science, Commerce, Humanities)."""

    code = models.CharField(max_length=30)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "academics_stream"
        constraints = [
            models.UniqueConstraint(fields=["school", "code"], name="uq_acad_stream_school_code")
        ]


class GradeClass(TenantScopedModel):
    """Grade/Class profile (e.g., Class 10 / कक्षा 10)."""

    class Stage(models.TextChoices):
        PRIMARY = "Primary Wing", "Primary Wing"
        MIDDLE = "Middle Wing", "Middle Wing"
        SECONDARY = "Secondary Wing", "Secondary Wing"
        SENIOR = "Senior Secondary", "Senior Secondary"

    code = models.CharField(max_length=30)
    name = models.CharField(max_length=100)
    hindi_name = models.CharField(max_length=100, blank=True, default="")
    numeric_grade = models.PositiveSmallIntegerField(default=1)
    stage = models.CharField(max_length=40, choices=Stage.choices, default=Stage.SECONDARY)
    class_mentor_name = models.CharField(max_length=150, blank=True, default="")
    room_number = models.CharField(max_length=50, blank=True, default="")
    display_order = models.PositiveSmallIntegerField(default=1)

    class Meta:
        db_table = "academics_grade_class"
        ordering = ["display_order", "numeric_grade"]
        constraints = [
            models.UniqueConstraint(fields=["school", "code"], name="uq_acad_class_school_code")
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"


class Section(TenantScopedModel):
    """Class section (e.g., A, B, C)."""

    grade_class = models.ForeignKey(GradeClass, on_delete=models.CASCADE, related_name="sections")
    name = models.CharField(max_length=30)
    code = models.CharField(max_length=40)
    capacity = models.PositiveSmallIntegerField(default=40)
    room_number = models.CharField(max_length=50, blank=True, default="")
    class_teacher_id = models.UUIDField(null=True, blank=True)

    class Meta:
        db_table = "academics_section"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(fields=["grade_class", "name"], name="uq_acad_section_class_name")
        ]

    def __str__(self):
        return f"{self.grade_class.name}-{self.name}"


class Subject(TenantScopedModel):
    """Master subject definition."""

    class Tier(models.TextChoices):
        CORE_COMPULSORY = "Core Compulsory", "Core Compulsory"
        CORE_SCIENCE = "Core Science", "Core Science"
        LANGUAGE_COMMS = "Language & Comms", "Language & Comms"
        COMMERCE_CORE = "Commerce Core", "Commerce Core"
        SKILL_IT = "Skill & IT", "Skill & IT"
        HUMANITIES_CORE = "Humanities Core", "Humanities Core"
        ELECTIVE = "Elective", "Elective"

    code = models.CharField(max_length=30)
    name = models.CharField(max_length=120)
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True, related_name="subjects"
    )
    curriculum_tier = models.CharField(max_length=40, choices=Tier.choices, default=Tier.CORE_COMPULSORY)
    is_elective = models.BooleanField(default=False)

    class Meta:
        db_table = "academics_subject"
        ordering = ["code"]
        constraints = [
            models.UniqueConstraint(fields=["school", "code"], name="uq_acad_subject_school_code")
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"


class ClassSubjectMapping(TenantScopedModel):
    """Binds a Subject to a GradeClass with weekly periods, marks split, mentor & textbook metadata."""

    class Status(models.TextChoices):
        ACTIVE = "Active", "Active"
        ELECTIVE = "Elective", "Elective"

    grade_class = models.ForeignKey(GradeClass, on_delete=models.CASCADE, related_name="subject_mappings")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="class_mappings")
    weekly_periods = models.PositiveSmallIntegerField(default=6)
    theory_marks = models.PositiveSmallIntegerField(default=80)
    internal_marks = models.PositiveSmallIntegerField(default=20)
    teacher_in_charge = models.CharField(max_length=150, blank=True, default="")
    syllabus_chapters = models.PositiveSmallIntegerField(default=12)
    prescribed_book_json = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    class Meta:
        db_table = "academics_class_subject_mapping"
        constraints = [
            models.UniqueConstraint(fields=["grade_class", "subject"], name="uq_acad_class_subject")
        ]


class AcademicMilestone(TenantScopedModel):
    """Term milestones and syllabus coverage targets (backs /academics milestones view)."""

    class AssessmentType(models.TextChoices):
        MID_TERM = "Mid-Term Exam", "Mid-Term Exam"
        PERIODIC = "Periodic Test", "Periodic Test"
        PRE_BOARD = "Pre-Board Exam", "Pre-Board Exam"
        FINAL_BOARD = "Final CBSE Board", "Final CBSE Board"
        INTERNAL = "Internal Assessment & Practical", "Internal Assessment & Practical"

    class Status(models.TextChoices):
        IN_PROGRESS = "In Progress", "In Progress"
        UPCOMING = "Upcoming", "Upcoming"
        SCHEDULED = "Scheduled", "Scheduled"
        COMPLETED = "Completed", "Completed"

    grade_class = models.ForeignKey(GradeClass, on_delete=models.CASCADE, related_name="milestones")
    academic_session = models.ForeignKey(
        AcademicSession, on_delete=models.SET_NULL, null=True, blank=True, related_name="milestones"
    )
    title = models.CharField(max_length=180)
    term = models.CharField(max_length=60, default="Term 1")
    start_date = models.DateField()
    end_date = models.DateField()
    target_syllabus_coverage = models.PositiveSmallIntegerField(default=50)
    assessment_type = models.CharField(
        max_length=50, choices=AssessmentType.choices, default=AssessmentType.MID_TERM
    )
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.SCHEDULED)
    notes = models.TextField(blank=True, default="")

    class Meta:
        db_table = "academics_milestone"
        ordering = ["start_date"]
        constraints = [
            models.CheckConstraint(
                condition=Q(target_syllabus_coverage__lte=100),
                name="chk_milestone_coverage_pct",
            )
        ]
