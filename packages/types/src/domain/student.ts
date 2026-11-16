/**
 * @vidyafloww/types — Student 360° Domain Types
 */

import type { Auditable, UUID } from '../common';

export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended' | 'withdrawn' | 'transferred';
export type Gender = 'male' | 'female' | 'other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Guardian extends Auditable {
  first_name: string;
  last_name: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  phone: string;
  email?: string;
  occupation?: string;
  annual_income?: number;
  is_emergency_contact: boolean;
}

export interface Student extends Auditable {
  admission_number: string;
  roll_number?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  gender: Gender;
  blood_group?: BloodGroup;
  avatar_url?: string;
  status: StudentStatus;
  organization_id: UUID;
  campus_id: UUID;
  class_id: UUID;
  class_name?: string;
  section_id: UUID;
  section_name?: string;
  academic_session_id: UUID;
  guardians?: Guardian[];
  emergency_contact?: string;
  address?: string;
  city?: string;
  attendance_percentage?: number;
  fee_dues?: number;
}
