# Project Context — VidyaMaxx

## 1. Project Purpose & Scope

**VidyaMaxx** is an enterprise-grade school management platform (ERP & SaaS) engineered for K-12 institutions, colleges, and multi-campus networks. It unifies admissions, academics, fee collection, attendance, timetables, examinations, homework, notices, payroll, and school administration into a high-density, centralized desktop command portal.

---

## 2. Technology Stack & Topology

* **Monorepo Management**: TurboRepo 2.x + pnpm 9.x workspaces (`pnpm-workspace.yaml`).
* **Frontend Web Command Portal (`apps/web`)**:
  * React 19 + TypeScript 5.6 + Vite 5.4.
  * TanStack Router (file-based routing via `routeTree.gen.ts` — 37 active routes).
  * TanStack Query 5.x + Zustand 5.x with `localStorage` persistence.
  * Tailwind CSS 3.4 + `@tailwindcss/forms` + `@tailwindcss/typography`.
  * Radix UI primitives (`dialog`, `popover`, `select`, `tabs`, `tooltip`).
  * Framer Motion 12.x/13.x (page transitions, drawers, springs) + Lenis (smooth scrolling).
  * Lucide React icons + Sonner toast notifications.
  * Typography: **Mukta** — a contemporary humanist sans-serif natively covering Latin and Devanagari script. Loaded via Google Fonts. The single `--ui-font` CSS token is used for both English and Hindi locales.
* **Decoupled Standalone Subsystem Ecosystem**:
  * Heavy, operation-intensive modules are decoupled into dedicated standalone repositories and subdomains, while preserving high-density, real-time overview dashboards within the main portal:
    * **Design Lab**: `designlab.vidyamaxx.com` (CBSE marksheet, CR80 ID cards, certificate & admit card vector generator)
    * **Hostel Management**: `hostel.vidyamaxx.com` (Dormitory beds, meal dining timetables, leave ledger, night biometric roll-call)
    * **Transport Management**: `transport.vidyamaxx.com` (Fleet GPS telematics, driver compliance audit, route optimization)
    * **HR & Biometrics**: `hr.vidyamaxx.com` (Support staff rosters, biometric turnstile punch logs, statutory payroll)
    * **E-Library Management**: `library.vidyamaxx.com` (NCERT textbook catalog, protected DRM reading reader, circulation ledger)
* **Backend API (`apps/backend`)**:
  * Python 3.12+ (in `.venv`), Django 5.1.x, Django REST Framework (DRF) 3.15.x.
  * SimpleJWT (token-based stateless auth), Django Channels 4.1.x (WebSockets ASGI), Celery 5.4.x (async tasks & periodic beat), Redis (cache/MQ).
  * Database: PostgreSQL (`psycopg3`) configured for production; local development uses SQLite (`db.sqlite3`).
  * Current Development Status: 100% infrastructure, settings, middleware, and app registration verified (`python manage.py check` passes with 0 errors). 56 local apps registered. Domain models and views are currently scaffolded (~5-10% implemented). The web frontend currently operates on client-side Zustand state stores and simulation fixtures.
* **Shared Packages (`packages/*`)**:
  * `@vidyamaxx/ui`: Standardized primitives (`VFCard`, `VFTable`, `VFDataTable`, `VFStatCard`, `VFTabs`, `VFButton`, `VFBadge`, `VFDialog`, `VFDrawer`, `VFCharts`, etc.).
  * `@vidyamaxx/types`: Shared domain interfaces and schemas.
  * `@vidyamaxx/constants`: Module registries, route paths, role definitions, and navigation constants.
  * `@vidyamaxx/api`: Axios client with interceptors and normalized error structures.
  * `@vidyamaxx/validation`: Shared Zod validation schemas.
  * `@vidyamaxx/hooks`, `@vidyamaxx/utils`, `@vidyamaxx/themes`, `@vidyamaxx/icons`, `@vidyamaxx/config`, `@vidyamaxx/assets`.
