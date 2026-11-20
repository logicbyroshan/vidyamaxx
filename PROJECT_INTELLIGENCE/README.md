# VIDYAFLOWW — PROJECT INTELLIGENCE & ARCHITECTURE REPOSITORY

> **Generated**: 2026-11-20  
> **Status**: Complete & Verified (Phases 0–9 Merged to `main` at commit `ff7ce08`)  
> **Repository Root**: `E:\E\VidyaMaxx\VidyaMaxx`  
> **Ecosystem Decoupled Sibling Repositories**: `E:\E\VidyaMaxx\*-VidyaFloww` (13 standalone Vite SPAs)  
> **Auditor Role**: Principal Software Architect, Senior Full-Stack Engineer, DevOps Architect, Database Architect, Application Security Auditor, QA Engineer, and Technical Product Analyst.

---

## 1. Master Navigational Index

This repository of 20 standardized, evidence-based documents provides a complete technical state assessment, architectural map, and operational intelligence guide for the **VidyaFloww** School Management SaaS ecosystem.

| # | Document | Purpose & Scope | Primary Stakeholders |
|---|---|---|---|
| **01** | [`01_EXECUTIVE_OVERVIEW.md`](./01_EXECUTIVE_OVERVIEW.md) | High-level layman & enterprise architectural overview, purpose, domain, target users, strengths, weaknesses, and top risks. | Executives, Product Managers, Lead Architects |
| **02** | [`02_TECH_STACK.md`](./02_TECH_STACK.md) | Exhaustive inventory of all verified dependencies across frontend, backend, packages, databases, and tooling. | Full-Stack Engineers, DevOps |
| **03** | [`03_SYSTEM_ARCHITECTURE.md`](./03_SYSTEM_ARCHITECTURE.md) | Complete monorepo topology, 12 decoupled submodules, and 6 comprehensive Mermaid architecture diagrams. | Systems Architects, Backend Engineers |
| **04** | [`04_FEATURE_INVENTORY.md`](./04_FEATURE_INVENTORY.md) | 6-column feature inventory mapping all 30 Work Divisions and Foundation with implementation status and exact file evidence. | Product Owners, QA, Developers |
| **05** | [`05_FRONTEND_AUDIT.md`](./05_FRONTEND_AUDIT.md) | In-depth audit of `apps/web`, 19 active TanStack file routes, `@vidyafloww/ui`, state stores, and legacy cleanup. | Frontend Engineers, UI/UX Designers |
| **06** | [`06_BACKEND_AUDIT.md`](./06_BACKEND_AUDIT.md) | Audit of `apps/backend` Django modular monolith (73 AppConfigs, 92 Models, 78 Domain Models, services, exception envelopes). | Backend Engineers, Django Developers |
| **07** | [`07_API_DOCUMENTATION.md`](./07_API_DOCUMENTATION.md) | Complete table of all 94 registered REST API endpoints (Method, Path, Auth, Scoped RBAC, Payload, Response, Status). | Frontend Integrators, API Consumers |
| **08** | [`08_DATABASE_ARCHITECTURE.md`](./08_DATABASE_ARCHITECTURE.md) | Relational schema design, 78 domain models, multi-tenancy keys, financial immutability constraints, and Mermaid ERD. | Database Architects, Data Engineers |
| **09** | [`09_AUTHENTICATION_PERMISSIONS.md`](./09_AUTHENTICATION_PERMISSIONS.md) | Dual JWT rotation, OTP, device sessions, 7 user types, and the 30-division dynamic scoped work responsibility RBAC engine. | Security Engineers, Auth Architects |
| **10** | [`10_SECURITY_AUDIT.md`](./10_SECURITY_AUDIT.md) | Classified security analysis: multi-tenant isolation, IDOR defense, financial immutability, confidential records, findings. | Security Auditors, DevSecOps |
| **11** | [`11_INFRASTRUCTURE_DEPLOYMENT.md`](./11_INFRASTRUCTURE_DEPLOYMENT.md) | Production Docker, Nginx, ASGI/WSGI, Celery/Redis workers, environment variables inventory, and cloud hosting architecture. | DevOps, SREs, Sysadmins |
| **12** | [`12_TESTING_QA.md`](./12_TESTING_QA.md) | Audit of 20 backend pytest suites, 11 vitest suites, type-check pipeline (`tsc --noEmit`), and recommended QA scenarios. | QA Engineers, Test Automators |
| **13** | [`13_PERFORMANCE_SCALABILITY.md`](./13_PERFORMANCE_SCALABILITY.md) | Query performance, N+1 bottlenecks, indexing, Redis caching, Celery task offloading, and horizontal scaling limits. | Performance Engineers, SREs |
| **14** | [`14_LEGACY_TECHNICAL_DEBT.md`](./14_LEGACY_TECHNICAL_DEBT.md) | Migration from VidyaMaxx to VidyaFloww, decoupled subsystems contract status, mock frontends, and debt priority matrix. | Technical Leads, Scrum Masters |
| **15** | [`15_CURRENT_PROJECT_STATUS.md`](./15_CURRENT_PROJECT_STATUS.md) | Consolidated 7-column status matrix for all modules and 30 work divisions, readiness score, and release status. | Project Managers, Delivery Leads |
| **16** | [`16_DEPENDENCIES_INTEGRATIONS.md`](./16_DEPENDENCIES_INTEGRATIONS.md) | Indian fintech adapters (Razorpay/Cashfree), DLT SMS/WhatsApp, Biometric turnstiles, and subsystem URL contracts. | Integration Engineers, Partners |
| **17** | [`17_DEVELOPMENT_HISTORY.md`](./17_DEVELOPMENT_HISTORY.md) | Version control chronology from PR #38 to PR #50, commit hashes, authors, merges, and evolutionary milestones. | Engineering Historians, Team Leads |
| **18** | [`18_MASTER_KNOWLEDGE_MAP.md`](./18_MASTER_KNOWLEDGE_MAP.md) | "Where do I find X?" fast navigational directory for incoming AI agents and developers. | Incoming AI Agents, New Developers |
| **19** | [`EVIDENCE_INDEX.md`](./EVIDENCE_INDEX.md) | Comprehensive index of all cited source paths, line ranges, and factual evidence tags (`VERIFIED`, `OBSERVED`, `INFERRED`). | Compliance Officers, Technical Auditors |
| **20** | `PROJECT_INTELLIGENCE.zip` | Standalone compressed distribution bundle containing all 20 intelligence markdown documents. | Archival, Offline Handover |

