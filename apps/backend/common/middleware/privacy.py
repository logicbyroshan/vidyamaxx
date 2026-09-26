"""
VidyaFloww — DPDP Privacy & Security Middleware
Enforces security headers, sovereign caching restrictions, and PII-sanitized logging.
"""

import logging
import re
import time

logger = logging.getLogger("vidyafloww.privacy")

# Regex patterns for sensitive PII redaction in logs
AADHAAR_REGEX = re.compile(r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b')
PASSWORD_REGEX = re.compile(r'(password|passwd|secret|token|refresh_token)\s*[:=]\s*["\']?[^"\'\s,]+["\']?', re.IGNORECASE)


def redact_pii(text: str) -> str:
    """Redacts plain-text Aadhaar and credentials from log strings."""
    if not isinstance(text, str):
        return text
    # Mask Aadhaar numbers to XXXX-XXXX-Last4
    def mask_match(m):
        raw = m.group(0).replace('-', '').replace(' ', '')
        return f"XXXX-XXXX-{raw[-4:]}"
    redacted = AADHAAR_REGEX.sub(mask_match, text)
    redacted = PASSWORD_REGEX.sub(r'\1: [REDACTED_BY_DPDP_FILTER]', redacted)
    return redacted


class PrivacyPreservingSecurityHeadersMiddleware:
    """
    Injects enterprise security headers aligned with DPDP Act reasonable security safeguards.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Essential Security Headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
        response['Permissions-Policy'] = 'camera=(self), microphone=(self), geolocation=()'
        response['X-XSS-Protection'] = '1; mode=block'
        
        # Ensure private API and student endpoints are never cached in public reverse proxies
        if request.path.startswith('/api/v1/') or request.path.startswith('/admin/'):
            response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
            response['Pragma'] = 'no-cache'

        return response


class SanitizedRequestLoggingMiddleware:
    """
    Logs HTTP telemetry without persisting sensitive personal data, passwords, or raw Aadhaar numbers.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration = time.time() - start_time

        # Safe logging without query parameters containing potential PII
        client_ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', '127.0.0.1')).split(',')[0].strip()
        path = request.path

        if not path.startswith('/static/'):
            logger.info(
                f"[DPDP-AUDIT] {request.method} {path} - Status {response.status_code} - "
                f"IP: {client_ip} - Duration: {duration:.3f}s"
            )

        return response
