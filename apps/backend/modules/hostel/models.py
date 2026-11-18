"""
VidyaFloww Hostel Room & Boarding Allocation Summary Models (Work Division #15)
"""

from django.db import models
from common.models import TenantScopedModel


class HostelAllocationRecord(TenantScopedModel):
    hostel_block = models.CharField(max_length=80, default="Tagore Boys Hostel")
    room_number = models.CharField(max_length=30)
    admission_number = models.CharField(max_length=50, db_index=True)
    student_name = models.CharField(max_length=150)
    warden_name = models.CharField(max_length=120, default="Mr. S. K. Sharma")
    status = models.CharField(max_length=25, default="Occupied")

    class Meta:
        db_table = "hostel_allocation_record"
        ordering = ["hostel_block", "room_number"]
