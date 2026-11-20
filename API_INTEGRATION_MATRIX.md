# VIDYAFLOWW — API INTEGRATION MATRIX

> **Base URL**: `http://localhost:8000/api/v1` (env: `VITE_API_URL`)  
> **OpenAPI 3.1 Contract**: `docs/api/openapi.yaml` (validated with `--fail-on-warn`: **0 errors, 0 warnings**)  
> **Last Updated**: 2026-11-20 (Final Phase 7 Verification)

---

## 1. Root Cause Fixed in Phase 1

- **Previous Bug**: `packages/api/src/client.ts` configured `baseURL = 'http://localhost:8000/api/v1'` while `packages/constants/src/api.ts` prefixed endpoints with `/api/v1/`, causing HTTP 404 `/api/v1/api/v1/...`.
- **Resolution**: Implemented automatic `/api/v1` path deduplication in `packages/api/src/client.ts`, exported `extractApiList()`, `clearSessionTokens()`, `getTenantHeaders()`, `setTenantHeaders()`, and `registerAuthFailureHandler()` from both `packages/api/src/index.ts` and `packages/api/index.ts`, and verified in `apps/web/src/tests/api_and_store.test.ts`.

---

## 2. Frontend-to-Backend Endpoint Integration Matrix

| Domain | Endpoint(s) | Backend Status | Main Portal (`apps/web`) | Satellite App(s) | Verification |
|---|---|---|---|---|---|
| **Health** | `GET /health/` | `VERIFIED` | Ready | Ready | Live HTTP QA: `200 {'status': 'ok', 'database': 'ok', 'cache': 'ok'}` |
| **Auth** | `POST /auth/login/`, `/register/`, `/otp/request/`, `/otp/verify/`, `/password/reset/`, `/username/lookup/`, `/token/refresh/`, `/logout/`, `GET/PATCH /auth/me/` | `VERIFIED` | `VERIFIED` (`login.tsx`, `AppShell.tsx`, `Sidebar.tsx`, `Header.tsx`, `shortcuts.tsx`) | `VERIFIED` (all 12 via `SatelliteAuthStatus.tsx` + `apiClient.ts`) | `test_phase1_foundation.py` + Live HTTP QA |
| **Schools & Branches** | `GET/PATCH /schools/current/`, `GET/POST /schools/branches/`, `PATCH/DELETE /schools/branches/{id}/` | `VERIFIED` | `VERIFIED` (`settings.tsx`, `Header.tsx`) | Tenant headers (`X-School-ID`, `X-Branch-ID`) | `test_phase10_portal_integrations_security.py` |
| **Platform Billing** | `GET /platform/subscription/`, `POST /payment-method/`, `POST /cancel/` | `VERIFIED` | `VERIFIED` (`license.tsx`) | N/A | `test_phase1_foundation.py` + `test_phase7_8_9` |
| **Permissions & Security** | `GET/PATCH /permissions/policies/`, `GET/POST /responsibilities/`, `PATCH/DELETE /responsibilities/{id}/`, `GET /responsibilities/history/` | `VERIFIED` | `VERIFIED` (`security.tsx`, `globalStore.ts`) | Enforced server-side on all writes | `test_phase1_foundation.py` + `test_phase11_security_idor_rbac.py` |
| **Audit & Storage** | `GET /audit/events/`, `GET/POST /storage/files/`, `GET /storage/files/{id}/download/` | `VERIFIED` | `VERIFIED` (`audit.tsx`) | Audit events recorded server-side | `test_phase1_foundation.py` |
| **Notifications** | `GET /notifications/`, `POST /notifications/mark-all-read/` | `VERIFIED` | `VERIFIED` (`NotificationsPanel.tsx`, `AppShell.tsx`) | N/A | `test_phase1_foundation.py` |
| **Academics** | `GET/POST /academics/sessions/`, `/classes/`, `/classes/{id}/`, `/class-subjects/`, `/milestones/` | `VERIFIED` | `VERIFIED` (`academics.tsx`, `Header.tsx`) | N/A | `test_phase2_core_data.py` |
| **Staff & HR** | `GET/POST /staff/`, `GET/PATCH/DELETE /staff/{id}/`, `/dossier-fields/` | `VERIFIED` | `VERIFIED` (`teachers.tsx`, `CommandPalette.tsx`) | `VERIFIED` (`HRM-VidyaFloww`) | `test_phase2_core_data.py` |
| **Students** | `GET/POST /students/`, `GET/PATCH/DELETE /students/{id}/`, `/promote/`, `/withdraw/`, `/readmit/`, `/dossier-fields/` | `VERIFIED` | `VERIFIED` (`students.tsx`, `CommandPalette.tsx`) | `VERIFIED` (`Design-VidyaFloww`, `Portal-VidyaFloww`) | `test_phase2_core_data.py` + `test_phase11` |
| **Admissions** | `GET/POST /admissions/enquiries/`, `/applications/`, `/approve/`, `/enroll/` | `VERIFIED` | Dashboard KPI count | `VERIFIED` (`Admissions-VidyaFloww`) | `test_phase2_core_data.py` |
| **Timetable** | `GET/POST /timetable/entries/`, `/entries/{id}/`, `/substitutions/` | `VERIFIED` | `VERIFIED` (`timetable.tsx`) | N/A | `test_phase3_academic_operations.py` |
| **Attendance** | `GET /attendance/records/`, `POST /mark-bulk/`, `GET/POST /leaves/`, `POST /leaves/{id}/decide/` | `VERIFIED` | `VERIFIED` (`attendance.tsx`, `index.tsx`) | `VERIFIED` (`Portal-VidyaFloww`) | `test_phase3_academic_operations.py` |
| **Teaching / LMS** | `GET/POST /teaching/lesson-plans/`, `/lesson-plans/{id}/`, `/diary/`, `/resources/`, `/online-classes/` | `VERIFIED` | `VERIFIED` (`teaching.tsx`) | `VERIFIED` (`LMS-VidyaFloww`, `E-Class-VidyaFloww`) | `test_phase3_academic_operations.py` |
| **Homework** | `GET/POST /homework/assignments/`, `/assignments/{id}/`, `/submissions/` | `VERIFIED` | `VERIFIED` (`homework.tsx`) | `VERIFIED` (`Portal-VidyaFloww`) | `test_phase3_academic_operations.py` |
| **Examinations** | `GET/POST /examinations/cycles/`, `/cycles/{id}/lock/`, `/marks/` | `VERIFIED` | Statistics pass rate | `VERIFIED` (`Examinations-VidyaFloww`) | `test_phase3_academic_operations.py` + `test_phase11` |
| **Finance & Accounting** | `GET/POST /finance/invoices/`, `/collect/`, `/receipts/{id}/`, `/receipts/{id}/reverse/`, `/scholarships/`, `/accounts/` | `VERIFIED` | Dashboard/Stats telemetry | `VERIFIED` (`Payments-VidyaFloww`) | `test_phase4_finance.py` + `test_phase10` |
| **School Operations (11 Resources)** | `GET/POST` + `GET/PATCH/DELETE <uuid:pk>/` on `certificates/templates`, `certificates/issued`, `documents`, `library/books`, `transport/routes`, `hostel/allocations`, `inventory/items`, `assets`, `events`, `activities`, `front-office/visitors` | `VERIFIED` | Dashboard/Events | `VERIFIED` (`Design`, `Library`, `Transport`, `Hostel`, `HRM`) | `test_phase5`, `test_phase10`, `test_phase11`, Live HTTP QA |
| **Engagement** | `GET/POST /engagement/health/visits/`, `/counselling/records/`, `/circulars/`, `/surveys/`, `/surveys/{id}/vote/`, `/complaints/`, `PATCH /complaints/{id}/` | `VERIFIED` | `VERIFIED` (`complaints.tsx`, `surveys.tsx`) | `VERIFIED` (`Communication-VidyaFloww`, `Portal-VidyaFloww`) | `test_phase6_engagement_and_support.py` + `test_phase11` |
| **Analytics & AI** | `GET /analytics/dashboard/`, `/statistics/`, `GET/POST /reports/`, `/compliance/`, `POST /ai/assist/`, `GET /subsystems/` | `VERIFIED` | `VERIFIED` (`index.tsx`, `statistics.tsx`, `reports.tsx`, `AIChatDrawer.tsx`, `teaching.tsx`) | `VERIFIED` (`LMS-VidyaFloww`, port registry `8010–8022`) | `test_phase7_8_9`, `test_phase10`, `test_phase11`, Live HTTP QA |
| **Portal (Parent/Student)** | `GET /portal/overview/` | `VERIFIED` | N/A | `VERIFIED` (`Portal-VidyaFloww`) | `test_phase10`, `test_phase11`, Live HTTP QA |
| **Integrations** | `POST /integrations/payment/webhook/`, `POST /integrations/biometric/punch/`, SMS/WhatsApp/Webhook service adapters | `VERIFIED (Sandbox)` | N/A | Backend services | `test_phase10_portal_integrations_security.py` |
