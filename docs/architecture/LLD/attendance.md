# Low-Level Design (LLD) — Attendance & Leave Governance (`modules.attendance`)

- **Work Division**: `#5 Attendance` (`attendance`)
- **Primary Frontend Route**: `apps/web/src/routes/attendance.tsx` (`/attendance`)

## 1. Domain Models
1. **`StudentAttendanceRecord` (`attendance_student_record`)**:
   - Scoped to `school`, `branch`, `academic_session`, `student`, `attendance_date`.
   - Fields: `class_section_label`, `status` (`present` | `absent` | `late` | `half_day` | `medical_leave`), `check_in_time`, `remarks`, `is_locked`, `marked_by_id`.
   - Unique constraint: `(school, student, attendance_date)`.
2. **`AttendanceCorrectionLog` (`attendance_correction_log`)**:
   - Append-only audit log whenever an existing attendance record is modified after initial submission (`record`, `previous_status`, `new_status`, `reason`, `corrected_by_id`).
3. **`LeaveApplication` (`attendance_leave_application`)**:
   - Student or Staff leave request (`applicant_type`: `STUDENT` | `STAFF`, `student`, `staff`, `leave_type`, `from_date`, `to_date`, `reason`, `status`: `Pending` | `Approved` | `Rejected`, `approved_by_id`).

## 2. Business Rules (Master Prompt Part 10.3)
- Bulk attendance marking (`POST /api/v1/attendance/mark-bulk/`) atomically records or updates attendance for a class-section on a given date and logs an `AttendanceCorrectionLog` whenever an already-marked status is changed.
- Leave approval (`POST /api/v1/attendance/leaves/<id>/decide/`) updates leave status and records an immutable `AuditEvent`.

## 3. API Endpoints (`/api/v1/attendance/`)
- `GET /api/v1/attendance/records/` — List attendance records by `date`, `class_section`, `status`.
- `POST /api/v1/attendance/mark-bulk/` — Bulk mark/update daily attendance for a class-section.
- `GET / POST /api/v1/attendance/leaves/` — List or submit leave applications.
- `POST /api/v1/attendance/leaves/<uuid:pk>/decide/` — Approve or reject a leave application.
