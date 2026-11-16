# Changelog

All notable changes to VidyaFloww will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v2.8.0] - 2026-08-11

### Added & Enhanced
- **Complete 24-Module Institutional ERP & SaaS Infrastructure**:
  - Module 1: Dashboard (`/`) — Central Institutional Intelligence & Activity Overview
  - Module 2: Students (`/students`) — Student 360, Health Records, Discipline & Lifecycle
  - Module 3: Academics (`/academics`) — Class & Section Structures, Subjects, Syllabus & Timetables
  - Module 4: Admissions (`/admissions`) — CRM Pipeline, AI Document OCR & Merit Evaluation
  - Module 5: Attendance (`/attendance`) — Biometric Turnstiles, Roll Call & AI Chronic Absenteeism Engine
  - Module 6: Examinations (`/examinations`) — Report Cards, CBSE Marks Entry & Re-evaluation
  - Module 7: Fees (`/fees`) — Fee Schedules, Concessions & Online Payment Gateway Integration
  - Module 8: Finance & Accounting (`/accounting`) — Double-Entry General Ledger, Invoices & Balance Sheets
  - Module 9: HR & Payroll (`/hr`) — Employee Profiles, Attendance, Salary Slips & Form 16
  - Module 10: Library (`/library`) — Catalog Search, RFID Circulation & Overdue Penalties
  - Module 11: Transport (`/transport`) — GPS Live Bus Telematics, Fuel Logs & Route Management
  - Module 12: Hostel (`/hostel`) — Room & Bed Inventory Matrix, Outpass QR & Warden Desk
  - Module 13: Inventory (`/inventory`) — Master Catalog, Fixed Assets & 3-Way Procurement Workflow
  - Module 14: Learning & LMS (`/learning`) — Lessons, Homework Assignments & MCQ Practice Quizzes
  - Module 15: Documents (`/documents`) — Central Document Vault & Certificate Live Preview Studio
  - Module 16: Communication (`/communication`) — Split-Pane Inbox, DLT SMS & Omnichannel Alerts
  - Module 17: Events & Activities (`/events`) — Monthly Activity Calendar, Clubs Directory & House Scoreboard
  - Module 18: Front Office (`/front-office`) — Admission CRM Kanban & Gate Pass Badge Printer
  - Module 19: School Administration (`/administration`) — Multi-Stage Approval Steppers & Governance Policies
  - Module 20: Parent & Student Portal (`/portal`) — Child Switcher, Timetables, Homework & Fee Payments
  - Module 21: Reports & Analytics (`/reports`) — Multi-Metric BI Area Charts & AI Natural Language Report Builder
  - Module 22: Security & Audit (`/security`) — SOC Incident Tracking, Active Devices & Immutable Audit Trails
  - Module 23: System Administration (`/system`) — Microservice Health, Integrations Marketplace & API Telemetry
  - Module 24: VidyaFloww AI (`/ai`) — Intelligent Institutional AI Assistant & Automated Insights

### Fixed & Refactored
- **Deep UI Layout Spacing & Deduplication**:
  - Updated `VFSection` primitive in `@vidyafloww/ui` to enforce vertical flex spacing (`space-y-3.5`).
  - Fixed microservice cards and data table search bars sticking together without margin.
  - Deduplicated top KPI stat cards so they ONLY appear on main `dashboard` tabs, keeping submodule tabs clean and focused.

---

## [0.1.0] - 2026-07-02

### Added
- Initial monorepo scaffold

[v2.8.0]: https://github.com/logicbyroshan/vidyafloww-school-management/compare/v0.1.0...main
[0.1.0]: https://github.com/logicbyroshan/vidyafloww-school-management/releases/tag/v0.1.0
