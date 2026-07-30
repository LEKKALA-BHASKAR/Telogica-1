import axios, { AxiosError } from "axios";
import type { ApiEnvelope } from "./types";

/**
 * Same-origin by default: next.config.mjs rewrites /api/* to the Express
 * server, so the httpOnly auth cookie rides along without CORS configuration.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiFailure {
  message: string;
  status?: number;
  fieldErrors: FieldError[];
}

/** Normalises anything thrown by axios into a message the UI can render. */
export function toApiError(error: unknown): ApiFailure {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<{ message?: string; errors?: FieldError[] }>;
    if (err.response) {
      return {
        message: err.response.data?.message ?? "That request failed. Please try again.",
        status: err.response.status,
        fieldErrors: Array.isArray(err.response.data?.errors) ? err.response.data.errors : [],
      };
    }
    return {
      message:
        "Can't reach the Telogica API. Start it with `npm run dev:api` and make sure MongoDB is running.",
      fieldErrors: [],
    };
  }
  return {
    message: error instanceof Error ? error.message : "Something went wrong",
    fieldErrors: [],
  };
}

/** Unwraps `{ success, data }` so callers work with the payload directly. */
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await api.get<ApiEnvelope<T>>(url, { params });
  return data.data;
}

export async function apiGetWithMeta<T>(url: string, params?: Record<string, unknown>) {
  const { data } = await api.get<ApiEnvelope<T>>(url, { params });
  return { data: data.data, meta: data.meta };
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await api.post<ApiEnvelope<T>>(url, body);
  return data.data;
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await api.patch<ApiEnvelope<T>>(url, body);
  return data.data;
}

export async function apiDelete<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await api.delete<ApiEnvelope<T>>(url, { params });
  return data.data;
}
