# Historical Milestones & Changelog

Concise record of verified milestones and structural changes reconstructed from Git history and project release documentation.

---

## [Unreleased / Active] — September 2026

### Component Architecture, Deep Consistency & Unified Toolbar (PR #31 — 2026-09-14)
* **Introduced `VFPageToolbar` in `@vidyamaxx/ui`**: Added reusable top header toolbar primitive encapsulating the standard `#141414` container pattern (`p-3 rounded-[4px] bg-[#141414] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-xs`), eliminating repeated markup across 10+ modules (`teaching.tsx`, `complaints.tsx`, `design-lab.tsx`, `hostel.tsx`, `transport.tsx`, `elibrary.tsx`, `e-class.tsx`, `hr-manage.tsx`, `security.tsx`, `audit.tsx`, `resources.tsx`, `lms.tsx`, `learning.tsx`).
* **Sleek Grey Hover Polish**: Audited all interactive elements to ensure strict adherence to subtle grey hover borders (`hover:border-zinc-700`, `hover:bg-[#181818]`), eliminating remaining orange hover borders on dashboard shortcut tiles and login institutional badges.
* **Strict Geometric Sharp Border Enforcement**: Standardized leftover `rounded-lg` elements across `shortcuts.tsx`, `learning.tsx`, and `security.tsx` to explicit sharp `rounded-[4px]`.

### Single-Page Subsystems UI Harmonization (PR #30 — 2026-09-14)
* **Harmonized 8 Single-Page Subsystem Modules**: Cleaned up styling, typography hierarchy, and borders across `/teaching`, `/design-lab`, `/hostel`, `/transport`, `/elibrary`, `/e-class`, `/hr-manage`, `/security`, and `/audit`.
* **Eliminated Orange Glows & Swatch Geometry**: Replaced orange selection outlines on presets/wings with crisp `border-zinc-500 bg-[#1c1c1c]`, and replaced `rounded-full` color swatches with sharp `rounded-[3px]`.
* **Fixed Duplicate Button Icon in Teaching**: Corrected the New Lesson Plan button to display a single `+` icon without duplicate text.
* **Preserved Route Isolation**: Kept all subsystems fully decoupled on their respective single routes without merging them.

### Subtle Grey Hover System & Complaints Toolbar Modernization (PR #29 — 2026-09-14)
* **Global Hover Color Refinement**: Replaced bright orange hover states (`hover:border-primary/50`, `hover:border-orange-500`) across tables and buttons with subtle, muted grey tones (`hover:bg-[#1a1a1a]`, `hover:border-zinc-700`).
* **Complaints Module Toolbar Modernization**: Consolidated duplicate filter bars into a single unified top toolbar with tab switchers, department dropdowns, expandable search icon, and single `+ Lodge Grievance` action.

### Clean In-Bar Metrics & 6-Section Navigation on Statistics (PR #28 — 2026-09-14)
* **In-Bar Progress Metrics**: Embedded numerical percentage labels directly inside horizontal progress bars, eliminating excessive text below bars.
* **Streamlined Academic Section Links**: Replaced multi-page button rows with 6 dedicated, clean navigation cards linking directly to `/attendance`, `/examinations`, `/academics`, `/homework`, `/students`, and `/timetable`.

### Responsive Table Layout Engine & Column Alignment Standardization (PR #27 — 2026-09-14)
* **Universal Full-Width Table Layout**: Updated `VFTable.tsx` and custom tables to stretch `w-full min-w-full`, expanding intelligently with viewport size and scrolling horizontally without visible scrollbars.
* **Max-Width Column Truncation**: Standardized column text truncation (`max-w-[180px] truncate`) with native `title="..."` tooltips so wide text does not blow out column widths.
* **Strict Column Alignment Standard**: Aligned text and identity columns (names, emails, subjects) to the left, and centered codes, counts, statuses, and action buttons for visual balance.