* **Additional Applications**:
  * `apps/landing`: Marketing and product discovery site (Vite + React 19).
  * `apps/desktop`: Electron wrapper targeting cross-platform desktop execution.
  * `apps/mobile`: React Native + Expo shell.

---

## 3. Architecture & Data Flow

* **Frontend Web Architecture**:
  * Route files live under `apps/web/src/routes/` — each file is a self-contained page component wired by TanStack Router's file-based auto-generation into `routeTree.gen.ts`.
  * Layout shell: `apps/web/src/layouts/AppShell.tsx` — wraps all authenticated routes with `Sidebar`, `Header`, `CommandPalette`, `NotificationsPanel`, and `ToastContainer`.
  * Data state is currently managed client-side through Zustand stores (`globalStore.ts`) backed by `localStorage` and localized mock fixtures.
  * Sub-navigation uses `VFTabs` (from `@vidyamaxx/ui`) with auto-centering horizontal scrolling and zero vertical scroll nesting.
* **Decoupled Subsystem Architecture & In-Portal Overview Dashboards**:
  * In the main web portal, `/design-lab`, `/hostel`, `/transport`, `/hr-manage`, and `/elibrary` serve as **instant, high-density overview dashboards** (telemetry stats, quick matrices, active outpasses, meal schedules, vehicle audits, biometric turnstile feeds, and document preview modals).
  * Each dashboard includes a prominent launch button ("Open Standalone Portal", "Open Studio Engine", "Open Fleet Console", etc.) providing seamless redirection to the dedicated subdomain with contextual school parameters.
* **Backend Layering Specification**:
  * `apps/backend/core/` (7 apps): Foundation services (`accounts`, `authentication`, `campuses`, `organizations`, `permissions`, `sessions`, `users`).
  * `apps/backend/platform_services/` (12 apps): Cross-cutting engines (`notifications`, `storage`, `audit`, `activity`, `imports`, `exports`, `reports`, `search`, `settings`, `workflows`, `forms`, `dashboard`).
  * `apps/backend/modules/` (23 apps): Business domain apps (`admissions`, `students`, `academics`, `attendance`, `examinations`, `homework`, `lms`, `finance`, `hr`, `library`, `hostel`, `transport`, `communication`, `documents`, `inventory`, `medical`, `events`, `discipline`, `analytics`, `timetable`, `accounting`, `certificates`, `welfare`).
  * `apps/backend/ai/` (5 apps): LLM providers, assistants, prompts, OCR, predictions.
  * `apps/backend/integrations/` (9 apps): Payment, SMS, email, WhatsApp, biometric, GPS, Google, Microsoft, webhooks.
  * Service layer pattern: `View` → `Serializer` → `Selector` (read) / `Service` (write) → `Model` → `Task`.

---

## 4. Source Directory Map (`apps/web/src/`)

