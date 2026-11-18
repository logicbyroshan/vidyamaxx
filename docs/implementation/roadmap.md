# VidyaFloww — Master Backend Implementation Roadmap (Phases 0–9)

Aligned with **Master Prompt Part 18**, ordered by relational dependency so every module builds on verified foundations.

---

## Phase 0 — Repository & Architecture Audit ✅ *(Current Phase)*
- Inspect monorepo, 19 `apps/web` routes, 12 decoupled UIs, 56 `apps/backend` apps, PostgreSQL/SQLite state, and dependencies.
- Deliverables: Repository Inventory, Existing Backend Inventory, UI-to-Backend Mapping, HLD (with 10 diagrams), ADRs, LLD Template + Phase 1 Foundation LLD, ERD & Schema Conventions, OpenAPI baseline, Deployment Guides, Roadmap.
- **Gate**: User review before starting Phase 1 implementation.

---

## Phase 1 — Backend Foundation & Multi-Tenant Infrastructure
**Goal**: Production-ready Django + PostgreSQL + Celery + Redis skeleton with auth, multi-tenancy, and responsibility RBAC.
1. Start local PostgreSQL 17, provision `vidyafloww_db`, install `psycopg[binary]`, `pytest`, `pytest-django`, `factory-boy`, `faker` in `.venv`.
2. Implement `common/` foundational primitives:
   - `TenantScopedModel`, `TimestampedModel`, `UUIDModel`, `SoftDeleteModel`, `TenantManager`.
   - `TenantContextMiddleware` & `RequestLoggingMiddleware` (never trusting unverified `school_id`).
   - Standard RFC/consistent DRF exception handler & `APIResponse` renderer matching frontend `@vidyafloww/api` contract.
   - Rate limiting throttles & `/api/v1/health/` check (DB + Redis + Celery ping).
3. Implement `core.identity` / `core.accounts` & `core.authentication`:
   - Custom `User` (`AUTH_USER_MODEL`), SimpleJWT login + refresh rotation + Redis blacklist, Google OAuth, OTP generation/verification, password reset, username lookup, device sessions.
4. Implement `core.organizations`, `core.schools`, `core.campuses` (`branches`), `core.memberships`, `core.permissions`:
   - SaaS Tenant -> School -> Branch hierarchy; Subscription & Invoice models (Super Admin vs Super Executive guard).
   - User Types (`SUPER_ADMIN`, `SUPER_EXECUTIVE`, `SCHOOL_ADMIN`, `SCHOOL_EXECUTIVE`, `STAFF`, `STUDENT`, `PARENT`).
   - Scoped `StaffResponsibilityAssignment` (Division, Submodule, Action, Branch/Class/Section/Subject/Student scope, temporary window, history).
5. Implement `platform_services.audit` (append-only `AuditEvent`) and `platform_services.storage` (local + S3 abstraction with MIME/size validation).
6. Connect `apps/web` `login.tsx` + `@vidyafloww/api` interceptors + session context.

---

## Phase 2 — Core Institutional Data
1. **School Administration** (`core.schools`, `core.campuses`, `platform_services.settings`) -> connect `settings.tsx`, `Header.tsx` session switcher, `license.tsx`.
2. **Academic Structure** (`modules.academics`: sessions, classes, sections, streams, houses, subjects, mappings, milestones, calendar) -> connect `academics.tsx`.
3. **Students** (`modules.students`: student master, `StudentEnrollment` session history, guardians, custom dossier fields, lifecycle promote/transfer/withdraw/readmit, bulk import/export) -> connect `students.tsx`.
4. **Admissions** (`modules.admissions`: enquiries, leads, applications, documents + verification, interviews, atomic enrollment into `modules.students`) -> connect `Admissions-VidyaFloww`.
5. **Staff Master Records** (`modules.hr` core `StaffProfile`, departments, designations, class/subject allocations, custom dossier fields) -> connect `teachers.tsx`.

---

