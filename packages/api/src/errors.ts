/**
 * @vidyafloww/api — ApiError Class
 *
 * Normalized error class for all API failures.
 *
 * TODO: Implement full error handling once backend error contract is finalized.
 */

import type { ApiErrorResponse } from './types';

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly errors?: Record<string, string[]>;

  constructor(message: string, status: number, response?: ApiErrorResponse) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = response?.code;
    this.errors = response?.errors;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }
}
