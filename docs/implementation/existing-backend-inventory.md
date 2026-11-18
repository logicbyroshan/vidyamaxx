# VidyaFloww — Existing Backend Inventory (`apps/backend`)

> **Audit Date**: 2026-11-18  
> **Verification Status**: `python apps/backend/manage.py check` passes (`0 issues`).

---

## 1. Configuration & Infrastructure Audit

| Component | File | Current Implementation State |
|---|---|---|
| **Base Settings** | `config/settings/base.py` | 100% structured. Registers 56 `LOCAL_APPS`, DRF (`JWTAuthentication`, `IsAuthenticated`, `StandardResultsSetPagination`, `drf-spectacular`), Celery (Redis broker/results + `DatabaseScheduler`), Channels (`RedisChannelLayer`), Logging (`vidyafloww.log`). `AUTH_USER_MODEL` is commented `# TODO`; custom middleware (`TenantMiddleware`, `RequestLoggingMiddleware`) are commented `# TODO`. |
| **Development Settings** | `config/settings/development.py` | Defaults `USE_SQLITE=true` (`db.sqlite3`) and `USE_LOCMEM_CACHE=true`. Allows CORS from `localhost:3000` and `localhost:5173`. |
| **Production Settings** | `config/settings/production.py` | Configures HTTPS/HSTS/secure cookies, Sentry SDK, SMTP email; S3 `django-storages` lines are commented `# TODO`. |
| **Testing Settings** | `config/settings/testing.py` | SQLite `:memory:`, `MD5PasswordHasher`, `CELERY_TASK_ALWAYS_EAGER=True`, `InMemoryStorage`. |
| **URL Routing** | `config/urls.py` | Only `/admin/`, `/api/schema/`, `/api/docs/swagger/`, `/api/docs/redoc/` are active. All `/api/v1/*` routes are commented out `# TODO`. No `/api/v1/health/` endpoint exists. |
| **ASGI / WebSockets** | `config/asgi.py` | `ProtocolTypeRouter` configured for HTTP + WebSocket (`URLRouter([])` empty). |
| **Celery** | `config/celery.py` | Configured with `autodiscover_tasks()` and `debug_task`. |
| **Common Utilities** | `common/pagination/__init__.py` | `StandardResultsSetPagination` (20/100), `LargeResultsSetPagination` (100/500), `CursorResultsSetPagination` (`-created_at`). All other `common/*` modules (`exceptions`, `middleware`, `mixins`, `models`, `permissions`, `serializers`, `utils`, `validators`) are 37–43B placeholder docstrings. |

---

## 2. Database & Migration State

- **Active Local DB**: `apps/backend/db.sqlite3` (352 KB).
- **Applied Migrations**: Default Django core (`admin`, `auth`, `contenttypes`, `sessions`) + `django_celery_beat` + `django_celery_results`.
- **Custom App Migrations**: **0 migrations exist** across all 56 local apps (`core`, `platform_services`, `modules`, `ai`, `integrations`).
- **Important Caution**: Because `auth.0001_initial` has already been applied to `db.sqlite3` with default `auth.User`, activating a custom `AUTH_USER_MODEL` will require migrating cleanly to a fresh PostgreSQL `vidyafloww_db` database (while never performing destructive actions on any populated production DB).

---

## 3. Registered Local Apps Audit (56 Total Apps)

Every app directory contains boilerplate placeholder files (`__init__.py`, `admin.py`, `apps.py`, `filters.py`, `models.py`, `permissions.py`, `selectors.py`, `serializers.py`, `services.py`, `signals.py`, `tasks.py`, `tests.py`, `urls.py`, `views.py`), ~40–55 bytes each with `# TODO` comments, **except** the 4 partial `models.py` files noted below.

### 3.1 `core/*` (7 Registered Apps)
- `core.accounts`, `core.authentication`, `core.organizations`, `core.campuses`, `core.users`, `core.permissions`, `core.sessions`
- **Status**: 100% stubs (only `core.sessions.apps.py` has standard `AppConfig` class). Zero models, zero auth views, zero RBAC/tenant middleware.
- **Note**: Notice overlap between `core.accounts` and `core.users` vs Master Prompt Section 4.1 (`identity`, `organizations`, `schools`, `branches`, `memberships`, `permissions`). We must consolidate cleanly without duplicate user tables.

