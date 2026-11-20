# 10 — CHANGED FILES MANIFEST (PHASES 0–7)

> **Generated**: 2026-11-20

## 1. Main Monorepo (`E:\E\VidyaMaxx\VidyaMaxx`) — `git status -s`

```text
M apps/backend/config/settings/base.py
 M apps/backend/config/settings/development.py
 M apps/backend/config/urls.py
 M apps/backend/core/authentication/views.py
 M apps/backend/core/campuses/views.py
 M apps/backend/core/organizations/management/commands/seed_foundation.py
 M apps/backend/integrations/biometric/services.py
 M apps/backend/integrations/biometric/urls.py
 M apps/backend/integrations/biometric/views.py
 M apps/backend/integrations/payment/services.py
 M apps/backend/integrations/payment/urls.py
 M apps/backend/integrations/payment/views.py
 M apps/backend/integrations/sms/services.py
 M apps/backend/integrations/webhook/services.py
 M apps/backend/integrations/whatsapp/services.py
 M apps/backend/modules/analytics/views.py
 M apps/backend/modules/events/urls.py
 M apps/backend/modules/events/views.py
 M apps/web/src/components/AIChatDrawer.tsx
 M apps/web/src/layouts/AppShell.tsx
 M apps/web/src/layouts/CommandPalette.tsx
 M apps/web/src/layouts/Header.tsx
 M apps/web/src/layouts/NotificationsPanel.tsx
 M apps/web/src/layouts/Sidebar.tsx
 M apps/web/src/routes/academics.tsx
 M apps/web/src/routes/attendance.tsx
 M apps/web/src/routes/audit.tsx
 M apps/web/src/routes/complaints.tsx
 M apps/web/src/routes/homework.tsx
 M apps/web/src/routes/index.tsx
 M apps/web/src/routes/license.tsx
 M apps/web/src/routes/login.tsx
 M apps/web/src/routes/reports.tsx
 M apps/web/src/routes/security.tsx
 M apps/web/src/routes/settings.tsx
 M apps/web/src/routes/shortcuts.tsx
 M apps/web/src/routes/statistics.tsx
 M apps/web/src/routes/students.tsx
 M apps/web/src/routes/surveys.tsx
 M apps/web/src/routes/teachers.tsx
 M apps/web/src/routes/teaching.tsx
 M apps/web/src/routes/timetable.tsx
 M apps/web/src/stores/globalStore.ts
 M apps/web/src/tests/app.test.ts
 M docs/api/openapi.yaml
 M packages/api/index.ts
 M packages/api/src/client.ts
 M packages/api/src/index.ts
 M packages/constants/src/subsystems.ts
?? API_INTEGRATION_MATRIX.md
?? FEATURE_IMPLEMENTATION_MATRIX.md
?? PRODUCTION_READINESS_REPORT.md
?? PROJECT_COMPLETION_MASTER.md
?? PROJECT_DELIVERY_INTELLIGENCE/
?? PROJECT_INTELLIGENCE.zip
?? PROJECT_INTELLIGENCE/
?? QA_VERIFICATION_REPORT.md
?? apps/backend/tests/test_phase10_portal_integrations_security.py
?? apps/backend/tests/test_phase11_security_idor_rbac.py
?? apps/web/src/tests/api_and_store.test.ts
```

## 2. Main Monorepo Diff Summary (`git diff --stat`)

