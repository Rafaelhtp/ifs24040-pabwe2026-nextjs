import { DELCOM_BASEURL } from "@/lib/config";
import type { ApiResponse } from "@/types";

export const ACCESS_TOKEN_KEY = "delcom_access_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const fromLocal =
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem("token");
  if (fromLocal) {
    return fromLocal;
  }

  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (const c of cookies) {
    const [key, val] = c.trim().split("=");
    if ((key === ACCESS_TOKEN_KEY || key === "token") && val) {
      return decodeURIComponent(val);
    }
  }

  return null;
}

export function putAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    localStorage.setItem("token", token);
    document.cookie = `${ACCESS_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
    document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
  }
}

export function removeAccessToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem("token");
    document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; max-age=0`;
    document.cookie = `token=; path=/; max-age=0`;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: BodyInit | object | null | unknown;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, headers: customHeaders, body, ...restOptions } = options;

  let urlString = endpoint.startsWith("http")
    ? endpoint
    : `${DELCOM_BASEURL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  if (params) {
    const url = new URL(urlString);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    urlString = url.toString();
  }

  const headers = new Headers(customHeaders);

  const token = getAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let finalBody: BodyInit | undefined = undefined;
  if (body !== undefined && body !== null) {
    if (typeof body === "string" || body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob) {
      finalBody = body;
    } else {
      headers.set("Content-Type", "application/json");
      finalBody = JSON.stringify(body);
    }
  }

  const response = await fetch(urlString, {
    ...restOptions,
    headers,
    body: finalBody,
  });

  let json: ApiResponse<T>;
  try {
    json = (await response.json()) as ApiResponse<T>;
  } catch {
    json = {
      status: response.ok ? "success" : "error",
      message: response.statusText || "Terjadi kesalahan saat memproses data",
    } as ApiResponse<T>;
  }

  return json;
}
