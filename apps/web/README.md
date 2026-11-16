# @vidyafloww/web

React 19 web application for **VidyaFloww — Enterprise School Management Platform**.

## 🛠️ Tech Stack

- **React 19** + **TypeScript 5.6**
- **Vite 5** — Build tool and dev server
- **TanStack Router** — Type-safe client-side routing
- **Zustand** — Client state management with `localStorage` persistence
- **Tailwind CSS** — Design system styling with bespoke dark palette
- **Lucide React** — Institutional iconography

## 🏛️ Active V1 Routes

- `/` — **Dashboard** (Executive Telemetry, Student Attendance Radar, Hardware Sync)
- `/students` — **Students** (Enrolled Roster, 360° Profiles, Demographics)
- `/admissions` — **Admissions** (4-Stage Pipeline, OCR Verification, Merit Scoring)
- `/attendance` — **Attendance** (Daily Roll Call, One-Click Mark All Present, Absence Alerts)
- `/academics` — **Academics** (Session Master, Subject Catalog, Section Allocations)
- `/timetable` — **Timetable** (Period Grid Matrix, Auto-Substitutions, Bell Timings)
- `/staff` — **Teachers** (Faculty Master Directory, Workload Meters)
- `/homework` — **Homework** (Assignment Register, Grading Feedback Queue)
- `/examinations` — **Examinations** (Exam Schedules, Marks Entry, Gradebooks)
- `/fees` — **Fees & Payments** (Collection Master, Defaulter Alerts)
- `/notices` — **Notices** (Official Circular Board, Broadcast Publisher)
- `/reports` — **Reports** (CBSE/RTE Compliance Audits, Excel/PDF Exports)
- `/settings` — **Settings** (School Identity & Custom Logo Studio, Campuses, RBAC)

## 💻 Development

```bash
# From the monorepo root
pnpm --filter @vidyafloww/web dev

# Type check
pnpm --filter @vidyafloww/web type-check

# Production build
pnpm --filter @vidyafloww/web build
```
