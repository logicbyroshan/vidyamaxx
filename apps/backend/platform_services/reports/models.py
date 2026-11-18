"""
VidyaFloww Generated Reports (#27) & Statutory Compliance Filings (#29) Models
"""

from django.db import models
from common.models import TenantScopedModel


class GeneratedReportRecord(TenantScopedModel):
    report_code = models.CharField(max_length=50)
    domain = models.CharField(max_length=40, default="students")
    title = models.CharField(max_length=180)
    export_format = models.CharField(max_length=15, default="csv")
    row_count = models.PositiveIntegerField(default=0)
    generated_by_name = models.CharField(max_length=150, default="Administrator")

    class Meta:
        db_table = "reports_generated_record"
        ordering = ["-created_at"]


class StatutoryComplianceFiling(TenantScopedModel):
    """Statutory board & regulatory compliance record (Work Division #29 Compliance & Records)."""

    filing_code = models.CharField(max_length=50)
    authority_name = models.CharField(max_length=120, default="CBSE OASIS / UDISE+")
    title = models.CharField(max_length=200)
    academic_session_label = models.CharField(max_length=30, default="2026-2027")
    submission_status = models.CharField(max_length=30, default="Compliant & Verified")
    reference_number = models.CharField(max_length=80, blank=True, default="")
    valid_until = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "compliance_statutory_filing"
        ordering = ["-created_at"]
