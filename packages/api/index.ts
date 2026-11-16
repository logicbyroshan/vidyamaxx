/**
 * @vidyafloww/api
 *
 * Typed HTTP client for the VidyaFloww backend API.
 *
 * Provides:
 * - Pre-configured Axios instance with interceptors
 * - Type-safe API endpoint functions
 * - Request/response transformation utilities
 * - Error normalization
 *
 * @example
 * import { apiClient } from '@vidyafloww/api';
 *
 * const students = await apiClient.get('/students/');
 */

export { apiClient, createApiClient } from './src/client';
export { ApiError } from './src/errors';
export type { ApiResponse, PaginatedResponse, ApiClientConfig } from './src/types';

// TODO: Export domain-specific API modules as they are built
// export * from './src/modules/students';
// export * from './src/modules/admissions';
// export * from './src/modules/auth';
