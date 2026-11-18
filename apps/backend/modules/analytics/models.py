"""
VidyaFloww Institutional Analytics Snapshot & Decoupled Subsystem Contract Models
"""

from django.db import models
from common.models import TenantScopedModel


class SubsystemIntegrationStatus(TenantScopedModel):
    """Tracks integration contract status with the 12 decoupled VidyaFloww subsystems."""

    subsystem_key = models.CharField(max_length=50)
    display_name = models.CharField(max_length=120)
    base_url = models.URLField(default="http://localhost:3001")
    sso_mode = models.CharField(max_length=40, default="JWT_BEARER_SHARED_TENANT")
    sync_status = models.CharField(max_length=30, default="Connected")

    class Meta:
        db_table = "analytics_subsystem_status"
        ordering = ["subsystem_key"]
