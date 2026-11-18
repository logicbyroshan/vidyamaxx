# VidyaFloww — Known Gaps & Architectural Discrepancies (Phase 0 Audit)

> **Audit Date**: 2026-11-18

---

## 1. Critical Architectural & Specification Discrepancies

1. **Permission Model Divergence (`docs/07-permissions.md` & `packages/constants/src/roles.ts` vs. Master Prompt Part 7)**:
   - **Found**: `roles.ts`, `types/domain/user.ts`, and `apps/web/src/routes/security.tsx` use a flat list of 10 job titles (`teacher`, `accountant`, `librarian`, `staff`, etc.).
   - **Required**: Master Prompt Part 7 strictly mandates:
     - Platform level: `Super Admin`, `Super Executive` (cannot cancel subscription).
     - School management: `School Admin`, `School Executive`.
     - Staff: **One unified `Staff` user type**, whose access comes exclusively from **scoped work responsibility assignments** (division, submodule, action, branch, class, section, subject, student, validity period).
     - End-users: `Student`, `Parent`.
   - **Resolution Plan**: Implement the exact responsibility-based model in `core.identity` & `core.permissions` during Phase 1, and gradually adapt `security.tsx` and `@vidyafloww/constants` without breaking existing UI screens.

2. **Subsystem Port Registry Mismatch**:
   - **Found**: `packages/constants/src/subsystems.ts` lists local ports `8010` (Transport), `8011` (E-Library), `8012` (E-Class), `8013` (Hostel), `8014` (HR), `8015` (Design Lab). However, the actual `package.json` & `.env.example` files inside the 6 standalone repos use `8010` (Design Lab), `8011` (Hostel), `8012` (Transport), `8013` (HRM), `8014` (Library), `8016` (E-Class). Ports `8017`–`8022` match in both places.
   - **Resolution Plan**: Standardize `packages/constants/src/subsystems.ts` to match the standalone `package.json` ports (or align env vars) before Phase 8 integration testing.

3. **56 Registered Backend Apps vs. 30 Work Divisions**:
   - **Found**: `apps/backend` has 56 stub apps. Some apps represent decoupled domains (`transport`, `hostel`, `library`, `lms`), some duplicate concepts (`core.accounts` vs `core.users`; `finance` vs `accounting`), and 6 finalized work divisions lack explicit app packages (`teaching`, `assets`, `student_activities`, `surveys`, `complaints`, `front_office`, `compliance`).
   - **Resolution Plan**: Cleanly rationalize app boundaries in Phase 1 (documented in `docs/architecture/domain-boundaries.md`) so `modules/*` maps 1:1 to clear business ownership with zero duplicate tables.

4. **Backend Environment Dependency Gap**:
   - **Found**: Local `.venv` runs Python `3.11.9` with `USE_SQLITE=true` and lacks `psycopg[binary]`, `boto3`, `python-decouple`, `sentry-sdk`, `pytest-django`, `factory-boy`, `ruff`, `mypy`, and `channels-redis`. Meanwhile `pyproject.toml` specifies `python = "^3.13"`. PostgreSQL 17 service (`postgresql-x64-17`) is installed locally but `Stopped`.
   - **Resolution Plan**: In Phase 1, start `postgresql-x64-17`, provision `vidyafloww_db` and `vidyafloww_test`, install `psycopg[binary]` & test tools in `.venv` (reconciling Python 3.11/3.13 compatibility), and switch default dev config to PostgreSQL.

5. **Draft Partial Models Lack Multi-Tenancy & Relational Integrity**:
   - **Found**: The 4 drafted models (`ChartOfAccount`, `CertificateTemplate`, `TimetableSlot`, `CounsellingRecord`) omit `organization`/`school` FKs, UUID PKs, timestamps, and relational FKs (using raw `CharField` strings like `student_id`, `teacher_name`).
   - **Resolution Plan**: Refactor them cleanly onto `TenantScopedModel` + proper FKs before generating initial migrations in PostgreSQL.

6. **Frontend Still Coupled to Simulation Data & Legacy Constants**:
   - **Found**: `@vidyafloww/api` Axios interceptors are unimplemented; `apps/web` routes store simulated state in React `useState` and `localStorage`; `packages/constants/src/routes.ts` still retains entries for removed decoupled routes; `globalStore.ts` includes `'admissions'` in `DEFAULT_DASHBOARD_KPIS`.
   - **Resolution Plan**: Wire `@vidyafloww/api` JWT/tenant interceptors + TanStack Query hooks module-by-module as each backend domain reaches completion.

7. **Cross-cutting Features Present in `apps/web` UI Without Backend Engines**:
   - **Dynamic Dossier Field Configurator** (`students.tsx`, `teachers.tsx`): Custom fields created at runtime must persist via `CustomFieldDefinition` / `CustomFieldValue` per school.
   - **ZIP / Excel / PDF Exports** (`students.tsx`, `teachers.tsx`, `reports.tsx`, `timetable.tsx`): Currently client-side or mocked; large exports require Celery + `openpyxl` / `WeasyPrint` + S3/local storage signed URLs.
   - **Audit Log & Security Policies** (`audit.tsx`, `security.tsx`, `license.tsx`): Require real append-only `AuditEvent` persistence, 2FA/session revocation, and subscription plan billing models.
