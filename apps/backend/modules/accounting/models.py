"""
VidyaFloww Tenant-Scoped Chart of Accounts Model
"""

from decimal import Decimal
from django.db import models
from common.models import TenantScopedModel


class ChartOfAccount(TenantScopedModel):
    class AccountType(models.TextChoices):
        ASSET = "ASSET", "Asset"
        LIABILITY = "LIABILITY", "Liability"
        INCOME = "INCOME", "Income"
        EXPENSE = "EXPENSE", "Expense"
        EQUITY = "EQUITY", "Equity"

    account_code = models.CharField(max_length=50)
    account_name = models.CharField(max_length=150)
    account_type = models.CharField(max_length=20, choices=AccountType.choices, default=AccountType.INCOME)
    balance_inr = models.DecimalField(max_digits=14, decimal_places=2, default=Decimal("0.00"))

    class Meta:
        db_table = "accounting_chart_of_account"
        ordering = ["account_code"]
        constraints = [
            models.UniqueConstraint(fields=["school", "account_code"], name="uq_coa_school_code")
        ]

    def __str__(self):
        return f"{self.account_code} - {self.account_name}"
