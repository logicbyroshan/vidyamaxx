/**
 * @vidyafloww/constants — Application Routes
 *
 * Centralized route definitions for web and mobile navigation.
 *
 * TODO: Expand as screens are built. Keep in sync with TanStack Router route tree.
 */

export const ROUTES = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Dashboard
  HOME: '/',
  DASHBOARD: '/dashboard',

  // Students
  STUDENTS: '/students',
  STUDENT_DETAIL: (id: string) => `/students/${id}`,
  STUDENT_NEW: '/students/new',

  // Admissions
  ADMISSIONS: '/admissions',
  ADMISSIONS_NEW: '/admissions/new',

  // Academics
  ACADEMICS: '/academics',
  TIMETABLE: '/timetable',
  ATTENDANCE: '/attendance',
  EXAMINATIONS: '/examinations',
  HOMEWORK: '/homework',

  // Teachers / Faculty
  TEACHERS: '/teachers',
  STAFF: '/teachers',

  // Finance
  FINANCE: '/fees',
  FEES: '/fees',

  // Operations
  NOTICES: '/notices',
  REPORTS: '/reports',
  STATISTICS: '/statistics',

  // Settings
  SETTINGS: '/settings',
  SETTINGS_ORGANIZATION: '/settings/organization',
  SETTINGS_USERS: '/settings/users',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
