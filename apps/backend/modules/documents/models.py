"""
VidyaFloww Student & Staff Compliance Document Verification Models
"""

from django.db import models
from common.models import TenantScopedModel


class ComplianceDocumentRecord(TenantScopedModel):
    """Backs STUDENT_COMPLIANCE_DOCUMENTS in /students."""

    owner_code = models.CharField(max_length=50, db_index=True)
    owner_name = models.CharField(max_length=150)
    document_name = models.CharField(max_length=180)
    document_category = models.CharField(max_length=80, default="Identity KYC")
    verification_status = models.CharField(max_length=30, default="Verified")
    file_url = models.URLField(blank=True, default="")

    class Meta:
        db_table = "documents_compliance_record"
        ordering = ["-created_at"]
