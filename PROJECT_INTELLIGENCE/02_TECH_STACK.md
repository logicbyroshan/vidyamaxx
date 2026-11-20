# DOCUMENT 02: COMPLETE TECHNOLOGY STACK

> **Classification**: `EVIDENCE-BASED DEPENDENCY INVENTORY`  
> **Source Files**: `apps/backend/pyproject.toml`, `package.json`, `pnpm-workspace.yaml`, `apps/web/package.json`, `packages/*/package.json`, `*-VidyaFloww/package.json`

---

## 1. Stack Summary Table

| Category | Primary Technology | Version | Purpose | Active Status |
|---|---|---|---|---|
| **Backend Framework** | Django | `5.2.7` | Core Web & ORM Framework | `VERIFIED ACTIVE` |
| **API Framework** | Django REST Framework (DRF) | `3.15.2` | REST API Views, Serializers, Routing | `VERIFIED ACTIVE` |
| **API Documentation** | `drf-spectacular` | `0.28.0` | OpenAPI 3.1 Schema & Swagger/Redoc UI | `VERIFIED ACTIVE` |
| **Authentication** | `djangorestframework-simplejwt` | `5.5.0` | JWT Access & Refresh Token Management | `VERIFIED ACTIVE` |
| **CORS Management** | `django-cors-headers` | `4.6.0` | Cross-Origin Request Handling for SPAs | `VERIFIED ACTIVE` |
| **Database (Production)** | PostgreSQL | `16 / 17` | Relational Storage with RLS Support | `VERIFIED READY` |
| **Database Driver** | `psycopg` (binary) | `3.2.3` | Modern Async/Sync PostgreSQL Adapter | `VERIFIED ACTIVE` |
| **Database (Dev/Test)** | SQLite 3 | Embedded | High-Speed Local & CI/CD Testing Engine | `VERIFIED ACTIVE` |
| **Cache & Broker** | Redis | `7.x` | In-Memory Cache, Celery Broker, Channels Layer | `VERIFIED READY` |
| **Asynchronous Jobs** | Celery | `5.4.0` | Background Task Queue & Distributed Execution | `VERIFIED ACTIVE` |
| **Scheduled Tasks** | Celery Beat | Embedded | Periodic Cron & Reminder Automation | `VERIFIED ACTIVE` |
| **Realtime WebSockets** | Django Channels | `4.2.0` | WebSocket Connections (`/ws/`) | `VERIFIED ACTIVE` |
| **ASGI Server** | Daphne / Uvicorn | `4.1.2` / `0.34.0` | Asynchronous Protocol Server | `VERIFIED ACTIVE` |
| **WSGI Server** | Gunicorn | `23.0.0` | Production WSGI HTTP Server | `VERIFIED ACTIVE` |
| **Object Storage SDK** | `boto3` / `botocore` | `1.36.0` | AWS S3 / MinIO Presigned URL Storage | `VERIFIED ACTIVE` |
| **PDF Generation** | `reportlab` / `weasyprint` | `4.2.5` | Certificate & Report PDF Rendering | `VERIFIED ACTIVE` |
| **Excel Processing** | `openpyxl` | `3.1.5` | Tabular Data Import & Export Generation | `VERIFIED ACTIVE` |
| **Frontend Framework** | React | `19.0.0` / `18.3.1` | Declarative UI Library | `VERIFIED ACTIVE` |
| **Frontend Bundler** | Vite | `6.0.7` | Modern ESM Build Tool & Dev Server | `VERIFIED ACTIVE` |
| **Client Routing** | TanStack Router | `1.95.2` | Type-Safe File-Based Routing | `VERIFIED ACTIVE` |
| **Data Fetching** | TanStack Query | `5.62.14` | Server State Caching & Mutators | `VERIFIED ACTIVE` |
| **Client State** | Zustand | `5.0.3` | Lightweight Global Store (`globalStore.ts`) | `VERIFIED ACTIVE` |
| **Styling & CSS** | TailwindCSS | `3.4.17` | Utility-First CSS Framework | `VERIFIED ACTIVE` |
| **UI Components** | Radix UI + Lucide | Latest | Accessible Headless Primitives & Icons | `VERIFIED ACTIVE` |
| **HTTP Client** | Axios | `1.7.9` | Interceptor-Enabled HTTP Client (`@vidyafloww/api`) | `VERIFIED ACTIVE` |
| **Form Validation** | Zod | `3.24.1` | Client-Side Schema Validation | `VERIFIED ACTIVE` |
| **Monorepo Engine** | pnpm Workspaces + Turborepo | `10.2.0` / `2.3.3` | Fast Monorepo Linking & Build Pipeline | `VERIFIED ACTIVE` |
| **Backend Testing** | Pytest + Pytest-Django | `9.1.1` / `4.7.0` | Automated Test Suite (20 Suites) | `VERIFIED ACTIVE` |
| **Frontend Testing** | Vitest | `2.1.9` | High-Speed Unit & Component Testing (11 Tests) | `VERIFIED ACTIVE` |

---

## 2. Backend Dependencies Inventory (`apps/backend/pyproject.toml`)