### Complete Platform Rebranding to VidyaMaxx (2026-09-13)
* **Comprehensive Rebrand Across Entire Monorepo**: Rebranded platform from VidyaFloww to VidyaMaxx across all packages, frontend apps, backend settings/configuration, documentation, routes, tests, and configuration files.
* **Workspace Package Renaming**: Updated all 11 monorepo packages to `@vidyamaxx/*` (`@vidyamaxx/api`, `@vidyamaxx/ui`, `@vidyamaxx/utils`, etc.), updated `pnpm-lock.yaml` and all dependencies.
* **Backend Rebrand**: Renamed Celery app and logger namespace to `vidyamaxx`, updated database defaults and production deployment configurations.
* **UI & Brand Consistency**: Synchronized header, preloader, sidebar, and landing page wordmarks and metadata.

### Architectural Decoupling, Overview Dashboards & Backend Audit (2026-09-08)

#### Mandatory Branching & GitHub CLI PR Workflow (PR #1)
* **Added Rule 8 & Section 5 to `AGENTS.md`**: Enforced strict prohibition against direct commits or pushes to `main`. Every new task or fix must be developed on an isolated branch (`feature/*` or `fix/*`), tested, audited for zero credentials, pushed to `origin`, and proposed via GitHub CLI (`gh pr create`).
* **Logged ADR-011 in `.agent/DECISIONS.md`**.

#### Hostel Management 4-Tab Workflow Refactor (PR #2)
* **Refactored `apps/web/src/routes/hostel.tsx`**: Replaced fragmented views with a structured 4-tab institutional workflow:
  * **Tab 1 "Rooms & Beds"**: Dormitory block selector, floor breakdown, room status grid, bed occupancy badges.
  * **Tab 2 "7-Day Food Timetable"**: Weekly nutrition timetable with 3 daily courses (Breakfast, Lunch, Dinner), calorie markers, and vegetarian/allergen tags.
  * **Tab 3 "Leave Ledger"**: Student outpass and leave request register with days granted, parent approvals, and status badges.
  * **Tab 4 "Night Attendance"**: Bed-to-bed night roll call register with Present / Absent / Leave status and biometric gate sync.

#### Subsystem Decoupling & Standalone Repository Architecture (PR #3 & #4)
* **Decoupled 5 heavy operational modules**:
  * `Design-Lab` (Target: `designlab.vidyamaxx.com`)
  * `Hostel Management` (Target: `hostel.vidyamaxx.com`)
  * `Transport Management` (Target: `transport.vidyamaxx.com`)
  * `HR Management` (Target: `hr.vidyamaxx.com`)
  * `Library Management` (Target: `library.vidyamaxx.com`)
* **Scaffolded full standalone repository infrastructure** for each subsystem with dedicated Vite configs, Tailwind design systems, Mukta font typography, sharp border radii, package scripts, `.husky`, `turbo.json`, and developer documentation. Decoupled folders were then cleanly separated into their own dedicated repositories.

#### In-Portal Integrated Overview Dashboards (PR #5)
* **Preserved integrated command center experience in `apps/web`**: Rather than generic launchpad placeholders, designed 5 high-density, interactive single-page overview dashboards matching the core ERP look and feel:
  * **`/design-lab`**: 24 document template presets (CBSE marksheets, CR80 student ID cards, sports certificates, admit cards), live template preview modal, recent export batches, and jump link to `designlab.vidyamaxx.com`.
  * **`/hostel`**: Dormitory room occupancy matrix, real-time headcounts (156 Inside, 24 Outside, 4 Unaccounted), today's 3-course meal cards (Breakfast, Lunch, Dinner), active leave outpasses, and jump link to `hostel.vidyamaxx.com`.
  * **`/transport`**: Live GPS route telematics cards with speed indicators, arrival ETAs, driver quick call action buttons, vehicle compliance audit ledger (fitness, insurance, pollution), and jump link to `transport.vidyamaxx.com`.
  * **`/hr-manage`**: Support staff operational stats, 5 departmental shift rosters (Housekeeping, Security, Transport, Dining, Maintenance), live biometric turnstile punch feed, statutory payroll breakdown, and jump link to `hr.vidyamaxx.com`.
  * **`/elibrary`**: NCERT digital curriculum catalog, protected DRM chapter preview modal, active reader telemetry, circulation ledger, and jump link to `library.vidyamaxx.com`.

