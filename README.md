<p align="center">
  <img src="./screenshots/VidyaFloww%20Banner.png" alt="VidyaFloww School Management Banner" width="100%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);" />
</p>

<div align="center">

# VidyaFloww — Enterprise School Management Platform

**A unified, high-performance digital operating system engineered for K-12 schools, colleges, and multi-campus educational networks.**

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript 5.6](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-1.x-FF4154?logo=reacttable&logoColor=white)](https://tanstack.com/router)
[![Zustand](https://img.shields.io/badge/Zustand-4.5-brown?logo=zustand&logoColor=white)](https://github.com/pmndrs/zustand)

</div>

---

## 📖 About VidyaFloww

**VidyaFloww** is an institutional-grade, full-stack educational ERP and campus command portal. Designed specifically for school administrators, principals, and educators, VidyaFloww eliminates administrative friction and replaces fragmented spreadsheets with an intuitive, clean, and blisteringly fast digital workspace.

### 🎨 Institutional Design System Highlights (V1)
- **High-Legibility Typography**: Solid 16px (`text-base`) foundation with high-contrast text and balanced metric indicators designed specifically for non-tech-friendly school personnel.
- **Pixel-Aligned Header Geometry**: Unified `72px` height across the top Navbar and Sidebar header creating an unbroken, symmetrical dividing line.
- **Square Collapsed Sidebar Navigation**: Centered `44px × 44px` square box geometry when collapsed for clean scanning.
- **Open Sub-Navigation Tabs**: Clean, open tabs resting directly on the sub-header with animated bottom underline indicators (no enclosing box wrappers).
- **Space-Efficient Borders (`rounded-lg` / `rounded-md`)**: Crisp 8px and 6px border radii that maximize screen real estate and avoid floaty capsule clutter.
- **Flat Single-Level Hierarchy**: Completely eliminates 3-level "box-inside-box" nesting in favor of clean divided lists (`divide-y divide-border`).
- **Dynamic School Identity & Logo Studio**: Real-time institution branding, custom logo upload, and preset emblem selectors with live Navbar header integration and `localStorage` persistence.

---

## 🏛️ Active V1 Application Modules & Overview Dashboards

VidyaFloww is organized into clean, isolated modules mapped to distinct, type-safe routes in `apps/web`:

| # | Module | Route | Key Capabilities |
|:---:|---|---|---|
| **01** | **Dashboard** | `/` | Real-time institutional telemetry, student attendance radar, priority action feed, biometric hardware sync |
| **02** | **Students** | `/students` | Enrolled student master roster, 360° academic profiles, demographic breakdown, batch promotions |
| **03** | **Admissions** | `/admissions` | 4-stage conversion funnel CRM, OCR document verification, merit scoring, instant admission letters |
| **04** | **Attendance** | `/attendance` | Interactive daily roll call, one-click "Mark All Present", absence alerts, biometric gate telemetry |
| **05** | **Academics** | `/academics` | Academic session master, subject catalog, classroom & section allocation matrix |
| **06** | **Timetable** | `/timetable` | Weekly period schedule matrix, automated teacher proxy & substitution matcher, standardized bell timings |
| **07** | **Teachers** | `/teachers` | Faculty & educator master directory, department workload meters, class allocations |
| **08** | **Teaching** | `/teaching` | Teacher daily workspace, 45-minute structured lesson planner, CBSE/NEP syllabus tracker |
| **09** | **Homework** | `/homework` | 2-tab unified workflow: rich-text assignment authoring & all-class submission evaluation queue |
| **10** | **Examinations** | `/examinations` | 3-tab examination suite: schedule datesheet, subject marks scheme, and lockable marks register |
| **11** | **E-Class & Live Room** | `/e-class`, `/live-room` | WebRTC live virtual classroom studio, interactive screen share, schedule lecture vault |
| **12** | **Fees & Payments** | `/fees` | Fee collection master register, quarterly dues tracking, WhatsApp reminder broadcasts |
| **13** | **Scholarships** | `/scholarships` | Merit & financial aid scholarship criteria, grant disbursement ledger |
| **14** | **Complaints** | `/complaints` | Grievance redressal registry, SLA resolution tracking, departmental escalation queues |
| **15** | **Surveys** | `/surveys` | Institutional feedback polls, participation meters, Net Promoter Score (NPS) analytics |
| **16** | **Notices** | `/notices` | 2-tab institutional notice publisher: multi-step audience composer & circular archive |
| **17** | **Reports & Statistics**| `/reports`, `/statistics`| CBSE / RTE compliance audits, academic GPA analytics, 1-click Excel (.xlsx) & PDF exports |
| **18** | **Settings & Security** | `/settings`, `/security`| School branding studio, RBAC role permissions, multi-campus governance |

---

## 🌐 Decoupled Standalone Subsystems Ecosystem

Specialized, operationally heavy subsystems are decoupled into dedicated standalone projects and subdomains. School administrators access **integrated, high-density overview dashboards** directly within the main portal, with 1-click seamless redirection to the full standalone engines:

| Subsystem | Main Portal Route | Standalone Subdomain | Overview Dashboard Capabilities |
|:---|:---|:---|:---|
| **Design Lab** | `/design-lab` | `designlab.vidyafloww.com` | 24 template presets (CBSE marksheet, CR80 ID cards, certificates, admit cards), live preview modal, batch exports |
| **Hostel Management** | `/hostel` | `hostel.vidyafloww.com` | Dormitory block & bed occupancy matrix, 3-course daily dining timetable, inside/outside headcounts, leave ledger |
| **Transport & Telemetry** | `/transport` | `transport.vidyafloww.com` | Live GPS fleet telematics, bus speed monitors, driver quick-call links, vehicle fitness & compliance audit |
| **HR & Biometrics** | `/hr-manage` | `hr.vidyafloww.com` | Support staff operations, 5 departmental shift rosters, live biometric turnstile punch feed, statutory payroll |
| **E-Library & DRM** | `/elibrary` | `library.vidyafloww.com` | NCERT textbook digital library, DRM chapter preview modal, active reader telemetry, circulation ledger |

---

## 🛠️ Technology Stack & Monorepo Architecture

```text
vidyafloww/
├── apps/
│   ├── web/                   # React 19 + Vite + TanStack Router Web Command Portal (37 routes)
│   │   ├── src/
│   │   │   ├── layouts/       # Header (72px), Sidebar (72px header), AppShell
│   │   │   ├── routes/        # TanStack Router type-safe route definitions & overview dashboards
│   │   │   ├── stores/        # Zustand global persistent store (localStorage)
│   │   │   └── styles/        # Tailwind design tokens, Mukta font & sharp border radii
│   ├── backend/               # Django 5.1 REST API + Celery 5.4 + Channels 4.1 backend
│   ├── landing/               # Institutional marketing and discovery site
│   ├── desktop/               # Electron desktop shell wrapper
│   └── mobile/                # Expo / React Native mobile shell
├── packages/
│   ├── ui/                    # @vidyafloww/ui standardized primitives (VFCard, VFTable, VFTabs, etc.)
│   ├── constants/             # Navigation configurations, module registries & metadata
│   ├── types/                 # Shared TypeScript interfaces
│   ├── api/                   # Axios API client with standardized error interceptors
│   ├── themes/                # Color palettes & tokens
│   └── validation/            # Shared Zod validation schemas
├── docs/                      # Technical specification documents (01-13)
└── README.md                  # Project overview documentation
```

---

## ⚙️ Backend Architecture & Readiness Status

The backend (`apps/backend`) is designed as a modular Django service layer configured for enterprise scale:

* **Technology Foundation**:
  * **Runtime**: Python 3.12+
  * **Framework**: Django 5.1, Django REST Framework (DRF) 3.15
  * **Stateless Auth**: SimpleJWT (15-min access tokens + HTTP-only refresh cookies)
  * **Real-time WebSockets**: Django Channels 4.1 with Redis channel layer
  * **Async Task Processing**: Celery 5.4 with Celery Beat & Celery Results backend
  * **API Documentation**: OpenAPI 3.0 via `drf-spectacular` (Swagger & Redoc)
  * **Database**: PostgreSQL (`psycopg3`) configured for production; local `db.sqlite3`
* **Development State**:
  * **System Health**: 100% verified — `python apps/backend/manage.py check` reports 0 issues.
  * **App Registrations**: 56 local apps registered across `core`, `platform_services`, `modules`, `ai`, and `integrations`.
  * **Database Migrations**: Default Django core migrations applied (`admin`, `auth`, `contenttypes`, `sessions`, `django_celery_beat`, `django_celery_results`).
  * **Implementation Reality**: Core scaffolding and settings are complete. 4 models are drafted (`ChartOfAccount`, `CertificateTemplate`, `TimetableSlot`, `CounsellingRecord`). Custom business serializers, views, and domain endpoints are ~5-10% developed. The web portal currently operates reliably on client-side Zustand stores and local simulation fixtures.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js**: `v20.x` or `v22.x` ([nodejs.org](https://nodejs.org/))
- **pnpm**: `v9.x` (`npm install -g pnpm`)
- **Python**: `v3.12+` (for backend services)
- **GitHub CLI**: `gh` command-line tool

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/logicbyroshan/vidyafloww-school-management.git
cd vidyafloww-school-management
```

---

### Step 2: Install Dependencies

```bash
pnpm install
```

---

### Step 3: Start the Web Development Server

```bash
pnpm --filter @vidyafloww/web dev
```

> The application will run at **`http://localhost:3000`** with Hot Module Replacement (HMR).

---

### Step 4: Validate Code & Types

```bash
# Validate type correctness across web portal
pnpm --filter @vidyafloww/web type-check

# Run web unit tests (Vitest)
pnpm --filter @vidyafloww/web test

# Verify Django backend integrity
python apps/backend/manage.py check
```

---

## 🌿 Git & Pull Request Workflow (Mandatory)

Per `AGENTS.md` Rule 8, **never commit or push directly to `main`**:

1. **Branch**: Create dedicated feature/fix branch:
   ```bash
   git checkout -b feature/<short-description>
   ```
2. **Verify & Audit**: Run `type-check`, `test`, and inspect `git status` to ensure **ZERO credentials, passwords, or `.env` files** are staged.
3. **Commit & Push**:
   ```bash
   git add <modified-files>
   git commit -m "feat(<scope>): concise summary"
   git push -u origin feature/<short-description>
   ```
4. **Generate PR via GitHub CLI**:
   ```bash
   gh pr create --title "feat(<scope>): summary" --body "Detailed change description"
   ```

---

## 🔐 Authentication & API Documentation

VidyaFloww features an enterprise authentication architecture adhering to CBSE cloud data compliance and OpenAPI 3.1 specifications.

- 📘 **Complete REST API Specification**: [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)
  - **Endpoints Covered**: Auth login, Google Workspace SSO, multi-role registration, OTP verification, password reset, JWT session renewal, and role-based scope verification.
  - **Backend Implementation Matrix**: See Section 6 in `API_DOCUMENTATION.md` for live backend readiness.

---

## 📄 License

Proprietary Software. All rights reserved &copy; 2026 **VidyaFloww Team**.

