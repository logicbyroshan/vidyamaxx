# VIDYAFLOWW — MASTER FEATURE IMPLEMENTATION MATRIX

> **Status Legend**: `NOT INSPECTED` | `MISSING` | `MOCK ONLY` | `PARTIAL` | `BLOCKED` | `IMPLEMENTED` | `VERIFIED`  
> **Last Updated**: 2026-11-20 (Final Phase 7 Sign-Off)

---

## 1. Cross-Cutting Platform & Main Portal Shell (`apps/web`)

| Feature | Frontend App | Route / File | Backend App | API Endpoints | Status | Verification Evidence |
|---|---|---|---|---|---|---|
| **Login, Signup, OTP, Reset, Username Lookup** | `apps/web` | `/login` (`routes/login.tsx`) | `core.authentication`, `core.accounts` | `/auth/login/`, `/register/`, `/otp/request/`, `/otp/verify/`, `/password/reset/`, `/username/lookup/`, `/token/refresh/`, `/logout/`, `/me/` | `VERIFIED` | Fake offline & SSO bypasses removed; all 4 flows wired; verified via `test_phase1_foundation.py` + live HTTP QA (`login` -> `refresh` -> `me` -> `logout`). |
| **Session Bootstrap, Tenant/Branch Context & Preferences** | `apps/web` | `layouts/AppShell.tsx`, `stores/globalStore.ts`, `layouts/Header.tsx`, `layouts/Sidebar.tsx` | `core.authentication`, `core.organizations`, `core.campuses`, `modules.academics` | `POST /auth/token/refresh/`, `GET/PATCH /auth/me/`, `GET /schools/current/`, `/schools/branches/`, `/academics/sessions/` | `VERIFIED` | Live session bootstrap, real authenticated user profile, multi-branch `X-Branch-ID` switcher, language PATCH persistence, real logout; `api_and_store.test.ts` + `tsc`/`vite build` pass. |
| **Notifications Drawer** | `apps/web` | `layouts/NotificationsPanel.tsx` | `platform_services.notifications` | `GET /notifications/`, `POST /notifications/mark-all-read/` | `VERIFIED` | Fetches live server notifications on open & persists mark-all-read. |
| **AI Copilot Drawer** | `apps/web` | `components/AIChatDrawer.tsx` | `modules.analytics` | `POST /analytics/ai/assist/` | `VERIFIED` | Hardcoded responses & `setTimeout` removed; backed by live DB telemetry; live HTTP QA verified 200 OK. |
| **Global Command Palette (Ctrl+K)** | `apps/web` | `layouts/CommandPalette.tsx` | `modules.students`, `modules.hr` | `GET /students/?search=`, `GET /staff/?search=` | `VERIFIED` | Debounced live search wired against student & staff directories. |

---

## 2. Main Command Portal Routes (`apps/web/src/routes/`)

