# DOCUMENT 05: FRONTEND ARCHITECTURE & CODEBASE AUDIT

> **Classification**: `EVIDENCE-BASED UI CODEBASE AUDIT`  
> **Source Directory**: `VidyaMaxx/apps/web/src/`  
> **Framework & Tools**: React 19 + TypeScript + Vite 6 + TanStack Router + TailwindCSS  

---

## 1. Main Command Portal Structure (`apps/web`)

The frontend application (`apps/web`) is structured around TanStack Router file-based routing. It contains **19 active route files** in `src/routes/` and supporting components:

```
apps/web/src/
├── components/
│   ├── AIChatDrawer.tsx          (Shift+K Copilot assistant drawer)
│   ├── AppShell.tsx              (Master layout container, Header + Sidebar + Outlet)
│   ├── CommandPalette.tsx        (Ctrl+K Universal fuzzy search palette)
│   ├── Header.tsx                (Session switcher, Branch selector, Notifications, Profile)
│   ├── NotificationsPanel.tsx    (Unread alerts drawer, Mark all read, Clear)
│   ├── Sidebar.tsx               (Active navigation menu, collapse state)
│   └── SmallScreenBlocker.tsx    (Enforces desktop resolution >= 1024px)
├── routes/
│   ├── __root.tsx                (Root router layout wrapper)
│   ├── index.tsx                 (Dashboard home, KPI cards, Attendance exceptions - 817 lines)
│   ├── login.tsx                 (Auth: Login, 4-step Signup, Password Reset, OTP - 1,277 lines)
│   ├── students.tsx              (Student Directory, 360° Drawer, Dossier Config - 3,636 lines)
│   ├── teachers.tsx              (Faculty Directory, 360° Drawer, Dossier Config - 2,589 lines)
│   ├── academics.tsx             (Classes, Subjects, Milestones, Mentors - 2,209 lines)
│   ├── timetable.tsx             (Weekly Grid, Period Config, Substitutions - 1,556 lines)
│   ├── attendance.tsx            (Daily Roll-Call, 6-Month Heatmap, Leaves - 1,747 lines)
│   ├── teaching.tsx              (Workload Matrix, Lesson Planner, AI Draft - 480 lines)
│   ├── homework.tsx              (Assignment Creator, Submission Reviewer - 749 lines)
│   ├── complaints.tsx            (Grievance Registry, SLA Countdown, Tickets - 686 lines)
│   ├── surveys.tsx               (Survey Campaigns, Polls, Response Charts - 526 lines)
│   ├── reports.tsx               (Report Catalog, Custom Builder Drawer, Formats - 868 lines)
│   ├── statistics.tsx            (Institutional BI, Area/Bar/Pie Visualizations - 522 lines)
│   ├── settings.tsx              (School Branding, Campuses, Master Data - 769 lines)
│   ├── security.tsx              (Role Matrix, 2FA Policies, IP Whitelisting - 362 lines)
│   ├── audit.tsx                 (Immutable Audit Trail Viewer, Filters - 323 lines)
│   ├── license.tsx               (SaaS License Keys, Invoices, Payment Methods - 518 lines)
│   ├── shortcuts.tsx             (Customizable Dashboard Shortcuts Reorder - 476 lines)
│   └── dashboard.tsx             (Redirect / alias to index)
├── store/
│   └── globalStore.ts            (Zustand UI preferences, active session, branch)
└── tests/
    └── app.test.ts               (11 automated Vitest tests)
```

---

## 2. Route-by-Route Deep Audit

### 1. `/login` (`login.tsx` — 1,277 lines)
- **Sub-Modes**:
  1. Standard Username/Email + Password Login.
  2. 4-Step Registration: Role Selection -> Personal Info -> School Code Lookup -> OTP Verification & Terms.
  3. 4-Step Forgot Password: User Identifier -> OTP Verification -> New Password -> Success confirmation.
  4. 3-Step Forgot Username: Phone Number + Date of Birth -> OTP Verification -> Matched Account Retrieval.
  5. Google SSO Button.
- **State & Integration**: Connected to `@vidyafloww/api` (`/api/v1/auth/*`).

### 2. `/` & `/dashboard` (`index.tsx` — 817 lines, `shortcuts.tsx` — 476 lines)
- **Features**:
  - Live Institutional Header: School Name, Tagline, Affiliation Badge, Clock.
  - 4 Drag-and-drop KPI Cards: Total Students (`2,451`), Faculty Coverage (`98.2%`), Daily Attendance (`94.5%`), New Admissions (`28`).
  - Attendance Exceptions Roster: Lists absent/late students with quick guardian communication trigger.
  - Shortcut Quick Launcher: Reorderable shortcut icons configured in `/shortcuts`.

### 3. `/students` (`students.tsx` — 3,636 lines)
- **Features & Complexity**:
  - Full tabular directory with filtering by Class, Section, Gender, House, Blood Group, and Fee Clearance.
  - **Student 360° Drawer (5 Distinct Tabs)**:
    - `overview`: Bio data, family details, operational flags, and Dynamic Dossier Custom Field Configurator.
    - `academics`: Multi-session history, GPA, subject enrollments, student promotion/withdrawal.
    - `credentials`: Parent and Student portal username lookup, credential reset, and QR login card.
    - `fees`: Ledger summary and direct launch button to `Payments-VidyaFloww`.
    - `scholarship`: Active grants and scholarship application review.
  - **Bulk Operations**: Export to ZIP bundle (JSZip), CSV/Excel export with custom column picker, Digital CR80 ID Card Modal.

