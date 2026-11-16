/**
 * @vidyafloww/constants — Status Codes
 *
 * Domain status constants for students, admissions, fees, and other entities.
 *
 * TODO: Sync with backend model choices when models are implemented.
 */

export const STUDENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  GRADUATED: 'graduated',
  SUSPENDED: 'suspended',
  EXPELLED: 'expelled',
  TRANSFERRED: 'transferred',
} as const;

export type StudentStatus = (typeof STUDENT_STATUS)[keyof typeof STUDENT_STATUS];

export const ADMISSION_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WAITLISTED: 'waitlisted',
} as const;

export type AdmissionStatus = (typeof ADMISSION_STATUS)[keyof typeof ADMISSION_STATUS];

export const FEE_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  PARTIAL: 'partial',
  WAIVED: 'waived',
} as const;

export type FeeStatus = (typeof FEE_STATUS)[keyof typeof FEE_STATUS];

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
  HOLIDAY: 'holiday',
} as const;

export type AttendanceStatus = (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];
