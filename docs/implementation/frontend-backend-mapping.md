# VidyaFloww — Complete UI-to-Backend Mapping

> **Audit Scope**: Every active route in `apps/web/src/routes/` (19 UI routes) AND all 12 decoupled frontend modules in `E:\E\VidyaMaxx\*-VidyaFloww`.

---

## Part A — Main Command Portal (`apps/web/src/routes/`)

### 1. `/login` (`login.tsx` — 1,277 lines)
- **Sub-modes**: Login, 4-step Signup (Role, Info, School Code, 6-digit OTP & Terms), 4-step Forgot Password (Identifier -> OTP -> Reset -> Success), 3-step Forgot Username (Phone + DOB -> OTP -> Match lookup), Google SSO button.
- **Global Chrome (`Header.tsx`, `Sidebar.tsx`, `CommandPalette.tsx`, `NotificationsPanel.tsx`, `AIChatDrawer.tsx`)**:
  - Academic Session switcher (`activeSession`), Language switcher (`en`/`hi`), Unread Notifications count + drawer (mark read, mark all read, clear), Ctrl+K global search across modules/records, Shift+K AI assistant drawer, Logout.
- **Backend Requirements**:
  - Custom `User` model (`email`, `phone`, `dob`, `full_name`, password hash, `is_verified`), `Tenant` / `School` affiliation code lookup.
  - Endpoints: `POST /api/v1/auth/login/`, `POST /api/v1/auth/google/`, `POST /api/v1/auth/register/`, `POST /api/v1/auth/otp/verify/`, `POST /api/v1/auth/password/reset/`, `POST /api/v1/auth/username/lookup/`, `POST /api/v1/auth/token/refresh/`, `POST /api/v1/auth/logout/`, `GET /api/v1/auth/me/`.
  - OTP service (Redis TTL + SMS/Email Celery task), JWT rotation + Redis session blacklist, login history logging.

### 2. `/` & `/dashboard` (`index.tsx` — 817 lines, `shortcuts.tsx` — 476 lines)
- **Screens & Features**:
  - School branding banner (name, tagline, affiliation, live clock, preset/custom logo).
  - 4 Drag-and-drop reorderable KPI Cards: Total Students (`2,451`), Faculty Attendance/Coverage (`98.2%`), Today's Attendance (`94.5%`), New Admissions (`28`).
  - Reorderable Sections: Quick Shortcuts grid (configurable via `/shortcuts`), Student Attendance Exception Roster (Absent/Late/Half-Day/Leave students with avatar, phone, reason, quick parent call/notify action).