| Feature | Route / File | Backend App | Key API Endpoints | Status | Verification Evidence |
|---|---|---|---|---|---|
| **Executive Command Dashboard** | `/` (`index.tsx`) | `modules.analytics`, `modules.attendance` | `GET /analytics/dashboard/`, `PATCH /auth/me/` | `VERIFIED` | Live ORM KPIs & real `attendance_exceptions`; KPI/section order persisted via `PATCH /auth/me/`; live HTTP QA verified 200 OK. |
| **Institutional Statistics (BI)** | `/statistics` (`statistics.tsx`) | `modules.analytics` | `GET /analytics/statistics/` | `VERIFIED` | Hardcoded metrics replaced with live ORM aggregations (`total_marks`/`max_total_marks` pass rate verified in `test_phase11_security_idor_rbac.py` + live HTTP QA). |
| **Student 360° & Lifecycle** | `/students` (`students.tsx`) | `modules.students` | `/students/`, `/students/{id}/`, `/promote/`, `/withdraw/`, `/readmit/`, `/dossier-fields/` | `VERIFIED` | Fixed `/api/v1` path & `extractApiList` unwrapping; full CRUD + lifecycle wired; `test_phase2_core_data.py` + build pass. |
| **Teachers & Staff Directory** | `/teachers` (`teachers.tsx`) | `modules.hr` | `/staff/`, `/staff/{id}/`, `/dossier-fields/` | `VERIFIED` | Fixed `extractApiList` & CRUD wiring; `test_phase2_core_data.py` + build pass. |
| **Academics & Curricula** | `/academics` (`academics.tsx`) | `modules.academics` | `/academics/sessions/`, `/classes/`, `/class-subjects/`, `/milestones/` | `VERIFIED` | Fixed `extractApiList` & full class/subject/milestone wiring; `test_phase2_core_data.py` pass. |
| **Timetable & Substitutions** | `/timetable` (`timetable.tsx`) | `modules.timetable` | `/timetable/entries/`, `/entries/{id}/`, `/substitutions/` | `VERIFIED` | Wired entry CRUD, 409 conflict alerts, and `ProxySubstitution` API; `test_phase3_academic_operations.py` pass. |
| **Attendance & Leaves** | `/attendance` (`attendance.tsx`) | `modules.attendance` | `/attendance/records/`, `/mark-bulk/`, `/leaves/`, `/leaves/{id}/decide/` | `VERIFIED` | Wired live roster, transactional bulk mark-all-present, and leave approve/reject; `test_phase3_academic_operations.py` pass. |
| **Teaching Workspace** | `/teaching` (`teaching.tsx`) | `modules.lms`, `modules.analytics` | `/teaching/lesson-plans/`, `/teaching/diary/`, `/analytics/ai/assist/` | `VERIFIED` | Replaced fake AI `setTimeout` with real `POST /analytics/ai/assist/` + lesson plan CRUD. |
| **Homework & Submissions** | `/homework` (`homework.tsx`) | `modules.homework` | `/homework/assignments/`, `/assignments/{id}/`, `/submissions/` | `VERIFIED` | Wired live assignments load & creation; `test_phase3_academic_operations.py` pass. |
| **Complaints & Grievances** | `/complaints` (`complaints.tsx`) | `modules.discipline` | `/engagement/complaints/`, `PATCH /engagement/complaints/{id}/` | `VERIFIED` | Wired live ticket creation and resolution PATCH; `test_phase6_engagement_and_support.py` pass. |
| **Surveys & Polls** | `/surveys` (`surveys.tsx`) | `platform_services.forms` | `/engagement/surveys/`, `/engagement/surveys/{id}/vote/` | `VERIFIED` | Wired live survey creation & atomic vote counts; `test_phase6_engagement_and_support.py` pass. |
| **Reports & Compliance** | `/reports` (`reports.tsx`) | `platform_services.reports`, `modules.analytics` | `/analytics/reports/`, `/analytics/compliance/` | `VERIFIED` | Real DB row counts computed server-side; generated reports persisted via `POST /analytics/reports/`. |
| **School Settings & Branches** | `/settings` (`settings.tsx`) | `core.organizations`, `core.campuses` | `GET/PATCH /schools/current/`, `GET/POST /schools/branches/`, `PATCH/DELETE /schools/branches/{id}/` | `VERIFIED` | Full multi-branch CRUD (primary branch deletion guarded); verified in `test_phase10_portal_integrations_security.py`. |
| **Security & Responsibilities** | `/security` (`security.tsx`) | `core.permissions` | `/permissions/policies/`, `/permissions/responsibilities/`, `DELETE /responsibilities/{id}/` | `VERIFIED` | Loads live `SecurityPolicy` & `StaffResponsibilityAssignment`, wires revoke & policy updates. |
| **Immutable Audit Trail** | `/audit` (`audit.tsx`) | `platform_services.audit` | `GET /audit/events/` | `VERIFIED` | Fake 6s `setInterval` generator deleted; live server-side audit query with filters. |
| **SaaS License & Billing** | `/license` (`license.tsx`) | `core.organizations` | `GET /platform/subscription/`, `POST /payment-method/`, `POST /cancel/` | `VERIFIED` | Fake `setTimeout` payment removed; wired live subscription, invoices, card update & Super Admin cancel guard. |
| **Quick Shortcuts Config** | `/shortcuts` (`shortcuts.tsx`) | `core.authentication` | `PATCH /auth/me/` | `VERIFIED` | Fixed payload key (`preferences`) for reliable server persistence. |

---

## 3. Twelve Decoupled Satellite Applications (`E:\E\VidyaMaxx\*-VidyaFloww`)

All 12 standalone satellite apps share `src/lib/apiClient.ts` (HttpOnly refresh rotation + JWT Bearer + `X-School-ID`/`X-Branch-ID`) and `<SatelliteAuthStatus />` header authentication controls with automatic module reload on auth change, plus verified CORS allowlist (`localhost:8010–8022`) in `config/settings/development.py`.

