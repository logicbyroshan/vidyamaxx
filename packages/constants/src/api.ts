/**
 * @vidyafloww/constants — API Endpoint Constants
 *
 * Typed API endpoint path constants.
 *
 * TODO: Expand as backend endpoints are implemented.
 */

const V1 = '/api/v1';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${V1}/auth/login/`,
    LOGOUT: `${V1}/auth/logout/`,
    REFRESH: `${V1}/auth/token/refresh/`,
    ME: `${V1}/auth/me/`,
  },

  // Users
  USERS: {
    LIST: `${V1}/users/`,
    DETAIL: (id: string) => `${V1}/users/${id}/`,
  },

  // Organizations
  ORGANIZATIONS: {
    LIST: `${V1}/organizations/`,
    DETAIL: (id: string) => `${V1}/organizations/${id}/`,
  },

  // Students
  STUDENTS: {
    LIST: `${V1}/students/`,
    DETAIL: (id: string) => `${V1}/students/${id}/`,
    ATTENDANCE: (id: string) => `${V1}/students/${id}/attendance/`,
  },

  // Admissions
  ADMISSIONS: {
    LIST: `${V1}/admissions/`,
    DETAIL: (id: string) => `${V1}/admissions/${id}/`,
    APPROVE: (id: string) => `${V1}/admissions/${id}/approve/`,
  },
} as const;