- **Backend Requirements**:
  - `GET /api/v1/dashboard/summary/` (cached KPIs scoped to active `school_id` & `academic_session_id`).
  - `GET /api/v1/dashboard/attendance-exceptions/` (today's absent/late/leave roster).
  - `GET/PATCH /api/v1/users/me/preferences/` (persist `dashboard_kpi_order`, `dashboard_section_order`, `dashboard_shortcuts`, `language`).

### 3. `/students` (`students.tsx` — 3,636 lines)
- **Tables & Columns**: Photo, Admission No, Roll No, Name, Class & Section, Gender, Blood Group, House, Guardian Name & Phone, Fee Status, GPA, Attendance %.
- **Interactive Actions & Modals/Drawers**:
  - **Student 360° Drawer (5 tabs)**:
    1. `overview`: Bio, Family, Operations fields + **Dynamic Dossier Field Configurator** (toggle built-in fields, create custom fields across `personal`/`family`/`operations`).
    2. `academics`: Attendance %, GPA, Exam results summary, subjects, promotion/transfer/withdrawal actions.
    3. `credentials`: Parent/Student portal username, temporary password reset/copy, QR code credential card.
    4. `fees`: Fee clearance status, summary ledger, deep-link button to `Payments-VidyaFloww` (`SUBSYSTEMS.PAYMENTS`).
    5. `scholarship`: Active grant details (`ACTIVE_STUDENT_SCHOLARSHIPS`), eligibility check against `AVAILABLE_SCHOLARSHIP_SCHEMES`.
  - **Bulk Operations & Exports**: ZIP bundle export (JSZip), CSV/Excel export with custom naming pattern (`{admNo}_{name}`) and custom columns, Digital ID Card Modal (CR80 preview + print/QR).
  - **Create / Edit Student** & WhatsApp/SMS quick parent message action.
- **Backend Requirements**:
  - Models: `Student`, `StudentEnrollment` (preserves per-session class/section/roll/house history!), `Guardian`, `StudentGuardianLink`, `CustomFieldDefinition`, `StudentCustomFieldValue`, `StudentLifecycleEvent` (promotion, transfer, withdrawal, re-admission).
  - Services: Atomic admission-to-student enrollment, session promotion without overwriting history, duplicate check (`aadhaar_no`, DOB+Name+Phone), export job (Celery for large batches), portal credential reset.
  - Endpoints: `GET/POST /api/v1/students/`, `GET/PATCH/DELETE /api/v1/students/{id}/`, `POST /api/v1/students/{id}/promote/`, `POST /api/v1/students/{id}/transfer/`, `POST /api/v1/students/{id}/withdraw/`, `POST /api/v1/students/{id}/readmit/`, `POST /api/v1/students/bulk-import/`, `POST /api/v1/students/export/`, `GET/POST /api/v1/students/dossier-fields/`, `POST /api/v1/students/{id}/reset-portal-credentials/`.

### 4. `/teachers` (`teachers.tsx` — 2,589 lines)
- **Tables & Columns**: Staff ID/Code, Faculty Member (avatar, name, designation, department), Primary & Secondary Subject, Class Mentor / Room, Weekly Load, Assigned Classes array.
- **Interactive Actions & Drawers**:
  - **Faculty 360° Drawer (5 tabs)**: `overview` (with customizable `StaffDossierFieldConfig`), `academics` (assigned classes/sections/subjects & weekly period load), `attendance` (attendance logs & leaves), `credentials` (portal login & reset), `payroll` (base pay, allowances, statutory deductions summary — coordinated with HRM integration).
  - **Add Staff Multi-step Wizard**, Edit Staff, Photo preview modal, Bulk export (`CSV`/`PDF`/ID Bundle).
- **Backend Requirements**:
  - Uses unified **`StaffProfile`** linked to `User` (`user_type=STAFF`) + `StaffWorkResponsibility` records (no separate Teacher auth role!).
  - Models: `Department`, `Designation`, `StaffProfile`, `StaffAcademicAssignment` (class, section, subject, is_class_mentor), `StaffCustomFieldValue`.
  - Endpoints: `GET/POST /api/v1/staff/`, `GET/PATCH /api/v1/staff/{id}/`, `GET/POST /api/v1/staff/{id}/responsibilities/`, `GET /api/v1/staff/{id}/workload/`.

### 5. `/academics` (`academics.tsx` — 2,209 lines)
- **Features**:
  - Class selector sidebar/pill bar (`ClassProfile`: `className`, `hindiClassName`, `stage`, `sections`, `classMentor`, `room`, `totalStudents`).
  - **Subjects Table**: Code, Name, Curriculum Tier (`Core Compulsory`, `Core Science`, `Language & Comms`, etc.), Weekly Periods, Assessment Scheme (`theoryMarks`, `internalMarks`), Faculty/Mentor, Syllabus Chapters, Prescribed Book + deep link to E-Library (`SUBSYSTEMS.ELIBRARY`).
  - **Academic Milestones View**: Term milestones (`Mid-Term Exam`, `Periodic Test`, `Pre-Board Exam`, `Final CBSE Board`), date ranges, target syllabus coverage %, status.
  - **Drawers**: Add/Edit Class Subject, Edit Class Profile & Mentor, Add/Edit Milestone.
- **Backend Requirements**:
  - Models: `AcademicSession`, `GradeLevel` (`ClassGrade`), `Section`, `Stream`, `House`, `Department`, `Subject`, `SubjectGroup`, `ClassSubjectMapping` (with weekly periods, theory/internal split, teacher assignment, prescribed book ISBN/ref), `StudentSubjectEnrollment`, `AcademicMilestone`, `AcademicCalendarEvent`.
  - Endpoints: `/api/v1/academics/sessions/`, `/classes/`, `/sections/`, `/subjects/`, `/class-subjects/`, `/milestones/`.

### 6. `/timetable` (`timetable.tsx` — 1,556 lines)
- **Features**:
  - Class selector + Working Days mode (`5 Days` / `6 Days`) + Pure CSS Grid Weekly Timetable (`PeriodSlot`: `subject`, `teacher`, `room`, `isLab`).
  - **Configure Periods Modal**: Order, name, start/end time, `Class` vs `Break`, duration.
  - **Configure Timetable Drawer**: Assign subject/teacher/room to day+period cells.
  - **Workload & Substitutions Drawer**: `FacultyLoad` (assigned vs max periods, free periods today, Optimal/Near Capacity status), `RoomLoad` (capacity, utilization rate), **Proxy Substitution Assignment** (`absentTeacher`, `proxyTeacher`, `period`, `subject`, `room`, `reason`, `Assigned`/`Confirmed`/`Completed`).
  - **Export Modal**: CSV/PDF/Print schedule.
- **Backend Requirements**:
  - Models: `PeriodTemplate`, `PeriodSlotDefinition` (bell timings), `TimetableVersion` (draft/published), `TimetableEntry` (FKs: session, class, section, day_of_week, period_slot, subject, teacher, room), `SchoolRoom` (classrooms & labs with capacity), `ProxySubstitution`.
  - Services: **Conflict detection engine** enforcing no overlapping teacher, section, or room on the same day+period; smart free-teacher suggestion for substitutions; transactional publish.
  - Endpoints: `GET/POST /api/v1/timetable/periods/`, `GET/POST /api/v1/timetable/entries/`, `POST /api/v1/timetable/validate-conflicts/`, `GET /api/v1/timetable/workload/`, `GET/POST /api/v1/timetable/substitutions/`.

### 7. `/attendance` (`attendance.tsx` — 1,747 lines)
- **Features**:
  - Class selector + Daily Roll-Call Roster (`Present`, `Absent`, `Late`, `Leave`, punch-in time) + Bulk mark Present.
  - **Student Attendance Drawer**:
    - 6-Month Activity Heatmap Calendar (`MonthActivity` / `DayActivityBox`: day status, `punchIn`, `punchOut`, correction note; click any day to inspect/correct).
    - **Leave Management Tab**: View existing leave records (`Medical`, `Casual`, `Family`, `Duty`, proof attachment preview), **Apply New Leave**, **Approve/Reject Leave** (`approvedBy`).
- **Backend Requirements**:
  - Models: `DailyAttendanceSession` (class, section, date, marked_by, finalized_at), `StudentAttendanceRecord` (student, date, status, punch_in, punch_out, source: `manual`/`biometric`/`rfid`), `AttendanceCorrectionLog` (immutable audit of old vs new status + reason + corrected_by), `StudentLeaveRequest` (type, start_date, end_date, reason, proof document FKs, approval status, approved_by), `SchoolHoliday`.
  - Services: Bulk submission transaction, percentage calculation excluding holidays, low-attendance threshold Celery alert task (SMS/WhatsApp/Push to guardians).
  - Endpoints: `GET /api/v1/attendance/roster/`, `POST /api/v1/attendance/submit/`, `GET /api/v1/attendance/students/{id}/calendar/`, `POST /api/v1/attendance/correct/`, `GET/POST/PATCH /api/v1/attendance/leaves/`.

### 8. `/teaching` (`teaching.tsx` — 480 lines)
- **Features**:
  - Tabs: Teaching Classes/Workload (`ClassWorkload` matrix) & Lesson Planner (`LessonPlanItem`: `title`, `subject`, `grade`, `duration`, `date`, `objectives`, `outline`).
  - Create New Lesson Plan modal + **AI Generate Lesson Plan** button (`isGeneratingAI`).
  - Print lesson plan.
- **Backend Requirements**:
  - Models: `SyllabusChapter`, `SyllabusTopic`, `LessonPlan` (teacher, subject, class, chapter, title, duration_minutes, scheduled_date, objectives JSON/table, outline, status), `TeachingDiaryEntry`, `SyllabusCompletionLog`.
  - AI Hook: `POST /api/v1/teaching/lesson-plans/ai-generate/` delegating to `ai.assistants` (cross-platform capability, not separate division).
  - Endpoints: `GET/POST /api/v1/teaching/lesson-plans/`, `GET/POST /api/v1/teaching/syllabus-progress/`, `GET/POST /api/v1/teaching/diary/`.

### 9. `/homework` (`homework.tsx` — 749 lines)
- **Features**:
  - 2 Tabs: **Assign Homework** (class, subject, due date, title, instructions, status `Published`/`Draft`/`Closed`) & **Review Submissions** (filter by status/search, inspect `detailHW`, track per-student `Submitted`/`Pending`/`Late` file submissions).
- **Backend Requirements**:
  - Models: `HomeworkAssignment` (code, organization, session, class, section, subject, teacher, title, instructions, assignment_type: `homework`/`worksheet`/`project`, due_at, status, attachment FKs), `HomeworkSubmission` (assignment, student, status: `pending`/`submitted`/`late`/`resubmitted`/`evaluated`, submitted_at, attachment FKs, marks_obtained, teacher_feedback, evaluated_by).
  - Endpoints: `GET/POST/PATCH /api/v1/homework/assignments/`, `GET /api/v1/homework/assignments/{id}/submissions/`, `POST /api/v1/homework/submissions/{id}/evaluate/`.

### 10. `/complaints` (`complaints.tsx` — 686 lines)
- **Features**:
  - **Kept in Core Portal explicitly by user directive**.
  - Filterable Grievance Registry (`Open`, `In Progress`, `Resolved`), Categories (`Transport`, `Academics`, `Hostel`, `Fees & Accounts`, `Facilities`), Priority (`Urgent`, `High`, `Medium`, `Low`), SLA countdown (`expectedSLA`).
  - Lodge New Grievance Modal (`complainantType`, `complainantName`, `category`, `subject`, `priority`, `description`) + Ticket Detail/Resolution Drawer (`assignedOfficer`, `resolutionNotes`, escalate/resolve actions).
- **Backend Requirements**:
  - Models: `GrievanceCategory` (with default SLA hours), `GrievanceTicket`, `GrievanceComment`, `GrievanceEscalationHistory`.
  - Endpoints: `GET/POST /api/v1/complaints/tickets/`, `PATCH /api/v1/complaints/tickets/{id}/`, `POST /api/v1/complaints/tickets/{id}/resolve/`, `POST /api/v1/complaints/tickets/{id}/escalate/`.

### 11. `/surveys` (`surveys.tsx` — 526 lines)
- **Features**:
  - Active Institutional Surveys & Polls (`targetAudience`: `Parents`/`Students`/`Faculty`/`All Community`, response progress bar, satisfaction/NPS score, end date) + Historical Surveys archive + Create New Survey Modal + Survey Detail Modal.
- **Backend Requirements**:
  - Models: `FormDefinition` (versioned schema), `FormField`, `SurveyCampaign` (target audience, start/end dates, status, anonymous flag), `SurveySubmission`, `SurveyFieldResponse`.
  - Endpoints: `GET/POST /api/v1/surveys/`, `POST /api/v1/surveys/{id}/respond/`, `GET /api/v1/surveys/{id}/analytics/`.

### 12. `/reports` (`reports.tsx` — 868 lines)
- **Features**:
  - Report Catalog table (`code`, `name`, `domain`, `format`, `frequency`, `lastGenerated`, `size`, `status`).
  - **Custom Report Builder Drawer**: Select Domain (`students`, `attendance`, `academics`, `finance`, `compliance`), Academic Session, Grade, Timeframe, Format (`PDF`/`XLSX`/`CSV`), Dynamic Column Selection (`selectedColumnKeys`), trigger generation & download.
- **Backend Requirements**:
  - Models: `ReportDefinition`, `GeneratedReportJob` (status: `queued`/`processing`/`ready`/`failed`, file storage ref, parameters JSONB, requested_by, file_size_bytes), `ScheduledReportConfig`.
  - Services/Celery: Async report compiler reusing domain selectors + WeasyPrint/ReportLab (PDF) + `openpyxl` (Excel).
  - Endpoints: `GET /api/v1/reports/catalog/`, `POST /api/v1/reports/generate/`, `GET /api/v1/reports/jobs/{id}/download/`.

### 13. `/statistics` (`statistics.tsx` — 522 lines)
- **Features**:
  - Institutional BI Charts (`VFAreaChart`/`VFBarChart`/`VFPieChart`): Attendance & Intake Trajectory, Wing distribution (Primary/Middle/Secondary/Senior), Student Directory summary, Fee Realization summary (links to `SUBSYSTEMS.PAYMENTS`), Examinations pass rate summary (links to `SUBSYSTEMS.EXAMINATIONS`), Admissions conversion summary (links to `SUBSYSTEMS.ADMISSIONS`).
- **Backend Requirements**:
  - Read-only aggregation endpoints (`GET /api/v1/analytics/overview/`, `/attendance-trends/`, `/wing-distribution/`) pulling live counts from Students/Attendance plus cached read-model/webhook summaries from decoupled Payments/Admissions/Examinations domains.

### 14. `/settings` (`settings.tsx` — 769 lines)
- **Features**:
  - School Branding Editor (`name`, `shortCode`, `tagline`, `affiliation`, `city`, `customLogoUrl` upload, `establishedYear`, `academicLevel`, `principalName`).
  - Campuses / Branches Cards & Add/Edit Campus Modal (`code`, `name`, `city`, `board`, `session`, `principal`, `status`, `coverUrl`, `logoUrl`).
  - Quick navigation cards to `/security`, `/audit`, `/license`.
- **Backend Requirements**:
  - Models: `Organization` (SaaS Tenant), `School`, `Branch` (Campus), `AcademicSession`, `SchoolPolicySetting`.
  - Endpoints: `GET/PATCH /api/v1/schools/current/`, `POST /api/v1/schools/current/logo/`, `GET/POST/PATCH /api/v1/schools/branches/`, `GET/POST /api/v1/academics/sessions/`.

### 15. `/security` (`security.tsx` — 362 lines)
- **Features**:
  - Permission Matrix Table across roles & modules + Security Policies Editor (`twoFactorEnforced`, `sessionTimeout`, `whitelistSubnet`).
  - **CRITICAL AUDIT FINDING**: Current UI columns show legacy fixed roles (`superAdmin`, `principal`, `frontOffice`, `accountant`, `parent`). Per Master Prompt Section 7, backend must implement the **4 Management Types (`Super Admin`, `Super Executive`, `School Admin`, `School Executive`) + 1 `Staff` type with Scoped Work Responsibilities + `Student`/`Parent`**, and expose both responsibility-assignment endpoints and a clean compatibility projection for the Security screen!
- **Backend Requirements**:
  - Models: `WorkDivision` (the 30 divisions), `PermissionAction`, `StaffResponsibilityAssignment` (staff membership, division/submodule/action, class/section/subject/student/branch scope, valid_from/valid_until, revoked_at), `SecurityPolicy` (2FA enforcement, session timeout minutes, IP CIDR allowlist).
  - Endpoints: `GET/POST/PATCH /api/v1/permissions/responsibilities/`, `GET /api/v1/permissions/matrix/`, `GET/PATCH /api/v1/security/policies/`.

### 16. `/audit` (`audit.tsx` — 323 lines)
- **Features**:
  - Immutable Audit Log viewer with Search, Role filter, Category filter (`Auth`, `Students`, `Exams`, `Finance`, `Settings`, `Gate`), Status filter (`Success`, `Warning`, `Blocked`), live stream indicator.
- **Backend Requirements**:
  - Append-only `AuditEvent` model (actor, membership, IP, user-agent, action, category, target model/UUID, diff JSONB, status, timestamp) populated automatically via service hooks/middleware. No `UPDATE`/`DELETE` exposed.
  - Endpoints: `GET /api/v1/audit/events/`, `GET /api/v1/audit/sessions/` (active devices/revocation).

### 17. `/license` (`license.tsx` — 518 lines)
- **Features**:
  - Enterprise license key reveal/copy, active tier & limits, billing invoice history (`InvoiceRecord`), Update Payment Method modal, Pay Early modal.
- **Backend Requirements**:
  - SaaS Customer/Subscription models (`SubscriptionPlan`, `CustomerSubscription`, `PlatformInvoice`) — enforcing **Super Admin vs Super Executive** rule (Super Executive can manage payment methods/invoices but is strictly blocked `403 Forbidden` from `POST /cancel/`).
  - Endpoints: `GET /api/v1/platform/subscription/`, `GET /api/v1/platform/invoices/`, `POST /api/v1/platform/subscription/payment-method/`, `POST /api/v1/platform/subscription/cancel/` (Super Admin only).

---

## Part B — Decoupled Micro-Apps (`E:\E\VidyaMaxx\*-VidyaFloww`) Backend Contracts

Even though their UIs run in standalone Vite apps, the VidyaFlow backend platform (or dedicated adapter/domain boundaries) must power their data & shared identity:

| Standalone App | UI Screens / Capabilities Observed | Required Backend Domain / Contract |
|---|---|---|
| `Admissions-VidyaFloww` | 4-stage pipeline, multi-tab intake drawer (`bio`, `guardian`, `academic`, `documents`), OCR/document verification, interviews & merit score, approval -> student creation | `modules.admissions` (`Enquiry`, `Application`, `ApplicantDocument`, `Interview`, `AdmissionDecision`) + transactional `enroll_applicant_to_student()` service |
| `Examinations-VidyaFloww` | Exam master (`ExamRecord`), Datesheet schedule, Seating modal, Editable/lockable `ClassMarksScheme` & `GradingTier`, Per-student `StudentMarkRow` ledger, report cards | `modules.examinations` (`Exam`, `ExamPaper`, `GradingScale`, `MarksScheme`, `StudentMark`, `ExamResult`) + external CBT/paper-authoring webhook integration |
| `Payments-VidyaFloww` | Fee plans & monthly installments (`MonthlyInstallmentItem`), Counter collection (`Cash`, `Cheque`, `UPI`, `NEFT`, `POS`), `PaymentReceipt`, Defaulter reminders, Scholarships (`ScholarshipRecord`, eligibility engine, RTE/NSP grants) | `modules.finance` + `modules.accounting` + `integrations.payment` (Immutable `FeeInvoice`, `FeeTransaction`, `Receipt`, `LedgerReversal`, `ScholarshipScheme`, `ScholarshipGrant`, webhook verification) |
| `Communication-VidyaFloww` | Multi-step circular composer, target audience (`School`/`Class`/`Section`/`Individual`), priority, rich HTML preview (DOMPurify), delivery status across SMS/Email/WhatsApp/Push | `modules.communication` + `platform_services.notifications` + `integrations.sms`/`whatsapp`/`email` (DLT template IDs, async Celery dispatch, delivery callbacks) |
| `LMS-VidyaFloww` | Online class schedule, live classes, recordings (`LMSModule.tsx`), lesson viewer (`learning.tsx`), study material resources & NCERT collections (`resources.tsx`) | `modules.lms` (`Course`, `LearningResource`, `LearningCollection`, `OnlineClassSession`, `OnlineAttendance`) + E-Class/E-Library adapters |
| `Portal-VidyaFloww` | Multi-child switcher (`ChildRecord`), Academics, Homework view, Attendance, Calendar, Notices, Fees due summary | Read-optimized Parent/Student API views (`/api/v1/portal/...`) scoped strictly to `guardian -> linked students` or `self` |
| `Design-VidyaFloww` | 24 certificate/ID card templates, sample student binding, batch PDF generation (`DesignLabModule.tsx`) | `modules.documents` & `modules.certificates` + `DesignLab` subsystem adapter (reads verified Student/Staff/Exam data; records issued certificate hashes) |
| `Transport-VidyaFloww` | Bus routes, stops, vehicles (fitness/insurance), drivers (license/police verification), student stop allocation, GPS speed/status (`TransportModule.tsx`) | `integrations` transport adapter (`TransportSyncContract`: pushes Student/Branch rosters, pulls Student route/stop summary & fee status) |
| `Hostel-VidyaFloww` | Hostel blocks, rooms & bed occupancy matrix, mess weekly menu, outpass approval/return gate log, night roll-call (`HostelModule.tsx`) | `integrations` hostel adapter (pushes Student/Guardian contacts, pulls Student room/outpass/mess status) |
| `HRM-VidyaFloww` | Non-teaching/support staff directory, shift timings, biometric punch logs, leave requests, monthly payroll, staff asset issue (`HRManagementModule.tsx`) | Unified `StaffProfile` + `modules.hr` + biometric ingestion webhook (`integrations.biometric`) |
| `Library-VidyaFloww` | NCERT & reference book catalog, DRM PDF reader, chapter index, circulation issue/return (`LibraryModule.tsx`) | `modules.library` + E-Library DRM presigned URL adapter (`platform_services.storage`) |
| `E-Class-VidyaFloww` | Live WebRTC studio & classroom launcher | `modules.lms.OnlineClassSession` signaling/join-token contract |
