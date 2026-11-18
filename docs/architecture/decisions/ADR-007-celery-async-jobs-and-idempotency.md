# ADR-007: Celery Background Jobs, Idempotency & Failure Handling

- **Status**: Accepted
- **Date**: 2026-11-18

## Context
Bulk student imports, ZIP/PDF/Excel exports, automated attendance alerts, fee reminders, broadcast notifications, and webhook deliveries would block HTTP worker threads if executed synchronously.

## Decision
Use **Celery 5.6 + Redis + `django-celery-beat`**, wrapped in a `BackgroundJob` tracking table:
- Every async task accepts a deterministic `idempotency_key` and `school_id`.
- Configure explicit timeouts (`soft_time_limit`, `time_limit`), bounded exponential-backoff retries (`autoretry_for`, `max_retries=3..5`), and failure state recording (`status=FAILED`, redacted error message) so no job fails silently.
- Keep fast transactional requests (single student create, attendance mark, single counter receipt) synchronous inside HTTP transactions.
