"""
VidyaFloww StoredFile Metadata Model (Local / S3 Storage Abstraction)
"""

from django.db import models
from common.models import TenantScopedModel


class StoredFile(TenantScopedModel):
    """
    Tracks uploaded documents, photos, certificates, and generated exports.
    Large binaries are never stored in PostgreSQL; binaries live in protected local media or S3.
    """

    class Visibility(models.TextChoices):
        PRIVATE = "PRIVATE", "Private"
        SCHOOL = "SCHOOL", "School Internal"
        PUBLIC = "PUBLIC", "Public Asset"

    class Category(models.TextChoices):
        AVATAR = "avatar", "Avatar Photo"
        DOCUMENT = "document", "Document"
        CERTIFICATE = "certificate", "Certificate"
        HOMEWORK = "homework", "Homework"
        LEAVE_PROOF = "leave_proof", "Leave Proof"
        REPORT = "report", "Generated Report"
        SCHOOL_LOGO = "school_logo", "School Logo"

    original_name = models.CharField(max_length=255)
    storage_key = models.CharField(max_length=512, unique=True)
    content_type = models.CharField(max_length=120)
    size_bytes = models.PositiveBigIntegerField()
    sha256_checksum = models.CharField(max_length=64, db_index=True)
    visibility = models.CharField(max_length=20, choices=Visibility.choices, default=Visibility.SCHOOL)
    category = models.CharField(max_length=30, choices=Category.choices, default=Category.DOCUMENT)
    uploaded_by_id = models.UUIDField(null=True, blank=True)
    retention_until = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "platform_stored_file"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.original_name} ({self.size_bytes}B)"