```
src/
├── app/
│   └── App.tsx                   # Root React app: QueryClientProvider + RouterProvider + Preloader
├── components/
│   ├── AIChatDrawer.tsx          # AI assistant slide-in drawer (standalone, not yet wired to AppShell)
│   └── Preloader.tsx             # First-visit animated preloader (shown once, state persisted in globalStore)
├── features/                     # SCAFFOLD — reserved for future feature-sliced domain modules
│   ├── api/                      # (empty) Future: domain-level API hooks per feature
│   ├── components/               # (empty) Future: reusable sub-components per feature slice
│   ├── constants/                # (empty) Future: per-feature constants
│   ├── hooks/                    # (empty) Future: per-feature React hooks
│   ├── pages/                    # (empty) Future: page-level compositions per feature
│   ├── schemas/                  # (empty) Future: Zod schemas per feature
│   ├── types/                    # (empty) Future: TypeScript interfaces per feature
│   └── utils/                    # (empty) Future: pure utility functions per feature
├── hooks/
│   └── useTranslation.ts         # Bilingual translation hook (wraps i18n.ts + globalStore language)
├── layouts/
│   ├── AppShell.tsx              # Main layout shell: Sidebar + Header + route outlet + overlays
│   ├── CommandPalette.tsx        # Ctrl+K search command palette
│   ├── Header.tsx                # Top navbar — locked 72px height, school name, search, notifications
│   ├── NotificationsPanel.tsx    # Slide-in notifications drawer
│   ├── Sidebar.tsx               # Left navigation sidebar — locked 72px brand header, route links
│   └── ToastContainer.tsx        # Global toast notification renderer
├── lib/
│   └── i18n.ts                   # 60KB bilingual translation dictionary (EN + HI keys for all modules)
├── pages/
│   └── ErrorPages.tsx            # Error boundary pages (future integration — not yet imported in router)
├── routes/                       # TanStack Router file-based pages (37 active routes)
│   ├── __root.tsx                # Root route: renders AppShell + 404 not-found handler
│   ├── index.tsx                 # Dashboard (/) — KPI cards, quick shortcuts, attendance overview
│   ├── dashboard.tsx             # /dashboard alias → re-exports DashboardPage from index.tsx
│   ├── academics.tsx             # Curriculum, syllabus, subjects management
│   ├── admissions.tsx            # Admissions pipeline and enquiry management
│   ├── attendance.tsx            # Daily/period attendance with biometric integration
│   ├── audit.tsx                 # System audit log viewer
│   ├── complaints.tsx            # Grievance redressal and ticket resolution SLA queue
│   ├── design-lab.tsx            # Design Lab Overview & Template Studio (redirects to designlab.vidyamaxx.com)
│   ├── e-class.tsx               # Virtual live classroom scheduler and recordings archive
│   ├── elibrary.tsx              # E-Library Overview & DRM Textbook Reader (redirects to library.vidyamaxx.com)
│   ├── examinations.tsx          # 3-tab: Timetable / Marks Scheme (editable) / Marks Register (lockable)
│   ├── fees.tsx                  # Fee collection, challan generation, ledger
│   ├── homework.tsx              # 2-tab: Assign (rich-text editor) / Review (all-class submission tracker)
│   ├── hostel.tsx                # Hostel Overview & Dormitory Matrix (redirects to hostel.vidyamaxx.com)
│   ├── hr-manage.tsx             # HR Overview & Biometric Turnstile Telemetry (redirects to hr.vidyamaxx.com)
│   ├── learning.tsx              # LMS learning content viewer
│   ├── license.tsx               # License and subscription details
│   ├── live-room.tsx             # WebRTC interactive live classroom video studio
│   ├── lms.tsx                   # LMS course management
│   ├── login.tsx                 # Authentication page (no AppShell wrapper)
│   ├── notices.tsx               # 2-tab notice board: send (wizard) / view
│   ├── portal.tsx                # Parent & student portal gateway
│   ├── reports.tsx               # Analytics and report generation
│   ├── resources.tsx             # Resource library
│   ├── salary.tsx                # Staff payroll and salary processing
│   ├── scholarships.tsx          # Scholarship management
│   ├── security.tsx              # Role & access control management
│   ├── settings.tsx              # System settings: school profile, branding, sessions
│   ├── shortcuts.tsx             # Dashboard shortcut configurator
│   ├── statistics.tsx            # Platform-wide statistics and charts
│   ├── students.tsx              # Student roster, 360° dossier, academic records
│   ├── surveys.tsx               # Institutional survey feedback and NPS sentiment analytics
│   ├── teachers.tsx              # Teacher management, schedules, and profiles
│   ├── teaching.tsx              # Faculty teaching dashboard, lesson planner, and syllabus tracker
│   ├── timetable.tsx             # Weekly timetable grid (CSS Grid layout)
│   └── transport.tsx             # Transport Overview & Live Fleet Telemetry (redirects to transport.vidyamaxx.com)
├── services/                     # SCAFFOLD — reserved for future API service layer
├── stores/
│   └── globalStore.ts            # Zustand persistent store: theme, language, school profile, notifications, dashboard config
├── styles/
│   └── globals.css               # Tailwind base + design tokens + Mukta font + scrollbar suppression + animations
├── tests/                        # SCAFFOLD — reserved for Vitest unit tests
├── types/                        # SCAFFOLD — reserved for shared TypeScript types
├── utils/                        # SCAFFOLD — reserved for pure utility functions
├── main.tsx                      # Vite entrypoint: mounts <App /> into #root
└── routeTree.gen.ts              # AUTO-GENERATED by TanStack Router (never edit manually)
```

