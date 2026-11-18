# Low-Level Design (LLD) — Timetable & Substitution Engine (`modules.timetable`)

- **Work Division**: `#4 Timetable` (`timetable`)
- **Primary Frontend Route**: `apps/web/src/routes/timetable.tsx` (`/timetable`)

## 1. Domain Models
1. **`PeriodSlotDefinition` (`timetable_period_slot`)**:
   - School-scoped period bell schedule (`period_number`, `label`, `start_time`, `end_time`, `slot_type`: `LECTURE` | `BREAK` | `ASSEMBLY`).
2. **`SchoolRoom` (`timetable_school_room`)**:
   - School/Branch-scoped physical room or laboratory (`room_code`, `name`, `room_type`, `capacity`).
3. **`TimetableEntry` (`timetable_entry`)**:
   - Links `academic_session`, `grade_class`, `section`, `day_of_week`, `period_number` (`1..8`), `time_label`, `subject`, `staff`, `room_label`, `entry_type` (`Core` | `Lab` | `Elective` | `Activity`).
   - Enforces non-overlapping constraints for `(section, day_of_week, period_number)`.
4. **`ProxySubstitution` (`timetable_proxy_substitution`)**:
   - Date-specific substitution assignment (`substitution_date`, `timetable_entry`, `absent_staff_name`, `substitute_staff`, `substitute_staff_name`, `reason`, `status`).

## 2. Conflict Detection Rules (Master Prompt Part 10.4)
- `assign_timetable_entry` validates before saving:
  1. **Teacher Conflict**: The assigned `staff` member is not already scheduled in another class/section on the same `day_of_week` and `period_number` within the same `academic_session`.
  2. **Room Conflict**: The `room_label` (if not empty/ground) is not already occupied by another class/section on the same `day_of_week` and `period_number`.
  3. **Class/Section Slot Uniqueness**: Upserts or rejects duplicate `(grade_class, section, day_of_week, period_number)`.

## 3. API Endpoints (`/api/v1/timetable/`)
- `GET / POST /api/v1/timetable/entries/` — List timetable grid (filtered by `class_section`, `teacher`, `day`) or assign a slot with conflict detection.
- `DELETE /api/v1/timetable/entries/<uuid:pk>/` — Clear a timetable slot.
- `GET / POST /api/v1/timetable/substitutions/` — List or assign daily proxy/substitute teachers.
