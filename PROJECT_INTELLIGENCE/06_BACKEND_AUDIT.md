# DOCUMENT 06: BACKEND ARCHITECTURE & CODEBASE AUDIT

> **Classification**: `EVIDENCE-BASED BACKEND AUDIT`  
> **Source Directory**: `VidyaMaxx/apps/backend/`  
> **Framework & Infrastructure**: Django 5.2.7 + DRF 3.15.2 + Celery 5.4.0 + Channels 4.2.0 + drf-spectacular 0.28.0  

---

## 1. Django AppConfigs & Architecture Organization

Inspection of the Django runtime environment verifies **73 total AppConfigs**, containing **92 total Models**, of which **78 are custom Domain Models** strictly organized into modular directories:

```
apps/backend/
├── ai/                          [Cross-Platform AI Copilot & Document OCR]
│   ├── assistants/              (Lesson plan generators, smart timetable helpers)
│   ├── ocr/                     (Student document/Aadhaar parsing)
│   ├── predictions/             (Dropout risk, fee default forecasting)
│   └── prompts/                 (Standardized prompt templates)
│
├── common/                      [Platform Abstractions & Base Models]
│   ├── exceptions/              (StandardizedAPIError, custom exception handlers)
│   ├── middleware/              (TenantResolutionMiddleware, SecurityHeadersMiddleware)
│   ├── mixins/                  (AuditModel, SoftDeleteMixin, TenantScopedModel)
│   ├── pagination/              (StandardResultsSetPagination - 25 items default)
│   ├── permissions/             (StaffScopedResponsibilityPermission)
│   ├── serializers/             (DynamicFieldsModelSerializer)
│   └── validators/              (Indian phone validator, Aadhaar Luhn check, magic-byte validator)
│
├── config/                      [Django & Infrastructure Settings]
│   ├── settings/                (base.py, development.py, production.py, testing.py)
│   ├── asgi.py                  (Channels WebSocket + ASGI protocol entrypoint)
│   ├── wsgi.py                  (Gunicorn WSGI protocol entrypoint)
│   ├── celery.py                (Celery app configuration, beat schedules, queues)
│   └── urls.py                  (Root URL resolver directing to /api/v1/ and /api/docs/)
│
├── core/                        [Identity, Tenancy & Access Control]
│   ├── accounts/                (Custom User model, UserType enum)
│   ├── authentication/          (SimpleJWT token rotation, OTP verification, password reset)
│   ├── campuses/                (Branch / Campus master data)
│   ├── organizations/           (CustomerTenant, School, SubscriptionPlan, CustomerSubscription)
│   ├── permissions/             (StaffResponsibilityAssignment, SecurityPolicy)
│   ├── sessions/                (DeviceSession tracking, IP/UserAgent logging)
│   └── users/                   (Membership linking Users to Schools with specific UserTypes)
│
├── modules/                     [Domain Applications Implementing 30 Work Divisions]
│   ├── academics/               (Sessions, Classes, Sections, Subjects, Milestones)
│   ├── accounting/              (ChartOfAccount ledger)
│   ├── admissions/              (Enquiries, Applications, Document verification, Interviews)
│   ├── analytics/               (KPI calculation, BI aggregations, SubsystemSync telemetry)
│   ├── attendance/              (StudentAttendanceRecord, AttendanceCorrectionLog, Leaves)
│   ├── certificates/            (CertificateTemplate, IssuedCertificate)
│   ├── communication/           (CircularBroadcast, SMS/WhatsApp dispatch)
│   ├── discipline/              (GrievanceTicket, SLA management)
│   ├── documents/               (ComplianceDocumentRecord)
│   ├── events/                  (SchoolCalendarEvent, StudentActivityRecord, FrontOfficeVisitorPass)
│   ├── examinations/            (ExaminationCycle, StudentExamMark)
│   ├── finance/                 (FeeStructure, ScholarshipGrant, StudentFeeInvoice, FeeReceipt, FeeTransaction)
│   ├── homework/                (HomeworkAssignment, HomeworkSubmission)
│   ├── hostel/                  (HostelAllocationRecord)
│   ├── hr/                      (StaffProfile, StaffAcademicAssignment, StaffDossierFieldConfig)
│   ├── inventory/               (InventoryStockItem, FixedAssetRecord)
│   ├── library/                 (LibraryBookSummary)
│   ├── lms/                     (LessonPlan, TeachingDiaryEntry, LearningResource, OnlineClassSession)
│   ├── medical/                 (InfirmaryVisitLog)
│   ├── students/                (Student, StudentEnrollment, Guardian, StudentLifecycleEvent, DossierConfig)
│   ├── timetable/               (PeriodSlotDefinition, SchoolRoom, TimetableEntry, ProxySubstitution)
│   ├── transport/               (TransportRouteRecord)
│   └── welfare/                 (CounsellingRecord - Confidential RBAC protected)
│
├── platform_services/           [Cross-Cutting Institutional Platform Microservices]
│   ├── audit/                   (Append-only immutable AuditEvent logging)
│   ├── forms/                   (SurveyCampaign, Polls, dynamic question definitions)
│   ├── notifications/           (InAppNotification, batch mark read)
│   ├── reports/                 (GeneratedReportRecord, StatutoryComplianceFiling)
│   ├── settings/                (SchoolSetting dynamic JSON registry)
│   └── storage/                 (StoredFile metadata, MIME detection, Presigned S3 links)
│
└── tests/                       [20 passing automated pytest suites covering Phases 1–9]
```

