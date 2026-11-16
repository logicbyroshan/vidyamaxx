/**
 * @vidyafloww/types — User & Authentication Domain Types
 */

import type { Auditable, ISODateTime, UUID } from '../common';

export type UserRole =
  | 'super_admin'
  | 'org_admin'
  | 'principal'
  | 'academic_coordinator'
  | 'teacher'
  | 'accountant'
  | 'librarian'
  | 'transport_manager'
  | 'student'
  | 'parent'
  | 'staff';

export interface User extends Auditable {
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  organization_id: UUID;
  campus_id?: UUID;
  last_login?: ISODateTime;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  expires_in: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserPermission {
  id: string;
  code: string;
  name: string;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'approve';
}
