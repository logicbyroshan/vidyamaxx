"""
VidyaFloww Events & Calendar (#22), Student Activities (#23), and Front Office (#26) Models
"""

from django.db import models
from django.utils import timezone
from common.models import TenantScopedModel


class SchoolCalendarEvent(TenantScopedModel):
    """Institutional calendar event (Work Division #22 Events & Calendar)."""

    title = models.CharField(max_length=180)
    category = models.CharField(max_length=60, default="Academic")  # Academic | Cultural | Sports | Holiday
    start_date = models.DateField()
    end_date = models.DateField()
    venue = models.CharField(max_length=120, default="Main Auditorium")
    audience = models.CharField(max_length=80, default="All Classes")

    class Meta:
        db_table = "events_school_calendar"
        ordering = ["start_date"]


class StudentActivityRecord(TenantScopedModel):
    """Co-curricular club, house competition & olympiad record (Work Division #23 Student Activities)."""

    activity_name = models.CharField(max_length=180)
    club_or_house = models.CharField(max_length=80, default="Ashoka House")
    coordinator_name = models.CharField(max_length=120, default="Faculty Coordinator")
    participant_count = models.PositiveSmallIntegerField(default=25)
    achievement_notes = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        db_table = "events_student_activity"
        ordering = ["-created_at"]


class FrontOfficeVisitorPass(TenantScopedModel):
    """Reception visitor gate-pass & postal inward/outward desk (Work Division #26 Front Office)."""

    pass_number = models.CharField(max_length=40)
    visitor_name = models.CharField(max_length=150)
    visitor_phone = models.CharField(max_length=25)
    purpose = models.CharField(max_length=180, default="Parent-Teacher Meeting")
    person_to_meet = models.CharField(max_length=150, default="Principal Office")
    visit_date = models.DateField(default=timezone.localdate)
    check_in_time = models.CharField(max_length=25, default="10:00 AM")
    check_out_time = models.CharField(max_length=25, blank=True, default="")
    status = models.CharField(max_length=25, default="Checked In")

    class Meta:
        db_table = "front_office_visitor_pass"
        ordering = ["-visit_date", "-created_at"]
