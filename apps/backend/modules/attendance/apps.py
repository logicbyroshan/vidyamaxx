from django.apps import AppConfig


class AttendanceConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "modules.attendance"
    label = "attendance"
    verbose_name = "Daily Attendance & Leave Governance"
