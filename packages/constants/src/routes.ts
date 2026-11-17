/**
 * @vidyafloww/constants — Application Routes
 *
 * Centralized route definitions for web and mobile navigation.
 *
 * TODO: Expand as screens are built. Keep in sync with TanStack Router route tree.
 */

export const ROUTES = {
  // Auth
  LOGIN: '/login',
  LOGOUT: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Dashboard
  HOME: '/',
  DASHBOARD: '/dashboard',

  // Core Management
  STUDENTS: '/students',
  STUDENT_DETAIL: (id: string) => `/students?student=${id}`,
  ADMISSIONS: '/admissions',
  ATTENDANCE: '/attendance',
  TIMETABLE: '/timetable',
  TEACHERS: '/teachers',
  STAFF: '/teachers',

  // Academics
  ACADEMICS: '/academics',
  TEACHING: '/teaching',
  HOMEWORK: '/homework',
  EXAMINATIONS: '/examinations',

  // Finance & Welfare
  FINANCE: '/fees',
  FEES: '/fees',
  SCHOLARSHIPS: '/scholarships',

  // Operations & Admin
  STATISTICS: '/statistics',
  NOTICES: '/notices',
  COMPLAINTS: '/complaints',
  SURVEYS: '/surveys',
  REPORTS: '/reports',
  LICENSE: '/license',
  SETTINGS: '/settings',
  SECURITY: '/security',
  AUDIT: '/audit',
  SHORTCUTS: '/shortcuts',

  // Subsystems & Extensions
  HR_MANAGE: '/hr-manage',
  E_CLASS: '/e-class',
  E_LIBRARY: '/elibrary',
  TRANSPORT: '/transport',
  HOSTEL: '/hostel',
  DESIGN_LAB: '/design-lab',
  LMS: '/lms',
  LEARNING: '/learning',
  RESOURCES: '/resources',
  PORTAL: '/portal',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