---

## 5. Important Conventions, Design System & UI Tokens

1. **Desktop-Only Viewport Requirement**:
   * The web application requires a minimum screen width of **1000px**.
   * Viewports `< 1000px` render the `SmallScreenBlocker` prompt in `AppShell.tsx`. Do not remove this constraint without architectural review.
2. **Unified 72px Header Metric**:
   * The top Navbar (`Header.tsx`) and Sidebar brand header (`Sidebar.tsx`) are strictly locked to `h-[72px]`.
3. **Bilingual Localization (i18n)**:
   * All user-facing UI labels must use the `useTranslation` hook (`en` / `hi`).
   * Single font for both locales: **Mukta** (humanist sans covering Latin + Devanagari). Loaded via Google Fonts and bound to `--ui-font`.
4. **Sharp Geometric Border Radius Rule** (strict — see AGENTS.md Rule 7):
   * Never use bubbly or excessive radius (`rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full` except icon plates or status indicators).
   * Strict sharp geometry: `rounded-[4px]`, `rounded-[3px]`, `rounded-[2px]`, or `rounded-sm`. Cards, dialogs, tables, buttons, and inputs must maintain crisp geometric edges.
5. **Subtle Grey Hover System (Zero Orange Hover Clutter)**:
   * Interactive hover and active focus states must use subtle grey accents (`hover:border-zinc-700`, `hover:bg-[#181818]`, active selector `bg-[#1c1c1c] border-zinc-500`).
   * Avoid aggressive orange hover outlines across cards, table rows, and buttons.
6. **Unified Top Toolbar Architecture (`VFPageToolbar`)**:
   * All modules must use `@vidyamaxx/ui`'s `VFPageToolbar` primitive (`p-3 rounded-[4px] bg-[#141414] border border-border/80 shadow-xs`) to house contextual tabs, action buttons, and filters uniformly.
7. **Universal Table Layout & Alignment Standards**:
   * Tables must stretch `w-full min-w-full` across the available container, scrolling horizontally without visible scrollbars (`no-scrollbar`).
   * **Column Alignment**: Text and identity columns (names, emails, subjects) are left-aligned; codes, student counts, period counts, percentages, statuses, and action buttons must be centered.
   * **Text Truncation**: Wide text cells must use `max-w-[180px] truncate` with native `title="..."` attributes to avoid column explosion.
8. **In-Bar Progress Metrics**:
   * Numeric percentages in progress meters must be rendered directly inside the bar, eliminating redundant lines of explanatory text underneath.
9. **Component Library First**:
   * Always use `@vidyamaxx/ui` primitives (`VFCard`, `VFPageToolbar`, `VFButton`, `VFBadge`, `VFTable`, `VFDataTable`, `VFDialog`, `VFTabs`, `VFStatCard`, etc.) instead of re-implementing bespoke HTML duplicates.
10. **Zero Secrets & Credentials (NEVER PUSH ID/PASS)**:
    * User IDs, passwords, API tokens, private keys, and `.env` files must NEVER be committed or pushed. Mock state must use generic placeholders.
11. **Globally Dark Mode**:
    * Theme is permanently dark. `initTheme()` in `globalStore.ts` forces `.dark` class on `<html>`. No light mode toggle exists.