## Phase 3 — Daily Academic Operations
1. **Timetable** (`modules.timetable`: period definitions, school rooms, entries, conflict-detection service, faculty/room workload, proxy substitutions) -> connect `timetable.tsx`.
2. **Attendance** (`modules.attendance`: daily/period attendance, calendar heatmap, leave approvals, immutable corrections audit, holiday exclusion, Celery low-attendance alerts) -> connect `attendance.tsx`.
3. **Teaching** (`modules.teaching`: syllabus chapters/topics, lesson plans, teaching diary, AI lesson-plan draft hook) -> connect `teaching.tsx`.
4. **Homework** (`modules.homework`: assignments/worksheets/projects, student submissions, attachments, evaluation & feedback) -> connect `homework.tsx`.
5. **Examinations** (`modules.examinations`: exams, papers, grading scales, lockable marks schemes, marks ledger, CBSE/ICSE result calculation, external CBT integration contract) -> connect `Examinations-VidyaFloww`.

---

## Phase 4 — Financial Operations
1. **Fees & Finance Core** (`modules.finance`, `modules.accounting`: fee heads, structures, installments, student fee accounts, immutable transactions & receipts, reversals, chart of accounts, income/expenses, bank accounts).
2. **Scholarships & Concessions** (`StudentScholarshipGrant`, eligibility engine, RTE/NSP DBT tracking).
3. **Payment Gateway Integration** (`integrations.payment`: Razorpay/UPI webhooks, idempotency, reconciliation) -> connect `Payments-VidyaFloww` & `students.tsx` fee tab.
4. **Payroll Integration** (HRM payroll ledger sync -> accounting expense entries).

---

## Phase 5 — School Operational Domains
1. **Documents & Certificates** (`modules.documents`, `modules.certificates`, `DesignLab` verification hash adapter).
2. **Inventory & Assets** (`modules.inventory`: stock in/out, POs, GRNs; `modules.assets`: fixed assets, assignments, preventive maintenance/AMC).
3. **Front Office** (`modules.front_office`: visitors, gate passes, appointments, call logs).
4. **Events, Calendar & Student Activities** (`modules.events`, `modules.student_activities`: clubs, sports, houses, competitions, achievements).
5. **Library, Transport & Hostel Integration Adapters** (shared identity sync, allocation/fee/fine read models, webhook receivers).

---

## Phase 6 — Engagement & Support
1. **Communication & Notifications** (`modules.communication`, `platform_services.notifications`, `integrations.sms`/DLT, `whatsapp`, `email`, Channels WebSockets) -> connect `Communication-VidyaFloww` & `NotificationsPanel.tsx`.
2. **Surveys & Dynamic Forms** (`platform_services.forms` / `modules.surveys`: versioned schemas, polls, consent forms) -> connect `surveys.tsx`.
3. **Complaints & Grievances** (`modules.complaints`: SLA tracking, officer assignment, escalation, resolution) -> connect `complaints.tsx`.
4. **Student Health & Counselling** (`modules.medical`, `modules.welfare`: confidential health & counselling records with strict access logging).

---

## Phase 7 — Governance & Analytics
1. **Reports & Analytics** (`platform_services.reports`, `modules.analytics`, `platform_services.dashboard`: Celery PDF/Excel/CSV compilation, BI endpoints) -> connect `reports.tsx`, `statistics.tsx`, `index.tsx`.
2. **Security & Audit** (`platform_services.audit`, `core.permissions`, `core.sessions`: live audit stream, device revocation, 2FA policies) -> connect `security.tsx`, `audit.tsx`.
3. **Compliance & Records** (`modules.compliance`: CBSE/ICSE/State board statutory registers, inspection dossiers, data retention).

---

## Phase 8 — External Subsystem Integration Hardening
- Verify end-to-end SSO/JWT handoff, webhooks, and event sync across all 12 decoupled frontends (`Portal`, `Admissions`, `LMS`, `Payments`, `Examinations`, `Communication`, `Transport`, `Library`, `Hostel`, `HRM`, `DesignLab`, `E-Class`).

---

## Phase 9 — Production Readiness
- Security audit & tenant-isolation penetration suite, PostgreSQL query/index tuning & RLS verification, load testing, automated backup/restore drill, Sentry + Prometheus/health monitoring, CI/CD & zero-downtime deployment runbooks.
