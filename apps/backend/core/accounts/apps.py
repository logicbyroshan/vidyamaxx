from django.apps import AppConfig


class CoreAccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core.accounts"
    label = "accounts"
    verbose_name = "Core Accounts & Identity"
