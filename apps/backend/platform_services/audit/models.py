"""
VidyaFloww Append-Only Audit Event Model
"""

from django.core.exceptions import PermissionDenied
from django.db import models
from common.models import TimestampedModel


class AuditEvent(TimestampedModel):
    """
    Immutable security & compliance audit log (backs /audit UI).
    Updates and deletions on persisted records are explicitly forbidden.
    """

    class Category(models.TextChoices):
        AUTH = "Auth", "Auth"
        STUDENTS = "Students", "Students"
        EXAMS = "Exams", "Exams"
        FINANCE = "Finance", "Finance"
        SETTINGS = "Settings", "Settings"
        GATE = "Gate", "Gate"
        PERMISSIONS = "Permissions", "Permissions"
        STORAGE = "Storage", "Storage"

    class Status(models.TextChoices):
        SUCCESS = "Success", "Success"
        WARNING = "Warning", "Warning"
        BLOCKED = "Blocked", "Blocked"

    tenant_id = models.UUIDField(null=True, blank=True, db_index=True)
    school_id = models.UUIDField(null=True, blank=True, db_index=True)
    actor_user_id = models.UUIDField(null=True, blank=True, db_index=True)
    actor_name = models.CharField(max_length=150, default="System")
    actor_role_label = models.CharField(max_length=80, blank=True, default="")
    category = models.CharField(max_length=30, choices=Category.choices, default=Category.SETTINGS, db_index=True)
    action = models.CharField(max_length=120, db_index=True)
    target_type = models.CharField(max_length=80, blank=True, default="")
    target_id = models.CharField(max_length=120, blank=True, default="")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUCCESS, db_index=True)
    metadata_json = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = "platform_audit_event"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["school_id", "category", "created_at"], name="idx_audit_school_cat_ts"),
        ]

    def delete(self, *args, **kwargs):
        raise PermissionDenied("AuditEvent records are immutable and cannot be deleted.")

    def save(self, *args, **kwargs):
        if not self._state.adding:
            raise PermissionDenied("AuditEvent records are immutable and cannot be updated.")
        super().save(*args, **kwargs)
