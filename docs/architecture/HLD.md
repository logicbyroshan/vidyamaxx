# VidyaFloww — High-Level Design (HLD)

> **Version**: 1.0.0 (Phase 0 Architecture Baseline)  
> **Scope**: Multi-Tenant School Management SaaS Platform (`VidyaFloww`)

---

## 1. System Overview

VidyaFloww is a multi-tenant, India-first School Management SaaS platform unifying institutional administration, academic operations, finance, compliance, and stakeholder portals.

### Ecosystem Components
- **Clients**:
  - **Main Command Portal (`apps/web`)**: React 19 + TypeScript + Vite + TanStack Router/Query command ERP (port `3000`).
  - **Desktop (`apps/desktop`) & Mobile (`apps/mobile`)**: Electron & React Native/Expo shells consuming `/api/v1/`.
  - **12 Decoupled Standalone Micro-Frontends (`*-VidyaFloww`)**: Portal (`8017`), Admissions (`8018`), LMS (`8019`), Payments (`8020`), Examinations (`8021`), Communication (`8022`), Design Lab (`8010`), Hostel (`8011`), Transport (`8012`), HR/Biometrics (`8013`), E-Library (`8014`), E-Class (`8016`).
- **Modular Django Monolith (`apps/backend`)**:
  - Django 5.2 + DRF 3.18 REST API (`/api/v1/`), Django Channels 4.3 WebSockets (`/ws/`), `drf-spectacular` OpenAPI 3.1.
- **Data & Async Infrastructure**:
  - **PostgreSQL 16/17**: Primary relational database with shared-schema tenant/school isolation (`school_id` + `tenant_id` indexing + PostgreSQL RLS defense-in-depth).
  - **Redis 7**: Cache backend, SimpleJWT revocation blacklist, Channels layer, Celery message broker & beat schedule.
  - **Celery 5.6 + Celery Beat**: Asynchronous imports/exports, PDF/Excel reports, SMS/WhatsApp/Email dispatch, scheduled reminders, webhook retries.
  - **Object Storage**: Local filesystem in development; AWS S3 / S3-compatible presigned URLs in production.
- **External Integrations**: Razorpay/Cashfree/PayU (UPI/Cards), DLT SMS (MSG91/Kaleyra), Meta WhatsApp Cloud API, AWS SES/SMTP, Biometric hardware (eSSL/ZKTeco), GPS fleet feeds, Google/Microsoft OAuth SSO, Sentry monitoring.

---

## 2. Architecture Diagrams

### 2.1 Overall System Architecture

```mermaid
flowchart TB
    subgraph Clients["Client Layer"]
        WEB["Main Command Portal (apps/web)"]
        MOB["Mobile App (Expo)"]
        DSK["Desktop App (Electron)"]
        EXTUI["12 Decoupled Micro-Apps (*-VidyaFloww)"]
    end

    subgraph Edge["Edge & Gateway Layer"]
        NGX["Nginx Reverse Proxy / WAF / TLS 1.3"]
    end

    subgraph Backend["VidyaFloww Django Monolith (apps/backend)"]
        DRF["REST API (/api/v1/ - DRF + SimpleJWT)"]
        WS["Realtime WebSockets (/ws/ - Channels)"]
        AUTH["Tenant & Responsibility RBAC Middleware"]
        CORE["Core & Platform Services"]
        DOM["30 School Work Division Modules"]
        ADAPT["Subsystem Adapters & Webhook Receivers"]
    end

    subgraph Async["Async & Storage Infrastructure"]
        CEL["Celery Workers & Beat Scheduler"]
        S3["Object Storage (Local / S3 Presigned)"]
    end

    subgraph Data["Persistence Layer"]
        PG["PostgreSQL (Primary Multi-Tenant DB)"]
        RED["Redis (Cache, JWT Blacklist, Broker, Channels)"]
    end

    subgraph External["External Services & Hardware"]
        PAY["UPI / Payment Gateways"]
        MSG["DLT SMS / WhatsApp / Email"]
        BIO["Biometric & GPS Hardware"]
        MON["Sentry / Structured Logs"]
    end

    WEB --> NGX
    MOB --> NGX
    DSK --> NGX
    EXTUI --> NGX

    NGX --> DRF
    NGX --> WS

    DRF --> AUTH
    WS --> AUTH
    AUTH --> CORE
    AUTH --> DOM
    AUTH --> ADAPT

    CORE --> PG
    DOM --> PG
    DOM --> RED
    CORE --> RED
    DOM --> S3

    DOM --> CEL
    CEL --> RED
    CEL --> PG
    CEL --> S3
    CEL --> MSG
    ADAPT --> PAY
    ADAPT --> BIO
    DRF --> MON
```

