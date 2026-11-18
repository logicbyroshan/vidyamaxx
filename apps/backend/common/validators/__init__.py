"""
VidyaFloww Domain Validators (India-First + File Security)
"""

import re
from django.core.exceptions import ValidationError

INDIAN_MOBILE_REGEX = re.compile(r"^(?:\+91[\-\s]?)?([6-9]\d{9})$")
INDIAN_PINCODE_REGEX = re.compile(r"^[1-9][0-9]{5}$")
SAFE_FILENAME_REGEX = re.compile(r"[^a-zA-Z0-9._\-]")

# Magic signatures for file-type validation
MAGIC_SIGNATURES = {
    "application/pdf": [b"%PDF-"],
    "image/png": [b"\x89PNG\r\n\x1a\n"],
    "image/jpeg": [b"\xff\xd8\xff"],
    "image/webp": [b"RIFF"],
}


def normalize_indian_phone(value: str) -> str:
    """Normalize an Indian 10-digit mobile number to E.164 (+91XXXXXXXXXX)."""
    cleaned = re.sub(r"[\s\-()]+", "", value.strip())
    match = INDIAN_MOBILE_REGEX.match(cleaned)
    if not match:
        raise ValidationError("Enter a valid 10-digit Indian mobile number (optionally prefixed with +91).")
    return f"+91{match.group(1)}"


def validate_indian_pincode(value: str) -> str:
    cleaned = value.strip()
    if not INDIAN_PINCODE_REGEX.match(cleaned):
        raise ValidationError("Enter a valid 6-digit Indian PIN code.")
    return cleaned


def sanitize_filename(filename: str) -> str:
    base = filename.rsplit("/", 1)[-1].rsplit("\\", 1)[-1]
    return SAFE_FILENAME_REGEX.sub("_", base)[:180] or "upload.bin"


def validate_uploaded_file(
    uploaded_file,
    *,
    allowed_extensions: set[str],
    allowed_mimes: set[str],
    max_size_bytes: int = 10 * 1024 * 1024,
) -> str:
    """
    Validate file size, extension, declared MIME type, and leading magic bytes.
    Returns normalized safe filename.
    """
    if uploaded_file.size > max_size_bytes:
        raise ValidationError(f"File exceeds maximum allowed size of {max_size_bytes // (1024 * 1024)} MB.")

    safe_name = sanitize_filename(getattr(uploaded_file, "name", "file"))
    ext = ("." + safe_name.rsplit(".", 1)[-1].lower()) if "." in safe_name else ""
    if ext not in allowed_extensions:
        raise ValidationError(f"File extension '{ext}' is not allowed.")

    content_type = getattr(uploaded_file, "content_type", "").lower()
    if allowed_mimes and content_type not in allowed_mimes:
        raise ValidationError(f"Content type '{content_type}' is not allowed.")

    # Verify leading bytes for binary formats with known magic signatures
    if content_type in MAGIC_SIGNATURES:
        pos = uploaded_file.tell() if hasattr(uploaded_file, "tell") else 0
        header = uploaded_file.read(16)
        if hasattr(uploaded_file, "seek"):
            uploaded_file.seek(pos)
        if not any(header.startswith(sig) for sig in MAGIC_SIGNATURES[content_type]):
            raise ValidationError("Uploaded file signature does not match its declared content type.")

    return safe_name
