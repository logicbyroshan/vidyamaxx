"""
VidyaFloww Student Health & Infirmary Visit Models (Work Division #19 Student Health)
"""

from django.db import models
from django.utils import timezone
from common.models import TenantScopedModel


class InfirmaryVisitLog(TenantScopedModel):
    admission_number = models.CharField(max_length=50, db_index=True)
    student_name = models.CharField(max_length=150)
    class_section_label = models.CharField(max_length=40, default="10-A")
    visit_date = models.DateField(default=timezone.localdate)
    symptoms = models.CharField(max_length=255)
    treatment_given = models.CharField(max_length=255, default="First aid & rest")
    nurse_or_doctor_name = models.CharField(max_length=120, default="School Medical Officer")
    parent_notified = models.BooleanField(default=True)

    class Meta:
        db_table = "medical_infirmary_visit"
        ordering = ["-visit_date", "-created_at"]
