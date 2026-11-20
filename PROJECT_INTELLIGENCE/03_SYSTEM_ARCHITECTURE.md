# DOCUMENT 03: COMPLETE SYSTEM ARCHITECTURE

> **Classification**: `EVIDENCE-BASED ARCHITECTURAL SPECIFICATION`  
> **Source Documents**: `docs/architecture/HLD.md`, `ADR-001` through `ADR-008`, `domain-boundaries.md`  

---

## 1. Architectural Style & Monorepo Topology

VidyaFloww adopts a **Hybrid Modular Monolith + Satellite Micro-Frontend Architecture**:

1. **The Core Platform Engine (`VidyaMaxx/apps/backend`)**:
   - A single, highly organized Django 5.2 modular monolith containing 73 AppConfigs and 78 Domain Models.
   - It exposes a unified REST API (`/api/v1/`) and WebSocket gateway (`/ws/`).
   - All modules execute in the same process memory space during development, avoiding distributed network latency, while retaining strict folder and domain boundary encapsulation.
2. **The Command ERP Portal (`VidyaMaxx/apps/web`)**:
   - A desktop-first React 19 single-page application handling daily institutional management across 19 active file-based routes (`src/routes/`).
3. **The 12 Decoupled Satellite Subsystems (`E:\E\VidyaMaxx\*-VidyaFloww`)**:
   - Standalone Vite applications operating on dedicated local development ports (`8010`–`8022`).
   - They handle high-concurrency or specialized tasks (e.g., student fee payments during peak admission season, computer-based exam testing, fleet GPS telematics, live online classrooms).
   - They share the core authentication token (JWT) and consume specialized backend contract adapters (`/api/v1/operations/*`, `/api/v1/finance/*`, `/api/v1/examinations/*`).

---

## 2. Complete Architecture Diagrams

### Diagram 1: High-Level System Architecture

```mermaid
flowchart TB
    subgraph ClientEcosystem["Client Ecosystem Layer"]
        CP["Main Command Portal (apps/web - Port 3000)"]
        DEC["12 Decoupled Micro-Apps (*-VidyaFloww)"]
        MOB["Mobile App (apps/mobile - Expo)"]
        DSK["Desktop App (apps/desktop - Electron)"]
    end

    subgraph EdgeLayer["Edge & Gateway Layer"]
        NGX["Nginx Ingress / Reverse Proxy (Port 80/443)"]
        WAF["Rate Limiting & Security Headers"]
    end

    subgraph BackendCore["VidyaFloww Django Backend (apps/backend - Port 8000)"]
        DRF["DRF API Gateway (/api/v1/)"]
        WSS["Django Channels WebSockets (/ws/)"]
        MW["Tenant Context & Security Middleware"]
        RBAC["Scoped Work Responsibility Engine"]
        
        subgraph InternalDomains["Internal Domain Subsystems"]
            AUTH_DOM["Identity & Sessions (core/accounts, sessions)"]
            ACAD_DOM["Academics & Timetable (modules/academics, timetable)"]
            STUD_DOM["Students & Admissions (modules/students, admissions)"]
            FIN_DOM["Finance & Accounting (modules/finance, accounting)"]
            OPS_DOM["School Operations (modules/transport, hostel, library, inventory)"]
            ENG_DOM["Engagement & Support (modules/communication, discipline, welfare)"]
            GOV_DOM["Governance & Analytics (modules/analytics, platform_reports)"]
        end
    end

    subgraph AsyncAndCache["Asynchronous & Caching Infrastructure"]
        REDIS["Redis 7 (Cache, JWT Blacklist, Channels, Broker)"]
        CEL_WKR["Celery Asynchronous Workers"]
        CEL_BEAT["Celery Beat Periodic Scheduler"]
    end

    subgraph StorageLayer["Data & Persistence Layer"]
        PG["PostgreSQL 16/17 (Shared Schema Multi-Tenancy)"]
        S3["AWS S3 / MinIO Object Storage (Presigned URLs)"]
    end

    subgraph ExternalThirdParty["Third-Party Services & Integrations"]
        RAZOR["Razorpay / UPI Payment Gateway"]
        SMS["DLT TRAI SMS Gateway (MSG91)"]
        WA["Meta WhatsApp Cloud API"]
        BIO["Biometric Punch Hardware (eSSL/ZKTeco)"]
    end

    CP --> NGX
    DEC --> NGX
    MOB --> NGX
    DSK --> NGX

    NGX --> WAF
    WAF --> DRF
    WAF --> WSS

    DRF --> MW
    WSS --> MW
    MW --> RBAC

    RBAC --> InternalDomains
    InternalDomains --> PG
    InternalDomains --> REDIS
    InternalDomains --> S3
    
    InternalDomains -.-> CEL_WKR
    CEL_WKR --> PG
    CEL_WKR --> REDIS
    CEL_WKR --> S3
    CEL_BEAT --> REDIS

    FIN_DOM --> RAZOR
    ENG_DOM --> SMS
    ENG_DOM --> WA
    OPS_DOM --> BIO
```

