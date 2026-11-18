# LLD Template — `<Module Name>` (`<modules.app_name>`)

> **Work Division #**: `<1..30>` | **Group**: `<Students|Learning|Operations|People|Engagement|Governance>`  
> **Status**: `<NOT STARTED | DOCUMENTATION COMPLETE | BACKEND IN PROGRESS | VERIFIED COMPLETE>`

---

## 1. Module Purpose
Brief summary of domain responsibility and ownership boundaries.

## 2. Sub-Module Structure
List frontend tabs/drawers/modals mapped to backend sub-capabilities.

## 3. Business Workflows
Step-by-step stateful workflows (include Mermaid `sequenceDiagram` or `stateDiagram-v2`).

## 4. Database Entities & Schema
Tables, fields (UUID PK, `school` FK, `branch` FK, decimals, enums), indexes.

## 5. Model Relationships
Foreign keys, M2M relations, and cross-module read/write contracts (include Mermaid `erDiagram`).

## 6. Database Constraints
Unique constraints, check constraints (`amount >= 0`, `valid_until > valid_from`), cascade/protect rules.

## 7. API Endpoints (`/api/v1/...`)
Method, URL, summary, query filters, pagination, ordering.

## 8. Request & Response Schemas
Exact JSON request and response payloads aligned with frontend TypeScript types.

## 9. Permission Requirements
Required User Types + `WorkDivision` + `Action` + data scope filters (`branch`/`class`/`section`/`subject`/`student`).

## 10. Business Validations
Domain invariants enforced in Serializers & Services (e.g., idempotency, conflict checks, state transitions).

## 11. Error Handling
Domain-specific error codes (`VALIDATION_ERROR`, `CONFLICT`, `FORBIDDEN`) & HTTP status codes.

## 12. Background Tasks
Celery task names, triggers, retry policies, and `BackgroundJob` integration.

## 13. External Integrations
Webhooks, storage signed URLs, SMS/WhatsApp/Email triggers, subsystem adapters.

## 14. Audit Requirements
Events written to append-only `AuditEvent` (actor, target UUID, before/after snapshot, IP).

## 15. Test Scenarios
Unit, Service Transaction, API Permission/Isolation, and UI End-to-End verification checklist.