#### Backend Architecture Deep Audit & Documentation Synchronization (PR #6)
* **Executed deep audit of `apps/backend`**:
  * Analyzed Django 5.1, DRF 3.15, SimpleJWT, Celery 5.4, Channels 4.1, and PostgreSQL/Redis stack.
  * Ran `manage.py check` (0 system issues identified).
  * Evaluated migration state (`showmigrations` confirms default Django migrations applied; 0 custom app migrations).
  * Documented actual implementation level: 100% infrastructure/scaffold readiness; 4 models drafted; 0 custom views/serializers; ~5-10% domain completion.
* **Updated project documentation suite**: Synchronized `.agent/CONTEXT.md`, `.agent/DECISIONS.md` (ADR-012), `.agent/CHANGELOG.md`, `README.md`, `API_DOCUMENTATION.md`, and `docs/`.

### UI Redesigns & Module Completions (September 2026 Sprint)

#### Notices Module (`/notices`) — Tabbed Wizard Redesign
* **Replaced** single-page modal form with a 2-tab layout:
  * **Tab 1 "Compose"**: Multi-step wizard — Step 1 selects audience (class/role/school-wide), channel, and urgency; Step 2 presents a rich-text editor (Bold, Italic, Lists, H1-H3 headings) with subject field. Step 2 is gated until Step 1 is complete.
  * **Tab 2 "Board"**: Read-only notice archive with search and status filters.
* Simplified over-verbose label text across the module ("Assignment Title & Topic" → "Title", etc.).

#### Examinations Module (`/examinations`) — 3-Tab Architecture
* **Tab 1 "Timetable"**: Compact exam cards + active date sheet table with search and type filters.
* **Tab 2 "Marks Scheme"**: Editable subject-wise marks allocation per exam, with **Lock/Unlock Scheme** toggle. Board-level classes (10, 12) default to locked. Editable CBSE Grading Scale section below.
* **Tab 3 "Marks Register"**: Per-student marks ledger with **Lock/Unlock Register** toggle. When locked: amber READ-ONLY banner, all inputs become plain text, Save Marks button disabled.
* Editable grading scale: `Edit Scale` → inline min/max/description inputs per tier → `Save Scale` re-grades the entire register.

#### Homework Module (`/homework`) — Single-Header, 2-Tab Redesign
* **Merged two header bars** into one unified toolbar: tab switcher + class selector + contextual controls.
* Removed "Term 1 Active" session badge (not needed in workflow).
* **Tab 1 "Assign"**: Class selector in header. Subject / Due date / Publish-now-or-draft meta bar. Rich-text `contenteditable` editor with toolbar (Bold, Italic, Lists, Quote, H1/H2/H3, Photo attach). `onPaste` handler — pasted clipboard images are read as `data:` URLs and injected inline. Send/Save Draft button in the toolbar.
* **Tab 2 "Review"**: Full-width table of **all classes' homework** (Code, Title, Class, Due, Submitted progress bar, Status, View). Clicking View transitions to a full-page submission roster showing Submitted / Late / Pending counts + student table. Breadcrumb navigation back to the list. Single search bar in the header (no duplicate).

#### Deep Audit & Documentation Pass (2026-09-07)
* **Identified orphaned components**: `AIChatDrawer.tsx` and `ErrorPages.tsx` are defined but not yet imported. Documented in CONTEXT.md Known Limitations. No deletion — these are planned integration targets.
* **Fixed stale CSS comment**: `globals.css` line 140 incorrectly referenced "Poppins" — corrected to "Mukta".
* **Corrected DECISIONS.md**: Decision 8 incorrectly stated "Sofia Sans + Baloo 2" — updated to reflect actual production font (Mukta).
* **Updated CONTEXT.md**: Complete source directory map, full 28-route status table, Known Limitations section, font clarification.