```text
apps/backend/config/settings/base.py               |   18 +-
 apps/backend/config/settings/development.py        |   18 +-
 apps/backend/config/urls.py                        |    5 +
 apps/backend/core/authentication/views.py          |    9 +-
 apps/backend/core/campuses/views.py                |   24 +
 .../management/commands/seed_foundation.py         |   68 +-
 apps/backend/integrations/biometric/services.py    |   62 +-
 apps/backend/integrations/biometric/urls.py        |    6 +-
 apps/backend/integrations/biometric/views.py       |   55 +-
 apps/backend/integrations/payment/services.py      |   88 +-
 apps/backend/integrations/payment/urls.py          |    7 +-
 apps/backend/integrations/payment/views.py         |  105 +-
 apps/backend/integrations/sms/services.py          |   54 +-
 apps/backend/integrations/webhook/services.py      |   58 +-
 apps/backend/integrations/whatsapp/services.py     |   59 +-
 apps/backend/modules/analytics/views.py            |  532 ++++++-
 apps/backend/modules/events/urls.py                |   22 +
 apps/backend/modules/events/views.py               |   76 +
 apps/web/src/components/AIChatDrawer.tsx           |  120 +-
 apps/web/src/layouts/AppShell.tsx                  |  236 ++-
 apps/web/src/layouts/CommandPalette.tsx            |   88 +-
 apps/web/src/layouts/Header.tsx                    |   77 +-
 apps/web/src/layouts/NotificationsPanel.tsx        |   48 +-
 apps/web/src/layouts/Sidebar.tsx                   |   52 +-
 apps/web/src/routes/academics.tsx                  |   76 +-
 apps/web/src/routes/attendance.tsx                 |  200 ++-
 apps/web/src/routes/audit.tsx                      |  117 +-
 apps/web/src/routes/complaints.tsx                 |  202 +--
 apps/web/src/routes/homework.tsx                   |  142 +-
 apps/web/src/routes/index.tsx                      |  285 ++--
 apps/web/src/routes/license.tsx                    |  159 +-
 apps/web/src/routes/login.tsx                      |  229 ++-
 apps/web/src/routes/reports.tsx                    |  101 +-
 apps/web/src/routes/security.tsx                   |   90 +-
 apps/web/src/routes/settings.tsx                   |  235 +--
 apps/web/src/routes/shortcuts.tsx                  |   34 +-
 apps/web/src/routes/statistics.tsx                 |   83 +-
 apps/web/src/routes/students.tsx                   |  164 +--
 apps/web/src/routes/surveys.tsx                    |  149 +-
 apps/web/src/routes/teachers.tsx                   |  273 ++--
 apps/web/src/routes/teaching.tsx                   |  167 ++-
 apps/web/src/routes/timetable.tsx                  |  171 ++-
 apps/web/src/stores/globalStore.ts                 |  211 ++-
 apps/web/src/tests/app.test.ts                     |   18 +-
 docs/api/openapi.yaml                              | 1554 ++++++++++++++++++--
 packages/api/index.ts                              |   22 +-
 packages/api/src/client.ts                         |   91 +-
 packages/api/src/index.ts                          |    4 +
 packages/constants/src/subsystems.ts               |   48 +-
 49 files changed, 4925 insertions(+), 1787 deletions(-)
```

## 3. Twelve Decoupled Satellite Applications (`E:\E\VidyaMaxx\*-VidyaFloww`)

### `Admissions-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/AdmissionsModule.tsx` (verified)

### `Communication-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/CommunicationModule.tsx` (verified)

### `Design-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/DesignLabModule.tsx` (verified)

### `E-Class-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/modules/EClassModule.tsx` (verified)

### `Examinations-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/ExaminationsModule.tsx` (verified)

### `Hostel-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/HostelModule.tsx` (verified)

### `HRM-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/HRManagementModule.tsx` (verified)

### `Library-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/LibraryModule.tsx` (verified)

### `LMS-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/LMSModule.tsx` (verified)
- `src/learning.tsx` (verified)
- `src/resources.tsx` (verified)

### `Payments-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/PaymentsModule.tsx` (verified)
- `src/scholarships.tsx` (verified)

### `Portal-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/PortalModule.tsx` (verified)

### `Transport-VidyaFloww`
- `src/lib/apiClient.ts` (verified)
- `src/components/SatelliteAuthStatus.tsx` (verified)
- `src/App.tsx` (verified)
- `src/TransportModule.tsx` (verified)

