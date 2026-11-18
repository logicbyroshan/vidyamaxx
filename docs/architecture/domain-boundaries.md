# VidyaFloww — Domain Boundaries & 30 Work Divisions Matrix

All school operational logic maps cleanly to the **30 finalized school work divisions** plus **cross-platform capabilities** (AI, Storage, Audit, Notifications). AI is **never** added as a 31st division.

| # | Work Division | Group | Django App Owner | Primary Data Owned | External Subsystem / Sync Contract |
|---|---|---|---|---|---|
| 1 | **Admissions** | Students | `modules.admissions` | Enquiries, Leads, Applications, ApplicantDocs, Interviews, Decisions | `Admissions-VidyaFloww` UI; promotes atomically into `modules.students` |
| 2 | **Students** | Students | `modules.students` | Student master, StudentEnrollment (per-session), Guardians, Lifecycle events, Custom fields | Syncs student master IDs to Transport, Hostel, Library, Portal, Design Lab |
| 3 | **Academics** | Students | `modules.academics` | Sessions, Classes, Sections, Streams, Houses, Subjects, Subject mappings, Milestones | Shared structure consumed by Timetable, Attendance, LMS, Exams |
| 4 | **Timetable** | Students | `modules.timetable` | PeriodTemplates, SchoolRooms, TimetableVersions, TimetableEntries, ProxySubstitutions | Triggers E-Class scheduled sessions |
| 5 | **Attendance** | Students | `modules.attendance` | DailyAttendanceSessions, StudentAttendanceRecords, LeaveRequests, Holidays, Corrections | Consumes `integrations.biometric` punches; triggers `notifications` |
| 6 | **Teaching** | Learning | `modules.teaching` | SyllabusChapters/Topics, LessonPlans, TeachingDiary, SyllabusProgress | Optional AI lesson-plan draft via `ai.assistants` |
| 7 | **Homework** | Learning | `modules.homework` | HomeworkAssignments, HomeworkSubmissions, Evaluation & Feedback | Exposed in Portal & LMS |
| 8 | **Examinations** | Learning | `modules.examinations` | Exams, Schedules, GradingScales, MarksSchemes, MarksLedger, ReportCards | Syncs with CBT/External Exam Engine; Design Lab renders PDF cards |
| 9 | **Learning Resources** | Learning | `modules.lms` | StudyMaterials, Videos, Notes, Collections, ResourcePermissions | Integrates with `Library-VidyaFloww` NCERT/DRM catalog |
| 10 | **Online Classes** | Learning | `modules.lms` | OnlineClassSessions, JoinLogs | Delegates WebRTC media room to `E-Class-VidyaFloww` |
| 11 | **Fees & Finance** | Operations | `modules.finance`, `modules.accounting` | FeeHeads, FeeStructures, Invoices, Transactions (immutable), Reversals, Scholarships, ChartOfAccounts | Integrated with `Payments-VidyaFloww` & Razorpay/UPI webhooks |
| 12 | **Documents & Certificates** | Operations | `modules.documents`, `modules.certificates` | CertificateTemplates, DocumentRequests, IssuedDocuments, VerificationHashes | Integrates with `Design-VidyaFloww` vector engine |
| 13 | **Library** | Operations | `modules.library` | Catalog/Copies, Members, BookIssues, Fines | Coordinates digital DRM with `Library-VidyaFloww` |
| 14 | **Transport** | Operations | `modules.transport` | Adapter read-models (Student route/stop assignment, fee linkage) | Owned operationally by `Transport-VidyaFloww` / GPS telemetry |
| 15 | **Hostel** | Operations | `modules.hostel` | Adapter read-models (Bed allocation, outpass status, mess fee linkage) | Owned operationally by `Hostel-VidyaFloww` |
| 16 | **Inventory** | Operations | `modules.inventory` | Categories, Items, StockLedgers, Vendors, PurchaseOrders, GRNs | Triggers low-stock alerts |
| 17 | **Assets & Maintenance** | Operations | `modules.assets` | FixedAssetRegister, AssetAssignments, WorkOrders, AMC/Warranties | Links staff assignments to unified `StaffProfile` |
| 18 | **Staff & HR** | People | `modules.hr` | StaffProfiles (unified), Departments, Designations, StaffLeaves, PayrollBatches | Coordinates biometric logs & non-teaching rosters with `HRM-VidyaFloww` |
| 19 | **Student Health** | People | `modules.medical` | HealthProfiles, Allergies, Checkups, MedicalVisits, Vaccinations, Incidents | Restricted health-scoped permission guard |
| 20 | **Counselling & Support** | People | `modules.welfare` | SupportCases, CounsellingSessions, Interventions, ConfidentialNotes | Strictly restricted RBAC + mandatory read audit log |
| 21 | **Communication** | Engagement | `modules.communication` | Announcements, Circulars, Campaigns, MessageTemplates (DLT/HSM), DeliveryLogs | Served via `Communication-VidyaFloww` + Celery + SMS/WA/Email |
| 22 | **Events & Calendar** | Engagement | `modules.events` | SchoolEvents, PTMs, Meetings, Holidays, EventRegistrations | Feeds Portal & Academic calendar |
| 23 | **Student Activities** | Engagement | `modules.student_activities` | Clubs, Sports, Teams, Competitions, Achievements, HousePoints | Feeds Student 360° profile |
| 24 | **Surveys & Forms** | Engagement | `modules.surveys` / `forms` | Versioned FormDefinitions, FormFields, Surveys, Polls, Responses | Immutable schema snapshots preserve response meaning |
| 25 | **Complaints & Grievances** | Engagement | `modules.complaints` | GrievanceCategories, SLA rules, Tickets, Escalations, Resolutions | Active in core portal (`/complaints`) |
| 26 | **Front Office** | Engagement | `modules.front_office` | Visitors, GatePasses, Appointments, PhoneLogs, GeneralEnquiries | Reception workflow |
| 27 | **Reports & Analytics** | Governance | `platform_services.reports`, `modules.analytics` | ReportJobs, ScheduledReports, Cached BI Metrics | Aggregates from domain selectors (zero duplicate business math) |
| 28 | **School Administration** | Governance | `core.organizations`, `core.campuses`, `platform_services.settings` | CustomerTenant, School, Branch, Subscription, Policies, Branding | Controls multi-tenant settings & billing |
| 29 | **Compliance & Records** | Governance | `modules.compliance` | BoardRegisters (CBSE/ICSE/State), AffiliationRecords, StatutoryTasks, RetentionPolicies | Scheduled deadline alerts via Celery Beat |
| 30 | **Security & Audit** | Governance | `platform_services.audit`, `core.permissions`, `core.sessions` | AuditEvents (append-only), DeviceSessions, SecurityPolicies, ResponsibilityHistory | Enforces cross-cutting governance across all 30 divisions |
