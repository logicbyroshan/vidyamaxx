# DOCUMENT 16: EXTERNAL DEPENDENCIES & HARDWARE INTEGRATIONS

> **Classification**: `EVIDENCE-BASED THIRD-PARTY ADAPTER AUDIT`  
> **Source Directory**: `apps/backend/integrations/`, `packages/constants/src/subsystems.ts`  

---

## 1. External Third-Party Service Adapters

VidyaFloww integrates with specialized external services tailored for the Indian educational ecosystem:

| Domain | Target Provider Ecosystem | Implementation Pattern | Status in Codebase |
|---|---|---|---|
| **Payment Gateways** | Razorpay / Cashfree / PayU (Cards, UPI, NetBanking, POS) | Service class with HMAC webhook verification & idempotency key deduplication | `VERIFIED ADAPTER STRUCTURED` |
| **DLT Compliant SMS** | MSG91 / Kaleyra / Gupshup | TRAI DLT template registry with `PE_ID` and `DLT_TEMPLATE_ID` validation | `VERIFIED ADAPTER STRUCTURED` |
| **WhatsApp Cloud API** | Meta Graph API / Interakt | Pre-approved HSM message templates for fee reminders & absentee alerts | `VERIFIED ADAPTER STRUCTURED` |
| **Email Delivery** | AWS SES / Postmark / SMTP | Templated HTML emails with asynchronous PDF attachment compilation | `VERIFIED ADAPTER STRUCTURED` |
| **Biometric & RFID Hardware** | eSSL / ZKTeco / Matrix Turnstiles | Push-API ingestion endpoint (`/api/v1/integrations/biometric/`) with punch deduplication | `VERIFIED ADAPTER STRUCTURED` |
| **Vehicle GPS Telematics** | Standard OBD-II / Fleet trackers | Time-series telemetry push to Transport subsystem adapter | `VERIFIED ADAPTER STRUCTURED` |
| **Enterprise SSO** | Google Identity / Microsoft Entra ID | `id_token` verification matching institutional domain memberships | `VERIFIED ADAPTER STRUCTURED` |

---

## 2. Decoupled Subsystem URL Registry (`packages/constants/src/subsystems.ts`)

The core command ERP launches and deep-links into the 12 decoupled satellite micro-frontends using a standardized port registry:

```typescript
export const SUBSYSTEM_PORTS = {
  DESIGN_LAB: 8010,
  HOSTEL: 8011,
  TRANSPORT: 8012,
  HRM: 8013,
  LIBRARY: 8014,
  E_CLASS: 8016,
  PORTAL: 8017,
  ADMISSIONS: 8018,
  LMS: 8019,
  PAYMENTS: 8020,
  EXAMINATIONS: 8021,
  COMMUNICATION: 8022,
} as const;

export function getSubsystemUrl(subsystem: keyof typeof SUBSYSTEM_PORTS): string {
  const port = SUBSYSTEM_PORTS[subsystem];
  return `http://localhost:${port}`;
}
```

---

## 3. Data Synchronization Contracts with Decoupled Frontends

While these 12 modules run as independent web applications, they communicate with the core backend through standard REST sync contracts:
1. **Admissions -> Students**: An approved application in `Admissions-VidyaFloww` invokes `POST /api/v1/admissions/applications/<uuid:pk>/enroll/`, automatically generating the student master, enrollments, and parent user accounts in `modules.students`.
2. **Finance -> Accounting**: Fee collections recorded via `Payments-VidyaFloww` automatically update `StudentFeeInvoice` balances and write balanced double-entry rows to `modules.accounting.ChartOfAccount`.
3. **Examinations -> Student 360°**: Finalized marks entered in `Examinations-VidyaFloww` are published to the student ledger, updating student GPA in the command portal's `/students` drawer and parent mobile view.
