# 13 — 🏫 VidyaFloww 33-Module Architecture & AI Specification

VidyaFloww is an AI-first, multi-tenant enterprise school management platform designed to manage the end-to-end operational, academic, financial, and administrative lifecycle of educational institutions.

---

## 🏛️ Core Institutional Hierarchy

All data and permissions in VidyaFloww are scoped according to the primary multi-tenant hierarchy:

```text
Organization (Multi-School / Group)
   └── Campus / Branch
         └── Academic Session (Year)
               └── Class / Grade
                     └── Section
                           ├── Students (Student 360° Profile)
                           └── Teachers / Staff (HR 360° Profile)
```

---

## 🧭 Navigation & Submodule Workspace Architecture

- **33 Main Business Modules**: The main sidebar displays all 33 main business modules with 100% unique route URL isolation.
- **Top Sub-module Tab Bar (`VFTabs`)**: Selecting any main module mounts its submodules in the sticky top sub-module tab bar.
- **Global `VidyaFloww AI` Assistant**: Accessible from anywhere in the application via the prominent `✨ VidyaFloww AI` button located in the sidebar footer directly above the profile card, or via the `Shift+K` keyboard shortcut.
- **Fail-Safe Dual Engine Data Tables (`VFTable`)**: All data tables feature client-side text searching, column visibility toggles, multi-column sorting, and pagination controls.

---

## 📑 Complete 33 VidyaFloww Main Business Modules Specification

### 01 — 📊 Dashboard
**Executive Command Center & Health Overview**
* **Submodules**: Overview, Today's Operations, Alerts & Attention, Upcoming, My Tasks, Quick Actions, Role Dashboard.
* **Capabilities**: Real-time operational widgets, executive financial KPIs, attendance radars, and task management.

### 02 — 🎓 Admissions
**Intake & Applicant Lifecycle**
* **Submodules**: Admission Dashboard, Enquiries, Applications, Applicant Review, Documents, Interviews & Assessments, Selection & Offers, Enrollment, Admission Settings.
* **VidyaFloww AI Capabilities**:
  - OCR automated document extraction & transcript field parsing.
  - Missing document flags & duplicate applicant detection.
  - Parent enquiry conversion probability scoring.

### 03 — 👨‍🎓 Students
**Central Student 360° Directory**
* **Submodules**: Student Dashboard, Student Directory, Student Profiles, Guardians & Family, Class & Section, Student Groups, Student Status, Student Documents, Student History, Student Import & Export.
* **Key Concept**: **Student 360° Profile** — Single pane of glass for all grades, attendance, payments, and disciplinary logs.

### 04 — 📚 Academics
**Curriculum & Class Structure Engine**
* **Submodules**: Academic Dashboard, Academic Structure, Classes & Sections, Subjects, Curriculum, Academic Sessions, Teachers & Subject Assignment, Academic Planning, Academic Calendar, Academic Settings.
* **VidyaFloww AI Capabilities**:
  - Automated lesson plan generation with custom objectives, classroom activities, and assessment prompts.

### 05 — 🗓️ Timetable
**Constraint-Based Scheduling Engine**
* **Submodules**: Timetable Dashboard, Schedule Configuration, Class Timetable, Teacher Timetable, Rooms & Resources, Substitutions, Exam & Event Scheduling, Timetable Versions.
* **VidyaFloww AI Capabilities**:
  - Auto-substitution engine and workload balancing.

### 06 — ✅ Attendance
**Biometric & Attendance Management**
* **Submodules**: Attendance Dashboard, Student Attendance, Period Attendance, Employee Attendance, Leave, Corrections & Regularization, Devices & Biometrics, Attendance Reports.
* **VidyaFloww AI Capabilities**:
  - Chronic absenteeism risk prediction & automated instant parent notifications.

### 07 — 📝 Examination
**Assessment & Grading Engine**
* **Submodules**: Examination Dashboard, Exams, Tests & Assessments, Question Bank, Question Papers, Exam Schedule, Hall Tickets, Seating & Invigilation, Evaluation, Results & Report Cards, Examination Reports.
* **VidyaFloww AI Capabilities**:
  - Automated question paper generator balancing difficulty levels, bloom's taxonomy, and answer keys.

### 08 — 💰 Fees
**Student Accounts & Counter Collections**
* **Submodules**: Fee Dashboard, Fee Structures, Student Accounts, Collections, Discounts & Scholarships, Payments & Refunds, Dues & Defaulters, Fee Reports, Fee Settings.
* **VidyaFloww AI Capabilities**:
  - Predictive fee defaulter risk scoring & automated WhatsApp payment reminders.

### 09 — 🏦 Finance
**Institutional Accounting Ledger & Purchasing**
* **Submodules**: Finance Dashboard, Expenses, Vendors & Purchases, Accounting, Budget, Bank & Reconciliation, Financial Controls, Finance Reports.
* **Capabilities**: Double-entry ledger accounting, expense approval workflows, vendor POs, and bank reconciliation.

### 10 — 👨‍🏫 HR & Payroll
**Staff Lifecycle & Payroll Engine**
* **Submodules**: HR Dashboard, Employee Directory, Employee Profiles, Recruitment, Attendance & Leave, Payroll, Salary Structure, Performance, Employee Documents, HR Reports.
* **Capabilities**: Salary structures, payslip generation, leave management, and staff performance appraisals.

### 11 — 📖 Library
**Book Catalog & Circulation**
* **Submodules**: Library Dashboard, Catalog, Books, Members, Issue & Return, Reservations, Fines, Inventory, Library Reports, Library Settings.
* **Capabilities**: ISBN barcode scanning, auto-calculated overdue fines, and book reservations.

