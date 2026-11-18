"""
VidyaFloww Shared Security & Helper Utilities
"""

import hashlib
import secrets
from typing import Optional


def generate_numeric_otp(digits: int = 6) -> str:
    """Generate a cryptographically secure N-digit OTP string."""
    upper = 10**digits
    code = secrets.randbelow(upper)
    return f"{code:0{digits}d}"


def hash_value(raw: str, salt: str = "") -> str:
    """SHA-256 hex digest for OTP codes, token hashes, and lookup fingerprints."""
    payload = f"{salt}:{raw}".encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def get_client_ip(request) -> Optional[str]:
    """Extract client IP safely from request headers."""
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")
