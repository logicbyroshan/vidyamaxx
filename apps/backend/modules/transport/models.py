"""
VidyaFloww Transport Route & Student Commute Summary Models (Work Division #14)
"""

from django.db import models
from common.models import TenantScopedModel


class TransportRouteRecord(TenantScopedModel):
    route_code = models.CharField(max_length=40)
    route_name = models.CharField(max_length=150)
    vehicle_number = models.CharField(max_length=40, default="DL-01-PC-4021")
    driver_name = models.CharField(max_length=120, default="Ramesh Kumar")
    driver_phone = models.CharField(max_length=25, default="+919811100001")
    capacity = models.PositiveSmallIntegerField(default=40)
    assigned_students_count = models.PositiveSmallIntegerField(default=32)

    class Meta:
        db_table = "transport_route_record"
        ordering = ["route_code"]
