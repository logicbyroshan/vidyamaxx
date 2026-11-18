from django.apps import AppConfig


class PlatformSettingsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "platform_services.settings"
    label = "platform_settings"
    verbose_name = "Platform School Policy Settings"
