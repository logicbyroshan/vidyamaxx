"""
VidyaFloww Institutional Surveys & Polls Models (Work Division #24 Surveys & Forms)
Backs /surveys (`apps/web/src/routes/surveys.tsx`).
"""

from django.db import models
from common.models import TenantScopedModel


class SurveyCampaign(TenantScopedModel):
    survey_code = models.CharField(max_length=50, db_index=True)
    title = models.CharField(max_length=200)
    target_audience = models.CharField(max_length=60, default="Parents")
    category = models.CharField(max_length=120, default="Academic & Institutional Excellence")
    responses_count = models.PositiveIntegerField(default=0)
    total_target = models.PositiveIntegerField(default=500)
    satisfaction_score = models.CharField(max_length=20, default="94.0%")
    status = models.CharField(max_length=25, default="Active")
    end_date_label = models.CharField(max_length=40, default="30 Sep 2026")
    key_finding = models.TextField(blank=True, default="")

    class Meta:
        db_table = "forms_survey_campaign"
        ordering = ["-created_at"]
