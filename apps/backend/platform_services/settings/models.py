"""
VidyaFloww Key-Value School Settings Store
"""

from django.db import models
from common.models import TenantScopedModel


class SchoolSetting(TenantScopedModel):
    key = models.CharField(max_length=120, db_index=True)
    value_json = models.JSONField(default=dict)
    description = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        db_table = "platform_school_setting"
        constraints = [
            models.UniqueConstraint(fields=["school", "key"], name="uq_setting_school_key")
        ]
