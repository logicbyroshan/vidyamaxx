# VIDYAFLOWW — FINAL API-TO-FRONTEND MAPPING

> **Base URL**: `http://localhost:8000/api/v1` (`VITE_API_URL`)  
> **OpenAPI 3.1 Spec**: `docs/api/openapi.yaml` (validated with `manage.py spectacular --validate --fail-on-warn` — **0 errors, 0 warnings**)  
> **Verified On**: Live Django 5.2 + **PostgreSQL 17.10** + CORS preflights from `:3000`, `:8017`, `:8018`, `:8020`.

| API Endpoint(s) | Main Portal (`apps/web`) Consumer | Satellite App Consumer | Verified Status |
|---|---|---|---|
| `GET /api/v1/health/` | Readiness / Infra | Readiness / Infra | `VERIFIED` (Live PG 17.10: `200 ok`) |
| `POST /api/v1/auth/login/`, `/register/`, `/otp/request/`, `/otp/verify/`, `/password/reset/`, `/username/lookup/` | `routes/login.tsx` | All 12 `components/SatelliteAuthStatus.tsx` | `VERIFIED` |
| `POST /api/v1/auth/token/refresh/`, `/logout/`, `GET/PATCH /api/v1/auth/me/` | `layouts/AppShell.tsx`, `Sidebar.tsx`, `Header.tsx`, `routes/shortcuts.tsx`, `routes/index.tsx` | All 12 `lib/apiClient.ts` | `VERIFIED` |
| `GET/PATCH /api/v1/schools/current/`, `GET/POST/PATCH/DELETE /api/v1/schools/branches/` | `routes/settings.tsx`, `layouts/Header.tsx` | `X-School-ID` / `X-Branch-ID` headers | `VERIFIED` |
| `GET /api/v1/platform/subscription/`, `POST /payment-method/`, `POST /cancel/` | `routes/license.tsx` | — | `VERIFIED` |
| `GET/PATCH /api/v1/permissions/policies/`, `GET/POST/PATCH/DELETE /api/v1/permissions/responsibilities/` | `routes/security.tsx`, `stores/globalStore.ts` | Server-enforced on all writes | `VERIFIED` |
| `GET /api/v1/audit/events/` | `routes/audit.tsx` | Server-recorded audit trail | `VERIFIED` |
| `GET /api/v1/notifications/`, `POST /notifications/mark-all-read/` | `layouts/NotificationsPanel.tsx`, `AppShell.tsx` | — | `VERIFIED` |
| `GET/POST/PATCH/DELETE /api/v1/students/`, `/promote/`, `/withdraw/`, `/readmit/` | `routes/students.tsx`, `layouts/CommandPalette.tsx` | `Design-VidyaFloww` (`:8010`), `Portal-VidyaFloww` (`:8017`) | `VERIFIED` |
| `GET/POST/PATCH/DELETE /api/v1/staff/` | `routes/teachers.tsx`, `layouts/CommandPalette.tsx` | `HRM-VidyaFloww` (`:8013`) | `VERIFIED` |
| `GET/POST /api/v1/academics/sessions/`, `/classes/`, `/class-subjects/`, `/milestones/` | `routes/academics.tsx`, `layouts/Header.tsx` | — | `VERIFIED` |
| `GET/POST/PATCH/DELETE /api/v1/timetable/entries/`, `/substitutions/` | `routes/timetable.tsx` | — | `VERIFIED` |
| `GET /api/v1/attendance/records/`, `POST /mark-bulk/`, `GET/POST /leaves/`, `POST /leaves/{id}/decide/` | `routes/attendance.tsx`, `routes/index.tsx` | `Portal-VidyaFloww` (`:8017`) | `VERIFIED` |
| `GET/POST /api/v1/teaching/lesson-plans/`, `/diary/`, `/resources/`, `/online-classes/` | `routes/teaching.tsx` | `LMS-VidyaFloww` (`:8019`), `E-Class-VidyaFloww` (`:8016`) | `VERIFIED` |
| `GET/POST /api/v1/homework/assignments/`, `/submissions/` | `routes/homework.tsx` | `Portal-VidyaFloww` (`:8017`) | `VERIFIED` |
| `GET/POST /api/v1/admissions/applications/`, `/approve/`, `/enroll/`, `/enquiries/` | Dashboard KPI | `Admissions-VidyaFloww` (`:8018`) | `VERIFIED` |
| `GET/POST /api/v1/examinations/cycles/`, `/lock/`, `/marks/` | `routes/statistics.tsx` | `Examinations-VidyaFloww` (`:8021`) | `VERIFIED` |
| `GET/POST /api/v1/finance/invoices/`, `POST /collect/`, `DELETE /receipts/{id}/`, `POST /reverse/`, `/scholarships/`, `/accounts/` | `routes/statistics.tsx` | `Payments-VidyaFloww` (`:8020`) | `VERIFIED` |
| `GET/POST/PATCH/DELETE /api/v1/operations/inventory/items/`, `/assets/`, `/front-office/visitors/`, `/events/`, `/activities/`, `/documents/` | `routes/operations.tsx` | `Design-VidyaFloww` (`:8010`), `Portal-VidyaFloww` (`:8017`) | `VERIFIED` |
| `GET/POST/PATCH/DELETE /api/v1/operations/library/books/`, `/transport/routes/`, `/hostel/allocations/`, `/certificates/*` | — | `Library` (`:8014`), `Transport` (`:8012`), `Hostel` (`:8011`), `Design` (`:8010`) | `VERIFIED` |
| `GET/POST /api/v1/engagement/health/visits/`, `/counselling/records/`, `/circulars/`, `/surveys/`, `/vote/`, `/complaints/`, `PATCH /complaints/{id}/` | `routes/operations.tsx`, `routes/complaints.tsx`, `routes/surveys.tsx` | `Communication-VidyaFloww` (`:8022`), `Portal-VidyaFloww` (`:8017`) | `VERIFIED` |
| `GET /api/v1/analytics/dashboard/`, `/statistics/`, `GET/POST /reports/`, `/compliance/`, `POST /ai/assist/`, `GET /subsystems/` | `routes/index.tsx`, `routes/statistics.tsx`, `routes/reports.tsx`, `components/AIChatDrawer.tsx`, `routes/teaching.tsx` | `LMS-VidyaFloww` (`:8019`) | `VERIFIED` |
| `GET /api/v1/portal/overview/` | — | `Portal-VidyaFloww` (`:8017`) | `VERIFIED` |
| `POST /api/v1/integrations/payment/webhook/`, `POST /api/v1/integrations/biometric/punch/` | Server-to-Server External Callbacks | Server-to-Server External Callbacks | `VERIFIED` (Sandbox HMAC) |
