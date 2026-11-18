# LLD — Staff & HR Master (`modules.hr`)

> **Work Division #**: `18` | **Group**: `GROUP 4 — PEOPLE`  
> **UI Coverage**: `apps/web/src/routes/teachers.tsx` (`/teachers`), `HRM-VidyaFloww` integration

---

## 1. Module Purpose
Maintains the unified institutional **Staff Master (`StaffProfile`)** linked to `accounts.User` and `core_users.Membership(user_type=STAFF)`. Never creates separate authentication roles for Teacher, Librarian, or Accountant; instead links each staff member to academic teaching allocations (`StaffAcademicAssignment`) and scoped `StaffResponsibilityAssignment` records.

## 2. Database Entities & Relationships
- **`Designation(TenantScopedModel)`**: `code`, `title` (`PGT Physics`, `TGT Mathematics`, `Administrative Officer`), `category` (`Faculty|Administrative|Support`).
- **`StaffProfile(TenantScopedModel, SoftDeleteMixin)`**:
  - `user (FK -> accounts.User, nullable)`
  - `membership (FK -> core_users.Membership, nullable)`
  - `employee_code` (`"FAC-2026-01"`) — *Unique `(school, employee_code)`*
  - `full_name`, `avatar_url`, `designation_title`, `department_name`, `primary_subject`, `secondary_subject`, `qualification`, `experience_years`, `joining_date`, `phone`, `email`, `class_mentor_label`, `room_number`, `weekly_periods_load`, `max_weekly_periods` (`default 30`), `employment_status` (`Active|On Leave|Resigned`), `base_salary_inr` (`Decimal(12,2)`), `bank_account_masked`, `custom_fields_json`.
- **`StaffAcademicAssignment(TenantScopedModel)`**:
  - `staff (FK -> StaffProfile)`, `academic_session (FK -> AcademicSession, nullable)`, `grade_class (FK -> GradeClass)`, `section (FK -> Section, nullable)`, `subject (FK -> Subject)`, `weekly_periods`, `is_class_mentor`.
- **`StaffDossierFieldConfig(TenantScopedModel)`**:
  - `field_key`, `label`, `category` (`personal|academic|payroll`), `field_type`, `is_visible`, `is_custom`.

## 3. API Endpoints (`/api/v1/staff/`)
- `GET/POST /api/v1/staff/` (supports `search`, `department_name`, `employment_status`)
- `GET/PATCH/DELETE /api/v1/staff/{id}/`
- `GET/POST /api/v1/staff/{id}/assignments/`
- `GET/POST /api/v1/staff/dossier-fields/`

## 4. Business Validations & Permissions
- Division: `WorkDivision.STAFF_HR`.
- Creating a `StaffProfile` with an email/phone optionally provisions or links an `accounts.User` + `Membership(user_type=STAFF)` inside `transaction.atomic()` without duplicating identities.
