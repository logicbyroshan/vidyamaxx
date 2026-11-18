# VidyaFloww — Authentication & Scoped Responsibility Authorization Architecture

## 1. Authentication Stack

- **Password Hashing**: `Argon2PasswordHasher` primary (with `PBKDF2PasswordHasher` fallback).
- **Stateless Access + Rotated Refresh Tokens**:
  - **Access JWT (`15 minutes`)**: Carries `sub` (`user_id`), `jti`, `iat`, `exp`, `default_school_id`, `user_type`, `session_id` (DeviceSession UUID). Permissions are NOT bloated into JWT claims indefinitely; active responsibility scopes are resolved efficiently from Redis-cached `Membership` + `StaffResponsibilityAssignment`.
  - **Refresh Token (`7 days`)**: Issued via `HttpOnly`, `Secure` (in prod), `SameSite=Lax` cookie + body option for mobile/Electron clients. Uses SimpleJWT rotation (`ROTATE_REFRESH_TOKENS=True`, `BLACKLIST_AFTER_ROTATION=True`) backed by Redis to immediately detect stolen refresh token reuse.
- **Multi-Factor & OTP Flows** (`/login` UI compliance):
  - Registration, Forgot Password, and Username Lookup issue 6-digit CSPRNG OTPs stored hashed in Redis (`5 min TTL`, max 5 verification attempts per window, rate-limited per IP and target identifier).
  - Verified OTP returns a short-lived signed `action_token` (`5 min TTL`) bound to exact purpose (`password_reset`, `registration`).
- **Google / Microsoft OAuth SSO**: Validates OAuth `id_token` server-side via Google/Microsoft JWKS before matching an active institutional `User` email.

---

## 2. User Types & Hierarchy (Master Prompt Part 7 Compliant)

VidyaFloww defines **7 canonical user types** (never flat job-title auth roles like "Librarian" or "Teacher"):

| Level | User Type Enum | Scope & Governance Rules |
|---|---|---|
| **Platform** | `SUPER_ADMIN` | Owns `CustomerTenant`. Can create/manage schools, billing, and cancel subscription. |
| **Platform** | `SUPER_EXECUTIVE` | Delegated platform operations across `CustomerTenant`. **Explicitly forbidden from cancelling customer subscription** (enforced at service & permission layer -> `403`). |
| **School** | `SCHOOL_ADMIN` | Full management authority across assigned `School` (and all its branches). |
| **School** | `SCHOOL_EXECUTIVE` | Delegated school-wide operational authority across assigned `School` (subject to any explicit policy restrictions). |
| **Staff** | `STAFF` | **Single unified staff user type.** Zero implicit access! All capabilities derive exclusively from `StaffResponsibilityAssignment` records. |
| **End-User** | `STUDENT` | Self-service access only to own attendance, timetable, homework, results, portal. |
| **End-User** | `PARENT` | Access scoped strictly to verified `GuardianStudentLink` children. |

---

## 3. Multi-School Membership & Scoped Work Responsibilities

1. **Multi-School Access (`Membership`)**:
   - A single `User` (phone/email) can hold multiple `Membership` rows across different `School`s within the same or different `CustomerTenant`s, with distinct `user_type` and `StaffProfile` per school!
   - Requests pass `X-School-ID` (and optional `X-Branch-ID`); middleware verifies an active `Membership` exists for `(user, school)`.
2. **Scoped Work Responsibility Assignments (`StaffResponsibilityAssignment`)**:
   - Assigned to a `Membership` (`user_type=STAFF`) by `School Admin` / authorized `School Executive`.
   - **Granularity**:
     - `work_division` (1 of 30 finalized divisions, e.g., `attendance`, `fees_finance`, `teaching`)
     - `submodule_code` (optional; `*` for entire division or specific e.g. `leave_approval`)
     - `actions` (`view`, `create`, `edit`, `delete`, `approve`, `export`, `manage`)
   - **Data Scope Restrictions**:
     - `branch_ids` (empty = all branches in school, or specific branch UUIDs)
     - `grade_class_ids` / `section_ids` (e.g., Teacher scoped strictly to `Class 6-A` & `Class 6-B`)
     - `subject_ids` (e.g., Subject teacher scoped to `Mathematics`)
     - `student_ids` (e.g., Counsellor assigned specific students)
   - **Temporal & Audit Lifecycle**:
     - Supports `valid_from`, `valid_until` (temporary substitution/acting coordinator assignments), explicit `revoked_at`, `revoked_by`, and immutable `ResponsibilityAssignmentHistory`.
