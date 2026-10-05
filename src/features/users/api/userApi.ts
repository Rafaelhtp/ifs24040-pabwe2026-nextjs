import { apiRequest } from "@/helpers/apiHelper";
import type { ApiResponse, ProfileResponseData, UsersResponseData } from "@/types";

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export interface UpdatePasswordPayload {
  password: string;
  new_password: string;
}

export async function getUsers(): Promise<ApiResponse<UsersResponseData>> {
  return apiRequest<UsersResponseData>("/users", {
    method: "GET",
  });
}

export async function getUserProfile(): Promise<ApiResponse<ProfileResponseData>> {
  return apiRequest<ProfileResponseData>("/users/me", {
    method: "GET",
  });
}

export async function putUserProfile(
  payload: UpdateProfilePayload
): Promise<ApiResponse<ProfileResponseData>> {
  return apiRequest<ProfileResponseData>("/users/me", {
    method: "PUT",
    body: payload,
  });
}

export async function postUserPhoto(
  photoFile: File
): Promise<ApiResponse<ProfileResponseData>> {
  const formData = new FormData();
  formData.append("photo", photoFile);

  return apiRequest<ProfileResponseData>("/users/me/photo", {
    method: "POST",
    body: formData,
  });
}

export async function putUserPassword(
  payload: UpdatePasswordPayload
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>("/users/password", {
    method: "PUT",
    body: payload,
  });
}
