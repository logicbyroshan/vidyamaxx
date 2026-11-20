# 06 — BACKEND COMPLETIONS & EXTERNAL INTEGRATION ADAPTERS

> **Location**: `E:\E\VidyaMaxx\VidyaMaxx\apps\backend`  
> **Stack**: Django 5.2, Django REST Framework, SimpleJWT, drf-spectacular (OpenAPI 3.1), PostgreSQL/SQLite, Celery, Redis

---

## 1. Real Database Analytics & Portal API (`modules/analytics/views.py`)

- **`DashboardCommandSummaryView` (`GET /api/v1/analytics/dashboard/`)**:
  - Replaced hardcoded percentages with real ORM queries computing active students, active staff, live daily attendance percentage, real `attendance_exceptions`, pending admissions, open grievances, and monthly fee totals.
- **`InstitutionalStatisticsView` (`GET /api/v1/analytics/statistics/`)**:
  - Computes real teacher-to-student ratio, real `StudentExamMark` pass rate (`total_marks / max_total_marks >= 0.33`), live wing breakdowns grouped by `GradeClass.stage`, monthly admission & attendance trends (`TruncMonth`), and live fee realization totals.
- **`ReportsListCreateView` (`GET/POST /api/v1/analytics/reports/`)**:
  - Computes live `row_count` from actual tenant tables (`students`, `staff`, `attendance`, `finance`, `academics`, `compliance`) on report generation.
- **`CrossPlatformAIAssistView` (`POST /api/v1/analytics/ai/assist/`)**:
  - Generates structured operational answers grounded in live tenant telemetry (fee defaulters, `< 75%` attendance radar, proxy substitution candidates ordered by `weekly_periods_load`, NEP 2020 lesson plan outlines) and returns both `suggestion` and `reply` keys.
- **`PortalOverviewView` (`GET /api/v1/portal/overview/`)**:
  - Dedicated read-optimized endpoint strictly scoped by `UserType`:
    - `PARENT`: Only children matched by `guardian_phone`, `guardian_email`, or `guardian_links`.
    - `STUDENT`: Only the student's own matched record.
    - `ADMIN/STAFF`: Tenant-scoped preview.
  - Returns linked children (with recent attendance, fee invoices, exam marks), class-scoped homework, school circulars, and calendar events.

---

## 2. Operational Detail CRUD & Campus Management

- **`modules/events/views.py` & `modules/events/urls.py`**:
  - Implemented `_make_detail_view()` providing tenant-scoped `GET`, `PATCH`, and `DELETE` with unique `@extend_schema(operation_id=...)` annotations across all 11 school operational resources:
    1. `certificates/templates/<uuid:pk>/`
    2. `certificates/issued/<uuid:pk>/`
    3. `documents/<uuid:pk>/`
    4. `library/books/<uuid:pk>/`
    5. `transport/routes/<uuid:pk>/`
    6. `hostel/allocations/<uuid:pk>/`
    7. `inventory/items/<uuid:pk>/`
    8. `assets/<uuid:pk>/`
    9. `events/<uuid:pk>/`
    10. `activities/<uuid:pk>/`
    11. `front-office/visitors/<uuid:pk>/`
- **`core/campuses/views.py`**:
  - Added `BranchDetailView.delete()` allowing `SCHOOL_ADMIN` to remove secondary campuses while protecting primary campus deletion with HTTP 400.
- **`config/settings/base.py`**:
  - Added dynamic `PASSWORD_HASHERS` detection so `Argon2PasswordHasher` is prioritized whenever `argon2-cffi` is installed and falls back cleanly to `PBKDF2PasswordHasher` in minimal local environments.
- **`core/organizations/management/commands/seed_foundation.py`**:
  - Added optional `--dev-password` CLI argument (never hardcoding credentials in source) and seeded `parent@vidyafloww.edu.in` (`PARENT`) and `student@vidyafloww.edu.in` (`STUDENT`) demo accounts alongside admin & faculty.

---

## 3. External Integration Adapters (`apps/backend/integrations/*`)

| Adapter | Files | Endpoint / Function | Security & Idempotency |
|---|---|---|---|
| **Payment Gateway (Razorpay / Cashfree)** | `integrations/payment/services.py`, `views.py`, `urls.py` | `POST /api/v1/integrations/payment/webhook/` + `create_gateway_order()` | Constant-time HMAC-SHA256 signature verification (`hmac.compare_digest`), idempotent fee settlement calling `collect_fee_payment()`, live & sandbox modes. |
| **Biometric Turnstile Hardware** | `integrations/biometric/services.py`, `views.py`, `urls.py` | `POST /api/v1/integrations/biometric/punch/` | Constant-time HMAC-SHA256 device signature verification, idempotent upsert into `StudentAttendanceRecord`. |
| **TRAI DLT SMS (MSG91)** | `integrations/sms/services.py` | `send_dlt_sms()` | DLT template ID support; live HTTPS dispatch when `MSG91_AUTH_KEY` is configured, deterministic sandbox result otherwise. |
| **Meta WhatsApp Cloud API** | `integrations/whatsapp/services.py` | `send_whatsapp_template()` | HSM template messaging; live Meta Graph API dispatch when `WHATSAPP_CLOUD_TOKEN` & `WHATSAPP_PHONE_NUMBER_ID` are set, sandbox mode otherwise. |
| **Outbound Signed Webhooks** | `integrations/webhook/services.py` | `dispatch_signed_webhook()` | Signs payloads with `X-VidyaFloww-Signature` (HMAC-SHA256) and supports exponential retry backoff. |
