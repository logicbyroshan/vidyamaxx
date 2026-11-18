"""
VidyaFloww Timetable, Bell Schedule, Room Registry & Proxy Substitution Models
"""

from django.db import models
from common.models import TenantScopedModel


class PeriodSlotDefinition(TenantScopedModel):
    """School bell schedule slot definition (Period 1..8, Break, Assembly)."""

    class SlotType(models.TextChoices):
        LECTURE = "LECTURE", "Lecture Period"
        BREAK = "BREAK", "Recess / Break"
        ASSEMBLY = "ASSEMBLY", "Morning Assembly"

    period_number = models.PositiveSmallIntegerField()
    label = models.CharField(max_length=60)
    start_time = models.CharField(max_length=20, default="08:00 AM")
    end_time = models.CharField(max_length=20, default="08:45 AM")
    slot_type = models.CharField(max_length=20, choices=SlotType.choices, default=SlotType.LECTURE)

    class Meta:
        db_table = "timetable_period_slot"
        ordering = ["period_number"]
        constraints = [
            models.UniqueConstraint(fields=["school", "period_number"], name="uq_tt_period_slot_school_no")
        ]


class SchoolRoom(TenantScopedModel):
    """Physical classroom, science lab, or activity hall."""

    room_code = models.CharField(max_length=40)
    name = models.CharField(max_length=120)
    room_type = models.CharField(max_length=40, default="Classroom")  # Classroom | Lab | Hall | Ground
    capacity = models.PositiveSmallIntegerField(default=40)

    class Meta:
        db_table = "timetable_school_room"
        constraints = [
            models.UniqueConstraint(fields=["school", "room_code"], name="uq_tt_room_school_code")
        ]


class TimetableEntry(TenantScopedModel):
    """
    Relational class/section timetable slot with conflict prevention across
    teacher, room, and class-section.
    """

    class DayOfWeek(models.TextChoices):
        MONDAY = "Monday", "Monday"
        TUESDAY = "Tuesday", "Tuesday"
        WEDNESDAY = "Wednesday", "Wednesday"
        THURSDAY = "Thursday", "Thursday"
        FRIDAY = "Friday", "Friday"
        SATURDAY = "Saturday", "Saturday"

    class EntryType(models.TextChoices):
        CORE = "Core", "Core"
        LAB = "Lab", "Lab"
        ELECTIVE = "Elective", "Elective"
        ACTIVITY = "Activity", "Activity"

    academic_session = models.ForeignKey(
        "academics.AcademicSession", on_delete=models.SET_NULL, null=True, blank=True
    )
    grade_class = models.ForeignKey(
        "academics.GradeClass", on_delete=models.CASCADE, null=True, blank=True, related_name="timetable_entries"
    )
    section = models.ForeignKey(
        "academics.Section", on_delete=models.CASCADE, null=True, blank=True, related_name="timetable_entries"
    )
    class_section_label = models.CharField(max_length=40, db_index=True, default="10-A")
    day_of_week = models.CharField(max_length=15, choices=DayOfWeek.choices, db_index=True)
    period_number = models.PositiveSmallIntegerField(db_index=True)
    time_label = models.CharField(max_length=40, default="08:00 - 08:45")
    subject_code = models.CharField(max_length=30, blank=True, default="")
    subject_name = models.CharField(max_length=120)
    staff = models.ForeignKey(
        "hr.StaffProfile", on_delete=models.SET_NULL, null=True, blank=True, related_name="timetable_entries"
    )
    teacher_name = models.CharField(max_length=150, db_index=True)
    room_label = models.CharField(max_length=60, db_index=True, default="Room 101")
    entry_type = models.CharField(max_length=20, choices=EntryType.choices, default=EntryType.CORE)

    class Meta:
        db_table = "timetable_entry"
        ordering = ["day_of_week", "period_number"]
        constraints = [
            models.UniqueConstraint(
                fields=["school", "class_section_label", "day_of_week", "period_number"],
                name="uq_tt_entry_class_day_period",
            )
        ]


class ProxySubstitution(TenantScopedModel):
    """Date-specific substitute teacher allocation when assigned faculty is on leave."""

    substitution_date = models.DateField(db_index=True)
    timetable_entry = models.ForeignKey(
        TimetableEntry, on_delete=models.CASCADE, null=True, blank=True, related_name="substitutions"
    )
    class_section_label = models.CharField(max_length=40)
    period_number = models.PositiveSmallIntegerField()
    subject_name = models.CharField(max_length=120)
    absent_teacher_name = models.CharField(max_length=150)
    substitute_staff = models.ForeignKey(
        "hr.StaffProfile", on_delete=models.SET_NULL, null=True, blank=True, related_name="proxy_duties"
    )
    substitute_teacher_name = models.CharField(max_length=150)
    reason = models.CharField(max_length=200, blank=True, default="Medical / Casual Leave")
    status = models.CharField(max_length=20, default="Confirmed")

    class Meta:
        db_table = "timetable_proxy_substitution"
        ordering = ["-substitution_date", "period_number"]
