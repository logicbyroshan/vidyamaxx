# DOCUMENT 14: LEGACY EVOLUTION & TECHNICAL DEBT ASSESSMENT

> **Classification**: `EVIDENCE-BASED CODEBASE REFACTORING & DEBT AUDIT`  
> **Source Baseline**: Git History (PRs #38–#50), `docs/implementation/known-gaps.md`  

---

## 1. Evolution from VidyaMaxx to VidyaFloww

The repository originated as **VidyaMaxx**, a monolithic school ERP combining marketing landing pages, administrative screens, and extensive subsystem prototypes.

Through pull requests #39 through #50, the project underwent major architectural rationalization:
1. **Decoupling of 12 Subsystems (PR #39 & PR #49)**:
   - 12 high-load, specialized domains were extracted into standalone repositories (`*-VidyaFloww`) in the parent directory `E:\E\VidyaMaxx\`.
   - The core portal was streamlined from 31 navigation links down to 19 focused administrative routes.
2. **Branding & Legacy Name Cleanup (PR #40)**:
   - Legacy package naming and repository references were updated from `vidyamaxx` to `@vidyafloww/*`.
3. **Removal of Unneeded Landing Page (PR #41)**:
   - The unneeded public marketing landing application was removed from the core monorepo and preserved in `Landing-VidyaFloww`.
4. **Backend Implementation & Hardening (PRs #42–#50)**:
   - Complete architectural redesign implementing clean Django modular patterns, 78 domain models, dynamic scoped RBAC, zero OpenAPI warnings, and 20 automated pytest suites.

---

## 2. Technical Debt Matrix & Prioritization

| Debt Item | Severity | Subsystem / Location | Description & Impact | Recommended Remediation |
|---|---|---|---|---|
| **Decoupled Frontends on Mock State** | **HIGH** | `E:\E\VidyaMaxx\*-VidyaFloww` (12 Subsystems) | The 12 decoupled Vite apps operate on mock data and local state. Their UI is complete, but they need to be wired to the verified backend APIs via `@vidyafloww/api`. | Execute Phase 10: Wire TanStack Query hooks in each standalone repo to `/api/v1/` endpoints. |
| **External Integration Stubs** | **MEDIUM** | `apps/backend/integrations/` | Payment (Razorpay), SMS (MSG91 DLT), WhatsApp Cloud, and Biometric turnstiles are structured as modular service adapters, but require production sandbox API credentials for live testing. | Connect staging sandbox credentials in `.env` for end-to-end integration verification. |
| **Legacy Role Column References in `security.tsx`** | **MEDIUM** | `apps/web/src/routes/security.tsx` | The UI table displays columns for legacy fixed roles (`teacher`, `accountant`, `librarian`). The backend uses dynamic scoped responsibilities. | Update `security.tsx` UI to display active `StaffResponsibilityAssignment` cards and a role-compatibility projection. |
| **Local PostgreSQL Stopped State** | **LOW** | Windows Service (`postgresql-x64-17`) | Local PostgreSQL service is stopped, so local development runs on SQLite (`USE_SQLITE=true`). | Start PostgreSQL service when running local production parity checks. |
| **WebSocket Push Notification Trigger** | **LOW** | `apps/backend/platform_services/notifications/` | Channels WebSocket infrastructure is configured, but notification drawer still relies partly on REST polling. | Add Django signal hook to push newly created `InAppNotification` records over Channels group `f"user_{user.id}"`. |

---

## 3. Deprecated or Archived Artifacts

- **`Landing-VidyaFloww`**: Fully archived. Contains static Vite marketing landing page. Not required for school management operations.
- **`apps/backend/common/models/legacy.py`**: Cleaned up in Phase 1. Zero legacy Django models remain in active backend apps.
