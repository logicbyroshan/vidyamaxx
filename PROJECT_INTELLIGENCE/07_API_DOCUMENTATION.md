# DOCUMENT 07: COMPLETE REST API SPECIFICATION (94 ENDPOINTS)

> **Classification**: `EVIDENCE-BASED REGISTERED API ENDPOINT INVENTORY`  
> **Source Files**: `apps/backend/config/urls.py`, `docs/api/openapi.yaml`, Django URL Resolver Output  
> **Total Registered Endpoints**: 94 Active API Endpoints  

---

## 1. API Architecture & Standards

- **Base URL Prefix**: `/api/v1/`
- **Schema & Interactive Documentation**:
  - `GET /api/schema/` (Raw OpenAPI 3.1 YAML/JSON specification)
  - `GET /api/docs/swagger/` (Interactive Swagger UI)
  - `GET /api/docs/redoc/` (Redoc Technical Documentation)
- **Authentication**: Bearer JWT (`Authorization: Bearer <access_token>`)
- **Tenant Context Headers**:
  - `X-School-ID`: Required for all school-scoped domain operations.
  - `X-Branch-ID`: Optional/required for multi-campus operations.
- **Idempotency**: Payment & financial writes require `Idempotency-Key: <uuid>`.

---

## 2. Comprehensive Endpoint Inventory

### GROUP 1: Health, Platform Documentation & Schemas

| Method | Endpoint Path | Purpose | Auth Required | Required Permission | Implementation Status |
|---|---|---|---|---|---|
| `GET` | `/api/v1/health/` | Liveness & Readiness probe (Database, Cache, Celery) | None | Public | `VERIFIED COMPLETE` |
| `GET` | `/api/schema/` | OpenAPI 3.1 Schema Definition | None | Public | `VERIFIED COMPLETE` |
| `GET` | `/api/docs/swagger/` | Interactive Swagger UI | None | Public | `VERIFIED COMPLETE` |
| `GET` | `/api/docs/redoc/` | Redoc Technical Documentation UI | None | Public | `VERIFIED COMPLETE` |

---

### GROUP 2: Authentication & User Accounts (`/api/v1/auth/`)