---

### Diagram 2: Web Client Internal Architecture (`apps/web`)

```mermaid
flowchart LR
    URL["Browser URL"] --> ROUTER["TanStack Router (File-Based Routes)"]
    ROUTER --> SHELL["AppShell Layout (Desktop-First)"]
    
    subgraph Chrome["Global Shell Navigation"]
        HDR["Header (Session Switcher, Branch Switcher, Profile)"]
        SBR["Sidebar (19 Active Route Navigation Links)"]
        CMD["CommandPalette (Ctrl+K Universal Search)"]
        NOTIF["Notifications Drawer (Unread Counter & Clear)"]
        AIC["AIChatDrawer (Shift+K Copilot)"]
        SMB["SmallScreenBlocker (Enforces >= 1024px Display)"]
    end
    
    SHELL --> Chrome
    SHELL --> PAGES["Route Page Components (students.tsx, etc.)"]
    
    PAGES --> QUERY["TanStack Query (useQuery / useMutation)"]
    PAGES --> ZUST["Zustand Store (globalStore.ts)"]
    PAGES --> UI_KIT["@vidyafloww/ui Components (VFDataTable, VFCard, VFDrawer)"]
    
    QUERY --> API_CLIENT["@vidyafloww/api (Axios HTTP Instance)"]
    API_CLIENT --> INTERCEPTORS["Interceptors: Bearer JWT + X-School-ID + X-Branch-ID"]
    INTERCEPTORS --> BACKEND["Backend REST API (/api/v1/)"]
```

---

### Diagram 3: Modular Monolith Domain Layout (`apps/backend`)

```mermaid
flowchart TD
    subgraph ConfigLayer["Platform Configuration"]
        CONF["apps/backend/config (settings, asgi, wsgi, celery)"]
        COMM["apps/backend/common (models, middleware, permissions, exceptions)"]
    end

    subgraph CoreLayer["Core Identity & Tenancy"]
        ACC["core/accounts (Custom User Model)"]
        AUTH["core/authentication (JWT Rotation & Reuse Detection)"]
        ORG["core/organizations (CustomerTenant, School)"]
        CAMP["core/campuses (Branch / Campus Master)"]
        SESS["core/sessions (DeviceSession Tracking)"]
        PERM["core/permissions (StaffResponsibilityAssignment Engine)"]
    end

    subgraph PlatformLayer["Platform Services"]
        AUDIT["platform_services/audit (Append-Only AuditEvent)"]
        STOR["platform_services/storage (StoredFile & Magic Byte Validator)"]
        NOTIF["platform_services/notifications (InAppNotification)"]
        FORMS["platform_services/forms (SurveyCampaign)"]
        REP["platform_services/reports (Report Generation & Compliance)"]
        SETT["platform_services/settings (SchoolSetting Registry)"]
    end

    subgraph BusinessModules["30 Work Division Business Modules"]
        ACAD["modules/academics"]
        ADM["modules/admissions"]
        STUD["modules/students"]
        HR["modules/hr"]
        TIME["modules/timetable"]
        ATT["modules/attendance"]
        LMS["modules/lms"]
        HW["modules/homework"]
        EXAM["modules/examinations"]
        FIN["modules/finance & accounting"]
        OPS["modules/transport, hostel, library, inventory"]
        ENG["modules/communication, discipline, welfare, medical, events"]
        ANALYTICS["modules/analytics"]
    end

    CONF --> COMM
    COMM --> CoreLayer
    CoreLayer --> PlatformLayer
    PlatformLayer --> BusinessModules
```

---