### 12 — 🚌 Transport
**Fleet Management & Route Tracking**
* **Submodules**: Transport Dashboard, Routes, Stops, Vehicles, Drivers & Staff, Student Allocation, Transport Fees, GPS & Tracking, Maintenance, Transport Reports.
* **Capabilities**: Live GPS vehicle tracking, route optimization, and driver license tracking.

### 13 — 🏢 Hostel
**Dormitory Allocation & Mess Management**
* **Submodules**: Hostel Dashboard, Buildings & Blocks, Rooms & Beds, Student Allocation, Hostel Attendance, Mess & Meals, Hostel Fees, Complaints & Incidents, Hostel Staff, Hostel Reports.
* **Capabilities**: Bed allocation matrix, mess meal menus, and night attendance logs.

### 14 — 📦 Inventory & Assets
**Store Stock & Fixed Assets**
* **Submodules**: Inventory Dashboard, Items & Catalog, Stock, Purchases, Issue & Return, Assets, Asset Assignment, Maintenance, Vendors, Inventory Reports.
* **Capabilities**: Stock reorder alerts, store issue slips, asset barcodes, and depreciation schedules.

### 15 — 💻 Homework & Learning
**Digital LMS & Homework**
* **Submodules**: Learning Dashboard, Homework, Assignments, Study Material, Tutorials, Online Classes, Student Submissions, Evaluation, Learning Progress, Learning Reports.
* **Capabilities**: Homework submission portal, online video lessons, and digital study material.

### 16 — 📄 Documents & Certificates
**ID Card Studio & Certificate Generation**
* **Submodules**: Document Dashboard, Student Documents, Employee Documents, Certificate Templates, Certificate Generation, TC & Transfer, Document Verification, Document Requests, Digital Vault, Document Reports.
* **Capabilities**: Bulk ID card generation, Transfer Certificate (TC) verification, and digital vault.

### 17 — 💬 Communication
**DLT SMS, Email & WhatsApp Gateways**
* **Submodules**: Communication Dashboard, Announcements, Messages, SMS, Email, Push Notifications, WhatsApp, Templates, Campaigns, Communication Reports.
* **Capabilities**: Multi-channel broadcasting, DLT SMS gateway integration, and WhatsApp notification templates.

### 18 — 🎪 Events & Activities
**School Events & Extra-Curricular Clubs**
* **Submodules**: Events Dashboard, School Events, Academic Events, Sports, Clubs & Activities, Competitions, Registrations, Gallery, Certificates, Event Reports.
* **Capabilities**: Event registration management, sports meet scheduling, and media galleries.

### 19 — 🚪 Front Office & Enquiries
**Reception & Visitor Gate Pass System**
* **Submodules**: Front Office Dashboard, Enquiries, Visitors, Appointments, Calls & Follow-ups, Reception, Complaints, Lost & Found, Front Office Reports.
* **Capabilities**: Instant visitor gate pass printing, phone log tracking, and parent appointment schedules.

### 20 — 🏫 School Administration
**Institutional Configuration & Policies**
* **Submodules**: School Dashboard, School Profile, Campuses, Academic Sessions, Departments, Designations, Working Days & Holidays, School Policies, Workflow Configuration, School Settings.
* **Capabilities**: Multi-campus branch settings, session rollover management, and school policy enforcement.

### 21 — 🎓 Parent & Student Portal
**Dedicated Guardian & Student Workspace**
* **Submodules**: Portal Dashboard, Student Profile, Academics, Attendance, Timetable, Homework & Learning, Examination & Results, Fees & Payments, Communication, Requests & Services.
* **Capabilities**: 360° view for parents to pay fees online, track attendance, and download report cards.

### 22 — 📈 Reports & Analytics
**Cross-Module BI & PDF Export Engine**
* **Submodules**: Reports Dashboard, Student Reports, Academic Reports, Attendance Reports, Examination Reports, Fee Reports, Finance Reports, HR Reports, Operations Reports, Custom Reports, Scheduled Reports, Data Export.
* **Capabilities**: Custom BI report builder, automated PDF exports, and scheduled email reports.

### 23 — 🛡️ Security & Audit
**Immutable Audit Trails & Access Monitoring**
* **Submodules**: Security Dashboard, Activity Logs, Audit Logs, Login & Sessions, Devices, Access Monitoring, Data Changes, Security Alerts, Compliance, Security Reports.
* **Capabilities**: Real-time user login tracking, 2FA security enforcement, and immutable database audit logs.

### 24 — ⚙️ System Administration
**Global Platform Configuration & RBAC**
* **Submodules**: System Dashboard, Users, Roles & Permissions, Organizations, Integrations, API & Webhooks, Storage, Backup & Recovery, Notifications Configuration, System Settings, Feature Flags, System Health.
* **Capabilities**: Granular role-based access control (RBAC), API webhook configurations, and real-time microservice health monitoring.

---

## 🤖 Global `VidyaFloww AI` Assistant Engine

The global `VidyaFloww AI` Assistant is integrated across all 24 modules:

* **Entry Point**: Available from the sidebar footer (`VidyaFloww AI` button) or via keyboard shortcut `Shift+K`.
* **Context Awareness**: Captures current page context to answer queries like *"Show me overdue fees for Class 10"* or *"Generate a physics lesson plan for Chapter 4"*.
* **Autonomous AI Agents**:
  1. **OCR Document Extractor Agent** — Extracts text & numbers from scanned marksheets and birth certificates.
  2. **Fee Defaulter Predictor Agent** — Forecasts collection risks and triggers automated WhatsApp reminder drafts.
  3. **Timetable & Substitution Agent** — Re-routes free teachers to absent class periods in real time.
  4. **Question Paper Generator Agent** — Creates difficulty-balanced exam papers according to CBSE/ICSE curriculum specifications.
