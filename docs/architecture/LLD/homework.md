# Low-Level Design (LLD) — Homework & Assignments (`modules.homework`)

- **Work Division**: `#7 Homework` (`homework`)
- **Primary Frontend Route**: `apps/web/src/routes/homework.tsx` (`/homework`)

## 1. Domain Models
1. **`HomeworkAssignment` (`homework_assignment`)**:
   - Scoped to `school`, `branch`, `academic_session`.
   - Fields: `assignment_code`, `title`, `description`, `class_section_label`, `subject_name`, `teacher_name`, `assigned_date`, `due_date`, `max_marks`, `submission_type` (`Digital PDF / Photo` | `Notebook Physical` | `Quiz / MCQ` | `Lab Practical`), `total_students`, `submitted_count`, `evaluated_count`, `status` (`Active` | `Due Today` | `Closed` | `Draft`).
2. **`HomeworkSubmission` (`homework_submission`)**:
   - Student submission & evaluation record (`assignment`, `student`, `student_name`, `admission_number`, `submitted_at`, `status`: `Submitted` | `Pending` | `Late` | `Graded`, `marks_obtained`, `grade_label`, `teacher_feedback`, `attachment_url`).
   - Unique constraint: `(assignment, student)`.

## 2. API Endpoints (`/api/v1/homework/`)
- `GET / POST /api/v1/homework/assignments/` — List or publish homework assignments.
- `PATCH / DELETE /api/v1/homework/assignments/<uuid:pk>/` — Update or delete an assignment.
- `GET / POST /api/v1/homework/assignments/<uuid:pk>/submissions/` — List or grade student submissions for an assignment.
