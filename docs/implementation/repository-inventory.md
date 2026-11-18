# VidyaFloww — Repository & Ecosystem Inventory (Phase 0 Audit)

> **Audit Date**: 2026-11-18  
> **Scope**: Monorepo (`E:\E\VidyaMaxx\VidyaMaxx`) and 13 decoupled standalone applications (`E:\E\VidyaMaxx\*-VidyaFloww`)

---

## 1. Root Workspace Structure (`VidyaMaxx`)

- **Monorepo Tooling**: `pnpm@9.0.0` workspaces (`pnpm-workspace.yaml`: `apps/*`, `packages/*`) orchestrated by `turbo@2.0.0` (`turbo.json`).
- **CI/CD**: `.github/workflows/ci.yml` (manual `workflow_dispatch`: `lint`, `type-check`, `build`, `test-backend` on PostgreSQL 16 + Redis 7, `test-web`) and `.github/workflows/cd.yml`.
- **Containerization & Reverse Proxy**:
  - `docker/docker-compose.yml`: Defines 6 services (`postgres:16-alpine`, `redis:7-alpine`, `backend`, `celery`, `celery-beat`, `web`).
  - `docker/Dockerfile.backend`: Multi-stage Python 3.13 + Poetry 1.8 image (`runserver` in dev; `gunicorn` + `uvicorn.workers.UvicornWorker` in prod).
  - `nginx/default.conf`: SPA fallback on `/`, proxy `/api/` and `/ws/` to `backend:8000`.
- **Existing Pre-Audit Docs**: `docs/01-project-overview.md` through `docs/13-modules-specification.md`, `API_DOCUMENTATION.md`, `AGENTS.md`, `.agent/CONTEXT.md`, `.agent/DECISIONS.md`, `.agent/CHANGELOG.md`.

---

## 2. Monorepo Applications (`apps/*`)

| App Path | Package Name | Tech Stack | Current Purpose & State |
|---|---|---|---|
| `apps/web` | `@vidyafloww/web` | React 19, Vite 5.4, TanStack Router 1, TanStack Query 5, Zustand 5, Tailwind CSS 3.4, Lucide Icons, JSZip | Core administrative command portal (**20 route files**: 19 operational screens + `__root.tsx`). Fully interactive UI backed by Zustand + simulated fixtures; zero live API calls yet. |
| `apps/backend` | `vidyafloww-backend` | Python 3.11.9 (`.venv`) / 3.13 (Docker), Django 5.2.17, DRF 3.18.1, SimpleJWT 5.5.1, Celery 5.6.3, Channels 4.3.2, drf-spectacular 0.30.0 | Settings, Celery, ASGI, and 56 app directories registered in `INSTALLED_APPS`. Only 4 partial models exist; zero serializers/views/URLs mounted; SQLite active (`db.sqlite3`). |
| `apps/desktop` | `@vidyafloww/desktop` | Electron 33, Vite 5.4, React 19 | Scaffolded desktop wrapper referencing workspace packages. |
| `apps/mobile` | `@vidyafloww/mobile` | React Native 0.76, Expo ~52, Expo Router ~4, React 18.3.1 | Scaffolded mobile shell for Android/iOS. |

