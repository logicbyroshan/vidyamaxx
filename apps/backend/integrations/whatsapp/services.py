"""
VidyaFloww Meta WhatsApp Cloud API Adapter

Dispatches pre-approved HSM templates for fee reminders, absentee alerts, and circulars.
"""

import logging
import os
from typing import Any, Dict, List

logger = logging.getLogger("vidyafloww.integrations.whatsapp")


def send_whatsapp_template(
    *,
    phone_e164: str,
    template_name: str,
    language_code: str = "en",
    body_params: List[str] | None = None,
) -> Dict[str, Any]:
    token = os.getenv("WHATSAPP_CLOUD_TOKEN", "")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")

    if token and phone_number_id:
        import requests

        url = f"https://graph.facebook.com/v21.0/{phone_number_id}/messages"
        payload = {
            "messaging_product": "whatsapp",
            "to": phone_e164.lstrip("+"),
            "type": "template",
            "template": {
                "name": template_name,
                "language": {"code": language_code},
                "components": [
                    {
                        "type": "body",
                        "parameters": [{"type": "text", "text": str(p)} for p in (body_params or [])],
                    }
                ],
            },
        }
        resp = requests.post(
            url,
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json=payload,
            timeout=10,
        )
        resp.raise_for_status()
        return {"provider": "whatsapp_cloud", "mode": "live", "status": "sent", "response": resp.json()}

    logger.info("WhatsApp HSM template logged in sandbox mode template=%s", template_name)
    return {
        "provider": "whatsapp_cloud",
        "mode": "sandbox",
        "status": "sandbox_logged",
        "template_name": template_name,
        "recipient_suffix": phone_e164[-4:],
    }