### 2.2 Main Portal Architecture (`apps/web`)

```mermaid
flowchart LR
    ROUTER["TanStack Router (19 Active Routes)"] --> SHELL["AppShell (Header + Sidebar + SmallScreenBlocker)"]
    SHELL --> PAGES["Module Pages (Students, Academics, Attendance, etc.)"]
    PAGES --> HOOKS["Feature TanStack Query Hooks"]
    SHELL --> ZUST["Zustand globalStore (UI Prefs, Session, Active Branch)"]
    SHELL --> CMD["CommandPalette (Ctrl+K) & AIChatDrawer (Shift+K)"]
    HOOKS --> APICLI["@vidyafloww/api (Axios + JWT + X-School-ID Interceptor)"]
    APICLI --> API["Django REST API (/api/v1/)"]
    PAGES --> UIPKG["@vidyafloww/ui (VFDataTable, VFCard, VFTabs, VFDrawer)"]
    PAGES --> SUBLINK["getSubsystemUrl() Deep Links"]
    SUBLINK --> MICRO["12 Standalone Micro-Apps"]
```

### 2.3 Backend Domain Architecture

```mermaid
flowchart TB
    subgraph L1["Layer 1: Core Identity & Multi-Tenancy"]
        ID["core.accounts & identity"]
        AUTHN["core.authentication (JWT/OTP/SSO)"]
        ORG["core.organizations & schools"]
        BR["core.campuses (Branches)"]
        PERM["core.permissions (Work Divisions & Scopes)"]
    end

    subgraph L2["Layer 2: Platform Cross-Cutting Services"]
        ST["storage"]
        AUD["audit (Append-Only)"]
        NTF["notifications"]
        IMP["imports / exports / reports"]
        SET["settings / forms / search"]
    end

    subgraph L3["Layer 3: School Business Domains (30 Divisions)"]
        G1["Group 1: Admissions, Students, Academics, Timetable, Attendance"]
        G2["Group 2: Teaching, Homework, Examinations, Resources, Online Classes"]
        G3["Group 3: Fees & Finance, Documents, Library, Transport, Hostel, Inventory, Assets"]
        G4["Group 4: Staff & HR, Student Health, Counselling & Support"]
        G5["Group 5: Communication, Events, Activities, Surveys, Complaints, Front Office"]
        G6["Group 6: Reports & Analytics, School Admin, Compliance, Security & Audit"]
    end

    subgraph L4["Layer 4: Cross-Platform AI & External Integrations"]
        AI["ai.* (Cross-Platform OCR, Lesson Draft, Defaulter Risk)"]
        INT["integrations.* (Razorpay, DLT SMS, WhatsApp, Biometric, GPS, OAuth)"]
    end

    L3 --> L1
    L3 --> L2
    L3 --> AI
    L3 --> INT
```

### 2.4 Database Architecture (Shared Schema + Tenant Hierarchy)

```mermaid
erDiagram
    CUSTOMER_TENANT ||--o{ SCHOOL : owns
    CUSTOMER_TENANT ||--o{ SUBSCRIPTION : holds
    SCHOOL ||--o{ BRANCH : has
    SCHOOL ||--o{ ACADEMIC_SESSION : configures
    USER ||--o{ MEMBERSHIP : belongs_to
    SCHOOL ||--o{ MEMBERSHIP : scopes
    BRANCH ||--o{ MEMBERSHIP : optionally_scopes
    MEMBERSHIP ||--o{ STAFF_RESPONSIBILITY : granted
    SCHOOL ||--o{ STUDENT : enrolls
    STUDENT ||--o{ STUDENT_ENROLLMENT : tracks_per_session
    ACADEMIC_SESSION ||--o{ STUDENT_ENROLLMENT : scopes
```

### 2.5 Authentication Architecture