*(Note: `apps/landing` was removed from the monorepo in PR #41 and archived to `Landing-VidyaFloww`.)*

---

## 3. Shared Workspace Packages (`packages/*`)

| Package | Name | Key Exports & Audit Notes |
|---|---|---|
| `packages/api` | `@vidyafloww/api` | `createApiClient`, `apiClient` (Axios targeting `VITE_API_URL ?? 'http://localhost:8000/api/v1'`), `ApiError`, `PaginatedResponse`. **Auth & error interceptors are `TODO` stubs.** |
| `packages/constants` | `@vidyafloww/constants` | `API_ENDPOINTS` (auth, users, orgs, students, admissions stubs), `SUBSYSTEMS` & `getSubsystemUrl()` (12 subsystems), `MODULE_REGISTRY` (13 in-portal modules), `ROLES` (**legacy flat role list — needs alignment with Master Prompt Section 7**), `ROUTES` (**contains legacy routes for decoupled pages — needs sync**), `STUDENT_STATUS`, `ADMISSION_STATUS`, `FEE_STATUS`, `ATTENDANCE_STATUS`. |
| `packages/types` | `@vidyafloww/types` | `common.ts` (`UUID`, `Auditable`, `PaginationParams`), `domain/academic.ts`, `domain/finance.ts`, `domain/organization.ts`, `domain/student.ts`, `domain/user.ts` (**legacy `UserRole` union**). |
| `packages/validation` | `@vidyafloww/validation` | Zod `primitives.ts` & `pagination.ts` schemas. |
| `packages/ui` | `@vidyafloww/ui` | Complete design-system primitive library (`VFPageContainer`, `VFPageToolbar`, `VFCard`, `VFDataTable`, `VFTable`, `VFStatCard`, `VFTabs`, `VFButton`, `VFBadge`, `VFDialog`, `VFDrawer`, `VFCharts`, `VFFormControls`, `VFSearchBar`, `VFEmptyState`, `VFLoading`). |
| `packages/utils` | `@vidyafloww/utils` | `export.ts`, `format.ts`, `sanitize.ts` (DOMPurify), `string.ts`. |
| `packages/hooks` | `@vidyafloww/hooks` | Shared React hooks. |
| `packages/themes` | `@vidyafloww/themes` | Design tokens & dark mode palette. |
| `packages/icons`, `assets`, `config` | `@vidyafloww/*` | Shared assets, SVG icons, ESLint/TS configs. |

---

## 4. Decoupled Standalone Applications (`E:\E\VidyaMaxx\*-VidyaFloww`)

All 12 decoupled functional subsystems (plus archived `Landing-VidyaFloww`) reside as standalone Vite + React 19 frontends in sibling directories:

| Directory | Package Name | `package.json` Port | `.env.example` Backend Port | `constants/subsystems.ts` Port | Actual Backend Code? |
|---|---|---|---|---|---|
| `Design-VidyaFloww` | `@vidyafloww/design-lab` | `8010` | `8110` (`design_lab_db`) | `8015` | **No** (Design spec doc only) |
| `Hostel-VidyaFloww` | `@vidyafloww/hostel-management` | `8011` | `8111` (`hostel_management_db`) | `8013` | **No** (Design spec doc only) |
| `Transport-VidyaFloww` | `@vidyafloww/transport-management` | `8012` | `8112` (`transport_management_db`) | `8010` | **No** (Design spec doc only) |
| `HRM-VidyaFloww` | `@vidyafloww/hr-management` | `8013` | `8113` (`hr_management_db`) | `8014` | **No** (Design spec doc only) |
| `Library-VidyaFloww` | `@vidyafloww/library-management` | `8014` | `8114` (`library_management_db`) | `8011` | **No** (Design spec doc only) |
| `E-Class-VidyaFloww` | `@vidyafloww/e-class` | `8016` | N/A | `8012` | **No** |
| `Portal-VidyaFloww` | `@vidyafloww/portal` | `8017` | N/A | `8017` | **No** |
| `Admissions-VidyaFloww` | `@vidyafloww/admissions` | `8018` | N/A | `8018` | **No** |
| `LMS-VidyaFloww` | `@vidyafloww/lms` | `8019` | N/A | `8019` | **No** |
| `Payments-VidyaFloww` | `@vidyafloww/payments` | `8020` | N/A | `8020` | **No** |
| `Examinations-VidyaFloww` | `@vidyafloww/examinations` | `8021` | N/A | `8021` | **No** |
| `Communication-VidyaFloww` | `@vidyafloww/communication` | `8022` | N/A | `8022` | **No** |
| `Landing-VidyaFloww` | `@vidyafloww/landing` | `vite` default | N/A | N/A | **No** (Archived site) |

---

## 5. Dependency Audit Summary

- **Frontend (`apps/web`)**: React 19, TanStack Router 1, TanStack Query 5, Zustand 5, React Hook Form 7, Zod 3.23, Lucide React, Framer Motion 12, Lenis 1.3, JSZip 3.10, Sonner 2.0, `cmdk` 1.1.
- **Backend (`apps/backend/pyproject.toml` vs `.venv`)**:
  - Installed in `.venv`: Python 3.11.9, Django 5.2.17, DRF 3.18.1, `djangorestframework_simplejwt` 5.5.1, `django-filter` 26.1, `django-cors-headers` 4.9.0, `channels` 4.3.2, `celery` 5.6.3, `django-celery-beat` 2.9.0, `django_celery_results` 2.6.0, `redis` 8.1.0, `django-redis` 7.0.0, `drf-spectacular` 0.30.0, `django-storages` 1.14.6, `pillow` 12.3.0.
  - Declared in `pyproject.toml`/`requirements.txt` but **missing from `.venv`**: `psycopg[binary]`, `boto3`, `python-decouple`, `sentry-sdk`, `gunicorn`, `uvicorn`, `channels-redis`, `pytest`, `pytest-django`, `factory-boy`, `faker`, `ruff`, `mypy`, `django-debug-toolbar`.
  - **Local PostgreSQL Service**: `postgresql-x64-17` is installed as a Windows service (currently `Stopped`).
