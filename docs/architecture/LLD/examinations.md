# Low-Level Design (LLD) — Examinations & Assessment Ledger (`modules.examinations`)

- **Work Division**: `#8 Examinations` (`examinations`)
- **Frontend**: `Examinations-VidyaFloww` (standalone) + `students.tsx` / `academics.tsx`

## 1. Domain Models
1. **`ExaminationCycle` (`exams_cycle`)**:
   - Scoped to `school`, `branch`, `academic_session`.
   - Fields: `code`, `name`, `term_label`, `start_date`, `end_date`, `weightage_pct`, `is_marks_locked`, `is_published`, `status` (`Scheduled` | `Ongoing` | `Evaluation` | `Published`).
2. **`StudentExamMark` (`exams_student_mark`)**:
   - Scoped to `school`, `examination`, `student`, `subject_code`, `subject_name`.
   - Fields: `theory_marks`, `max_theory_marks`, `practical_marks`, `max_practical_marks`, `total_marks`, `max_total_marks`, `grade`, `is_absent`, `is_locked`, `remarks`.
   - Unique constraint: `(examination, student, subject_code)`.

## 2. Business Rules (Master Prompt Part 10.5)
- Once an `ExaminationCycle.is_marks_locked` or `StudentExamMark.is_locked` is `True`, mark modifications are rejected (`409 MARKS_LOCKED`) unless unlocked by an authorized `SCHOOL_ADMIN` or `examinations:approve` holder, which writes an immutable `AuditEvent`.

## 3. API Endpoints (`/api/v1/examinations/`)
- `GET / POST /api/v1/examinations/cycles/` — List or create examination cycles.
- `POST /api/v1/examinations/cycles/<uuid:pk>/lock/` — Lock or unlock exam marks entry.
- `GET / POST /api/v1/examinations/marks/` — Query or bulk-record student exam marks.
