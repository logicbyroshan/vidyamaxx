/**
 * @vidyafloww/types — Academic & Curriculum Domain Types
 */

import type { Auditable, UUID } from '../common';

export interface ClassGrade extends Auditable {
  name: string;
  code: string;
  numeric_grade: number;
  order: number;
  campus_id: UUID;
}

export interface Section extends Auditable {
  name: string;
  code: string;
  class_id: UUID;
  capacity: number;
  room_number?: string;
  class_teacher_id?: UUID;
}

export interface Subject extends Auditable {
  name: string;
  code: string;
  department?: string;
  is_optional: boolean;
  credit_hours?: number;
}

export interface PeriodSlot {
  id: string;
  order: number;
  name: string;
  start_time: string;
  end_time: string;
  is_break: boolean;
  duration_minutes: number;
}

export interface TimetableEntry {
  id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  period_id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id: string;
  room?: string;
}
