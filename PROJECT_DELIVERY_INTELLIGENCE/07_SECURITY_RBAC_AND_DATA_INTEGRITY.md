# 07 — SECURITY, 7-ROLE RBAC & DATA INTEGRITY VERIFICATION

> **Automated Verification Suites**:
> - `apps/backend/tests/test_phase1_foundation.py`
> - `apps/backend/tests/test_phase4_finance.py`
> - `apps/backend/tests/test_phase6_engagement_and_support.py`
> - `apps/backend/tests/test_phase10_portal_integrations_security.py`
> - `apps/backend/tests/test_phase11_security_idor_rbac.py`
> - `apps/web/src/tests/api_and_store.test.ts`

---

## 1. Multi-Tenant & Cross-Tenant IDOR Defense

- Every tenant-scoped model uses `TenantScopedModel` + `TenantScopedManager.for_school(school_id)`.
- Every protected view calls `resolve_user_tenant_context(request, require_school=True)`, validating that the authenticated user has an active `Membership` for the requested `X-School-ID`.
- **Verified in `test_phase11_security_idor_rbac.py`**:
  - Tenant-2 admin guessing a Tenant-1 UUID on `GET`/`PATCH`/`DELETE /api/v1/operations/hostel/allocations/{uuid}/` receives **404 Not Found**, and the Tenant-1 record remains unmodified.
  - Tenant-2 admin forging `X-School-ID` to Tenant-1's UUID on `/students/`, `/finance/invoices/`, `/portal/overview/`, and `/analytics/statistics/` receives **403 Forbidden**.

---

## 2. All 7 User Types & 30-Division Responsibility Boundaries

| User Type | Verified Permission Behavior |
|---|---|
| `SUPER_ADMIN` | Full platform, tenant, billing cancellation, and school governance access. |
| `SUPER_EXECUTIVE` | Operational oversight across tenants; explicitly blocked (`403`) from destructive subscription cancellation (`test_phase1_foundation.py`). |
| `SCHOOL_ADMIN` | Full access to all 30 work divisions within their assigned school(s), including branch CRUD and responsibility assignment grants/revocations. |
| `SCHOOL_EXECUTIVE` | Executive school access across divisions within their assigned school. |
| `STAFF` | Denied sensitive divisions (e.g., confidential counselling `GET /engagement/counselling/records/` -> `403`, transport write -> `403`) until explicitly granted a time-bounded `StaffResponsibilityAssignment` for that specific `WorkDivision`, after which only granted divisions/actions succeed (`201`) while ungranted divisions remain `403`. |
| `PARENT` | Strict child-only read scoping on `GET /portal/overview/` (`200`); blocked (`403`) from admin writes and confidential counselling. |
| `STUDENT` | Strict self-only read scoping on `GET /portal/overview/` (`200`); blocked (`403`) from admin writes and confidential counselling. |

---

## 3. Financial, Audit & Webhook Integrity

- **Immutable Receipts**: `DELETE /api/v1/finance/receipts/{id}/` is blocked (`403 IMMUTABLE_FINANCIAL_RECORD`); corrections occur strictly via append-only `POST /api/v1/finance/receipts/{id}/reverse/` with reason & audit trail.
- **Idempotent Payments**: `POST /api/v1/finance/collect/` and `POST /api/v1/integrations/payment/webhook/` deduplicate replays via `Idempotency-Key`.
- **Immutable Audit Events**: Append-only `AuditEvent` records logged on sensitive actions (auth, counselling access/writes, exam mark locks, finance, responsibilities); fake frontend `setInterval` log generator completely removed.
- **Webhook Authenticity**: Payment and biometric ingestion endpoints reject missing or invalid HMAC-SHA256 signatures with `401`/`403` before touching database state.

---

## 4. Security Findings Closure Summary (`SEC-01` – `SEC-06`)

| ID | Issue | Status |
|---|---|---|
| `SEC-01` | Offline login bypass & simulated SSO in `login.tsx` | **CLOSED** |
| `SEC-02` | Cross-app auth & CORS allowlist for 12 satellites (`8010–8022`) | **CLOSED** |
| `SEC-03` | Fake 6s random audit log generator in `audit.tsx` | **CLOSED** |
| `SEC-04` | HMAC-SHA256 webhook signature verification & idempotency | **CLOSED** |
| `SEC-05` | `idempotency-key` added to `CORS_ALLOW_HEADERS` | **CLOSED** |
| `SEC-06` | PgBouncer-compatible PostgreSQL RLS guidance documented | **DOCUMENTED** |
