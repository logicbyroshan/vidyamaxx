"""
Audit Recording Service — strips sensitive keys automatically before persistence.
"""

from typing import Any, Dict, Optional
import uuid
from common.context import get_ip_address, get_current_tenant_id
from .models import AuditEvent

REDACTED_KEYS = {"password", "token", "refresh", "access", "secret", "otp", "cvv", "pin", "license_key"}


def _redact(data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    if not data:
        return {}
    cleaned = {}
    for k, v in data.items():
        if any(s in str(k).lower() for s in REDACTED_KEYS):
            cleaned[k] = "***REDACTED***"
        elif isinstance(v, dict):
            cleaned[k] = _redact(v)
        else:
            cleaned[k] = v
    return cleaned


def record_audit_event(
    *,
    action: str,
    category: str = AuditEvent.Category.SETTINGS,
    status: str = AuditEvent.Status.SUCCESS,
    school_id: Optional[uuid.UUID] = None,
    tenant_id: Optional[uuid.UUID] = None,
    actor_user_id: Optional[uuid.UUID] = None,
    actor_name: str = "System",
    actor_role_label: str = "",
    target_type: str = "",
    target_id: str = "",
    ip_address: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> AuditEvent:
    return AuditEvent.objects.create(
        tenant_id=tenant_id or get_current_tenant_id(),
        school_id=school_id,
        actor_user_id=actor_user_id,
        actor_name=actor_name[:150],
        actor_role_label=actor_role_label[:80],
        category=category,
        action=action[:120],
        target_type=target_type[:80],
        target_id=str(target_id)[:120],
        ip_address=ip_address or get_ip_address(),
        status=status,
        metadata_json=_redact(metadata),
    )
