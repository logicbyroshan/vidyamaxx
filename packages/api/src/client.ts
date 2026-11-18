/**
 * @vidyafloww/api — HTTP Client
 *
 * Pre-configured Axios instance with JWT Bearer token injection,
 * active school/branch tenant headers, automatic 401 refresh rotation,
 * and normalized ApiError throwing.
 */

import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './errors';
import type { ApiClientConfig, ApiErrorResponse } from './types';

let inMemoryAccessToken: string | null = null;
let activeSchoolId: string | null = null;
let activeBranchId: string | null = null;

export function setAuthToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export function getAuthToken(): string | null {
  return inMemoryAccessToken;
}

export function setTenantHeaders(schoolId: string | null, branchId: string | null = null): void {
  activeSchoolId = schoolId;
  activeBranchId = branchId;
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

      if (status === 401 && original && !original._retry && !original.url?.includes('/auth/token/refresh/')) {
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

      const data = error.response?.data;
      const message = data?.message || data?.detail || error.message || 'An API error occurred.';
      return Promise.reject(new ApiError(message, status, data));
    }
  );

  return instance;
}

/// <reference types="vite/client" />

export const apiClient = createApiClient({
  baseURL: (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL ?? 'http://localhost:8000/api/v1',
});
