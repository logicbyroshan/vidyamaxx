/**
 * @vidyafloww/api
 *
 * Typed HTTP client for the VidyaFloww backend API.
 */

export {
  apiClient,
  clearSessionTokens,
  createApiClient,
  extractApiList,
  getAuthToken,
  getTenantHeaders,
  registerAuthFailureHandler,
  setAuthToken,
  setTenantHeaders,
} from './src/client';
export { ApiError } from './src/errors';
export type { ApiResponse, PaginatedResponse, ApiClientConfig, ApiErrorResponse } from './src/types';
