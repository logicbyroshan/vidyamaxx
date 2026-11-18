"""
VidyaFloww File Storage Service (Validation + Local/S3 Abstraction + Presigned Access)
"""

import hashlib
import os
import uuid
from typing import Optional
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.utils import timezone

from common.validators import validate_uploaded_file
from platform_services.audit.services import record_audit_event
from .models import StoredFile

DEFAULT_ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".webp", ".csv", ".xlsx"}
DEFAULT_ALLOWED_MIMES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}


def store_uploaded_file(
    *,
    uploaded_file,
    school,
    branch=None,
    uploaded_by_id: Optional[uuid.UUID] = None,
    category: str = StoredFile.Category.DOCUMENT,
    visibility: str = StoredFile.Visibility.SCHOOL,
    max_size_bytes: int = 10 * 1024 * 1024,
) -> StoredFile:
    safe_name = validate_uploaded_file(
        uploaded_file,
        allowed_extensions=DEFAULT_ALLOWED_EXTENSIONS,
        allowed_mimes=DEFAULT_ALLOWED_MIMES,
        max_size_bytes=max_size_bytes,
    )

    content_bytes = uploaded_file.read()
    sha256_hex = hashlib.sha256(content_bytes).hexdigest()
    file_id = uuid.uuid4()
    date_prefix = timezone.now().strftime("%Y/%m")
    storage_key = f"schools/{school.id}/{category}/{date_prefix}/{file_id}_{safe_name}"

    saved_path = default_storage.save(storage_key, ContentFile(content_bytes))

    stored = StoredFile.objects.create(
        id=file_id,
        school=school,
        branch=branch,
        created_by_id=uploaded_by_id,
        uploaded_by_id=uploaded_by_id,
        original_name=safe_name,
        storage_key=saved_path,
        content_type=getattr(uploaded_file, "content_type", "application/octet-stream"),
        size_bytes=len(content_bytes),
        sha256_checksum=sha256_hex,
        visibility=visibility,
        category=category,
    )

    record_audit_event(
        school_id=school.id,
        tenant_id=school.tenant_id,
        actor_user_id=uploaded_by_id,
        category="Storage",
        action="FILE_UPLOADED",
        target_type="StoredFile",
        target_id=str(stored.id),
        metadata={"filename": safe_name, "category": category, "size_bytes": stored.size_bytes},
    )
    return stored


def get_secure_download_info(stored_file: StoredFile) -> dict:
    """
    Returns either a short-lived S3 presigned URL (production S3)
    or indicates local streaming through the RBAC-protected download endpoint.
    """
    use_s3 = bool(os.getenv("AWS_STORAGE_BUCKET_NAME") and not settings.DEBUG and hasattr(default_storage, "bucket"))
    if use_s3:
        url = default_storage.url(stored_file.storage_key)
        return {"mode": "presigned_url", "url": url, "expires_in": 300}
    return {
        "mode": "stream",
        "path": f"/api/v1/storage/files/{stored_file.id}/download/",
    }
