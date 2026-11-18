"""
VidyaFloww Certificate Templates & Issued Student/Staff Certificates Models
"""

from django.db import models
from django.utils import timezone
from common.models import TenantScopedModel


class CertificateTemplate(TenantScopedModel):
    """School-scoped certificate template (TC, Bonafide, Character, Experience, ID Card)."""

    code = models.CharField(max_length=40, default="TMPL-BONAFIDE")
    title = models.CharField(max_length=120)
    certificate_type = models.CharField(max_length=50, default="Bonafide")
    template_html = models.TextField(blank=True, default="")
    design_lab_template_id = models.CharField(max_length=80, blank=True, default="")

    class Meta:
        db_table = "certificates_template"
        ordering = ["title"]


class IssuedCertificate(TenantScopedModel):
    """Official serial-numbered certificate issued to a student or staff member."""

    serial_number = models.CharField(max_length=60, db_index=True)
    certificate_type = models.CharField(max_length=50, default="Bonafide")
    recipient_code = models.CharField(max_length=50, db_index=True)
    recipient_name = models.CharField(max_length=150)
    class_or_dept = models.CharField(max_length=60, default="10-A")
    issue_date = models.DateField(default=timezone.localdate)
    reason = models.CharField(max_length=255, blank=True, default="Official Request")
    verification_hash = models.CharField(max_length=64, blank=True, default="")
    status = models.CharField(max_length=20, default="Issued")

    class Meta:
        db_table = "certificates_issued"
        ordering = ["-issue_date", "-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["school", "serial_number"], name="uq_cert_school_serial")
        ]