---

## 2. Directory Tree of the Ecosystem

```
E:\E\VidyaMaxx\
├── VidyaMaxx/                           [PRIMARY GIT MONOREPO - commit ff7ce08]
│   ├── .github/                         [GitHub workflows & CI/CD automation]
│   ├── apps/
│   │   ├── backend/                     [Django 5.2 + DRF Modular Monolith (94 Endpoints, 92 Models)]
│   │   │   ├── ai/                      [Assistants, OCR, predictions, prompts, providers]
│   │   │   ├── common/                  [Base models, middleware, permissions, exceptions, validators]
│   │   │   ├── config/                  [Django settings: base, development, production, testing, asgi, wsgi, celery]
│   │   │   ├── core/                    [Accounts, auth, campuses, organizations, permissions, sessions, users]
│   │   │   ├── integrations/            [Biometric, email, google, gps, payment, sms, whatsapp, webhook]
│   │   │   ├── modules/                 [30 Work Division domain apps: academics, admissions, attendance, etc.]
│   │   │   ├── platform_services/       [Audit, forms, notifications, reports, settings, storage]
│   │   │   └── tests/                   [20 passing automated pytest suites covering Phases 1–9]
│   │   ├── web/                         [Main Command Portal: React 19 + Vite + TanStack Router (19 Active Routes)]
│   │   │   ├── src/
│   │   │   │   ├── components/          [AppShell, Header, Sidebar, CommandPalette, AIChatDrawer]
│   │   │   │   ├── routes/              [19 Active File Routes: login, index, students, teachers, academics, etc.]
│   │   │   │   ├── store/               [Zustand globalStore.ts]
│   │   │   │   └── tests/               [11 passing Vitest suites (app.test.ts)]
│   │   ├── desktop/                     [Electron desktop container]
│   │   └── mobile/                      [React Native / Expo mobile application]
│   ├── packages/                        [Shared Workspace Libraries]
│   │   ├── api/                         [@vidyafloww/api: Axios HTTP client & API bindings]
│   │   ├── assets/                      [@vidyafloww/assets: logos, branding, illustrations]
│   │   ├── config/                      [@vidyafloww/config: eslint, prettier, tsconfig shared configs]
│   │   ├── constants/                   [@vidyafloww/constants: subsystems, routes, roles, permissions]
│   │   ├── hooks/                       [@vidyafloww/hooks: React shared hooks]
│   │   ├── icons/                       [@vidyafloww/icons: Lucide React icon wrappers]
│   │   ├── themes/                      [@vidyafloww/themes: Tailwind & theme definitions]
│   │   ├── types/                       [@vidyafloww/types: TypeScript domain models & DTOs]
│   │   ├── ui/                          [@vidyafloww/ui: UI Component Library (VFDataTable, VFCard, etc.)]
│   │   ├── utils/                       [@vidyafloww/utils: formatters, date helpers, math]
│   │   └── validation/                  [@vidyafloww/validation: Zod schemas & client validation]
│   ├── docs/                            [Phase 0–9 Architecture, HLD, LLD, ADRs 001–008, OpenAPI 3.1 Spec]
│   └── PROJECT_INTELLIGENCE/            [THIS INTELLIGENCE SUITE - 20 Standardized Documents]
│
├── Admissions-VidyaFloww/               [@vidyafloww/admissions: Standalone Vite App (Port 8018)]
├── Communication-VidyaFloww/            [@vidyafloww/communication: Standalone Vite App (Port 8022)]
├── Design-VidyaFloww/                   [@vidyafloww/design-lab: Standalone Vite App (Port 8010)]
├── E-Class-VidyaFloww/                  [@vidyafloww/e-class: Standalone Vite App (Port 8016)]
├── Examinations-VidyaFloww/             [@vidyafloww/examinations: Standalone Vite App (Port 8021)]
├── Hostel-VidyaFloww/                   [@vidyafloww/hostel-management: Standalone Vite App (Port 8011)]
├── HRM-VidyaFloww/                      [@vidyafloww/hr-management: Standalone Vite App (Port 8013)]
├── Landing-VidyaFloww/                  [@vidyafloww/landing: Archived Marketing Landing App (Port 8009)]
├── Library-VidyaFloww/                  [@vidyafloww/library-management: Standalone Vite App (Port 8014)]
├── LMS-VidyaFloww/                      [@vidyafloww/lms: Standalone Vite App (Port 8019)]
├── Payments-VidyaFloww/                 [@vidyafloww/payments: Standalone Vite App (Port 8020)]
├── Portal-VidyaFloww/                   [@vidyafloww/portal: Standalone Vite App (Port 8017)]
└── Transport-VidyaFloww/                [@vidyafloww/transport-management: Standalone Vite App (Port 8012)]
```

