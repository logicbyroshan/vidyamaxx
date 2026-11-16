/**
 * @vidyafloww/constants — User Roles
 *
 * Role constants for permission control throughout the application.
 *
 * TODO: Sync with backend permissions system when implemented.
 */

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORG_ADMIN: 'org_admin',
  CAMPUS_ADMIN: 'campus_admin',
  PRINCIPAL: 'principal',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  ACCOUNTANT: 'accountant',
  LIBRARIAN: 'librarian',
  STAFF: 'staff',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  [ROLES.SUPER_ADMIN]: 'Super Administrator',
  [ROLES.ORG_ADMIN]: 'Organization Administrator',
  [ROLES.CAMPUS_ADMIN]: 'Campus Administrator',
  [ROLES.PRINCIPAL]: 'Principal',
  [ROLES.TEACHER]: 'Teacher',
  [ROLES.STUDENT]: 'Student',
  [ROLES.PARENT]: 'Parent / Guardian',
  [ROLES.ACCOUNTANT]: 'Accountant',
  [ROLES.LIBRARIAN]: 'Librarian',
  [ROLES.STAFF]: 'Staff Member',
};
