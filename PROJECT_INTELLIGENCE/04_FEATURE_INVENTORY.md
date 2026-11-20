# DOCUMENT 04: COMPLETE FEATURE INVENTORY & 30 WORK DIVISIONS MAPPING

> **Classification**: `EVIDENCE-BASED 6-COLUMN MASTER INVENTORY`  
> **Source Documents**: `docs/13-modules-specification.md`, `docs/implementation/frontend-backend-mapping.md`, `docs/implementation/module-status.md`  

---

## 1. Foundation & Cross-Cutting Capabilities

| # | Work Division / Capability | Backend App Boundary & Models | UI Location (Routes & Files) | Implementation Status | Evidence & Reference Files |
|---|---|---|---|---|---|
| **F01** | **Identity, Auth & Device Sessions** | `core.accounts`, `core.authentication`, `core.sessions`<br>Models: `User`, `DeviceSession` | `apps/web/src/routes/login.tsx`<br>`apps/web/src/components/Header.tsx` | `VERIFIED COMPLETE` | `core/accounts/models.py`<br>`core/authentication/views.py`<br>`tests/test_phase1_foundation.py` |
| **F02** | **Multi-Tenant Organizations & Campuses** | `core.organizations`, `core.campuses`, `core.users`<br>Models: `CustomerTenant`, `School`, `Branch`, `Membership` | `apps/web/src/routes/settings.tsx`<br>`Header.tsx` (Branch Selector) | `VERIFIED COMPLETE` | `core/organizations/models.py`<br>`core/campuses/models.py`<br>`common/middleware/tenant.py` |
| **F03** | **Dynamic Responsibility RBAC** | `core.permissions`<br>Models: `StaffResponsibilityAssignment`, `ResponsibilityAssignmentHistory`, `SecurityPolicy` | `apps/web/src/routes/security.tsx` | `VERIFIED COMPLETE` | `core/permissions/models.py`<br>`common/permissions/responsibility.py`<br>`tests/test_phase1_foundation.py` |
| **F04** | **Platform Audit & File Storage** | `platform_services.audit`, `platform_services.storage`<br>Models: `AuditEvent`, `StoredFile` | `apps/web/src/routes/audit.tsx`<br>Global Document Uploaders | `VERIFIED COMPLETE` | `platform_services/audit/models.py`<br>`platform_services/storage/models.py`<br>`tests/test_phase1_foundation.py` |
| **F05** | **Platform Subscription & Billing** | `core.organizations`<br>Models: `SubscriptionPlan`, `CustomerSubscription`, `PlatformInvoice` | `apps/web/src/routes/license.tsx` | `VERIFIED COMPLETE` | `core/organizations/models.py`<br>`core/organizations/views.py`<br>`tests/test_phase1_foundation.py` |

---

## 2. Finalized 30 School Workspace Work Divisions

### GROUP 1 — STUDENTS

| # | Work Division Name | Backend App Boundary & Models | UI Location (Routes & Files) | Implementation Status | Evidence & Reference Files |
|---|---|---|---|---|---|
| **01** | **Admissions Pipeline** | `modules.admissions`<br>Models: `AdmissionEnquiry`, `AdmissionApplication`, `ApplicantDocument`, `AdmissionInterview` | `Admissions-VidyaFloww`<br>`apps/web/src/routes/index.tsx` (KPIs) | `VERIFIED COMPLETE` | `modules/admissions/models.py`<br>`modules/admissions/views.py`<br>`tests/test_phase2_core_data.py` |
| **02** | **Student 360° & Lifecycle** | `modules.students`<br>Models: `Student`, `StudentEnrollment`, `Guardian`, `StudentGuardianLink`, `StudentLifecycleEvent`, `StudentDossierFieldConfig` | `apps/web/src/routes/students.tsx` | `VERIFIED COMPLETE` | `modules/students/models.py`<br>`modules/students/views.py`<br>`tests/test_phase2_core_data.py` |
| **03** | **Academics & Curricula** | `modules.academics`<br>Models: `AcademicSession`, `GradeClass`, `Section`, `Subject`, `ClassSubjectMapping`, `AcademicMilestone`, `Department`, `House`, `Stream` | `apps/web/src/routes/academics.tsx` | `VERIFIED COMPLETE` | `modules/academics/models.py`<br>`modules/academics/views.py`<br>`tests/test_phase2_core_data.py` |
| **04** | **Timetable & Scheduling** | `modules.timetable`<br>Models: `PeriodSlotDefinition`, `SchoolRoom`, `TimetableEntry`, `ProxySubstitution` | `apps/web/src/routes/timetable.tsx` | `VERIFIED COMPLETE` | `modules/timetable/models.py`<br>`modules/timetable/services.py`<br>`tests/test_phase3_academic_operations.py` |
| **05** | **Attendance & Leaves** | `modules.attendance`<br>Models: `StudentAttendanceRecord`, `AttendanceCorrectionLog`, `LeaveApplication` | `apps/web/src/routes/attendance.tsx`<br>`apps/web/src/routes/index.tsx` (Exceptions) | `VERIFIED COMPLETE` | `modules/attendance/models.py`<br>`modules/attendance/views.py`<br>`tests/test_phase3_academic_operations.py` |