### 3.2 `platform_services/*` (12 Registered Apps)
- `notifications`, `storage`, `audit`, `activity`, `imports`, `exports`, `reports`, `search`, `settings`, `workflows`, `forms`, `dashboard`
- **Status**: 100% stubs.

### 3.3 `modules/*` (23 Registered Apps)
| App | Current State | Existing Code Details |
|---|---|---|
| `modules.accounting` | Partial Model (14 lines) | `ChartOfAccount(account_code, account_name, account_type, balance)` — lacks `organization` FK, `TimestampedModel`, audit fields, transactions, views, serializers. |
| `modules.certificates` | Partial Model (13 lines) | `CertificateTemplate(title, certificate_type, template_html)` — lacks tenant isolation, versioning, issued certificate records, views. |
| `modules.timetable` | Partial Model (19 lines) | `TimetableSlot(day_of_week, start_time, end_time, subject_name, teacher_name, room_number)` — uses plain strings instead of FKs to Class, Section, Subject, Teacher, Session, Organization, PeriodSlot. |
| `modules.welfare` | Partial Model (15 lines) | `CounsellingRecord(student_id, counsellor_name, session_date, notes, follow_up_date)` — uses `CharField` `student_id` instead of FK to Student/Organization, lacks confidential access guards & audit trails. |
| **Other 19 Module Apps** (`admissions`, `students`, `academics`, `attendance`, `examinations`, `homework`, `lms`, `finance`, `hr`, `library`, `hostel`, `transport`, `communication`, `documents`, `inventory`, `medical`, `events`, `discipline`, `analytics`) | 100% Stubs | ~40–55 byte placeholder files with `# TODO`. |

### 3.4 `ai/*` (5 Registered Apps) & `integrations/*` (9 Registered Apps)
- `ai.*`: `providers`, `assistants`, `prompts`, `ocr`, `predictions` — 100% stubs.
- `integrations.*`: `payment`, `sms`, `email`, `whatsapp`, `biometric`, `gps`, `google`, `microsoft`, `webhook` — 100% stubs.

---

## 4. Gap vs. Master Prompt 30 Work Divisions

Comparing `INSTALLED_APPS` (`23 modules.*`) against the finalized **30 Work Divisions** in Master Prompt Section 8:
- **Covered (App directory exists, implementation missing)**: Admissions, Students, Academics, Timetable, Attendance, Homework, Examinations, LMS (Learning Resources + Online Classes), Finance/Accounting (Fees & Finance), Documents & Certificates, Library, Transport, Hostel, Inventory, HR (Staff & HR), Medical (Student Health), Welfare (Counselling & Support), Communication, Events, Discipline/Complaints & Grievances, Analytics (Reports & Analytics).
- **Missing dedicated domain boundaries (need creation or clear domain mapping)**:
  1. **Teaching** (Curriculum Lesson Plans, Teaching Diary, Class Progress — currently unmapped in `modules/*`; distinct from `homework` and `lms`).
  2. **Assets & Maintenance** (Fixed Asset Register, Work Orders, Preventive Maintenance, AMC/Warranty — distinct from consumable `inventory`).
  3. **Student Activities** (Clubs, Sports, Houses, Competitions, Achievements — currently partially conflated with `events`).
  4. **Surveys & Forms** (Versioned dynamic forms/polls/consent responses — `platform_services.forms` exists as stub, needs domain exposure).
  5. **Front Office** (Visitors, Gate Passes, Calls, General Enquiries, Reception — currently unmapped in `modules/*`).
  6. **School Administration** (`core.organizations`/`campuses` + `platform_services.settings`).
  7. **Compliance & Records** (Indian Board Statutory Registers, Inspection Dossiers, Retention Policies — unmapped in `modules/*`).
  8. **Security & Audit** (`platform_services.audit` + `core.permissions` + `core.sessions`).
