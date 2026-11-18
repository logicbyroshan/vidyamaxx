from django.apps import AppConfig


class CoreUsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core.users"
    label = "core_users"
    verbose_name = "User Memberships & Preferences"