```mermaid
sequenceDiagram
    participant U as User (Web/Mobile/Sub-app)
    participant API as Django Auth API (/api/v1/auth/)
    participant R as Redis (OTP / Blacklist / Rate Limit)
    participant PG as PostgreSQL (User & Membership)

    U->>API: POST /auth/login/ (identifier, password, deviceInfo)
    API->>R: Check IP & account rate limit
    API->>PG: Verify Argon2/PBKDF2 password & User.is_active
    PG-->>API: User + Active Memberships + Default School/Branch
    API->>R: Store Refresh JTI & DeviceSession record
    API-->>U: 200 OK (Access JWT 15m + HttpOnly Refresh Cookie 7d)

    Note over U,API: Subsequent API Request
    U->>API: GET /api/v1/students/ + Bearer AccessJWT + X-School-ID + X-Branch-ID
    API->>R: Check if JTI revoked / user blacklisted
    API->>PG: Validate active Membership for requested School/Branch
    API-->>U: 200 OK (Tenant-isolated data)

    Note over U,API: Token Refresh & Rotation
    U->>API: POST /auth/token/refresh/ (Refresh Cookie)
    API->>R: Verify unused Refresh JTI & mark rotated (detect reuse!)
    API-->>U: New Access JWT + New Refresh Cookie
```

### 2.6 Authorization & Scoped Responsibility Architecture

```mermaid
flowchart TD
    REQ["Incoming Request (Authenticated User + X-School-ID)"] --> CHECK_TYPE{"Check User Type"}
    CHECK_TYPE -->|"SUPER_ADMIN"| SA["Platform Owner: Full access + Can Cancel Subscription"]
    CHECK_TYPE -->|"SUPER_EXECUTIVE"| SE["Delegated Platform Ops: Explicit perms (Subscription Cancel BLOCKED)"]
    CHECK_TYPE -->|"SCHOOL_ADMIN / SCHOOL_EXECUTIVE"| SC["School Management: Full School Workspace (within assigned School/Branch scope)"]
    CHECK_TYPE -->|"STAFF"| ST["Unified Staff User: Query StaffResponsibilityAssignment"]
    CHECK_TYPE -->|"STUDENT / PARENT"| END["Self or Linked Guardian Children Only"]

    ST --> DIV["Match Division & Submodule & Action (e.g. Attendance -> Submit)"]
    DIV --> ACTIVE{"Active Window & Not Revoked?"}
    ACTIVE -->|No| DENY["403 Forbidden"]
    ACTIVE -->|Yes| SCOPE["Apply Data Scope Filter (Branch / Class / Section / Subject / Student)"]
    SCOPE --> QUERY["Selector filters queryset strictly to allowed IDs"]
```

### 2.7 External Subsystem & Micro-App Integrations

```mermaid
flowchart LR
    CORE["VidyaFloww Core Backend (apps/backend)"]
    HOSTEL["Hostel Subsystem"]
    TRANS["Transport & GPS Subsystem"]
    LIB["E-Library & DRM Subsystem"]
    HR["HR & Biometric Subsystem"]
    DLAB["Design Lab Subsystem"]
    ECLS["E-Class Live Subsystem"]
    PORT["Portal / Admissions / LMS / Payments / Exams / Comms UIs"]

    PORT -->|"Direct /api/v1/ + Scoped JWT"| CORE
    CORE <-->|"REST + Signed Webhook (Student & Fee Sync)"| HOSTEL
    CORE <-->|"REST + Signed Webhook (Student & Route Sync)"| TRANS
    CORE <-->|"Presigned S3 + Circulation Sync"| LIB
    CORE <-->|"Unified StaffProfile + Biometric & Payroll Sync"| HR
    CORE <-->|"Snapshot API + Document Hash Registry"| DLAB
    CORE <-->|"Session Token + Attendance Callback"| ECLS
```

### 2.8 Notification Architecture

```mermaid
flowchart LR
    EVT["Domain Event (e.g., Student Absent, Fee Paid, Circular Published)"] --> NSVC["Notification Orchestrator Service"]
    NSVC --> PREF["Check School Templates (DLT ID / HSM) & Preferences"]
    PREF --> QUEUE["Celery Priority Queues (urgent / default)"]
    QUEUE --> EMAIL["Email Worker (SES / SMTP)"]
    QUEUE --> SMS["DLT SMS Worker (MSG91 / Kaleyra)"]
    QUEUE --> WA["WhatsApp Worker (Cloud API)"]
    QUEUE --> PUSH["In-App & Push Worker (Channels WS / FCM)"]
    EMAIL --> LOG["NotificationDeliveryLog + Retry / DLQ"]
    SMS --> LOG
    WA --> LOG
    PUSH --> LOG
```

