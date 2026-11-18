from django.apps import AppConfig


class CoreOrganizationsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core.organizations"
    label = "organizations"
    verbose_name = "Tenants, Schools & Subscriptions"
