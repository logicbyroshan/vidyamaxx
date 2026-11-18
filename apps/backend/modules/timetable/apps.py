from django.apps import AppConfig


class TimetableConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "modules.timetable"
    label = "timetable"
    verbose_name = "Timetable & Substitution Engine"
