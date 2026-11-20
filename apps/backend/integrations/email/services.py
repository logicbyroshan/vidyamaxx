"""
VidyaFloww Transactional Email Service Adapter.
Uses Django's configured EMAIL_BACKEND (SMTP in production, locmem/console in dev/test).
Supports deterministic sandbox mode when EMAIL_HOST is not configured so no external SMTP server is required for tests.
"""

from __future__ import annotations

import logging
from typing import Iterable

from django.conf import settings
from django.core.mail import EmailMultiAlternatives

logger = logging.getLogger("vidyafloww.integrations.email")


def send_transactional_email(
    *,
    to_emails: Iterable[str],
    subject: str,
    text_body: str,
    html_body: str | None = None,
    from_email: str | None = None,
) -> dict:
    recipients = [e.strip() for e in to_emails if e and e.strip()]
    if not recipients:
        return {"success": False, "mode": "validation_error", "error": "No valid recipients supplied."}

    sender = from_email or getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@vidyafloww.com")
    backend_path = getattr(settings, "EMAIL_BACKEND", "")
    is_live_smtp = "smtp" in backend_path.lower() and bool(getattr(settings, "EMAIL_HOST", ""))

    msg = EmailMultiAlternatives(subject=subject, body=text_body, from_email=sender, to=recipients)
    if html_body:
        msg.attach_alternative(html_body, "text/html")

    if not is_live_smtp and not getattr(settings, "TESTING", False):
        logger.info("email_sandbox_dispatch recipients=%s subject=%s", recipients, subject)
        return {
            "success": True,
            "mode": "sandbox",
            "recipients": recipients,
            "subject": subject,
            "sent_count": len(recipients),
        }

    sent_count = msg.send(fail_silently=False)
    return {
        "success": sent_count > 0,
        "mode": "live_smtp" if is_live_smtp else "test_backend",
        "recipients": recipients,
        "subject": subject,
        "sent_count": sent_count,
    }
