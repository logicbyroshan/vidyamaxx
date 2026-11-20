"""
Celery background tasks for institutional communication delivery (In-App Notifications, Email, SMS, WhatsApp).
"""

from __future__ import annotations

import logging
from celery import shared_task

logger = logging.getLogger("vidyafloww.communication.tasks")


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def dispatch_circular_notifications_task(self, circular_id: str) -> dict:
    from core.users.models import Membership
    from modules.communication.models import CircularBroadcast
    from platform_services.notifications.models import InAppNotification
    from integrations.email.services import send_transactional_email

    circular = CircularBroadcast.objects.filter(id=circular_id).first()
    if not circular:
        return {"success": False, "error": "Circular not found", "circular_id": circular_id}

    memberships = (
        Membership.objects.select_related("user")
        .filter(school_id=circular.school_id, is_active=True)
    )
    created_count = 0
    emails: list[str] = []
    for m in memberships:
        InAppNotification.objects.create(
            school_id=circular.school_id,
            recipient_user_id=m.user_id,
            title=f"Circular {circular.circular_number}: {circular.title}",
            description=circular.message_body[:240],
            notification_type="info",
            action_url="/communication",
        )
        created_count += 1
        if m.user.email:
            emails.append(m.user.email)

    email_result = None
    if emails and "email" in (circular.channel or "").lower():
        email_result = send_transactional_email(
            to_emails=emails[:200],
            subject=f"[VidyaFloww] {circular.title}",
            text_body=circular.message_body,
        )

    logger.info("circular_dispatched id=%s notifications=%d", circular_id, created_count)
    return {
        "success": True,
        "circular_id": str(circular.id),
        "notifications_created": created_count,
        "email_result": email_result,
    }
