/**
 * @vidyafloww/api — HTTP Client
 *
 * Pre-configured Axios instance with auth token injection,
 * response normalization, and error handling interceptors.
 *
 * TODO: Implement when backend is ready.
 */

import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { ApiClientConfig } from './types';

export function createApiClient(config: ApiClientConfig): AxiosInstance {
  // TODO: Implement API client factory with interceptors
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout ?? 30_000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // TODO: Add request interceptor for JWT token injection
  // instance.interceptors.request.use(...)

  // TODO: Add response interceptor for error normalization
  // instance.interceptors.response.use(...)

  return instance;
}

/// <reference types="vite/client" />

export const apiClient = createApiClient({
  baseURL: (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL ?? 'http://localhost:8000/api/v1',
});