| Method | Endpoint Path | Purpose | Auth Required | Required Permission | Implementation Status |
|---|---|---|---|---|---|
| `POST` | `/api/v1/auth/login/` | Password authentication -> returns Access (15m) & Refresh (7d) JWT | None | Public | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/auth/token/refresh/` | JWT token rotation & reuse detection | None | Valid Refresh Token | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/auth/logout/` | Blacklists refresh token & invalidates session | Bearer JWT | Authenticated | `VERIFIED COMPLETE` |
| `GET` | `/api/v1/auth/me/` | Current user profile, active memberships, and permissions | Bearer JWT | Authenticated | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/auth/register/` | 4-step institutional user self-registration | None | Public | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/auth/otp/request/` | Generate 6-digit OTP sent via SMS/Email | None | Public | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/auth/otp/verify/` | Verify 6-digit OTP code against Redis TTL cache | None | Public | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/auth/password/reset/`| Reset password using verified OTP token | None | Public | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/auth/username/lookup/`| Lookup forgotten username via Phone + Date of Birth | None | Public | `VERIFIED COMPLETE` |

---

### GROUP 3: SaaS Platform, Campuses & Dynamic RBAC

| Method | Endpoint Path | Purpose | Auth Required | Required Permission | Implementation Status |
|---|---|---|---|---|---|
| `GET` | `/api/v1/schools/current/` | Retrieve active school branding & config | Bearer JWT | School Member | `VERIFIED COMPLETE` |
| `GET` | `/api/v1/schools/branches/` | List campus branches for current school | Bearer JWT | School Member | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/schools/branches/` | Create a new campus branch | Bearer JWT | `SCHOOL_ADMIN` | `VERIFIED COMPLETE` |
| `GET/PATCH` | `/api/v1/schools/branches/<uuid:pk>/` | Retrieve or update specific branch | Bearer JWT | `SCHOOL_ADMIN` | `VERIFIED COMPLETE` |
| `GET` | `/api/v1/platform/subscription/` | SaaS plan limits, current usage & license key | Bearer JWT | `SUPER_ADMIN` / `SUPER_EXECUTIVE` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/platform/subscription/payment-method/` | Update payment method for subscription | Bearer JWT | `SUPER_ADMIN` / `SUPER_EXECUTIVE` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/platform/subscription/cancel/` | Cancel SaaS subscription (Blocked for Super Executive) | Bearer JWT | **`SUPER_ADMIN` ONLY (`403` for others)** | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/permissions/responsibilities/` | List/assign scoped staff work responsibilities | Bearer JWT | `SCHOOL_ADMIN` | `VERIFIED COMPLETE` |
| `PATCH/DELETE`| `/api/v1/permissions/responsibilities/<uuid:pk>/` | Modify or revoke staff responsibility | Bearer JWT | `SCHOOL_ADMIN` | `VERIFIED COMPLETE` |
| `GET` | `/api/v1/permissions/responsibilities/history/` | Immutable log of all responsibility changes | Bearer JWT | `SCHOOL_ADMIN` | `VERIFIED COMPLETE` |
| `GET/PATCH` | `/api/v1/permissions/policies/` | Retrieve or update school security policies (2FA) | Bearer JWT | `SCHOOL_ADMIN` | `VERIFIED COMPLETE` |
| `GET` | `/api/v1/audit/events/` | Query immutable system audit logs | Bearer JWT | `SCHOOL_ADMIN` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/storage/files/` | Upload file metadata & validate magic-bytes | Bearer JWT | Authenticated | `VERIFIED COMPLETE` |
| `GET` | `/api/v1/storage/files/<uuid:pk>/download/` | Generate presigned time-limited download URL | Bearer JWT | RBAC Checked | `VERIFIED COMPLETE` |
| `GET` | `/api/v1/notifications/` | List in-app notifications for current user | Bearer JWT | Authenticated | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/notifications/mark-all-read/` | Batch mark all notifications as read | Bearer JWT | Authenticated | `VERIFIED COMPLETE` |

---

### GROUP 4: Academics, Staff & Student Lifecycle

| Method | Endpoint Path | Purpose | Auth Required | Required Permission | Implementation Status |
|---|---|---|---|---|---|
| `GET/POST` | `/api/v1/academics/sessions/` | List or create Academic Sessions | Bearer JWT | `ACADEMICS:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/academics/classes/` | List or create Grade Classes | Bearer JWT | `ACADEMICS:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/PATCH` | `/api/v1/academics/classes/<uuid:pk>/` | Retrieve or edit class details & mentor | Bearer JWT | `ACADEMICS:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/academics/class-subjects/`| Map subjects to classes with theory/internal split | Bearer JWT | `ACADEMICS:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/academics/milestones/` | Term exam milestones & target syllabus dates | Bearer JWT | `ACADEMICS:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/staff/` | List faculty directory or onboard new staff | Bearer JWT | `STAFF_HR:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/PATCH/DELETE`| `/api/v1/staff/<uuid:pk>/` | View or edit staff profile (Soft Delete) | Bearer JWT | `STAFF_HR:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/staff/dossier-fields/` | Configure custom dossier fields for staff | Bearer JWT | `STAFF_HR:WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/students/` | Filter student directory or enroll student | Bearer JWT | `STUDENTS:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/PATCH` | `/api/v1/students/<uuid:pk>/` | View Student 360° or edit details | Bearer JWT | `STUDENTS:READ/WRITE` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/students/<uuid:pk>/promote/` | Promote student to next session preserving history | Bearer JWT | `STUDENTS:WRITE` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/students/<uuid:pk>/withdraw/`| Withdraw student and generate transfer status | Bearer JWT | `STUDENTS:WRITE` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/students/<uuid:pk>/readmit/` | Re-admit previously withdrawn student | Bearer JWT | `STUDENTS:WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/students/dossier-fields/` | Custom personal/family dossier field configs | Bearer JWT | `STUDENTS:WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/admissions/enquiries/` | Public or authenticated admission enquiries | Bearer JWT | `ADMISSIONS:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/admissions/applications/`| Admission applications & merit scoring | Bearer JWT | `ADMISSIONS:READ/WRITE` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/admissions/applications/<uuid:pk>/approve/` | Approve admission application | Bearer JWT | `ADMISSIONS:APPROVE` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/admissions/applications/<uuid:pk>/enroll/` | Transactional conversion: Application -> Student | Bearer JWT | `ADMISSIONS:ENROLL` | `VERIFIED COMPLETE` |