---

### GROUP 2 — LEARNING

| # | Work Division Name | Backend App Boundary & Models | UI Location (Routes & Files) | Implementation Status | Evidence & Reference Files |
|---|---|---|---|---|---|
| **06** | **Teaching Workspace & Lesson Plans** | `modules.lms`<br>Models: `LessonPlan`, `TeachingDiaryEntry` | `apps/web/src/routes/teaching.tsx` | `VERIFIED COMPLETE` | `modules/lms/models.py`<br>`modules/lms/views.py`<br>`tests/test_phase3_academic_operations.py` |
| **07** | **Homework & Assignments** | `modules.homework`<br>Models: `HomeworkAssignment`, `HomeworkSubmission` | `apps/web/src/routes/homework.tsx` | `VERIFIED COMPLETE` | `modules/homework/models.py`<br>`modules/homework/views.py`<br>`tests/test_phase3_academic_operations.py` |
| **08** | **Examinations & Grading** | `modules.examinations`<br>Models: `ExaminationCycle`, `StudentExamMark` | `Examinations-VidyaFloww`<br>`apps/web/src/routes/statistics.tsx` | `VERIFIED COMPLETE` | `modules/examinations/models.py`<br>`modules/examinations/views.py`<br>`tests/test_phase3_academic_operations.py` |
| **09** | **Learning Resources** | `modules.lms`<br>Models: `LearningResource` | `LMS-VidyaFloww` (`resources.tsx`) | `VERIFIED COMPLETE` | `modules/lms/models.py`<br>`modules/lms/views.py`<br>`docs/architecture/LLD/teaching.md` |
| **10** | **Online Classes & Virtual Studio** | `modules.lms`<br>Models: `OnlineClassSession` | `E-Class-VidyaFloww`<br>`LMS-VidyaFloww` (`LMSModule.tsx`) | `VERIFIED COMPLETE` | `modules/lms/models.py`<br>`modules/lms/views.py`<br>`tests/test_phase3_academic_operations.py` |

---

### GROUP 3 — SCHOOL OPERATIONS

| # | Work Division Name | Backend App Boundary & Models | UI Location (Routes & Files) | Implementation Status | Evidence & Reference Files |
|---|---|---|---|---|---|
| **11** | **Fees & Accounting** | `modules.finance`, `modules.accounting`<br>Models: `FeeStructure`, `ScholarshipGrant`, `StudentFeeInvoice`, `FeeReceipt`, `FeeTransaction`, `ChartOfAccount` | `Payments-VidyaFloww`<br>`apps/web/src/routes/students.tsx` (Fee tab) | `VERIFIED COMPLETE` | `modules/finance/models.py`<br>`modules/accounting/models.py`<br>`tests/test_phase4_finance.py` |
| **12** | **Documents & Certificates** | `modules.certificates`, `modules.documents`<br>Models: `CertificateTemplate`, `IssuedCertificate`, `ComplianceDocumentRecord` | `Design-VidyaFloww`<br>`apps/web/src/routes/students.tsx` (ID Cards) | `VERIFIED COMPLETE` | `modules/certificates/models.py`<br>`modules/documents/models.py`<br>`tests/test_phase5_school_operations.py` |
| **13** | **Library Management** | `modules.library`<br>Models: `LibraryBookSummary` | `Library-VidyaFloww` | `VERIFIED COMPLETE` | `modules/library/models.py`<br>`modules/library/views.py`<br>`tests/test_phase5_school_operations.py` |
| **14** | **Transport Management** | `modules.transport`<br>Models: `TransportRouteRecord` | `Transport-VidyaFloww` | `VERIFIED COMPLETE` | `modules/transport/models.py`<br>`modules/transport/views.py`<br>`tests/test_phase5_school_operations.py` |
| **15** | **Hostel Management** | `modules.hostel`<br>Models: `HostelAllocationRecord` | `Hostel-VidyaFloww` | `VERIFIED COMPLETE` | `modules/hostel/models.py`<br>`modules/hostel/views.py`<br>`tests/test_phase5_school_operations.py` |
| **16** | **Inventory Management** | `modules.inventory`<br>Models: `InventoryStockItem` | `apps/web/src/routes/settings.tsx` / API | `VERIFIED COMPLETE` | `modules/inventory/models.py`<br>`modules/inventory/views.py`<br>`tests/test_phase5_school_operations.py` |
| **17** | **Assets & Maintenance** | `modules.inventory`<br>Models: `FixedAssetRecord` | `HRM-VidyaFloww` (Asset Tab) / API | `VERIFIED COMPLETE` | `modules/inventory/models.py`<br>`modules/inventory/views.py`<br>`tests/test_phase5_school_operations.py` |

---

### GROUP 4 — PEOPLE

