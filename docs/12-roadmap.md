# 12 — Roadmap

## Phase 1 — Foundation ✅ (Completed)

- [x] Monorepo scaffold with TurboRepo + pnpm
- [x] Backend app structure (Django 5, DRF, Channels, Celery)
- [x] Frontend app structure (React 19, Vite, TypeScript)
- [x] Mobile app structure (Expo, React Native)
- [x] Desktop app structure (Electron, React)
- [x] Shared packages (`api`, `ui`, `types`, `validation`, `constants`, `icons`)
- [x] Docker Compose for local development
- [x] GitHub Actions CI/CD pipeline
- [x] Documentation framework (13 docs)

## Phase 1.5 — Industry-Standard Design System & UX ✅ (Completed)

- [x] **Radix UI Primitives Integration** (`@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-tabs`, `@radix-ui/react-popover`, `@radix-ui/react-tooltip`)
- [x] **Framer Motion Animations** (`framer-motion` scale-in modal transitions, right-sliding drawers, backdrop blurs)
- [x] **TanStack Table Data Grid** (`@tanstack/react-table` v9 powering `VFDataTable` with sorting, global filtering, and column visibility)
- [x] **Recharts BI Analytics Engine** (`recharts` powering `VFAreaChart`, `VFBarChart`, and `VFPieChart` with dark theme tooltips & gradient fills)
- [x] **cmdk Search & Command Palette** (`cmdk` powering `CommandPalette.tsx` with `⌘K` keyboard navigation across 24 ERP modules)
- [x] **Sonner Toast System** (`sonner` powering `ToastContainer.tsx` with global Zustand store notifications)
- [x] **Lenis Smooth Physics Scrolling** (`lenis` instances on `<main>` viewport in `AppShell.tsx` and sidebar navigation in `Sidebar.tsx`)
- [x] **Sofia Sans Fluid Typography** (`clamp(15px, 0.3vw + 12px, 18px)`) with crisp letter-spacing (`0.015em`)
- [x] **Single Viewport & Non-Passive Tabbar Wheel Scroll** (isolated horizontal wheel scroll preventing vertical page scroll conflicts)
- [x] **Submodule Tabbar Auto-Centering** (`scrollIntoView({ inline: 'center' })` auto-focus on active tabs)
- [x] **Header Navigation Upgrade** (`Welcome,` + school logo image + `Springfield Academy`)

## Phase 1.6 — 24-Module Architecture & Motion System ✅ (Completed)

- [x] **Single Source Navigation Registry** (`MODULE_REGISTRY` in `packages/constants/src/navigation.ts` storing 24 main modules & submodules)
- [x] **24 Main Business Modules Architecture** (`Dashboard`, `Admissions`, `Students`, `Academics`, `Timetable`, `Attendance`, `Examination`, `Fees`, `Finance`, `HR & Payroll`, `Library`, `Transport`, `Hostel`, `Inventory & Assets`, `Homework & Learning`, `Documents & Certificates`, `Communication`, `Events & Activities`, `Front Office & Enquiries`, `School Administration`, `Parent & Student Portal`, `Reports & Analytics`, `Security & Audit`, `System Administration`)
- [x] **Global `VidyaFloww AI` Assistant** (Prominent button in sidebar footer directly above user profile card, context-aware global AI Chat drawer `AIChatDrawer.tsx`, `Shift+K` shortcut)
- [x] **Submodule Workspace Layout** (Sidebar renders main modules only, top `VFTabs` mounts submodules)
- [x] **Framer Motion Revealing Transitions** (Staggered revealing fade & slide-up animation on route navigation & submodule tab switching)
- [x] **Fail-Safe Dual-Engine Data Tables** (Combined TanStack Table v9 + fail-safe rendering engine ensuring 100% data visibility, search filtering, column toggles, and pagination)
- [x] **Backward Compatibility Forwarding** (`/finance` ➔ `/fees`, `/lms` ➔ `/learning`, `/settings` ➔ `/administration`, `/ai` ➔ global AI drawer)