| # | Satellite App | Port | Work Division(s) | Wired Backend Endpoints | Status | Verification Evidence |
|---|---|---|---|---|---|---|
| 1 | `Admissions-VidyaFloww` | `8018` | #1 Admissions | `GET/POST /admissions/applications/`, `POST /admissions/applications/{id}/approve/` | `VERIFIED` | Wired in `AdmissionsModule.tsx` + `App.tsx`; TS/TSX transpile 0 errors; backend `test_phase2_core_data.py` pass. |
| 2 | `Payments-VidyaFloww` | `8020` | #11 Fees & Finance | `GET /finance/invoices/`, `POST /finance/collect/` (with `Idempotency-Key`), `GET/POST /finance/scholarships/` | `VERIFIED` | Wired in `PaymentsModule.tsx` & `scholarships.tsx` + `App.tsx`; TS/TSX 0 errors; backend `test_phase4_finance.py` pass. |
| 3 | `Examinations-VidyaFloww` | `8021` | #8 Examinations | `GET/POST /examinations/cycles/`, `POST /examinations/cycles/{id}/lock/`, `POST /examinations/marks/` | `VERIFIED` | Wired in `ExaminationsModule.tsx` + `App.tsx`; TS/TSX 0 errors; backend `test_phase3_academic_operations.py` pass. |
| 4 | `Communication-VidyaFloww` | `8022` | #21 Communication | `GET/POST /engagement/circulars/` | `VERIFIED` | Wired in `CommunicationModule.tsx` + `App.tsx`; TS/TSX 0 errors; backend `test_phase6_engagement_and_support.py` pass. |
| 5 | `LMS-VidyaFloww` | `8019` | #6 Teaching, #9 Resources, #10 Online Classes | `GET/POST /teaching/online-classes/`, `/teaching/lesson-plans/`, `/teaching/resources/`, `POST /analytics/ai/assist/` | `VERIFIED` | Fixed `LMSPage` export & relative hook paths; wired `LMSModule.tsx`, `learning.tsx`, `resources.tsx`; TS/TSX 0 errors. |
| 6 | `Portal-VidyaFloww` | `8017` | Parent & Student Portal | `GET /portal/overview/` | `VERIFIED` | Dedicated guardian/student-scoped backend endpoint created & wired in `PortalModule.tsx`; strict parent isolation verified in `test_phase10` + live HTTP QA. |
| 7 | `Design-VidyaFloww` | `8010` | #12 Documents & Certificates | `GET /students/`, `POST /operations/certificates/issued/` | `VERIFIED` | Wired live student binding & real certificate batch persistence in `DesignLabModule.tsx`; TS/TSX 0 errors. |
| 8 | `Hostel-VidyaFloww` | `8011` | #15 Hostel | `GET/POST /operations/hostel/allocations/`, `DELETE /operations/hostel/allocations/{id}/` | `VERIFIED` | Wired live allocation CRUD & vacate DELETE in `HostelModule.tsx`; IDOR isolation verified in `test_phase11`. |
| 9 | `Transport-VidyaFloww` | `8012` | #14 Transport | `GET/POST /operations/transport/routes/` | `VERIFIED` | Wired live route load & creation in `TransportModule.tsx`; full CRUD verified in live HTTP QA. |
| 10 | `HRM-VidyaFloww` | `8013` | #18 Staff & HR | `GET/POST /staff/`, `PATCH /staff/{id}/` | `VERIFIED` | Wired live staff load, edit PATCH & onboarding POST in `HRManagementModule.tsx`; TS/TSX 0 errors. |
| 11 | `Library-VidyaFloww` | `8014` | #13 Library | `GET/POST /operations/library/books/` | `VERIFIED` | Wired live catalog hydration & book creation in `LibraryModule.tsx`; CRUD verified in `test_phase10`. |
| 12 | `E-Class-VidyaFloww` | `8016` | #10 Online Classes | `GET/POST /teaching/online-classes/` | `VERIFIED` | Wired live sessions load & schedule POST in `EClassModule.tsx` + `App.tsx`; TS/TSX 0 errors. |

---

## 4. External Integrations (`apps/backend/integrations/*`)

| Adapter | Endpoint / Service | Status | Notes |
|---|---|---|---|
| **Payment Gateway (Razorpay/Cashfree)** | `integrations/payment/services.py`, `POST /api/v1/integrations/payment/webhook/` | `VERIFIED (Sandbox)` / `BLOCKED (Live Keys)` | Order creation + HMAC-SHA256 verified idempotent webhook -> `collect_fee_payment()` verified in `test_phase10`. |
| **Biometric Turnstile Ingestion** | `integrations/biometric/services.py`, `POST /api/v1/integrations/biometric/punch/` | `VERIFIED (Sandbox)` / `BLOCKED (Hardware)` | HMAC-SHA256 verified idempotent punch -> `StudentAttendanceRecord` verified in `test_phase10`. |
| **TRAI DLT SMS (MSG91)** | `integrations/sms/services.py` (`send_dlt_sms`) | `VERIFIED (Sandbox)` / `BLOCKED (Live Key)` | Sandbox dispatch verified in `test_phase10`; live dispatch activates when `MSG91_AUTH_KEY` is configured. |
| **WhatsApp Cloud API (Meta HSM)** | `integrations/whatsapp/services.py` (`send_whatsapp_template`) | `VERIFIED (Sandbox)` / `BLOCKED (Live Token)` | Sandbox dispatch verified in `test_phase10`; live dispatch activates when `WHATSAPP_CLOUD_TOKEN` is configured. |
| **Signed Outbound Webhooks** | `integrations/webhook/services.py` (`dispatch_signed_webhook`) | `VERIFIED` | HMAC-SHA256 signature generation + exponential retry backoff verified in `test_phase10`. |
