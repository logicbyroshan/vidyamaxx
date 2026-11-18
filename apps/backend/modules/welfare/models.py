"""
VidyaFloww Confidential Counselling & Support Models (Work Division #20)
"""

from django.db import models
from django.utils import timezone
from common.models import TenantScopedModel


class CounsellingRecord(TenantScopedModel):
    """
    Confidential student counselling dossier.
    Protected by `HasWorkDivisionAccess` on both GET and POST so general STAFF without
    `counselling_support` responsibility cannot read confidential notes.
    """

    admission_number = models.CharField(max_length=50, db_index=True)
    student_name = models.CharField(max_length=150)
    counsellor_name = models.CharField(max_length=150)
    session_date = models.DateField(default=timezone.localdate)
    category = models.CharField(max_length=80, default="Academic Stress & Wellbeing")
    confidential_notes = models.TextField()
    follow_up_date = models.DateField(null=True, blank=True)
    is_strictly_confidential = models.BooleanField(default=True)

    class Meta:
        db_table = "welfare_counselling_record"
        ordering = ["-session_date", "-created_at"]
