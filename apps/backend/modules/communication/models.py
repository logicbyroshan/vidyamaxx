"""
VidyaFloww Circulars & Broadcast Models (Work Division #21 Communication)
"""

from django.db import models
from common.models import TenantScopedModel


class CircularBroadcast(TenantScopedModel):
    circular_number = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    audience = models.CharField(max_length=80, default="All Parents & Faculty")
    channel = models.CharField(max_length=40, default="In-App + WhatsApp + Email")
    message_body = models.TextField()
    status = models.CharField(max_length=25, default="Published")

    class Meta:
        db_table = "communication_circular_broadcast"
        ordering = ["-created_at"]
