"""
VidyaFloww Outbound HMAC-SHA256 Signed Webhook Dispatcher
"""

import hashlib
import hmac
import json
import logging
import time
from typing import Any, Dict

logger = logging.getLogger("vidyafloww.integrations.webhook")


def sign_webhook_payload(payload: Dict[str, Any], secret: str) -> str:
    raw = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hmac.new(secret.encode("utf-8"), raw, hashlib.sha256).hexdigest()


def dispatch_signed_webhook(
    *,
    target_url: str,
    event_type: str,
    payload: Dict[str, Any],
    secret: str,
    max_retries: int = 3,
    dry_run: bool = False,
) -> Dict[str, Any]:
    envelope = {"event": event_type, "data": payload}
    sig = sign_webhook_payload(envelope, secret)
    if dry_run:
        return {"delivered": True, "mode": "dry_run", "signature": sig, "event": event_type}

    import requests

    last_err = None
    for attempt in range(1, max_retries + 1):
        try:
            resp = requests.post(
                target_url,
                json=envelope,
                headers={
                    "Content-Type": "application/json",
                    "X-VidyaFloww-Event": event_type,
                    "X-VidyaFloww-Signature": sig,
                },
                timeout=8,
            )
            if 200 <= resp.status_code < 300:
                return {"delivered": True, "status_code": resp.status_code, "attempts": attempt}
            last_err = f"HTTP {resp.status_code}"
        except Exception as exc:  # noqa: BLE001
            last_err = str(exc)
        if attempt < max_retries:
            time.sleep(0.2 * attempt)

    logger.error("Outbound webhook dead-lettered event=%s url=%s error=%s", event_type, target_url, last_err)
    return {"delivered": False, "attempts": max_retries, "error": last_err}
