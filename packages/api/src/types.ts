/**
 * @vidyafloww/api — Shared Types
 *
 * Type definitions for API request/response contracts.
 *
 * TODO: Sync with backend DRF serializer output shapes.
 */

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}