### 2.9 File & Document Management Architecture

```mermaid
flowchart TB
    UP["Client Upload (Multipart <= 10MB or Direct Presigned)"] --> VAL["FileValidator (MIME magic bytes, Extension allowlist, Size, Malware scan hook)"]
    VAL --> META["StoredFile Record (UUID, school_id, owner_id, checksum_sha256, visibility, retention_until)"]
    META --> ENG{"Environment?"}
    ENG -->|Development| LOC["Local Protected Media Root (/api/v1/storage/files/{id}/download/)"]
    ENG -->|Production| S3["Private S3 Bucket (Short-Lived Presigned GET URLs after RBAC Check)"]
```

### 2.10 Background Task & Async Processing Architecture

```mermaid
flowchart LR
    REQ["HTTP Action (Bulk Import / Report PDF / Payroll / Broadcast)"] --> JOB["Create BackgroundJob Record (status=QUEUED, idempotency_key)"]
    JOB --> MQ["Redis Celery Broker"]
    MQ --> WORK["Celery Workers (import, reporting, notifications, integrations)"]
    BEAT["Celery Beat Scheduler (Fee Reminders, Low-Attendance Alerts, Session Checks)"] --> MQ
    WORK -->|"Progress Update"| JOB
    WORK -->|"Failure + Exponential Backoff (max 3-5 retries)"| DLQ["FailedTaskAlert + Admin Audit Log"]
    WORK -->|"Success"| WS["WebSocket / Polling Job Complete Event"]
```

---

## 3. Domain Boundaries & Data Ownership

- **Single Source of Truth**:
  - **CustomerTenant, School, Branch, User, Membership, WorkResponsibility** owned by `core.*`.
  - **Student Master, Guardians, Academic Enrollments** owned by `modules.students` (Admission applicants only materialize as Students upon atomic approval/enrollment in `modules.admissions`).
  - **Staff Master** owned by unified `StaffProfile` (`modules.hr`), linking to academic subject/class assignments without creating separate Teacher/Librarian/Accountant auth accounts.
  - **Financial Ledgers & Receipts**: Append-only immutable transaction rows owned by `modules.finance` + `modules.accounting`; corrections use reversal/adjustment entries, never row deletion.
- **External Specialized Subsystems**: Transport telematics/vehicles/routes, Hostel bed/mess/outpass operations, E-Library DRM streaming, Design Lab vector rendering, E-Class WebRTC rooms, and Biometric clock hardware own their operational telemetry while exchanging canonical UUIDs and webhooks with `apps/backend`.

---

## 4. Multi-Tenancy Architecture

- **Model**: Shared PostgreSQL database with hierarchical ownership: `CustomerTenant` -> `School` -> `Branch` (optional branch scope).
- **Enforcement**:
  1. `TenantContextMiddleware` resolves active `school_id` and `branch_id` from verified JWT claims or `X-School-ID` / `X-Branch-ID` headers **only after validating** an active `Membership` row for `(request.user, school)`.
  2. Context is stored in `contextvars` (async/Celery safe) and passed explicitly to Services & Selectors.
  3. All Selectors require explicit `school_id` (and `branch_id` if branch-scoped); unauthenticated or unverified cross-school object lookups return `404`/`403`.
  4. **Defense-in-Depth**: PostgreSQL Row Level Security (RLS) policies on high-sensitivity tables (`students_student`, `finance_transaction`, `medical_healthrecord`, `welfare_counsellingrecord`) bound to session variable `app.current_school_id`.
- **Multi-School Access**: A `User` has M:N access across multiple `School`s via `Membership`, with independent `user_type` and `StaffResponsibilityAssignment`s per school.

---

## 5. Architecture Decision Records (ADRs)

Full ADR documents live in `docs/architecture/decisions/`:
- `ADR-001-modular-django-monolith.md`
- `ADR-002-postgresql-shared-schema-multitenancy.md`
- `ADR-003-jwt-rotation-otp-authentication.md`
- `ADR-004-scoped-work-responsibility-rbac.md`
- `ADR-005-external-subsystem-integration-contracts.md`
- `ADR-006-file-storage-and-presigned-access.md`
- `ADR-007-celery-async-jobs-and-idempotency.md`
- `ADR-008-api-versioning-and-error-envelope.md`
