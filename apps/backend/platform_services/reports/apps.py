from django.apps import AppConfig


class ReportsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "platform_services.reports"
    label = "platform_reports"
    verbose_name = "Reports, Exports & Statutory Compliance Records"
