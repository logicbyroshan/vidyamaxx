"""
Celery background tasks for signed outbound webhook delivery with retry handling.
"""

from __future__ import annotations

from celery import shared_task
from integrations.webhook.services import dispatch_signed_webhook


@shared_task(bind=True, max_retries=3, default_retry_delay=15)
def deliver_outbound_webhook_task(
    self,
    url: str,
    event_name: str,
    payload: dict,
    secret: str = "sandbox-webhook-secret",
    dry_run: bool = False,
) -> dict:
    return dispatch_signed_webhook(
        target_url=url,
        event_type=event_name,
        payload=payload,
        secret=secret,
        dry_run=dry_run,
    )