#### New Sidebar Modules Integration (2026-09-07)
* **Teaching (`/teaching`)**: Added directly above Homework in the Academics navigation group. Includes assigned faculty sections, workload KPI cards, AI-assisted 45-minute lesson planner, CBSE/NEP 2020 syllabus completion tracker, and daily period routine.
* **E-Class (`/e-class`)**: Simplified label to "E-Class" (removed "(Online Class)" wording). Integrated WebRTC HD live virtual classroom studio, scheduled lectures timetable with platform engines (VidyaClass Live, Zoom, Google Meet), interactive classroom launcher with screen share and participant management, and recorded lecture vault.
* **Transport (`/transport`)**: Added to dedicated Facilities group in the sidebar. Fleet management with live GPS bus telematics, active routes, driver and vehicle compliance registry, and student commute allocation rosters.
* **Hostel (`/hostel`)**: Added to Facilities group. Dormitory room and bed matrix (Block A Boys, Block B Girls, Block C Junior), resident student directory, biometric gate outpass registry, and weekly 4-meal nutritional dining hall menu.
* **Complaints (`/complaints`)**: Dedicated separate module in Admin group. Full Grievance Redressal registry with status filtering (All, Open, In Progress, Resolved), department tags, severity badges, actionable queue, and departmental SLA analytics.
* **Surveys (`/surveys`)**: Dedicated separate module in Admin group. Institutional feedback collection, community polls, participation progress bars, Net Promoter Score (NPS) sentiment analytics, historical survey archive, and survey creator wizard.
* **Shortcuts & Localization**: Registered all modules independently in `shortcuts.tsx` and added bilingual translation keys in `i18n.ts`. All interfaces strictly adhere to sharp geometric borders (`rounded-md`, `rounded-sm`).

---

## [Pre-September 2026] — August 2026 Sprint

### Added & Enhanced
* **Comprehensive Bilingual Localization (i18n)**:
  * Integrated full English & Hindi translation coverage across all 18+ primary route modules via `useTranslation`.
  * Adopted Mukta as the unified bilingual font covering Latin and Devanagari script.
  * Added instant language switcher toggle in the top Navbar and Settings page.
* **Landing Application (`apps/landing`)**:
  * Introduced dedicated institutional marketing and product discovery site.
* **Timetable Grid Engine**:
  * Converted period matrix to CSS Grid for uniform slot dimensions across screen resolutions.
  * Added period configuration drawer, dynamic class switching, and faculty substitution matcher.
* **360° Dossier Drawers**:
  * Added slide-in profiles for Students and Faculty with academic history, fee records, attendance logs, and export actions.
* **VidyaMaxx AI Assistant Drawer** (`AIChatDrawer.tsx`):
  * Component built and available in `apps/web/src/components/`. Pending wiring into `AppShell.tsx`.

---

## [v2.8.0] — 2026-08-11

### Added
* **28-Module Institutional ERP Infrastructure**:
  * Connected all primary institutional modules into the unified AppShell and routing registry:
    * Core: `Dashboard`, `Students`, `Admissions`, `Attendance`, `Academics`, `Timetable`.
    * Academic & Learning: `Examinations`, `Homework`, `Learning (LMS)`, `Library`, `E-Library`.
    * Operations: `Parent Portal`, `Notices`, `Reports`, `Statistics`, `Shortcuts`.
    * Finance & HR: `Fees`, `Salary`, `Scholarships`.
    * Governance: `Security`, `Audit Log`, `Settings`, `License`.
    * Auth: `Login`.
  * Embedded global `VidyaMaxx AI` assistant drawer (pending AppShell integration).

### Fixed & Refactored
* **Viewport & Spacing Standardization**:
  * Enforced vertical spacing standard via `VFSection` / `space-y-3` in `@vidyamaxx/ui`.
  * Removed nested vertical scrollbars on sub-navigation tabs to establish a single unified vertical scroll container.
  * Standardized KPI stat cards to render exclusively on primary dashboard views.

---

## [v0.1.0] — 2026-07-02

### Added
* Initial monorepo foundation with TurboRepo and pnpm workspaces.
* Backend skeleton: Django 5, Django REST Framework, Celery, Channels, and PostgreSQL/Redis Docker Compose configurations.
* Frontend skeleton: React 19, Vite, TypeScript, and Tailwind CSS.
* Shared packages foundation (`@vidyamaxx/ui`, `@vidyamaxx/types`, `@vidyamaxx/api`, `@vidyamaxx/constants`, `@vidyamaxx/validation`).
* Project architecture and standards documentation suite (`docs/01-13`).
