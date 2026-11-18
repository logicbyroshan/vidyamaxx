# ADR-006: File Storage Abstraction & Presigned Access Control

- **Status**: Accepted
- **Date**: 2026-11-18

## Context
Modules upload student photos, Aadhaar/birth certificates, medical documents, leave proofs, homework attachments, bulk CSVs, and generated PDFs. Storing binaries in PostgreSQL bloats backups; direct public S3 URLs violate student/medical privacy.

## Decision
Implement `platform_services.storage` (`StoredFile` metadata model in PostgreSQL + `StorageBackend` abstraction):
- Validate MIME type (via file signature, not just extension), extension allowlist, and size limits before persistence.
- Store binaries on Local Protected Media (dev) or Private AWS S3 / S3-compatible bucket (prod).
- Serve downloads strictly via RBAC-verified endpoints returning short-lived (`60s–300s`) S3 presigned URLs or authorized `FileResponse`.
- Track retention policy, SHA-256 checksum, school ownership, and uploader audit trail.
