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

  STUDENTS: {
    LIST: `${V1}/students/`,
    DETAIL: (id: string) => `${V1}/students/${id}/`,
    ATTENDANCE: (id: string) => `${V1}/students/${id}/attendance/`,
  },

  ADMISSIONS: {
    LIST: `${V1}/admissions/`,
    DETAIL: (id: string) => `${V1}/admissions/${id}/`,
    APPROVE: (id: string) => `${V1}/admissions/${id}/approve/`,
  },
} as const;
