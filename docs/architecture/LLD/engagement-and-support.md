# Low-Level Design (LLD) — Engagement, Health, Counselling & Support (`modules.medical`, `modules.welfare`, `modules.communication`, `platform_services.forms`, `modules.discipline`)

## 1. Covered Work Divisions
- **#19 Student Health** (`student_health`) — `StudentHealthRecord`, `InfirmaryVisitLog` (`modules.medical`).
- **#20 Counselling & Support** (`counselling_support`) — `CounsellingRecord` (`modules.welfare`) with strict confidential RBAC (`HasWorkDivisionAccess` on `GET` as well as `POST` so general faculty without explicit `counselling_support` responsibility are denied `403`).
- **#21 Communication** (`communication`) — `CircularBroadcast` (`modules.communication`).
- **#24 Surveys & Forms** (`surveys_forms`) — `SurveyPoll` & `SurveyVoteResponse` (`platform_services.forms`, connected to `apps/web/src/routes/surveys.tsx`).
- **#25 Complaints & Grievances** (`complaints_grievances`) — `GrievanceTicket` (`modules.discipline`, connected to `apps/web/src/routes/complaints.tsx`).

## 2. API Endpoints (`/api/v1/engagement/`)
- `GET / POST /api/v1/engagement/health/visits/`
- `GET / POST /api/v1/engagement/counselling/records/` (Strictly guarded by `HasWorkDivisionAccess` for `counselling_support`)
- `GET / POST /api/v1/engagement/circulars/`
- `GET / POST /api/v1/engagement/surveys/` & `POST /api/v1/engagement/surveys/<uuid:pk>/vote/`
- `GET / POST /api/v1/engagement/complaints/` & `PATCH /api/v1/engagement/complaints/<uuid:pk>/`
