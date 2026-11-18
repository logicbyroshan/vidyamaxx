# Low-Level Design (LLD) — Teaching Workspace & Lesson Planning (`modules.academics` / `modules.lms`)

- **Work Division**: `#6 Teaching` (`teaching`)
- **Primary Frontend Route**: `apps/web/src/routes/teaching.tsx` (`/teaching`)

## 1. Domain Models
1. **`LessonPlan` (`teaching_lesson_plan`)**:
   - Scoped to `school`, `branch`, `academic_session`.
   - Fields: `plan_code`, `class_section_label`, `subject_name`, `teacher_name`, `unit_title`, `topic_title`, `scheduled_date`, `duration_minutes`, `pedagogy_method`, `learning_objectives`, `resources_links_json`, `completion_pct`, `status` (`Completed` | `In Progress` | `Upcoming` | `Pending Review`), `hod_remarks`.
2. **`TeachingDiaryEntry` (`teaching_diary_entry`)**:
   - Daily classroom execution log (`entry_date`, `period_label`, `class_section_label`, `subject_name`, `teacher_name`, `topic_covered`, `homework_assigned`, `student_engagement_rating`, `notes`).

## 2. API Endpoints (`/api/v1/teaching/`)
- `GET / POST /api/v1/teaching/lesson-plans/` — List or create lesson plans & syllabus tracker items.
- `PATCH /api/v1/teaching/lesson-plans/<uuid:pk>/` — Update completion percentage, status, or HOD review remarks.
- `GET / POST /api/v1/teaching/diary/` — List or log daily teaching diary entries.
