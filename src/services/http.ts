import { clearTokens, getAccess, getRefresh, setTokens } from "./session";

export type ApiError = { code: string; details: { field: string; code: string }[]; request_id: string };
export type ApiSuccess<T> = { ok: true; status: number; data: T; meta: Record<string, unknown> };
export type ApiFailure = { ok: false; status: number; error: ApiError };
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
let refreshing: Promise<boolean> | null = null;

export async function api<T>(path: string, options: { method?: string; body?: unknown } = {}, retry = true): Promise<ApiResult<T>> {
  const headers: Record<string, string> = { Accept: "application/json", "Accept-Language": "en" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const token = getAccess();
  if (token) headers.Authorization = `Bearer ${token}`;
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    return { ok: false, status: 0, error: { code: "NETWORK", details: [], request_id: "" } };
  }
  if (response.status === 204) return { ok: true, status: 204, data: null as T, meta: {} };
  const payload = await response.json().catch(() => null);
  if (response.status === 401 && retry && !path.startsWith("/api/v1/auth/")) {
    const refreshed = await refreshTokens();
    if (refreshed) return api(path, options, false);
    clearTokens();
  }
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: payload?.error ?? { code: "INTERNAL_ERROR", details: [], request_id: "" },
    };
  }
  return { ok: true, status: response.status, data: payload.data as T, meta: payload.meta ?? {} };
}

async function refreshTokens() {
  if (!refreshing) {
    refreshing = (async () => {
      const current = getRefresh();
      if (!current) return false;
      const result = await api<{ access_token: string; refresh_token: string }>(
        "/api/v1/auth/refresh",
        { method: "POST", body: { refresh_token: current } },
        false,
      );
      if (!result.ok) return false;
      setTokens(result.data.access_token, result.data.refresh_token);
      return true;
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}