## Phase 2 — Core Authentication & Multi-Tenancy

- [x] Web login page and client auth flow (`/login`)
- [ ] Backend custom `User` model with institutional roles (`core.accounts.User`)
- [ ] Backend SimpleJWT login, token refresh, and blacklist endpoints
- [ ] Multi-tenant `Organization` and `Campus` persistence models
- [ ] Tenant isolation middleware (`TenantMiddleware` & `TenantQuerySet`)
- [ ] User invitation and onboarding lifecycle
- [ ] Role-based permission system (RBAC scopes)
- [ ] Mobile authentication screens

## Phase 3 — Student & Academic Management

- [x] Student 360° Directory & Profiles (`/students`)
- [x] Admissions & Intake Queue (`/admissions`)
- [x] Academics & Curriculum Module (`/academics`)
- [x] Timetable & Scheduling Engine (`/timetable`)
- [x] Attendance & Biometrics Dashboard (`/attendance`)
- [x] Faculty Teaching Workspace (`/teaching`)
- [x] Homework & Learning Module (`/homework`, `/learning`)
- [x] Virtual Live Classrooms & Studio (`/e-class`, `/live-room`)

## Phase 4 — Examinations & Assessments

- [x] Examination Datesheet Schedule (`/examinations` Tab 1)
- [x] Subject Marks Allocation & Grading Scale (`/examinations` Tab 2)
- [x] Per-Student Marks Ledger & Lockable Register (`/examinations` Tab 3)
- [ ] Backend exam results calculation service
- [ ] Automated CBSE PDF report card generator

## Phase 5 — Fees & Finance

- [x] Fees & Student Accounts Module (`/fees`)
- [x] Staff Salary & Payroll Processing (Unified into Standalone HR Subsystem: `/hr-manage`)
- [x] Scholarship Grants & Disbursements (`/scholarships`)
- [ ] Payment gateway integration (Razorpay / Stripe)
- [ ] Automated fee receipt generation

## Phase 6 — Communication & Governance

- [x] Institutional Notice Publisher with 2-Tab Wizard (`/notices`)
- [x] Grievance Redressal SLA Queue (`/complaints`)
- [x] Community Feedback & NPS Surveys (`/surveys`)
- [ ] Real-time notifications (Django Channels + WebSocket)
- [ ] WhatsApp broadcasting gateway

## Phase 7 — Advanced Subsystems Decoupling & In-Portal Dashboards ✅

- [x] Decouple **Design Lab** into standalone repo (`designlab.vidyafloww.com`) + build in-portal overview dashboard (`/design-lab`)
- [x] Decouple **Hostel Management** into standalone repo (`hostel.vidyafloww.com`) + build in-portal overview dashboard (`/hostel`)
- [x] Decouple **Transport Management** into standalone repo (`transport.vidyafloww.com`) + build in-portal overview dashboard (`/transport`)
- [x] Decouple **HR Management** into standalone repo (`hr.vidyafloww.com`) + build in-portal overview dashboard (`/hr-manage`)
- [x] Decouple **E-Library Management** into standalone repo (`library.vidyafloww.com`) + build in-portal overview dashboard (`/elibrary`)

## Phase 8 — Portals & Security

- [x] Parent & Student Portal (`/portal`)
- [x] Security & Access Control (`/security`)
- [x] Audit Log Viewer (`/audit`)
- [x] Reports & Analytics (`/reports`, `/statistics`)
- [x] Institutional Settings Studio (`/settings`)

## Phase 9 — Backend Domain Services Implementation (Next Sprint)

- [ ] Activate `core.accounts.User` and generate initial core migrations
- [ ] Implement `TenantMiddleware` and `TenantModel` in `common`
- [ ] Implement Student, Admission, and Attendance ViewSets + Serializers
- [ ] Connect `@vidyafloww/api` Axios client with live Django endpoints

---

*This roadmap is a living document and will be updated as priorities evolve.*
*Last updated: 2026-09-08*

