# ADR-004: Scoped Work Responsibility RBAC (No Flat Job-Title Roles)

- **Status**: Accepted
- **Date**: 2026-11-18

## Context
Legacy constants (`packages/constants/src/roles.ts`) listed flat job titles (`teacher`, `accountant`, `librarian`). In real Indian schools, one staff member often holds overlapping duties (e.g., Math Teacher for 6-A & 6-B + Sports House Coordinator + Temporary Exam Invigilator).

## Decision
Implement the 7 canonical user types (`SUPER_ADMIN`, `SUPER_EXECUTIVE`, `SCHOOL_ADMIN`, `SCHOOL_EXECUTIVE`, `STAFF`, `STUDENT`, `PARENT`):
- One unified **`STAFF`** type for all employees.
- Permissions for `STAFF` are modeled exclusively via **`StaffResponsibilityAssignment`** linking `(membership, work_division, submodule, actions, branch_ids, class_ids, section_ids, subject_ids, student_ids, valid_from, valid_until, revoked_at)` with an immutable audit history.
- Enforce `SUPER_EXECUTIVE` restriction preventing subscription cancellation.

## Alternatives Rejected
- **Django Groups / Static Role Strings**: Cannot express class/section/subject/time-bounded scopes cleanly.
