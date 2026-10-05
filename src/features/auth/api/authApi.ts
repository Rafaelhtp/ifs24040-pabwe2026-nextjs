import { apiRequest } from "@/helpers/apiHelper";
import type { ApiResponse, AuthLoginResponseData } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export async function postLogin(payload: LoginPayload): Promise<ApiResponse<AuthLoginResponseData>> {
  return apiRequest<AuthLoginResponseData>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function postRegister(payload: RegisterPayload): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>("/auth/register", {
    method: "POST",
    body: payload,
  });
}
