# VidyaFloww — Integration & Subsystem Audit Status

> **Audit Date**: 2026-11-18

---

## 1. Standalone Subsystem Applications Audit

Per architectural inspection across `E:\E\VidyaMaxx\*-VidyaFloww`, **all 12 subsystems are currently frontend-only Vite/React SPAs operating on mock state**. The 5 microservices described in `*/docs/03-backend-integration-and-api.md` (`8110`–`8114`) do not yet have running server codebases.

| Subsystem | Standalone Repo | Expected Auth & Identity Sharing | Synchronization Contract Needed |
|---|---|---|---|
| **Transport** | `Transport-VidyaFloww` | Shared JWT (`sub`, `school_id`, `branch_id`) + Staff/Student UUID | Master -> Transport: Student/Guardian emergency contact & branch sync; Transport -> Master: Allocation & transport fee items |
| **E-Library** | `Library-VidyaFloww` | Shared JWT + S3 presigned DRM streaming URLs | Master -> Library: Curriculum subjects, grades, member roster; Library -> Master: Reading telemetry & overdue fine ledger |
| **Hostel** | `Hostel-VidyaFloww` | Shared JWT + Warden staff responsibility check | Master -> Hostel: Student bio, guardian phone; Hostel -> Master: Room/bed occupancy, mess fee charges, outpass alerts |
| **HR / Biometrics** | `HRM-VidyaFloww` | Shared JWT + Unified `StaffProfile` ID (no duplicate staff master!) | Biometric hardware -> Backend/HRM webhook: raw punch logs; HRM -> Finance: Approved payroll batches & statutory deductions |
| **Design Lab** | `Design-VidyaFloww` | Shared JWT + Read-only student/staff/exam snapshots | Master -> Design Lab: Verified Student/Staff/Result payload; Design Lab -> Master: Issued document hash & verification code |
| **E-Class** | `E-Class-VidyaFloww` | Shared JWT + Classroom session join token | LMS/Timetable -> E-Class: Scheduled session ID; E-Class -> Attendance: Participant join/leave minutes |
| **Parent & Student Portal** | `Portal-VidyaFloww` | JWT (`user_type=PARENT` or `STUDENT`) scoped to linked children / self | Direct consumption of `/api/v1/portal/*` read-optimized endpoints + payment initiation |
| **Admissions** | `Admissions-VidyaFloww` | Public lead capture + authenticated Admission Officer JWT | Public form submission -> OTP/CAPTCHA guarded endpoint; Approved Enrollment -> Atomic creation in `modules.students` |
| **LMS / Learning Cloud** | `LMS-VidyaFloww` | Shared JWT + Branch/Class/Subject responsibility scope | Reads Academic Classes/Subjects; exposes Courses, Video Materials, Collections |
| **Payments Engine** | `Payments-VidyaFloww` | Shared JWT + Idempotency Key + Gateway Webhook HMAC | Syncs Student Fee Invoices; processes Razorpay/UPI/POS payments & posts immutable receipts + accounting ledger entries |
| **Examination Engine** | `Examinations-VidyaFloww` | Shared JWT + Strict Confidentiality RBAC | Consumes Classes/Subjects/Students; publishes verified report card summaries back to Student 360° & Portal |
| **Communication Hub** | `Communication-VidyaFloww` | Shared JWT + DLT Template Registry | Consumes audience segments (Class/Section/School/Guardians) and dispatches via Celery + SMS/WhatsApp/Email/Push workers |

---

## 2. External Infrastructure Integrations (`apps/backend/integrations/*`)

| Integration | Target Provider Ecosystem (India-First) | Current State | Planned Architecture |
|---|---|---|---|
| **Payment Gateways** (`integrations.payment`) | Razorpay / Cashfree / PayU (UPI, Cards, NetBanking) | Stub | Signature-verified webhooks, `idempotency_key` deduplication, immutable transaction log |
| **SMS** (`integrations.sms`) | MSG91 / Kaleyra / Gupshup (**TRAI DLT compliant**) | Stub | `DLT_TEMPLATE_ID` + `PE_ID` enforcement, async Celery dispatch, delivery status webhook |
| **WhatsApp** (`integrations.whatsapp`) | Meta WhatsApp Cloud API / Interakt / Gupshup | Stub | Pre-approved HSM templates for fee reminders, absentee alerts, circulars |
| **Email** (`integrations.email`) | AWS SES / SMTP (TLS) | Dev console backend configured | Templated HTML + PDF attachment pipeline via Celery |
| **Biometric & RFID** (`integrations.biometric`) | eSSL / ZKTeco / Matrix punch devices | Stub | Signed push-API ingestion endpoint + idempotent punch deduplication -> Student/Staff attendance |
| **GPS Telematics** (`integrations.gps`) | Vehicle OBD/GPS devices | Stub | Delegated to Transport adapter; telemetry pings stored in timeseries/stream |
| **SSO OAuth** (`integrations.google`, `microsoft`) | Google Identity / Microsoft Entra ID | Stub | `id_token` server-side verification -> matched institutional email membership |
| **Webhooks** (`integrations.webhook`) | Outbound event bus for external subsystems | Stub | HMAC-SHA256 signed payload delivery with exponential backoff & dead-letter tracking |
