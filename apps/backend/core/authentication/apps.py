from django.apps import AppConfig


class CoreAuthenticationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core.authentication"
    label = "core_authentication"
    verbose_name = "Authentication & OTP Services"
