/**
 * @vidyafloww/types — Common Type Definitions
 *
 * Shared primitive types and utility interfaces used across all domain modules.
 *
 * TODO: Expand as domain models are defined.
 */

/** ISO 8601 date-time string (e.g., "2024-01-15T10:30:00Z") */
export type ISODateTime = string;

/** UUID v4 string */
export type UUID = string;

/** Sortable pagination direction */
export type SortDirection = 'asc' | 'desc';

/** Generic select option for dropdowns */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

/** API pagination params */
export interface PaginationParams {
  page?: number;
  page_size?: number;
  ordering?: string;
  search?: string;
}

/** Generic entity identifier */
export interface Identifiable {
  id: UUID;
}

/** Entity with audit timestamps */
export interface Auditable extends Identifiable {
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

/** Generic key-value metadata */
export type Metadata = Record<string, string | number | boolean | null>;

/** Theme modes */
export type ThemeMode = 'light' | 'dark' | 'system';

/** Application environment */
export type AppEnvironment = 'development' | 'staging' | 'production';
