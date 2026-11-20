# DOCUMENT 18: MASTER KNOWLEDGE MAP & DEVELOPER DIRECTORY

> **Classification**: `DEVELOPER & AI NAVIGATIONAL INDEX`  
> **Purpose**: Instant look-up directory for any domain, model, endpoint, or business rule in VidyaFloww.  

---

## 1. Quick Navigation: "Where do I find X?"

| If you need to work on... | Go to File Path(s) | Key Classes / Functions | API Endpoints |
|---|---|---|---|
| **User Login & Password Reset** | `core/authentication/views.py`<br>`core/accounts/models.py` | `LoginView`, `TokenRefreshView`, `PasswordResetView`, `User` | `POST /api/v1/auth/login/`<br>`POST /api/v1/auth/password/reset/` |
| **Indian Phone OTP Verification** | `core/authentication/views.py`<br>`common/validators/phone.py` | `OTPRequestView`, `OTPVerifyView`, `validate_indian_phone` | `POST /api/v1/auth/otp/request/`<br>`POST /api/v1/auth/otp/verify/` |
| **Assigning Staff Responsibilities** | `core/permissions/views.py`<br>`core/permissions/models.py` | `StaffResponsibilityAssignmentViewSet`, `StaffResponsibilityAssignment` | `GET/POST /api/v1/permissions/responsibilities/` |
| **RBAC Permission Evaluation** | `common/permissions/responsibility.py` | `StaffScopedResponsibilityPermission.has_permission()` | Enforced across all domain viewsets |
| **Multi-Tenancy Resolution** | `common/middleware/tenant.py`<br>`common/models/base.py` | `TenantResolutionMiddleware`, `TenantScopedModel` | Reads `X-School-ID` & `X-Branch-ID` |
| **Student 360° & Enrollment** | `modules/students/views.py`<br>`modules/students/models.py` | `StudentViewSet`, `Student`, `StudentEnrollment` | `GET/POST /api/v1/students/`<br>`POST /api/v1/students/<id>/promote/` |
| **Admissions Approval & Conversion** | `modules/admissions/services.py`<br>`modules/admissions/views.py` | `enroll_applicant_to_student()`, `AdmissionApplicationViewSet` | `POST /api/v1/admissions/applications/<id>/approve/`<br>`POST /api/v1/admissions/applications/<id>/enroll/` |
| **Timetable Conflict Detection** | `modules/timetable/services.py`<br>`modules/timetable/views.py` | `validate_timetable_entry_conflicts()`, `TimetableEntryViewSet` | `POST /api/v1/timetable/entries/`<br>`GET /api/v1/timetable/substitutions/` |
| **Attendance Roll-Call & Corrections** | `modules/attendance/views.py`<br>`modules/attendance/models.py` | `AttendanceBulkMarkView`, `StudentAttendanceRecord`, `AttendanceCorrectionLog` | `POST /api/v1/attendance/mark-bulk/`<br>`GET /api/v1/attendance/records/` |
| **Fee Collection & Reversals** | `modules/finance/services.py`<br>`modules/finance/models.py` | `collect_fee_payment()`, `reverse_fee_receipt()`, `FeeReceipt` | `POST /api/v1/finance/collect/`<br>`POST /api/v1/finance/receipts/<id>/reverse/` |
| **Immutable Audit Logging** | `platform_services/audit/models.py`<br>`platform_services/audit/services.py` | `AuditEvent`, `log_audit_event()`, `ImmutableModelAdmin` | `GET /api/v1/audit/events/` |
| **Presigned S3 File Uploads** | `platform_services/storage/services.py`<br>`platform_services/storage/models.py` | `StoredFile`, `generate_presigned_download_url()`, magic-byte validator | `POST /api/v1/storage/files/`<br>`GET /api/v1/storage/files/<id>/download/` |
| **Confidential Counselling Records** | `modules/welfare/views.py`<br>`modules/welfare/models.py` | `CounsellingRecordViewSet`, `CounsellingRecord` | `GET/POST /api/v1/engagement/counselling/records/` |
| **Executive Dashboard KPIs** | `modules/analytics/views.py`<br>`apps/web/src/routes/index.tsx` | `DashboardSummaryView`, `get_dashboard_summary()` | `GET /api/v1/analytics/dashboard/` |
| **OpenAPI 3.1 Schema Spec** | `config/settings/base.py`<br>`docs/api/openapi.yaml` | `SPECTACULAR_SETTINGS`, `ENUM_NAME_OVERRIDES` | `GET /api/schema/`<br>`GET /api/docs/swagger/` |
| **Full Database Seeder** | `apps/backend/seed_foundation.py` | `seed_all_domains()`, creates 30 work divisions, sample users, sessions, classes | Executed via: `python seed_foundation.py` |

---

## 2. Monorepo Package Directory

- `@vidyafloww/api`: `packages/api/src/index.ts` — Pre-configured Axios instance with JWT bearer token and tenant header injectors.
- `@vidyafloww/constants`: `packages/constants/src/` — Contains `subsystems.ts` (ports `8010`–`8022`), `routes.ts`, and `roles.ts`.
- `@vidyafloww/ui`: `packages/ui/src/` — Exporting `VFDataTable`, `VFCard`, `VFModal`, `VFDrawer`, `VFButton`.
- `@vidyafloww/validation`: `packages/validation/src/` — Zod client-side schemas matching DRF backend serializers.

---

## 3. Critical Rules for Any Incoming AI or Engineer

1. **NEVER add static role fields to models**: If a feature requires staff permissions, check `StaffResponsibilityAssignment` using `has_work_division_permission(user, division, action)`.
2. **NEVER modify or hard-delete financial or audit records**: `FeeReceipt`, `FeeTransaction`, `AuditEvent`, and `AttendanceCorrectionLog` must remain immutable. Reversals must be executed as compensating transactions.
3. **NEVER create students without `StudentEnrollment`**: A student record must always have a corresponding session enrollment record to maintain historical integrity.
4. **NEVER bypass tenant scoping**: Always filter queries using `request.school` resolved by `TenantResolutionMiddleware`.