12. **Mandatory Branching & GitHub CLI PR Workflow** (strict — see AGENTS.md Rule 8):
    * NEVER commit or push directly to `main`. Every change must be developed on an isolated branch (`fix/*` or `feature/*`), verified with tests and secrets audit, pushed to `origin`, submitted via `gh pr create`, and merged via `gh pr merge --merge`. Direct commits to `main` are strictly prohibited.

---

## 6. Development & Verification Commands

```bash
# Start web dev server (default: port 3000)
pnpm --filter @vidyamaxx/web dev

# Validate web TypeScript (run after every code change)
pnpm --filter @vidyamaxx/web type-check

# Run web unit tests (Vitest)
pnpm --filter @vidyamaxx/web test

# Verify Django backend integrity
python apps/backend/manage.py check

# Full monorepo type-check
pnpm type-check
```

---

## 7. Current Implementation Status

### Core ERP Web Portal (`apps/web`)

| Module | Route | Status | Description |
| :--- | :--- | :---: | :--- |
| Dashboard | `/` | ✅ Complete | Real-time KPI telemetry, attendance radar, quick shortcuts |
| Students | `/students` | ✅ Complete | Master student directory, 360° dossiers, batch promotions |
| Admissions | `/admissions` | ✅ Complete | 4-stage conversion CRM, OCR verification, merit scoring |
| Attendance | `/attendance` | ✅ Complete | Daily roll-call, biometric sync, absence alerts |
| Academics | `/academics` | ✅ Complete | Curriculum, syllabus progress, classroom allocations |
| Timetable | `/timetable` | ✅ Complete | CSS Grid period schedule, teacher proxy & substitution matcher |
| Teachers | `/teachers` | ✅ Complete | Faculty roster, workload meters, class allocations |
| Teaching | `/teaching` | ✅ Complete | Faculty planner, 45-min lesson plans, syllabus tracker |
| Homework | `/homework` | ✅ Complete | 2-tab unified workflow: Rich-text Assign / All-class Review |
| Examinations | `/examinations` | ✅ Complete | 3-tab workflow: Timetable / Marks Scheme / Marks Register |
| E-Class | `/e-class` | ✅ Complete | Live classroom scheduler, WebRTC launcher, recordings vault |
| Live Room | `/live-room` | ✅ Complete | Interactive WebRTC video studio with screen sharing |
| Notices | `/notices` | ✅ Complete | 2-tab workflow: Multi-step Compose wizard / Notice archive |
| Fees | `/fees` | ✅ Complete | Fee master register, challan generation, dues tracking |
| Salary | `/salary` | ✅ Complete | Staff payroll, statutory allowances, payslip generation |
| Scholarships | `/scholarships` | ✅ Complete | Scholarship criteria, grant allocations, disbursement ledgers |
| Complaints | `/complaints` | ✅ Complete | Grievance redressal registry, priority SLA queue, resolution logs |
| Surveys | `/surveys` | ✅ Complete | Institutional polls, participation progress, NPS sentiment |
| Statistics | `/statistics` | ✅ Complete | Platform-wide BI analytics and institutional charts |
| Reports | `/reports` | ✅ Complete | CBSE/RTE compliance audits, GPA analytics, Excel/PDF exports |
| Settings | `/settings` | ✅ Complete | School branding, session years, institutional metadata |
| Security | `/security` | ✅ Complete | RBAC role definitions, permission matrix, access logs |
| Audit Log | `/audit` | ✅ Complete | Immutable system audit log viewer |
| Parent Portal | `/portal` | ✅ Complete | Parent/guardian view: student academic and fee summary |
| LMS | `/lms` | ✅ Complete | Course management and learning modules |
| Learning | `/learning` | ✅ Complete | Interactive student learning viewer |
| Resources | `/resources` | ✅ Complete | Institutional file and document vault |
| License | `/license` | ✅ Complete | Enterprise subscription & tier governance |
| Shortcuts | `/shortcuts` | ✅ Complete | Dashboard quick navigation configurator |
| Login | `/login` | ✅ Complete | Multi-role authentication interface |

