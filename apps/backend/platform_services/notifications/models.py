"""
VidyaFloww In-App Notification Model (backs NotificationsPanel.tsx)
"""

from django.db import models
from common.models import TenantScopedModel


class InAppNotification(TenantScopedModel):
    class Type(models.TextChoices):
        SUCCESS = "success", "Success"
        ERROR = "error", "Error"
        WARNING = "warning", "Warning"
        INFO = "info", "Info"

    recipient_user_id = models.UUIDField(db_index=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    notification_type = models.CharField(max_length=20, choices=Type.choices, default=Type.INFO)
    is_read = models.BooleanField(default=False, db_index=True)
    read_at = models.DateTimeField(null=True, blank=True)
    action_url = models.CharField(max_length=255, blank=True, default="")

    class Meta:
        db_table = "platform_inapp_notification"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["school", "recipient_user_id", "is_read"], name="idx_notif_school_user_read")
        ]
