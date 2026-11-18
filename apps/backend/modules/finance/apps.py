from django.apps import AppConfig


class FinanceConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "modules.finance"
    label = "finance"
    verbose_name = "Fees, Scholarships & Immutable Financial Ledger"
