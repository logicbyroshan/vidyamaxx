"""
VidyaFloww Device Session Tracking & Refresh Token Rotation Registry
"""

from django.conf import settings
from django.db import models
from common.models import TimestampedModel


class DeviceSession(TimestampedModel):
    """Tracks issued refresh tokens and client devices for revocation and reuse detection."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="device_sessions"
    )
    refresh_jti = models.CharField(max_length=128, db_index=True)
    previous_refresh_jti = models.CharField(max_length=128, blank=True, default="", db_index=True)
    device_id = models.CharField(max_length=120, blank=True, default="")
    platform = models.CharField(max_length=80, blank=True, default="web")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True, default="")
    last_active_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()
    revoked_at = models.DateTimeField(null=True, blank=True, db_index=True)
    revoke_reason = models.CharField(max_length=120, blank=True, default="")

    class Meta:
        db_table = "core_device_session"
        ordering = ["-last_active_at"]

    @property
    def is_active(self) -> bool:
        return self.revoked_at is None

    def __str__(self):
        return f"Session({self.user_id}, {self.platform}, active={self.is_active})"
