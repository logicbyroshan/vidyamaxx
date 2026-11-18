# Low-Level Design (LLD) — Governance, Reports, Analytics, Compliance, AI & Subsystem Contracts (`platform_services.reports`, `modules.analytics`, `platform_services.dashboard`, `ai.assistants`)

## 1. Covered Work Divisions & Platform Capabilities
- **#27 Reports & Analytics** (`reports_analytics`) — `GeneratedReportRecord`, `SchoolAnalyticsSnapshot`, and Executive Command Center KPI aggregator (`/api/v1/analytics/dashboard/`, `/api/v1/analytics/statistics/`, `/api/v1/analytics/reports/`).
- **#29 Compliance & Records** (`compliance_records`) — `StatutoryComplianceFiling` (UDISE+, CBSE OASIS, RTE 25% Quota, Fire Safety NOC).
- **Cross-Platform AI Capability** (`ai.assistants`) — `/api/v1/ai/assist/` (never a 31st work division; inherits caller's domain permission).
- **12 Decoupled Subsystems Integration Contract** — `/api/v1/integrations/subsystems/` providing live health, SSO token handoff metadata, and contract status for Transport, E-Library, Hostel, HR/Biometrics, Design Lab, E-Class, Parent/Student Portal, Admissions Public App, LMS, Payments Engine, Examination Engine, and Communication Hub.