| # | Work Division Name | Backend App Boundary & Models | UI Location (Routes & Files) | Implementation Status | Evidence & Reference Files |
|---|---|---|---|---|---|
| **18** | **Staff & HR Management** | `modules.hr`, `core.users`<br>Models: `StaffProfile`, `StaffAcademicAssignment`, `StaffDossierFieldConfig` | `apps/web/src/routes/teachers.tsx`<br>`HRM-VidyaFloww` | `VERIFIED COMPLETE` | `modules/hr/models.py`<br>`modules/hr/views.py`<br>`tests/test_phase2_core_data.py` |
| **19** | **Student Health & Infirmary** | `modules.medical`<br>Models: `InfirmaryVisitLog` | `apps/web/src/routes/students.tsx` (Dossier) / API | `VERIFIED COMPLETE` | `modules/medical/models.py`<br>`modules/medical/views.py`<br>`tests/test_phase6_engagement_and_support.py` |
| **20** | **Counselling & Support** | `modules.welfare`<br>Models: `CounsellingRecord` | API (Confidential RBAC Protected) | `VERIFIED COMPLETE` | `modules/welfare/models.py`<br>`modules/welfare/views.py`<br>`tests/test_phase6_engagement_and_support.py` |

---

### GROUP 5 — ENGAGEMENT

| # | Work Division Name | Backend App Boundary & Models | UI Location (Routes & Files) | Implementation Status | Evidence & Reference Files |
|---|---|---|---|---|---|
| **21** | **Communication & Circulars** | `modules.communication`, `platform_services.notifications`<br>Models: `CircularBroadcast`, `InAppNotification` | `Communication-VidyaFloww`<br>`NotificationsPanel.tsx` | `VERIFIED COMPLETE` | `modules/communication/models.py`<br>`platform_services/notifications/models.py`<br>`tests/test_phase6_engagement_and_support.py` |
| **22** | **Events & School Calendar** | `modules.events`<br>Models: `SchoolCalendarEvent` | `apps/web/src/routes/academics.tsx`<br>`Portal-VidyaFloww` | `VERIFIED COMPLETE` | `modules/events/models.py`<br>`modules/events/views.py`<br>`tests/test_phase5_school_operations.py` |
| **23** | **Student Activities & Houses** | `modules.events`<br>Models: `StudentActivityRecord` | `apps/web/src/routes/students.tsx` (Houses) | `VERIFIED COMPLETE` | `modules/events/models.py`<br>`modules/events/views.py`<br>`tests/test_phase5_school_operations.py` |
| **24** | **Surveys & Polls** | `platform_services.forms`<br>Models: `SurveyCampaign` | `apps/web/src/routes/surveys.tsx` | `VERIFIED COMPLETE` | `platform_services/forms/models.py`<br>`platform_services/forms/views.py`<br>`tests/test_phase6_engagement_and_support.py` |
| **25** | **Complaints & Grievances** | `modules.discipline`<br>Models: `GrievanceTicket` | `apps/web/src/routes/complaints.tsx` | `VERIFIED COMPLETE` | `modules/discipline/models.py`<br>`modules/discipline/views.py`<br>`tests/test_phase6_engagement_and_support.py` |
| **26** | **Front Office & Visitors** | `modules.events`<br>Models: `FrontOfficeVisitorPass` | API / Front Desk Registry | `VERIFIED COMPLETE` | `modules/events/models.py`<br>`modules/events/views.py`<br>`tests/test_phase5_school_operations.py` |

---

### GROUP 6 — GOVERNANCE

| # | Work Division Name | Backend App Boundary & Models | UI Location (Routes & Files) | Implementation Status | Evidence & Reference Files |
|---|---|---|---|---|---|
| **27** | **Reports & Analytics** | `platform_services.reports`, `modules.analytics`<br>Models: `GeneratedReportRecord` | `apps/web/src/routes/reports.tsx`<br>`apps/web/src/routes/statistics.tsx` | `VERIFIED COMPLETE` | `platform_services/reports/models.py`<br>`modules/analytics/views.py`<br>`tests/test_phase7_8_9_governance_and_integrations.py` |
| **28** | **School Administration & Settings** | `core.organizations`, `core.campuses`, `platform_services.settings`<br>Models: `SchoolSetting` | `apps/web/src/routes/settings.tsx`<br>`apps/web/src/routes/shortcuts.tsx` | `VERIFIED COMPLETE` | `platform_services/settings/models.py`<br>`core/campuses/views.py`<br>`tests/test_phase7_8_9_governance_and_integrations.py` |
| **29** | **Compliance & Statutory Filings** | `platform_services.reports`<br>Models: `StatutoryComplianceFiling` | `apps/web/src/routes/reports.tsx` (CBSE/RTE) | `VERIFIED COMPLETE` | `platform_services/reports/models.py`<br>`platform_services/reports/views.py`<br>`tests/test_phase7_8_9_governance_and_integrations.py` |
| **30** | **Security & Audit Governance** | `platform_services.audit`, `core.permissions`<br>Models: `AuditEvent`, `SecurityPolicy` | `apps/web/src/routes/security.tsx`<br>`apps/web/src/routes/audit.tsx` | `VERIFIED COMPLETE` | `platform_services/audit/models.py`<br>`core/permissions/views.py`<br>`tests/test_phase7_8_9_governance_and_integrations.py` |