### Decoupled Subsystem Overview Dashboards (Integrated in `apps/web`)

| Subsystem | In-Portal Overview Route | Standalone Subdomain / Repo | Capabilities in Web Portal |
| :--- | :--- | :--- | :--- |
| **Design Lab** | `/design-lab` | `designlab.vidyamaxx.com` | 24 template presets, live preview modal, recent export batches, jump link |
| **Hostel Management** | `/hostel` | `hostel.vidyamaxx.com` | Dormitory matrix, 3-course dining menu, inside/outside headcounts, outpass ledger |
| **Transport Management** | `/transport` | `transport.vidyamaxx.com` | Live GPS fleet telematics, arrival ETAs, driver contacts, vehicle compliance audit |
| **HR & Biometrics** | `/hr-manage` | `hr.vidyamaxx.com` | Support staff stats, 5 departmental rosters, live biometric turnstile feed, payroll |
| **E-Library Management** | `/elibrary` | `library.vidyamaxx.com` | NCERT catalog, DRM protected chapter preview modal, reader counts, circulation ledger |

### Platform Architecture & Backend Readiness

| Subsystem | Readiness | Status & Technical Findings |
| :--- | :---: | :--- |
| **Backend Infrastructure** | 🟢 100% | Django 5.1, DRF 3.15, SimpleJWT, Celery 5.4, Channels 4.1. `manage.py check` passes with 0 issues. |
| **Backend Domain Logic** | 🔴 5-10% | 56 local apps registered in `base.py`. Only 4 models drafted. Zero views/serializers. `api/v1/` routes commented out in `urls.py`. |
| **Database Migrations** | 🟡 15% | `db.sqlite3` contains default Django core migrations (`auth`, `admin`, `sessions`, `django_celery_beat`, `django_celery_results`). No custom app migrations exist yet. |
| **Frontend State** | 🟢 100% | Frontend runs completely and interactively on client-side Zustand stores and simulation fixtures. |
| **API Client (`@vidyamaxx/api`)** | 🟡 40% | Axios client scaffolded with error interceptors; pending integration with live Django endpoints. |
| **Desktop App (`apps/desktop`)** | ⚪ 20% | Electron container scaffolded. |
| **Mobile App (`apps/mobile`)** | ⚪ 20% | Expo/React Native shell scaffolded. |

---

## 8. Known Limitations & Active Integration Gaps

* **Client/Server Coupling (Backend Gap)**: The web portal currently functions 100% on client-side state and mock simulation data. Django REST API integration via `@vidyamaxx/api` is pending backend domain models, serializers, and views implementation.
* **Backend Custom App Models & Migrations**: While `apps/backend/config/settings/base.py` cleanly registers 56 local apps across `core`, `platform_services`, `modules`, `ai`, and `integrations`, only 4 models are currently written (`ChartOfAccount`, `CertificateTemplate`, `TimetableSlot`, `CounsellingRecord`). The remaining apps contain skeleton files (`# TODO: Implement ...`).
* **Backend URL Routing**: In `apps/backend/config/urls.py`, all `api/v1/` routes are commented out pending app-level URLconf and viewset creation.
* **Tenant Middleware**: Multi-tenancy database isolation middleware (`TenantMiddleware` and `TenantQuerySet`) is designed in architecture documentation but not yet implemented in `apps/backend/common/`.
* **Authentication Linkage**: Web has complete UI forms (`/login`), but live JWT exchange with Django's `rest_framework_simplejwt` requires mounting active auth endpoints and switching Zustand store from mock authentication.
* **`AIChatDrawer.tsx` & `ErrorPages.tsx`**: Fully integrated. AI Copilot Drawer is wired into `AppShell.tsx`, `Sidebar.tsx` footer, and `Header.tsx` with global state and `Shift+K` shortcut. `Error404` and `Error500` are mounted as TanStack Router error boundaries in `__root.tsx`.
