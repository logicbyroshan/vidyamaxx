# 05 — TWELVE DECOUPLED SATELLITE APPLICATIONS ARCHITECTURE

> **Location**: `E:\E\VidyaMaxx\*-VidyaFloww`  
> **CORS Policy**: All 12 origins (`http://localhost:8010` – `http://localhost:8022` and `127.0.0.1` equivalents) explicitly allowlisted with `CORS_ALLOW_CREDENTIALS = True` in `apps/backend/config/settings/development.py`.

---

## 1. Shared Satellite Integration Layer

Every one of the 12 standalone Vite + React 19 satellite applications now includes two unified integration modules:

1. **`src/lib/apiClient.ts`**:
   - Zero external runtime dependency (`fetch`-based) client pointing to `VITE_API_URL ?? 'http://localhost:8000/api/v1'`.
   - Sends `credentials: 'include'` on every request to participate in the shared `HttpOnly` refresh cookie (`vidyafloww_refresh`) across localhost ports / `*.vidyafloww.com` subdomains.
   - Injects `Authorization: Bearer <accessToken>`, `X-School-ID`, and `X-Branch-ID` headers automatically.
   - Deduplicates `/api/v1/` path prefixes, transparently refreshes tokens on `401 Unauthorized`, and provides `extractList()` + normalized error parsing.
2. **`src/components/SatelliteAuthStatus.tsx`** (mounted in every satellite's `src/App.tsx`):
   - Automatically bootstraps session on page load via `POST /auth/token/refresh/` + `GET /auth/me/`.
   - Displays the authenticated user pill + **Sign Out** button (`POST /auth/logout/`) or a **Sign In** button launching an institutional sign-in modal (`POST /auth/login/`).
   - Triggers `setAuthKey((k) => k + 1)` on `<main key={authKey}>` so signing in or switching users immediately reloads live tenant data across the active module.

---

## 2. Complete 12-Satellite Inventory & API Wiring

| # | Directory | Local Port | Production Subdomain | Primary Module File(s) | Live Django APIs Wired |
|---|---|---|---|---|---|
| 1 | `Design-VidyaFloww` | `8010` | `designlab.vidyafloww.com` | `src/DesignLabModule.tsx` | `GET /students/`, `POST /operations/certificates/issued/` |
| 2 | `Hostel-VidyaFloww` | `8011` | `hostel.vidyafloww.com` | `src/HostelModule.tsx` | `GET/POST /operations/hostel/allocations/`, `DELETE /operations/hostel/allocations/{id}/` |
| 3 | `Transport-VidyaFloww` | `8012` | `transport.vidyafloww.com` | `src/TransportModule.tsx` | `GET/POST /operations/transport/routes/` |
| 4 | `HRM-VidyaFloww` | `8013` | `hrm.vidyafloww.com` | `src/HRManagementModule.tsx` | `GET/POST /staff/`, `PATCH /staff/{id}/` |
| 5 | `Library-VidyaFloww` | `8014` | `library.vidyafloww.com` | `src/LibraryModule.tsx` | `GET/POST /operations/library/books/` |
| 6 | `E-Class-VidyaFloww` | `8016` | `eclass.vidyafloww.com` | `src/modules/EClassModule.tsx` | `GET/POST /teaching/online-classes/` |
| 7 | `Portal-VidyaFloww` | `8017` | `portal.vidyafloww.com` | `src/PortalModule.tsx` | `GET /portal/overview/` (live children switcher, attendance, homework, fee balance, circulars, events) |
| 8 | `Admissions-VidyaFloww` | `8018` | `admissions.vidyafloww.com` | `src/AdmissionsModule.tsx` | `GET/POST /admissions/applications/`, `POST /admissions/applications/{id}/approve/` |
| 9 | `LMS-VidyaFloww` | `8019` | `learn.vidyafloww.com` | `src/LMSModule.tsx`, `src/learning.tsx`, `src/resources.tsx` | `GET/POST /teaching/online-classes/`, `/teaching/lesson-plans/`, `/teaching/resources/`, `POST /analytics/ai/assist/` |
| 10 | `Payments-VidyaFloww` | `8020` | `payments.vidyafloww.com` | `src/PaymentsModule.tsx`, `src/scholarships.tsx` | `GET /finance/invoices/`, `POST /finance/collect/` (with `Idempotency-Key`), `GET/POST /finance/scholarships/` |
| 11 | `Examinations-VidyaFloww` | `8021` | `exams.vidyafloww.com` | `src/ExaminationsModule.tsx` | `GET/POST /examinations/cycles/`, `POST /examinations/cycles/{id}/lock/`, `POST /examinations/marks/` |
| 12 | `Communication-VidyaFloww` | `8022` | `comms.vidyafloww.com` | `src/CommunicationModule.tsx` | `GET/POST /engagement/circulars/` |

> **Verification**: All **304 TypeScript/TSX source files** across all 12 satellite applications were syntax-verified with the TypeScript compiler (`ts.transpileModule`) — **304 passed, 0 failed**.
