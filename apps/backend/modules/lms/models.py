"""
VidyaFloww Teaching Workspace, Lesson Plans, Learning Resources & Online Classes Models
"""

from django.db import models
from django.utils import timezone
from common.models import TenantScopedModel


class LessonPlan(TenantScopedModel):
    """Structured lesson plan & syllabus unit tracker (backs /teaching)."""

    class Status(models.TextChoices):
        COMPLETED = "Completed", "Completed"
        IN_PROGRESS = "In Progress", "In Progress"
        UPCOMING = "Upcoming", "Upcoming"
        PENDING_REVIEW = "Pending Review", "Pending Review"

    plan_code = models.CharField(max_length=50)
    class_section_label = models.CharField(max_length=40, default="Class 10-A")
    subject_name = models.CharField(max_length=120)
    teacher_name = models.CharField(max_length=150)
    unit_title = models.CharField(max_length=180)
    topic_title = models.CharField(max_length=200)
    scheduled_date = models.DateField(default=timezone.localdate)
    duration_minutes = models.PositiveSmallIntegerField(default=45)
    pedagogy_method = models.CharField(max_length=100, default="Interactive Lecture & Lab Demo")
    learning_objectives = models.TextField(blank=True, default="")
    completion_pct = models.PositiveSmallIntegerField(default=0)
    status = models.CharField(max_length=25, choices=Status.choices, default=Status.IN_PROGRESS)
    hod_remarks = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        db_table = "teaching_lesson_plan"
        ordering = ["-scheduled_date", "-created_at"]


class TeachingDiaryEntry(TenantScopedModel):
    """Daily classroom teaching log."""

    entry_date = models.DateField(default=timezone.localdate, db_index=True)
    period_label = models.CharField(max_length=40, default="Period 1")
    class_section_label = models.CharField(max_length=40, default="Class 10-A")
    subject_name = models.CharField(max_length=120)
    teacher_name = models.CharField(max_length=150)
    topic_covered = models.CharField(max_length=250)
    homework_assigned = models.CharField(max_length=250, blank=True, default="")
    notes = models.TextField(blank=True, default="")

    class Meta:
        db_table = "teaching_diary_entry"
        ordering = ["-entry_date", "-created_at"]


class LearningResource(TenantScopedModel):
    """Digital study material & repository item (Work Division #9 Learning Resources)."""

    resource_code = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    subject_name = models.CharField(max_length=120)
    class_label = models.CharField(max_length=60, default="Class 10")
    resource_type = models.CharField(max_length=40, default="PDF Notes")  # PDF Notes | Video | Worksheet
    file_url = models.URLField(blank=True, default="")
    uploaded_by_name = models.CharField(max_length=150, default="Faculty")

    class Meta:
        db_table = "lms_learning_resource"
        ordering = ["-created_at"]


class OnlineClassSession(TenantScopedModel):
    """Live virtual classroom session & E-Class bridge (Work Division #10 Online Classes)."""

    session_code = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    class_section_label = models.CharField(max_length=40, default="Class 10-A")
    subject_name = models.CharField(max_length=120)
    teacher_name = models.CharField(max_length=150)
    scheduled_start = models.DateTimeField()
    duration_minutes = models.PositiveSmallIntegerField(default=45)
    meeting_url = models.URLField(blank=True, default="https://eclass.vidyafloww.edu.in/live")
    status = models.CharField(max_length=25, default="Scheduled")

    class Meta:
        db_table = "lms_online_class_session"
        ordering = ["-scheduled_start"]
