# 02 — Architecture

## System Architecture Overview

VidyaFloww follows a **modular monolith** backend architecture combined with a
**multi-package monorepo** frontend strategy. This provides the simplicity of a
monolith while enabling independent development of features.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Web    │  │  Mobile  │  │ Desktop  │  │   3rd    │  │
│  │ (React)  │  │ (Expo)   │  │(Electron)│  │  Party   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
└───────┼─────────────┼─────────────┼──────────────┼─────────┘
        │             │             │              │
        └─────────────┴─────────────┘              │
                      │                            │
               ┌──────▼──────┐           ┌─────────▼────────┐
               │    Nginx    │           │  Webhook Handler  │
               │  (Reverse   │           │   (Integrations)  │
               │   Proxy)    │           └──────────────────┘
               └──────┬──────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
   ┌────▼─────┐ ┌─────▼─────┐ ┌───▼───────┐
   │   HTTP   │ │ WebSocket  │ │   Admin   │
   │  (DRF)   │ │(Channels)  │ │  Panel    │
   └────┬─────┘ └─────┬─────┘ └───────────┘
        │             │
        └──────┬───────┘
               │
        ┌──────▼──────────────────────────────────────┐
        │              Django Application              │
        │                                             │
        │  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
        │  │  Core   │  │ Platform │  │  Modules  │  │
        │  │  Apps   │  │  Apps    │  │  (Domain) │  │
        │  └─────────┘  └──────────┘  └───────────┘  │
        │                                             │
        │  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
        │  │   AI    │  │Integrtns │  │  Common   │  │
        │  │  Layer  │  │          │  │  Library  │  │
        │  └─────────┘  └──────────┘  └───────────┘  │
        └──────────────────────────────────────────────┘
                      │           │
            ┌─────────▼─┐   ┌─────▼──────┐
            │ PostgreSQL │   │   Redis    │
            │  (Primary) │   │(Cache/MQ)  │
            └────────────┘   └──────┬─────┘
                                    │
                             ┌──────▼──────┐
                             │   Celery    │
                             │  Workers   │
                             └─────────────┘
```

## Backend Architecture Layers

### Layer 1: Core Apps
Foundation-level apps that all other modules depend on.
- `accounts` — User account management
- `authentication` — JWT authentication, session management
- `organizations` — Multi-tenant organization management
- `campuses` — Campus/branch management within organizations
- `users` — Extended user profiles and roles
- `permissions` — Role-based access control (RBAC)
- `sessions` — User session tracking

### Layer 2: Platform Services
Cross-cutting concerns used by domain modules.
- `notifications` — Push, email, SMS notification orchestration
- `audit` — Immutable audit log for all data changes
- `activity` — User activity feed
- `storage` — File upload/storage abstraction
- `search` — Full-text search coordination
- `workflows` — Configurable approval workflows
- `reports` — Report generation engine
- `exports` — Data export (CSV, Excel, PDF)
- `imports` — Bulk data import processing

### Layer 3: Domain Modules
Independent, business-domain-specific feature modules.
Each module is self-contained with its own models, views, services, and tasks.

### Layer 4: AI Layer
AI/ML capabilities as a service to other modules.
- `providers` — LLM provider abstraction (OpenAI, Gemini, etc.)
- `assistants` — Domain-specific AI assistant implementations
- `ocr` — Document OCR processing
- `predictions` — ML prediction models

### Layer 5: Integrations
External service connectors.
- Payment gateways, SMS providers, email, WhatsApp, biometric hardware

## Service Pattern (Django)

Each module follows a strict layered service pattern:

```
Request → View → Serializer (validation)
              → Selector (read) or Service (write)
              → Model (persistence)
              → Signal → Task (async side effects)
```

- **Views** — Thin; handle HTTP only
- **Serializers** — Validation + serialization only
- **Selectors** — Read-only queries (`get_student_by_id`, `list_active_students`)
- **Services** — Write operations with business logic (`enroll_student`, `process_fee_payment`)
- **Tasks** — Async operations via Celery (emails, reports, AI calls)

## Frontend Architecture

### Shared Package Strategy

```
packages/
  api/        → HTTP client (Axios + interceptors)
  types/      → TypeScript type definitions (source of truth)
  validation/ → Zod schemas (shared between apps)
  constants/  → Routes, enums, roles
  hooks/      → Shared React hooks
  ui/         → Shared UI components (shadcn/ui base)
  utils/      → Pure utility functions
  themes/     → Design tokens and theme config
```

### State Management Strategy

| State Type | Solution |
|-----------|----------|
| Server state | TanStack Query |
| Global client state | Zustand stores |
| Form state | React Hook Form + Zod |
| URL/navigation state | TanStack Router |
| Local component state | React useState |

## Multi-Tenancy Design

VidyaFloww uses a **shared schema with tenant isolation** approach:

- Every model has an `organization` foreign key
- A custom `TenantMiddleware` injects the current organization from the JWT claims
- A `TenantQuerySet` base manager automatically filters all queries by organization
- Superadmin accounts can bypass tenant isolation for platform management

> TODO: Implement TenantMiddleware and TenantQuerySet in common.middleware and common.models.

## Caching Strategy

| Data Type | Cache TTL | Strategy |
|-----------|-----------|----------|
| User session data | 24 hours | Redis with JWT |
| Organization config | 1 hour | Django cache framework |
| Report data | 15 minutes | Cache-then-update |
| Notification counts | 30 seconds | Cache invalidation on write |
| Static reference data | 24 hours | Cache warming on deploy |

## Decoupled Standalone Subsystems Architecture

VidyaFloww decouples operation-heavy subsystems into dedicated standalone repositories and subdomains, while maintaining **integrated single-page overview dashboards** directly within the main command portal:

```
┌────────────────────────────────────────────────────────────────────────┐
│             VidyaFloww Main Command Portal (apps/web)                   │
│   • Core ERP: Students, Admissions, Attendance, Academics, Fees, Exams  │
│   • Integrated Overview Dashboards (Stats, Modals, Status Matrices)     │
└────────┬──────────────┬───────────────┬──────────────┬─────────────────┘
         │              │               │              │
         │ Redirect     │ Redirect      │ Redirect     │ Redirect
         ▼              ▼               ▼              ▼
┌─────────────────┐ ┌────────────────┐ ┌───────────────┐ ┌───────────────┐
│   Design Lab    │ │Hostel Mgmt App │ │Transport App  │ │  HR & Biomet  │
│ designlab.*.com │ │  hostel.*.com  │ │transport.*.com│ │   hr.*.com    │
└─────────────────┘ └────────────────┘ └───────────────┘ └───────────────┘
```

| Subsystem | Main Portal Route | Standalone Target | Architectural Role |
|:---|:---|:---|:---|
| **Design Lab** | `/design-lab` | `designlab.vidyafloww.com` | Vector-rendered certificates, CBSE marksheets, CR80 ID card generation engine |
| **Hostel Management** | `/hostel` | `hostel.vidyafloww.com` | Dormitory room matrix, 7-day nutritional timetable, night attendance, outpass ledger |
| **Transport Telemetry** | `/transport` | `transport.vidyafloww.com` | GPS fleet hardware telematics, live route tracking, driver compliance audit |
| **HR & Biometrics** | `/hr-manage` | `hr.vidyafloww.com` | Biometric turnstile logs, support staff departmental rosters, statutory payroll |
| **E-Library & DRM** | `/elibrary` | `library.vidyafloww.com` | DRM protected reading engine, NCERT digital textbook catalog, circulation tracking |

---

*Last updated: 2026-09-08*

