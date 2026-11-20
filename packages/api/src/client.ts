/**
 * @vidyafloww/api — HTTP Client
 *
 * Pre-configured Axios instance with:
 * - Automatic `/api/v1` path deduplication (supports both `/students/` and `/api/v1/students/`)
 * - JWT Bearer token injection + active school/branch tenant headers
 * - Automatic 401 refresh rotation using HttpOnly refresh cookie
 * - Normalized ApiError throwing matching backend `custom_exception_handler`
 */

import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './errors';
import type { ApiClientConfig, ApiErrorResponse } from './types';

const SCHOOL_STORAGE_KEY = 'vf_active_school_id';
const BRANCH_STORAGE_KEY = 'vf_active_branch_id';

let inMemoryAccessToken: string | null = null;
let activeSchoolId: string | null =
  typeof window !== 'undefined' ? window.sessionStorage.getItem(SCHOOL_STORAGE_KEY) : null;
let activeBranchId: string | null =
  typeof window !== 'undefined' ? window.sessionStorage.getItem(BRANCH_STORAGE_KEY) : null;
let authFailureHandler: (() => void) | null = null;

export function setAuthToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export function getAuthToken(): string | null {
  return inMemoryAccessToken;
}

export function setTenantHeaders(schoolId: string | null, branchId: string | null = null): void {
  activeSchoolId = schoolId;
  activeBranchId = branchId;
  if (typeof window !== 'undefined') {
    if (schoolId) window.sessionStorage.setItem(SCHOOL_STORAGE_KEY, schoolId);
    else window.sessionStorage.removeItem(SCHOOL_STORAGE_KEY);
    if (branchId) window.sessionStorage.setItem(BRANCH_STORAGE_KEY, branchId);
    else window.sessionStorage.removeItem(BRANCH_STORAGE_KEY);
  }
}

export function getTenantHeaders(): { schoolId: string | null; branchId: string | null } {
  return { schoolId: activeSchoolId, branchId: activeBranchId };
}

export function clearSessionTokens(): void {
  inMemoryAccessToken = null;
  setTenantHeaders(null, null);
}

export function registerAuthFailureHandler(handler: (() => void) | null): void {
  authFailureHandler = handler;
}

/**
 * Unwraps Django REST responses returned in `{ success, data, results }` envelope or bare array.
 */
export function extractApiList<T = Record<string, unknown>>(response: { data?: unknown } | null | undefined): T[] {
  const payload = response?.data as { results?: unknown; data?: unknown } | unknown[] | undefined;
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.results)) return payload.results as T[];
    if (Array.isArray(payload.data)) return payload.data as T[];
  }
  return [];
}

function normalizeUrl(baseURL: string | undefined, url: string | undefined): string | undefined {
  if (!url || !baseURL) return url;
  if (/^https?:\/\//i.test(url)) return url;
  const cleanBase = baseURL.replace(/\/+$/, '');
  if (cleanBase.endsWith('/api/v1') && url.startsWith('/api/v1/')) {
    return url.slice('/api/v1'.length);
  }
  if (cleanBase.endsWith('/api/v1') && url.startsWith('api/v1/')) {
    return url.slice('api/v1'.length);
  }
  return url;
}

export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout ?? 30_000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...config.headers,
    },
  });

  instance.interceptors.request.use((req: InternalAxiosRequestConfig) => {
    req.url = normalizeUrl(req.baseURL ?? config.baseURL, req.url);
    if (inMemoryAccessToken && !req.headers.Authorization) {
      req.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    if (activeSchoolId && !req.headers['X-School-ID']) {
      req.headers['X-School-ID'] = activeSchoolId;
    }
    if (activeBranchId && !req.headers['X-Branch-ID']) {
      req.headers['X-Branch-ID'] = activeBranchId;
    }
    return req;
  });

  let refreshPromise: Promise<string | null> | null = null;

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
      const status = error.response?.status ?? 0;

      const isAuthEndpoint =
        original?.url?.includes('/auth/token/refresh/') ||
        original?.url?.includes('/auth/login/') ||
        original?.url?.includes('/auth/register/');

      if (status === 401 && original && !original._retry && !isAuthEndpoint) {
        original._retry = true;
        try {
          if (!refreshPromise) {
            refreshPromise = instance
              .post<{ access_token: string }>('/auth/token/refresh/')
              .then((res) => {
                inMemoryAccessToken = res.data.access_token;
                return inMemoryAccessToken;
              })
              .catch(() => {
                inMemoryAccessToken = null;
                authFailureHandler?.();
                return null;
              })
              .finally(() => {
                refreshPromise = null;
              });
          }
          const refreshedToken = await refreshPromise;
          if (refreshedToken) {
            original.headers.Authorization = `Bearer ${refreshedToken}`;
            return instance(original);
          }
        } catch {
          inMemoryAccessToken = null;
        }
      }

      const data = error.response?.data as (ApiErrorResponse & { error?: ApiErrorResponse }) | undefined;
      const nested = data?.error;
      const message =
        data?.message || nested?.message || data?.detail || error.message || 'An API error occurred.';
      return Promise.reject(
        new ApiError(message, status, {
          code: data?.code ?? nested?.code,
          message,
          errors: data?.errors ?? nested?.errors,
          detail: data?.detail,
        })
      );
    }
  );

  return instance;
}

/// <reference types="vite/client" />

export const apiClient = createApiClient({
  baseURL:
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL ??
    'http://localhost:8000/api/v1',
});
