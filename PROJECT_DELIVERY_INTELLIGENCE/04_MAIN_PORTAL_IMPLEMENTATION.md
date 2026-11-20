# 04 — MAIN COMMAND PORTAL IMPLEMENTATION (`apps/web` & `@vidyafloww/*`)

> **Location**: `E:\E\VidyaMaxx\VidyaMaxx\apps\web` + `packages/api` + `packages/constants`  
> **Stack**: React 19, TypeScript, Vite 5.4, TanStack Router, Zustand, Axios, TailwindCSS, Vitest

---

## 1. Shared Packages Fixed (`packages/api` & `packages/constants`)

1. **`packages/api/src/client.ts`, `packages/api/src/index.ts`, `packages/api/index.ts`**:
   - Fixed the root-cause **double `/api/v1/api/v1/` URL prefix bug** via `normalizeUrl()` in the Axios request interceptor so both `/students/` and `/api/v1/students/` cleanly resolve to `http://localhost:8000/api/v1/students/`.
   - Added `extractApiList<T>(response)` to reliably unwrap Django REST responses regardless of whether they arrive as bare arrays, `{ data: [...] }`, or `{ results: [...] }`.
   - Added session/tenant persistence helpers: `setAuthToken()`, `getAuthToken()`, `setTenantHeaders()`, `getTenantHeaders()` (`sessionStorage` keys `vf_active_school_id` & `vf_active_branch_id`), `clearSessionTokens()`, and `registerAuthFailureHandler()`.
   - Synchronized root `packages/api/index.ts` (used by Vite/Rollup) with `packages/api/src/index.ts` (used by `tsup` / TypeScript).
   - Automatic `401` interceptor triggers `POST /auth/token/refresh/` with `withCredentials: true` and replays the failed request seamlessly.

2. **`packages/constants/src/subsystems.ts`**:
   - Aligned all 12 decoupled satellite app local URLs & ports to match each satellite's actual `package.json` dev script (`8010–8022`), eliminating 6 broken cross-app launch links.

---

## 2. Global Auth, Tenancy & Shell Wiring (`apps/web/src/`)

| File | Key Changes Delivered |
|---|---|
| `stores/globalStore.ts` | Added `authStatus`, `currentUser`, `activeMembership`, `memberships`, `responsibilities`, `branches`, `activeBranchId`, `academicSessionRecords`, `setAuthSession()`, `clearAuthSession()`, `hasDivisionAccess()`, and `setNotificationsFromServer()`. |
| `layouts/AppShell.tsx` | Bootstraps authentication on page load via `POST /auth/token/refresh/` + `GET /auth/me/`, hydrates `/schools/current/`, `/schools/branches/`, `/academics/sessions/`, and `/notifications/`, and redirects unauthenticated sessions cleanly to `/login`. |
| `layouts/Sidebar.tsx` | Replaced hardcoded `Roshan Singh (Super Admin)` with live authenticated user name & role; Logout button now invokes `POST /auth/logout/`, clears session tokens & Zustand auth state, and navigates to `/login`. |
| `layouts/Header.tsx` | Populates academic session selector from live `/academics/sessions/`, adds live multi-branch switcher (updating `X-Branch-ID`), and persists language toggle (`en`/`hi`) via `PATCH /auth/me/`. |
| `layouts/NotificationsPanel.tsx` | Fetches live notifications via `GET /notifications/` when opened and persists `POST /notifications/mark-all-read/`. |
| `components/AIChatDrawer.tsx` | Deleted hardcoded `KNOWLEDGE_RESPONSES` and `setTimeout`; wired directly to `POST /analytics/ai/assist/` backed by live school database telemetry. |
| `layouts/CommandPalette.tsx` | Added debounced live search querying `GET /students/?search=` and `GET /staff/?search=` alongside module shortcuts. |
| `routes/login.tsx` | Removed fake offline bypass & simulated Google SSO bypass; wired real Login (`/auth/login/`), 4-step Signup (`/auth/register/` + `/auth/otp/verify/`), Forgot Password (`/auth/otp/request/` + `/auth/otp/verify/` + `/auth/password/reset/`), and Forgot Username (`/auth/otp/request/` + `/auth/otp/verify/` + `/auth/username/lookup/`). |

---

## 3. Main Command Portal Routes Wired (`apps/web/src/routes/`)

All 17 operational routes were updated to use `extractApiList(res)` (fixing the systemic `Array.isArray(res?.data)` bug) and wired to live REST endpoints with real error notifications:

- **`index.tsx` (Command Dashboard)**: Binds live KPIs and real `attendance_exceptions` from `GET /analytics/dashboard/`; persists KPI card & section ordering via `PATCH /auth/me/`.
- **`statistics.tsx` (Institutional BI)**: Renders live database aggregations from `GET /analytics/statistics/`.
- **`audit.tsx` (Immutable Audit Trail)**: Removed `INITIAL_AUDIT_LOGS` and the fake 6-second `setInterval` random log generator; queries live `GET /audit/events/` with filters.
- **`license.tsx` (SaaS License & Billing)**: Removed `INVOICE_HISTORY` and simulated `setTimeout` payment; renders live subscription & invoices from `GET /platform/subscription/` and updates card via `POST /platform/subscription/payment-method/`.
- **`settings.tsx` (School Settings & Branches)**: Loads live branches via `GET /schools/branches/`; wires branch create (`POST`), edit (`PATCH`), delete (`DELETE`), and school profile `PATCH /schools/current/`.
- **`security.tsx` (Security & Responsibilities)**: Loads live `SecurityPolicy` and `StaffResponsibilityAssignment` records; wires revocation (`DELETE /permissions/responsibilities/{id}/`) and policy `PATCH`.
- **`shortcuts.tsx` (Dashboard Shortcuts)**: Fixed payload key (`preferences` instead of `preferences_json`) on `PATCH /auth/me/`.
- **`students.tsx` & `teachers.tsx`**: Wired live directory fetch, creation, edit, deletion, lifecycle operations, and custom dossier configurations.
- **`academics.tsx`, `timetable.tsx`, `attendance.tsx`**: Wired live classes/subjects/milestones, timetable entry CRUD + conflict handling + `ProxySubstitution` (`/timetable/substitutions/`), bulk mark-all-present (`POST /attendance/mark-bulk/`), and leave approval/rejection (`POST /attendance/leaves/{id}/decide/`).
- **`teaching.tsx`, `homework.tsx`, `complaints.tsx`, `surveys.tsx`, `reports.tsx`**: Wired live lesson plans + real AI generator (`POST /analytics/ai/assist/`), homework creation, grievance ticket creation & resolution (`PATCH /engagement/complaints/{id}/`), survey creation & voting, and report generation (`POST /analytics/reports/`).