---

## 3. Reading Order for AI Agents & Engineers

To onboard quickly and safely operate on this codebase without violating architecture invariants, review the documents in this recommended sequence:

1. **Understand the Big Picture**: Read [`01_EXECUTIVE_OVERVIEW.md`](./01_EXECUTIVE_OVERVIEW.md) and [`03_SYSTEM_ARCHITECTURE.md`](./03_SYSTEM_ARCHITECTURE.md).
2. **Understand the Auth & Multi-Tenancy Invariant**: Read [`09_AUTHENTICATION_PERMISSIONS.md`](./09_AUTHENTICATION_PERMISSIONS.md) (Crucial: never assign static roles to teachers; all staff permissions derive from `StaffResponsibilityAssignment`).
3. **Understand the Data Schema & Immutability**: Read [`08_DATABASE_ARCHITECTURE.md`](./08_DATABASE_ARCHITECTURE.md) and [`10_SECURITY_AUDIT.md`](./10_SECURITY_AUDIT.md) (Crucial: receipts, audit events, and attendance correction logs are strictly immutable).
4. **Locate Code & Endpoints**: Use [`18_MASTER_KNOWLEDGE_MAP.md`](./18_MASTER_KNOWLEDGE_MAP.md), [`07_API_DOCUMENTATION.md`](./07_API_DOCUMENTATION.md), and [`04_FEATURE_INVENTORY.md`](./04_FEATURE_INVENTORY.md).
5. **Verify Facts & Citations**: Cross-reference any technical claim using [`EVIDENCE_INDEX.md`](./EVIDENCE_INDEX.md).
