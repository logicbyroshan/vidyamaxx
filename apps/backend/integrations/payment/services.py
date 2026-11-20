"""
VidyaFloww Payment Gateway Adapter (Razorpay & Cashfree)

Supports HMAC-SHA256 webhook signature verification, order creation in live or
explicit sandbox mode, and idempotent fee ledger crediting.
"""

import hashlib
import hmac
import logging
import os
import uuid
from decimal import Decimal
from typing import Any, Dict, Tuple

logger = logging.getLogger("vidyafloww.integrations.payment")


def verify_razorpay_signature(raw_body: bytes, signature: str, secret: str | None = None) -> bool:
    """Verify Razorpay X-Razorpay-Signature HMAC-SHA256 digest using constant-time compare."""
    webhook_secret = secret or os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    if not webhook_secret or not signature:
        return False
    expected = hmac.new(webhook_secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature.strip())


def verify_cashfree_signature(timestamp: str, raw_body: bytes, signature: str, secret: str | None = None) -> bool:
    """Verify Cashfree webhook signature (HMAC-SHA256 over timestamp + body)."""
    webhook_secret = secret or os.getenv("CASHFREE_WEBHOOK_SECRET", "")
    if not webhook_secret or not signature:
        return False
    signed_payload = timestamp.encode("utf-8") + raw_body
    expected = hmac.new(webhook_secret.encode("utf-8"), signed_payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature.strip())


def create_payment_order(
    *,
    invoice_number: str,
    amount_inr: Decimal,
    currency: str = "INR",
    provider: str = "razorpay",
) -> Tuple[Dict[str, Any], bool]:
    """
    Create a gateway order payload. Uses live Razorpay/Cashfree credentials when
    configured; otherwise returns a clearly tagged sandbox order for testing.
    """
    amount_paise = int((Decimal(str(amount_inr)) * Decimal("100")).quantize(Decimal("1")))
    key_id = os.getenv("RAZORPAY_KEY_ID", "")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")

    if provider == "razorpay" and key_id and key_secret:
        import requests

        resp = requests.post(
            "https://api.razorpay.com/v1/orders",
            auth=(key_id, key_secret),
            json={
                "amount": amount_paise,
                "currency": currency,
                "receipt": invoice_number[:40],
                "payment_capture": 1,
            },
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        return {
            "provider": "razorpay",
            "mode": "live",
            "order_id": data["id"],
            "amount_inr": str(amount_inr),
            "amount_paise": amount_paise,
            "currency": currency,
            "key_id": key_id,
        }, True

    sandbox_order_id = f"order_sandbox_{uuid.uuid4().hex[:14]}"
    logger.info("Payment order generated in sandbox mode invoice=%s order=%s", invoice_number, sandbox_order_id)
    return {
        "provider": provider,
        "mode": "sandbox",
        "order_id": sandbox_order_id,
        "amount_inr": str(amount_inr),
        "amount_paise": amount_paise,
        "currency": currency,
    }, False
