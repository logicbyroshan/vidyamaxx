# VidyaFloww — Database Architecture

## 1. Engine & Standards
- **Primary RDBMS**: PostgreSQL 16+ (local dev aligned to installed PostgreSQL 17 service `postgresql-x64-17`; test runner uses PostgreSQL in CI or SQLite in fast unit mode where dialect-independent, though integration tests validate PostgreSQL constraints/RLS).
- **Primary Keys**: `UUIDv4` (`UUIDField(primary_key=True, default=uuid.uuid4, editable=False)`).
- **Timestamps**: UTC stored in `created_at` / `updated_at`; rendered in the school's configured timezone (`Asia/Kolkata` default for Indian schools).
- **Monetary Values**: Always `DecimalField(max_digits=12, decimal_places=2)` with INR default currency — never float.

## 2. Multi-Tenancy Hierarchy & Isolation Rules

Every domain table belongs to the hierarchy:
`CustomerTenant` (SaaS subscriber) &rarr; `School` (institution) &rarr; `Branch` (campus, where branch-level segregation applies).

### Application-Level Isolation
- All school-owned models inherit from `TenantScopedModel` (`school` FK + optional `branch` FK + `created_by`/`updated_by` UUIDs).
- Custom `TenantManager` provides `.for_school(school_id)` and `.for_scope(membership, division)` methods. Unscoped `.objects.all()` calls inside views are forbidden by lint/review rules.
- `school_id` sent in request body or headers is **always validated** against `request.user`'s active `Membership` for that school.

### PostgreSQL Row-Level Security (RLS) Defense-in-Depth
For sensitive domains (`students`, `finance`, `medical`, `welfare`, `audit`):
- `TenantContextMiddleware` executes `SET LOCAL app.current_school_id = '<uuid>'` (when using Postgres transactions) alongside strict Django ORM `.filter(school_id=...)`.
- RLS policies enforce `school_id = current_setting('app.current_school_id', true)::uuid` as a database-level backstop (bypassed only via explicit platform admin DB role or non-RLS migration connection).

## 3. Historical Data Integrity
- **Student Enrollments**: Never overwrite a student's past class/section/roll number on session promotion. Store immutable `StudentEnrollment(student, school, branch, academic_session, grade_class, section, roll_number, status)`.
- **Financial Transactions**: Never execute SQL `DELETE` or mutating `UPDATE` on completed payment receipts or ledger entries. Mistakes must record compensating reversal/credit-note entries.
- **Dynamic Forms / Custom Dossier Fields**: `FormDefinitionVersion` / `CustomFieldDefinition` store schema snapshots so past survey answers and custom student attributes stay valid even when labels evolve.
- **Soft Deletion**: Only applied to top-level master profiles (`Student`, `StaffProfile`, `SchoolRoom`) via `deleted_at` + `deleted_by`, never on financial ledgers or audit logs.
