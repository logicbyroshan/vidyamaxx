/**
 * @vidyafloww/types — Organization & Campus Domain Types
 */

import type { Auditable, UUID } from '../common';

export interface Organization extends Auditable {
  name: string;
  code: string;
  logo_url?: string;
  tagline?: string;
  website?: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  timezone: string;
  currency: string;
  is_active: boolean;
}

export interface Campus extends Auditable {
  organization_id: UUID;
  name: string;
  code: string;
  address: string;
  city: string;
  is_main_campus: boolean;
  contact_phone: string;
}

export interface AcademicSession extends Auditable {
  organization_id: UUID;
  name: string;
  code: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}