---

### GROUP 5: Daily Academic Operations (Timetable, Attendance, Teaching, Homework, Exams)

| Method | Endpoint Path | Purpose | Auth Required | Required Permission | Implementation Status |
|---|---|---|---|---|---|
| `GET/POST` | `/api/v1/timetable/entries/` | Fetch or add timetable entries with conflict check | Bearer JWT | `TIMETABLE:READ/WRITE` | `VERIFIED COMPLETE` |
| `PATCH/DELETE`| `/api/v1/timetable/entries/<uuid:pk>/` | Modify or remove timetable slot entry | Bearer JWT | `TIMETABLE:WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/timetable/substitutions/` | Suggest or assign proxy faculty substitutions | Bearer JWT | `TIMETABLE:WRITE` | `VERIFIED COMPLETE` |
| `GET` | `/api/v1/attendance/records/` | Query attendance roster for a class/date | Bearer JWT | `ATTENDANCE:READ` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/attendance/mark-bulk/` | Bulk mark section attendance + log corrections | Bearer JWT | `ATTENDANCE:WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/attendance/leaves/` | Submit or inspect student leave applications | Bearer JWT | `ATTENDANCE:READ/WRITE`| `VERIFIED COMPLETE` |
| `POST` | `/api/v1/attendance/leaves/<uuid:pk>/decide/` | Approve or reject student leave application | Bearer JWT | `ATTENDANCE:APPROVE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/teaching/lesson-plans/` | List or author structured lesson plans | Bearer JWT | `TEACHING:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/PATCH` | `/api/v1/teaching/lesson-plans/<uuid:pk>/` | Retrieve or edit specific lesson plan | Bearer JWT | `TEACHING:WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/teaching/diary/` | Teacher daily classroom diary reflections | Bearer JWT | `TEACHING:WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/teaching/resources/` | Upload or query lesson study materials | Bearer JWT | `TEACHING:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/teaching/online-classes/` | Schedule virtual classroom sessions | Bearer JWT | `TEACHING:WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/homework/assignments/` | Create or list homework assignments | Bearer JWT | `HOMEWORK:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/PATCH` | `/api/v1/homework/assignments/<uuid:pk>/` | View details or update homework | Bearer JWT | `HOMEWORK:WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/homework/assignments/<uuid:pk>/submissions/` | List or submit student homework solutions | Bearer JWT | `HOMEWORK:SUBMIT` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/examinations/cycles/` | Examination terms & datesheet schedules | Bearer JWT | `EXAMINATIONS:READ/WRITE`| `VERIFIED COMPLETE` |
| `POST` | `/api/v1/examinations/cycles/<uuid:pk>/lock/` | Lock examination ledger preventing score changes | Bearer JWT | `EXAMINATIONS:LOCK` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/examinations/marks/` | Enter student marks with validation bounds | Bearer JWT | `EXAMINATIONS:WRITE` | `VERIFIED COMPLETE` |

---

### GROUP 6: Financial Operations & Ledger (`/api/v1/finance/`)

| Method | Endpoint Path | Purpose | Auth Required | Required Permission | Implementation Status |
|---|---|---|---|---|---|
| `GET/POST` | `/api/v1/finance/accounts/` | Chart of Accounts ledger codes | Bearer JWT | `FINANCE:READ/WRITE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/finance/invoices/` | Student fee installment invoices | Bearer JWT | `FINANCE:READ/WRITE` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/finance/collect/` | Collect fee installment (Idempotent receipt generation) | Bearer JWT | `FINANCE:COLLECT` | `VERIFIED COMPLETE` |
| `GET` | `/api/v1/finance/receipts/<uuid:pk>/` | View immutable payment receipt | Bearer JWT | `FINANCE:READ` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/finance/receipts/<uuid:pk>/reverse/` | Ledger reversal of receipt (Compensating debit) | Bearer JWT | `FINANCE:REVERSE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/finance/scholarships/`| Record scholarship grant schemes | Bearer JWT | `FINANCE:SCHOLARSHIPS`| `VERIFIED COMPLETE` |

---

### GROUP 7: School Operational Domains (`/api/v1/operations/`)

| Method | Endpoint Path | Purpose | Auth Required | Required Permission | Implementation Status |
|---|---|---|---|---|---|
| `GET/POST` | `/api/v1/operations/certificates/templates/` | Certificate template designs & variables | Bearer JWT | `DOCUMENTS:MANAGE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/operations/certificates/issued/` | Query or issue student completion certificates | Bearer JWT | `DOCUMENTS:ISSUE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/operations/documents/` | Regulatory compliance records & file proofs | Bearer JWT | `DOCUMENTS:MANAGE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/operations/library/books/` | Library catalog, accession codes, availability | Bearer JWT | `LIBRARY:MANAGE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/operations/transport/routes/` | Transport vehicle routes, stops, student allocations | Bearer JWT | `TRANSPORT:MANAGE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/operations/hostel/allocations/` | Hostel blocks, rooms & student bed allocations | Bearer JWT | `HOSTEL:MANAGE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/operations/inventory/items/` | Stock inventory items, consumable levels | Bearer JWT | `INVENTORY:MANAGE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/operations/assets/` | Fixed asset directory, serial numbers, maintenance | Bearer JWT | `ASSETS:MANAGE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/operations/events/` | Institutional school events & academic calendar | Bearer JWT | `EVENTS:MANAGE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/operations/activities/` | Student extracurricular activities & house points | Bearer JWT | `ACTIVITIES:MANAGE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/operations/front-office/visitors/` | Front desk visitor register & digital gate passes | Bearer JWT | `FRONT_OFFICE:MANAGE` | `VERIFIED COMPLETE` |

---

### GROUP 8: Engagement, Support, Analytics & Subsystems

| Method | Endpoint Path | Purpose | Auth Required | Required Permission | Implementation Status |
|---|---|---|---|---|---|
| `GET/POST` | `/api/v1/engagement/health/visits/` | Infirmary student medical visit logs | Bearer JWT | `HEALTH:MANAGE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/engagement/counselling/records/` | Confidential psychological counselling records | Bearer JWT | **`WELFARE:MANAGE` ONLY** | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/engagement/circulars/` | Broadcast circulars to parents/students/staff | Bearer JWT | `COMMUNICATION:SEND` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/engagement/surveys/` | Create survey campaigns or fetch active polls | Bearer JWT | `SURVEYS:MANAGE` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/engagement/surveys/<uuid:pk>/vote/` | Record anonymous survey submission | Bearer JWT | School Member | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/engagement/complaints/` | Lodge grievance ticket or view helpdesk registry | Bearer JWT | School Member | `VERIFIED COMPLETE` |
| `GET/PATCH` | `/api/v1/engagement/complaints/<uuid:pk>/`| Resolve grievance ticket or update SLA status | Bearer JWT | `GRIEVANCE:MANAGE` | `VERIFIED COMPLETE` |
| `GET` | `/api/v1/analytics/dashboard/` | Real-time KPI summaries for command dashboard | Bearer JWT | School Member | `VERIFIED COMPLETE` |
| `GET` | `/api/v1/analytics/statistics/` | Institutional BI aggregation figures | Bearer JWT | School Member | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/analytics/reports/` | List report catalog or compile custom report | Bearer JWT | `REPORTS:GENERATE` | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/analytics/compliance/` | Statutory filings (CBSE/RTE compliance records) | Bearer JWT | `COMPLIANCE:MANAGE` | `VERIFIED COMPLETE` |
| `POST` | `/api/v1/analytics/ai/assist/` | Cross-platform AI Copilot prompts (Lesson/Timetable) | Bearer JWT | School Member | `VERIFIED COMPLETE` |
| `GET/POST` | `/api/v1/analytics/subsystems/` | Telemetry & sync contract for 12 decoupled apps | Bearer JWT | School Member | `VERIFIED COMPLETE` |
