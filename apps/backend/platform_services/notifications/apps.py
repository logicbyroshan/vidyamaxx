from django.apps import AppConfig


class PlatformNotificationsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "platform_services.notifications"
    label = "platform_notifications"
    verbose_name = "Platform Notifications & Alerts"
