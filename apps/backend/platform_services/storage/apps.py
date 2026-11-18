from django.apps import AppConfig


class PlatformStorageConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "platform_services.storage"
    label = "platform_storage"
    verbose_name = "Platform Document & File Storage"