### 4. `/teachers` (`teachers.tsx` — 2,589 lines)
- **Features**:
  - Faculty directory with Subject assignments, Class mentor indicators, and period load.
  - **Faculty 360° Drawer (5 Tabs)**: `overview`, `academics` (class/section load), `attendance`, `credentials`, `payroll` (salary snapshot).
  - Add Staff Multi-step Wizard and photo cropping preview.

### 5. `/academics` (`academics.tsx` — 2,209 lines)
- **Features**:
  - Class Profile sidebar with Hindi class titles and section counts.
  - Subjects Table: Curriculum tier, assessment split (Theory vs. Internal marks), assigned faculty, prescribed textbook reference with E-Library deep link.
  - Academic Milestones: Board exam dates, periodic tests, target syllabus completion percentages.

### 6. `/timetable` (`timetable.tsx` — 1,556 lines)
- **Features**:
  - Interactive CSS Grid weekly timetable (5-day / 6-day toggle).
  - Period Slot Definition Modal (start time, end time, recess breaks).
  - Workload & Substitutions Drawer: Visual indicators for over-capacity teachers, and automated Proxy Substitution matching.

### 7. `/attendance` (`attendance.tsx` — 1,747 lines)
- **Features**:
  - Daily roll-call roster with Present, Absent, Late, and Leave toggles. Bulk mark Present action.
  - Student Attendance History Drawer with **6-Month Heatmap Calendar** (clickable days with punch timestamps and correction notes).
  - Leave Management Tab: Multi-type leave requests (Medical, Duty, Casual) with proof attachments and approval workflows.

### 8. `/teaching` (`teaching.tsx` — 480 lines)
- **Features**:
  - Teacher workload matrix and Lesson Planner drawer.
  - **AI Generate Lesson Plan** hook integrating with the backend AI assistant service.

### 9. `/homework` (`homework.tsx` — 749 lines)
- **Features**:
  - Dual tabs: Homework Creation (attachments, due dates, instructions) and Submission Review (student submission status, file download, marks entry).

### 10. `/complaints` (`complaints.tsx` — 686 lines)
- **Features**:
  - Institutional Grievance Desk retained in core portal.
  - Category filtering (`Transport`, `Academics`, `Hostel`, `Accounts`, `Facilities`), priority badges, expected SLA countdown timers, ticket resolution drawer.

### 11. `/surveys` (`surveys.tsx` — 526 lines)
- **Features**:
  - Active campaigns for parents, students, and staff with NPS/satisfaction progress bars and anonymous voting toggles.

### 12. `/reports` (`reports.tsx` — 868 lines)
- **Features**:
  - Report Catalog and Custom Report Builder with dynamic column selectors, session filters, and format options (`PDF`, `XLSX`, `CSV`).

### 13. `/statistics` (`statistics.tsx` — 522 lines)
- **Features**:
  - Institutional business intelligence dashboard with SVG/CSS area charts, bar charts, and enrollment trajectory metrics.

### 14. `/settings` (`settings.tsx` — 769 lines)
- **Features**:
  - School branding editor, logo upload, campus/branch management cards.

### 15. `/security` (`security.tsx` — 362 lines)
- **Features**:
  - Matrix table displaying permissions across work divisions and roles, 2FA policies, session timeout configurations.

### 16. `/audit` (`audit.tsx` — 323 lines)
- **Features**:
  - Read-only table of append-only audit events with category filters, IP addresses, and JSON diff inspector.

### 17. `/license` (`license.tsx` — 518 lines)
- **Features**:
  - SaaS license management, tier limits, invoice download history, payment method updater, and cancel subscription trigger (Super Admin only).

### 18. `/shortcuts` (`shortcuts.tsx` — 476 lines)
- **Features**:
  - Visual configurator to customize which shortcuts appear on the primary dashboard.

---

## 3. UI Component System (`@vidyafloww/ui`)

The UI relies on a modular component library built on Radix primitives and Tailwind styling:
- `VFDataTable`: Virtualized/paginated data tables with column filtering, sorting, and row selection.
- `VFCard`: Standardized container with elevation, borders, and header actions.
- `VFDrawer`: Slide-over inspection drawers for 360° entity detail views.
- `VFModal`: Accessible focus-trapped dialogs.
- `VFBadge`: Semantic color badges for attendance, fees, status, and priorities.

---

## 4. Desktop-First Requirement & `SmallScreenBlocker`

The ERP is designed for institutional desktop administration. To prevent UI degradation on unsupported small mobile screens:
- `SmallScreenBlocker.tsx` is mounted at the root shell.
- It detects viewport widths below `1024px` and displays a responsive guidance message advising the user to open the command portal on a desktop or tablet in landscape mode, or use the dedicated mobile app.

---

## 5. Cleaned Legacy Code & Remnants Scan

- **Removed Landing Page**: The historical landing page in `apps/web/src/routes/landing.tsx` was fully removed in PR #41 (`9c63a7b`). The root `/` now points cleanly to `index.tsx` (Dashboard).
- **Subsystem Links**: Standalone micro-frontends are reached through `getSubsystemUrl()` helper in `@vidyafloww/constants`, cleanly decoupling their views from the core command portal.
