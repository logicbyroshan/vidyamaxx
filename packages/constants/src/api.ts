/**
 * @vidyafloww/constants — API Endpoint Constants
 *
 * Typed API endpoint path constants synchronized with Django backend `/api/v1/`.
 */

const V1 = '/api/v1';

export const API_ENDPOINTS = {
  HEALTH: `${V1}/health/`,

  // Auth & Session
  AUTH: {
    LOGIN: `${V1}/auth/login/`,
    REGISTER: `${V1}/auth/register/`,
    OTP_REQUEST: `${V1}/auth/otp/request/`,
    OTP_VERIFY: `${V1}/auth/otp/verify/`,
    PASSWORD_RESET: `${V1}/auth/password/reset/`,
    USERNAME_LOOKUP: `${V1}/auth/username/lookup/`,
    LOGOUT: `${V1}/auth/logout/`,
    REFRESH: `${V1}/auth/token/refresh/`,
    ME: `${V1}/auth/me/`,
  },

  // Schools, Branches & Platform Subscriptions
  SCHOOLS: {
    CURRENT: `${V1}/schools/current/`,
    BRANCHES: `${V1}/schools/branches/`,
    BRANCH_DETAIL: (id: string) => `${V1}/schools/branches/${id}/`,
  },

  PLATFORM: {
    SUBSCRIPTION: `${V1}/platform/subscription/`,
    PAYMENT_METHOD: `${V1}/platform/subscription/payment-method/`,
    CANCEL_SUBSCRIPTION: `${V1}/platform/subscription/cancel/`,
  },

  // Permissions & Governance
  PERMISSIONS: {
    RESPONSIBILITIES: `${V1}/permissions/responsibilities/`,
    RESPONSIBILITY_DETAIL: (id: string) => `${V1}/permissions/responsibilities/${id}/`,
    HISTORY: `${V1}/permissions/responsibilities/history/`,
    POLICIES: `${V1}/permissions/policies/`,
  },

  AUDIT: {
    EVENTS: `${V1}/audit/events/`,
  },

  STORAGE: {
    UPLOAD: `${V1}/storage/files/`,
    DOWNLOAD: (id: string) => `${V1}/storage/files/${id}/download/`,
  },

  NOTIFICATIONS: {
    LIST: `${V1}/notifications/`,
    MARK_ALL_READ: `${V1}/notifications/mark-all-read/`,
  },

  // Domain Modules (Upcoming Phases)
  USERS: {
    LIST: `${V1}/users/`,
    DETAIL: (id: string) => `${V1}/users/${id}/`,
  },

  ORGANIZATIONS: {
    LIST: `${V1}/organizations/`,
    DETAIL: (id: string) => `${V1}/organizations/${id}/`,
  },

  // Phase 2: Core Institutional Data
  ACADEMICS: {
    SESSIONS: `${V1}/academics/sessions/`,
    CLASSES: `${V1}/academics/classes/`,
    CLASS_DETAIL: (id: string) => `${V1}/academics/classes/${id}/`,
    CLASS_SUBJECTS: `${V1}/academics/class-subjects/`,
    MILESTONES: `${V1}/academics/milestones/`,
  },

  STAFF: {
    LIST: `${V1}/staff/`,
    DETAIL: (id: string) => `${V1}/staff/${id}/`,
    DOSSIER_FIELDS: `${V1}/staff/dossier-fields/`,
  },

  STUDENTS: {
    LIST: `${V1}/students/`,
    DETAIL: (id: string) => `${V1}/students/${id}/`,
    PROMOTE: (id: string) => `${V1}/students/${id}/promote/`,
    WITHDRAW: (id: string) => `${V1}/students/${id}/withdraw/`,
    READMIT: (id: string) => `${V1}/students/${id}/readmit/`,
    DOSSIER_FIELDS: `${V1}/students/dossier-fields/`,
    ATTENDANCE: (id: string) => `${V1}/students/${id}/attendance/`,
  },

  ADMISSIONS: {
    LIST: `${V1}/admissions/applications/`,
    ENQUIRIES: `${V1}/admissions/enquiries/`,
    DETAIL: (id: string) => `${V1}/admissions/applications/${id}/`,
    APPROVE: (id: string) => `${V1}/admissions/applications/${id}/approve/`,
    ENROLL: (id: string) => `${V1}/admissions/applications/${id}/enroll/`,
  },

  // Phase 3: Daily Academic Operations
  TIMETABLE: {
    ENTRIES: `${V1}/timetable/entries/`,
    ENTRY_DETAIL: (id: string) => `${V1}/timetable/entries/${id}/`,
    SUBSTITUTIONS: `${V1}/timetable/substitutions/`,
  },

  ATTENDANCE: {
    RECORDS: `${V1}/attendance/records/`,
    MARK_BULK: `${V1}/attendance/mark-bulk/`,
    LEAVES: `${V1}/attendance/leaves/`,
    LEAVE_DECIDE: (id: string) => `${V1}/attendance/leaves/${id}/decide/`,
  },

  TEACHING: {
    LESSON_PLANS: `${V1}/teaching/lesson-plans/`,
    LESSON_PLAN_DETAIL: (id: string) => `${V1}/teaching/lesson-plans/${id}/`,
    DIARY: `${V1}/teaching/diary/`,
    RESOURCES: `${V1}/teaching/resources/`,
    ONLINE_CLASSES: `${V1}/teaching/online-classes/`,
  },

  HOMEWORK: {
    ASSIGNMENTS: `${V1}/homework/assignments/`,
    ASSIGNMENT_DETAIL: (id: string) => `${V1}/homework/assignments/${id}/`,
    SUBMISSIONS: (id: string) => `${V1}/homework/assignments/${id}/submissions/`,
  },

  EXAMINATIONS: {
    CYCLES: `${V1}/examinations/cycles/`,
    CYCLE_LOCK: (id: string) => `${V1}/examinations/cycles/${id}/lock/`,
    MARKS: `${V1}/examinations/marks/`,
  },
} as const;