### Diagram 4: Authentication & Dual JWT Rotation Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant DRF as Auth Viewset (/api/v1/auth/)
    participant DB as PostgreSQL
    participant Redis as Redis Cache / Blacklist

    User->>DRF: POST /login/ (email/phone, password, school_code)
    DRF->>DB: Query User & Active School Membership
    DRF->>DRF: Verify Argon2 Password Hash
    DRF->>DB: Record DeviceSession (IP, User-Agent)
    DRF->>DRF: Generate Dual JWT (Access: 15m, Refresh: 7d)
    DRF-->>User: 200 OK (access, refresh, user_profile, permissions)

    Note over User,DRF: Normal API Request
    User->>DRF: GET /api/v1/students/ (Header: Bearer Access Token)
    DRF->>DRF: Verify Signature & Expiry
    DRF-->>User: 200 OK (Student Data)

    Note over User,DRF: Token Expiry & Automatic Refresh
    User->>DRF: POST /token/refresh/ (Header: Refresh Token)
    DRF->>Redis: Check if Refresh Token is in Blacklist
    alt Token Reused / Stolen
        Redis-->>DRF: Token is Blacklisted!
        DRF->>Redis: Blacklist entire Token Family
        DRF-->>User: 401 Unauthorized (TOKEN_REUSE_DETECTED)
    else Valid Refresh Token
        DRF->>Redis: Blacklist old Refresh Token
        DRF->>DRF: Generate new Access + new Refresh Token
        DRF-->>User: 200 OK (new access, new refresh)
    end
```

---

### Diagram 5: Multi-Tenant Request Isolation & Dynamic Scoped RBAC

```mermaid
flowchart TD
    REQ["Incoming HTTP Request"] --> T_MW["TenantResolutionMiddleware"]
    
    T_MW --> EXT_T["Extract X-School-ID / X-Branch-ID Header"]
    EXT_T --> VAL_MEM["Validate User Membership in School"]
    
    VAL_MEM -->|Invalid / Cross-School Mismatch| F403["Return 403 Forbidden (TENANT_ACCESS_DENIED)"]
    VAL_MEM -->|Valid School Membership| ATT_REQ["Attach request.tenant = {school, branch, membership}"]
    
    ATT_REQ --> VIEW["Execute API ViewSet"]
    VIEW --> PERM_CHK["StaffScopedResponsibilityPermission Check"]
    
    PERM_CHK --> UT_CHK{"User Type?"}
    UT_CHK -->|SUPER_ADMIN / SCHOOL_ADMIN| ALLOW["Grant Global School Access"]
    UT_CHK -->|SUPER_EXECUTIVE| SE_CHK{"Action == cancel_subscription?"}
    SE_CHK -->|Yes| DENY_SE["Return 403 Forbidden (RESTRICTED_ACTION)"]
    SE_CHK -->|No| ALLOW
    
    UT_CHK -->|STAFF| RESP_CHK["Query Active StaffResponsibilityAssignment"]
    RESP_CHK --> MATCH{"Matches division, submodule, branch, class, section, subject & date?"}
    MATCH -->|Yes| ALLOW
    MATCH -->|No| DENY["Return 403 Forbidden (SCOPE_NOT_PERMITTED)"]
    
    ALLOW --> ORM["ORM Query: Model.objects.filter(school=request.school)"]
    ORM --> RESP["Return Filtered Multi-Tenant Response"]
```

---

### Diagram 6: Asynchronous Jobs & Celery Worker Topology

```mermaid
flowchart TD
    subgraph TriggerLayer["Task Producers"]
        API_CALL["User Bulk Import / Export Request"]
        ATT_SUB["Daily Attendance Marked"]
        FEE_COL["Fee Installment Received"]
        BEAT["Celery Beat Scheduler (Periodic Crons)"]
    end

    subgraph BrokerLayer["Message Broker (Redis)"]
        Q_HIGH["Queue: high_priority (OTP, SMS Alerts)"]
        Q_DEFAULT["Queue: default (Background Sync, Deduplication)"]
        Q_REPORTS["Queue: reports (PDF Invoices, Excel Compilations, ZIPs)"]
    end

    subgraph CeleryWorkers["Distributed Celery Workers"]
        W_HIGH["Worker Instance 1: High Priority SMS/Push"]
        W_DEF["Worker Instance 2: Core Data Jobs"]
        W_REP["Worker Instance 3: ReportLab / WeasyPrint PDF Engine"]
    end

    subgraph OutputLayer["External Side Effects"]
        S3_OUT["Presigned S3 Storage (Generated Files)"]
        TEL_OUT["DLT SMS & WhatsApp Cloud Dispatch"]
        DB_AUD["Immutable Audit & Attendance Logs"]
    end

    ATT_SUB -->|Low Attendance Alert| Q_HIGH
    BEAT -->|Fee Defaulter Reminders| Q_HIGH
    FEE_COL -->|Receipt PDF Generation| Q_REPORTS
    API_CALL -->|Bulk Student Export| Q_REPORTS
    API_CALL -->|Biometric Punch Sync| Q_DEFAULT

    Q_HIGH --> W_HIGH
    Q_DEFAULT --> W_DEF
    Q_REPORTS --> W_REP

    W_HIGH --> TEL_OUT
    W_REP --> S3_OUT
    W_DEF --> DB_AUD
```
