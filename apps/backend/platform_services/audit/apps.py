from django.apps import AppConfig


class PlatformAuditConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "platform_services.audit"
    label = "platform_audit"
    verbose_name = "Platform Immutable Audit Trail"
