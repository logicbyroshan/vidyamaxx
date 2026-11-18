"""
VidyaFloww Grievance & Helpdesk Ticket Models (Work Division #25 Complaints & Grievances)
Backs /complaints (`apps/web/src/routes/complaints.tsx`).
"""

from django.db import models
from common.models import TenantScopedModel


class GrievanceTicket(TenantScopedModel):
    ticket_number = models.CharField(max_length=50, db_index=True)
    complainant_type = models.CharField(max_length=30, default="Parent")
    complainant_name = models.CharField(max_length=150)
    category = models.CharField(max_length=60, default="Transport")
    subject = models.CharField(max_length=220)
    description = models.TextField(blank=True, default="")
    priority = models.CharField(max_length=20, default="High")
    assigned_officer = models.CharField(max_length=150, default="Administrative Desk")
    status = models.CharField(max_length=25, default="Open", db_index=True)
    resolution_notes = models.TextField(blank=True, default="")
    expected_sla = models.CharField(max_length=60, default="24 Hours")

    class Meta:
        db_table = "discipline_grievance_ticket"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["school", "ticket_number"], name="uq_grievance_school_ticket")
        ]
