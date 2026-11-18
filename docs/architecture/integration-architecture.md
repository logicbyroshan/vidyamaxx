# VidyaFloww — External Subsystem & Third-Party Integration Architecture

## 1. Decoupled Frontend Subsystems Integration Model

| Integration Pattern | Participating Subsystems | Mechanism |
|---|---|---|
| **Direct Core API Consumers** (Shared DB + Core Domain Apps) | `Portal-VidyaFloww` (`8017`), `Admissions-VidyaFloww` (`8018`), `LMS-VidyaFloww` (`8019`), `Payments-VidyaFloww` (`8020`), `Examinations-VidyaFloww` (`8021`), `Communication-VidyaFloww` (`8022`) | Consume `/api/v1/{domain}/` endpoints on `apps/backend` using shared SimpleJWT Bearer token + `X-School-ID` header. Domain boundaries prevent coupling inside `apps/web` bundle while preserving unified transactional integrity in PostgreSQL. |
| **Adapter / Synced Specialized Subsystems** (Independent Compute/Hardware Boundaries) | `Transport-VidyaFloww` (`8012`), `Hostel-VidyaFloww` (`8011`), `HRM-VidyaFloww` (`8013`), `Library-VidyaFloww` (`8014`), `Design-VidyaFloww` (`8010`), `E-Class-VidyaFloww` (`8016`) | Communicate via `apps/backend/integrations/` adapters + HMAC-SHA256 signed webhooks + shared canonical UUIDs (`school_id`, `student_id`, `staff_id`). Core backend never duplicates GPS telemetry, DRM PDF streaming, or WebRTC media servers. |

## 2. Port Alignment Contract
During Phase 0 audit, `packages/constants/src/subsystems.ts` had mismatched ports (`8010–8015`) vs standalone `.env.example` / `package.json` ports:
- Canonical Port Map to unify in Phase 1:
  - `8010`: Design Lab (`designlab.vidyafloww.com`)
  - `8011`: Hostel (`hostel.vidyafloww.com`)
  - `8012`: Transport (`transport.vidyafloww.com`)
  - `8013`: HR & Biometrics (`hr.vidyafloww.com`)
  - `8014`: E-Library (`library.vidyafloww.com`)
  - `8016`: E-Class (`eclass.vidyafloww.com`)
  - `8017`: Parent & Student Portal (`portal.vidyafloww.com`)
  - `8018`: Admissions (`admissions.vidyafloww.com`)
  - `8019`: LMS & Learning Cloud (`learn.vidyafloww.com`)
  - `8020`: Payments Engine (`pay.vidyafloww.com`)
  - `8021`: Examination Engine (`exams.vidyafloww.com`)
  - `8022`: Communication Hub (`comms.vidyafloww.com`)

## 3. External Third-Party Services (`integrations/*`)
- **Payments (`integrations.payment`)**: Pluggable provider interface (`RazorpayAdapter`, `UPIWebhookVerifier`). Every payment confirmation checks `X-Razorpay-Signature` HMAC and processes idempotently on `gateway_payment_id` inside `transaction.atomic()`.
- **SMS (`integrations.sms`)**: Indian TRAI DLT mandatory `sender_id`, `principal_entity_id`, and `dlt_template_id` validation before dispatch.
- **WhatsApp (`integrations.whatsapp`)**: Approved template variables only for automated absentee, fee due, and circular broadcasts.
- **Biometrics (`integrations.biometric`)**: Push receiver `/api/v1/integrations/biometric/punch/` authenticated via per-device HMAC API key (`device_serial`, `punch_time`, `biometric_code`), queued cleanly into `attendance` or `hr`.
