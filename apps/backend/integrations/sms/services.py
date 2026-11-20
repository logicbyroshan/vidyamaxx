"""
VidyaFloww TRAI DLT-Compliant SMS Adapter (MSG91 / Kaleyra)

Requires valid `pe_id` (Principal Entity ID) and `dlt_template_id`.
Executes real HTTP dispatch when `MSG91_AUTH_KEY` is configured, and safe sandbox logging otherwise.
"""

import logging
import os
from typing import Any, Dict

logger = logging.getLogger("vidyafloww.integrations.sms")


def send_dlt_sms(
    *,
    phone_e164: str,
    dlt_template_id: str,
    variables: Dict[str, str],
    pe_id: str | None = None,
) -> Dict[str, Any]:
    entity_id = pe_id or os.getenv("TRAI_DLT_PE_ID", "")
    auth_key = os.getenv("MSG91_AUTH_KEY", "")
    sender_id = os.getenv("MSG91_SENDER_ID", "VFLOWW")

    if not dlt_template_id:
        raise ValueError("TRAI DLT template ID is required for Indian SMS dispatch.")

    if auth_key and entity_id:
        import requests

        resp = requests.post(
            "https://control.msg91.com/api/v5/flow/",
            headers={"authkey": auth_key, "content-type": "application/json"},
            json={
                "template_id": dlt_template_id,
                "sender": sender_id,
                "short_url": "0",
                "mobiles": phone_e164.lstrip("+"),
                **variables,
            },
            timeout=10,
        )
        resp.raise_for_status()
        return {"provider": "msg91", "mode": "live", "status": "queued", "response": resp.json()}

    logger.info("DLT SMS queued in sandbox mode template=%s phone_suffix=%s", dlt_template_id, phone_e164[-4:])
    return {
        "provider": "msg91",
        "mode": "sandbox",
        "status": "sandbox_logged",
        "dlt_template_id": dlt_template_id,
        "recipient_suffix": phone_e164[-4:],
    }