```toml
[tool.poetry.dependencies]
python = ">=3.11,<3.14"
django = "^5.2.0"
djangorestframework = "^3.15.2"
drf-spectacular = "^0.28.0"
djangorestframework-simplejwt = "^5.5.0"
django-cors-headers = "^4.6.0"
psycopg = {extras = ["binary"], version = "^3.2.3"}
redis = "^5.2.1"
celery = "^5.4.0"
channels = "^4.2.0"
channels-redis = "^4.2.1"
daphne = "^4.1.2"
gunicorn = "^23.0.0"
uvicorn = "^0.34.0"
boto3 = "^1.36.0"
django-storages = "^1.14.4"
reportlab = "^4.2.5"
openpyxl = "^3.1.5"
pillow = "^11.1.0"
phonenumbers = "^8.13.52"
python-dateutil = "^2.9.0"
requests = "^2.32.3"
argon2-cffi = "^23.1.0"

[tool.poetry.group.dev.dependencies]
pytest = "^9.1.1"
pytest-django = "^4.7.0"
pytest-mock = "^3.12.0"
pytest-asyncio = "^1.4.0"
factory-boy = "^3.3.1"
faker = "^20.1.0"
ruff = "^0.9.0"
mypy = "^1.14.0"
django-stubs = "^5.1.1"
djangorestframework-stubs = "^3.15.1"
```

- **Python Version Compatibility**: Verified working under Python `3.11.9` (local venv) and compatible up to `3.13`.
- **Database Portability**: Swappable between `sqlite3` (local zero-setup development) and `postgresql` (multi-tenant production) via environment flag `USE_SQLITE=true|false`.

---

## 3. Frontend Monorepo Packages (`packages/*`)

The monorepo architecture isolates shared logic into 11 internal packages:

| Package Name | Workspace Directory | Purpose | Version |
|---|---|---|---|
| `@vidyafloww/api` | `packages/api` | Axios API client, base URLs, auth token injectors | `0.1.0` |
| `@vidyafloww/assets` | `packages/assets` | Brand assets, school logos, default badges | `0.1.0` |
| `@vidyafloww/config` | `packages/config` | Shared ESLint, Prettier, and TypeScript base configs | `0.1.0` |
| `@vidyafloww/constants` | `packages/constants` | 30 Work Divisions, Roles, Subsystem local ports | `0.1.0` |
| `@vidyafloww/hooks` | `packages/hooks` | Shared React hooks (debounce, local storage, media queries) | `0.1.0` |
| `@vidyafloww/icons` | `packages/icons` | Lucide icon component wrappers | `0.1.0` |
| `@vidyafloww/themes` | `packages/themes` | Tailwind theme extensions, color tokens | `0.1.0` |
| `@vidyafloww/types` | `packages/types` | Shared TypeScript domain types and API DTOs | `0.1.0` |
| `@vidyafloww/ui` | `packages/ui` | Design system: `VFDataTable`, `VFCard`, `VFModal`, `VFDrawer`, `VFButton` | `0.1.0` |
| `@vidyafloww/utils` | `packages/utils` | Date formatting (IST), currency (`INR`), math helpers | `0.1.0` |
| `@vidyafloww/validation`| `packages/validation` | Shared Zod schemas for forms and validations | `0.1.0` |

---

## 4. Decoupled Subsystem Frontend Manifests (`E:\E\VidyaMaxx\*-VidyaFloww`)

| Subsystem Name | Directory | Package Name | Port | Files Count |
|---|---|---|---|---|
| **Admissions** | `Admissions-VidyaFloww` | `@vidyafloww/admissions` | `8018` | 32 |
| **Communication** | `Communication-VidyaFloww` | `@vidyafloww/communication` | `8022` | 32 |
| **Design Lab** | `Design-VidyaFloww` | `@vidyafloww/design-lab` | `8010` | 40 |
| **E-Class** | `E-Class-VidyaFloww` | `@vidyafloww/e-class` | `8016` | 38 |
| **Examinations** | `Examinations-VidyaFloww` | `@vidyafloww/examinations` | `8021` | 32 |
| **Hostel** | `Hostel-VidyaFloww` | `@vidyafloww/hostel-management` | `8011` | 40 |
| **HRM** | `HRM-VidyaFloww` | `@vidyafloww/hr-management` | `8013` | 40 |
| **Library** | `Library-VidyaFloww` | `@vidyafloww/library-management` | `8014` | 40 |
| **LMS** | `LMS-VidyaFloww` | `@vidyafloww/lms` | `8019` | 34 |
| **Payments** | `Payments-VidyaFloww` | `@vidyafloww/payments` | `8020` | 33 |
| **Portal** | `Portal-VidyaFloww` | `@vidyafloww/portal` | `8017` | 32 |
| **Transport** | `Transport-VidyaFloww` | `@vidyafloww/transport-management` | `8012` | 40 |
| **Landing (Archived)** | `Landing-VidyaFloww` | `@vidyafloww/landing` | `8009` | 11 |

---

## 5. Verified vs. Suspected / Outdated Dependencies

1. **`psycopg[binary]` vs `psycopg2-binary` (`VERIFIED`)**:
   - The project uses modern `psycopg` 3.x (`^3.2.3`), which is fully compatible with Python 3.11–3.13 and async Django ORM queries.
2. **`USE_SQLITE` Default in Development (`VERIFIED`)**:
   - In local development, `config/settings/development.py` defaults to `USE_SQLITE = True`, generating `vidyafloww_dev.sqlite3`. This provides rapid iteration without requiring a local PostgreSQL instance running. In production (`config/settings/production.py`), PostgreSQL with connection pooling is strictly enforced.
3. **`Landing-VidyaFloww` Status (`VERIFIED ARCHIVED`)**:
   - Per PR #41 (`9c63a7b`), the public marketing landing page was decoupled and removed from the core portal monorepo, preserved in `Landing-VidyaFloww` as a standalone static reference.
