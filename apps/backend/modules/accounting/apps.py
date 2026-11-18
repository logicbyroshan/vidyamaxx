from django.apps import AppConfig


class AccountingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "modules.accounting"
    label = "accounting"
    verbose_name = "Chart of Accounts & General Ledger"