---

## 2. Core Service Layer Patterns & Architectural Principles

The backend explicitly rejects putting complex business logic in views or raw models. Instead, business logic is isolated into dedicated service functions and classes:

1. **Admission-to-Student Enrollment Service** (`modules/admissions/services.py`):
   - Executes inside a database transaction (`transaction.atomic`).
   - Validates that the application status is `APPROVED`.
   - Creates the `Student` master record, creates `Guardian` records, establishes `StudentGuardianLink`, creates the initial `StudentEnrollment` for the active `AcademicSession`, and updates the application state to `ENROLLED`.
2. **Timetable Conflict Detection Service** (`modules/timetable/services.py`):
   - Before any `TimetableEntry` is committed, queries existing entries on `(academic_session, day_of_week, period_slot)`.
   - Validates that neither the `teacher` nor the `room` nor the `(grade_class, section)` is already occupied in that slot.
   - Suggests available unassigned teachers for `ProxySubstitution`.
3. **Fee Collection & Reversal Engine** (`modules/finance/services.py`):
   - Enforces `idempotency_key` checking to eliminate duplicate charges.
   - Automatically allocates paid amounts against unpaid `StudentFeeInvoice` items.
   - Generates an immutable `FeeReceipt` and logs a credit `FeeTransaction`.
   - Hard deletion is blocked. If an error occurred, a compensating debit `FeeTransaction` is created, returning the invoice status to `UNPAID` or `PARTIALLY_PAID`.
4. **Attendance Bulk Marking & Correction Audit** (`modules/attendance/services.py`):
   - Accepts bulk student status updates per section in a single SQL operation (`bulk_create` / `bulk_update`).
   - If an existing attendance record is modified, an immutable `AttendanceCorrectionLog` is created documenting `previous_status`, `new_status`, `reason`, and `corrected_by`.

---

## 3. Custom Error Envelope & Exception Handling

All API errors return a standardized JSON error envelope:

```json
{
  "error": {
    "code": "TENANT_ACCESS_DENIED",
    "message": "User does not have an active membership in the requested school.",
    "status_code": 403,
    "details": {},
    "timestamp": "2026-11-20T12:00:00Z"
  }
}
```

This is enforced by `common/exceptions/handler.py`, which intercepts DRF and Django validation exceptions, formatting them consistently across all 94 endpoints.

---

## 4. Multi-Tenant Scoping Implementation

Multi-tenancy is enforced at three levels:
1. **Model Inheritance**: Domain models inherit from `TenantScopedModel` (`common/models/base.py`), which defines:
   - `school = models.ForeignKey('organizations.School', on_delete=models.CASCADE, db_index=True)`
   - `branch = models.ForeignKey('campuses.Branch', on_delete=models.CASCADE, null=True, blank=True, db_index=True)`
2. **Context Resolution**: `common/middleware/tenant.py` extracts `X-School-ID` and `X-Branch-ID` headers, validates the user's `Membership`, and attaches the context to `request.school` and `request.branch`.
3. **Automatic Queryset Scoping**: Domain ViewSets inherit from `TenantScopedViewSetMixin`, which overrides `get_queryset()`:
   ```python
   def get_queryset(self):
       qs = super().get_queryset()
       school = resolve_user_tenant_context(self.request)
       return qs.filter(school=school)
   ```
