import { apiRequest } from "@/helpers/apiHelper";
import type {
  ApiResponse,
  PostDetailResponseData,
  PostsResponseData,
} from "@/types";

export interface GetPostsParams {
  is_me?: number | string;
}

export interface AddPostPayload {
  description: string;
}

export interface UpdatePostPayload {
  description: string;
}

export interface LikePostPayload {
  like: number; // 1 for like, 0 for unlike
}

export interface AddCommentPayload {
  comment: string;
}

export async function getPosts(
  params?: GetPostsParams
): Promise<ApiResponse<PostsResponseData>> {
  return apiRequest<PostsResponseData>("/posts", {
    method: "GET",
    params: params as Record<string, string | number | boolean>,
  });
}

export async function getPostDetail(
  id: string | number
): Promise<ApiResponse<PostDetailResponseData>> {
  return apiRequest<PostDetailResponseData>(`/posts/${id}`, {
    method: "GET",
  });
}

export async function postPost(
  payload: AddPostPayload
): Promise<ApiResponse<PostDetailResponseData>> {
  return apiRequest<PostDetailResponseData>("/posts", {
    method: "POST",
    body: payload,
  });
}

export async function putPost(
  id: string | number,
  payload: UpdatePostPayload
): Promise<ApiResponse<PostDetailResponseData>> {
  return apiRequest<PostDetailResponseData>(`/posts/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function postPostCover(
  id: string | number,
  coverFile: File
): Promise<ApiResponse<PostDetailResponseData>> {
  const formData = new FormData();
  formData.append("cover", coverFile);

  return apiRequest<PostDetailResponseData>(`/posts/${id}/cover`, {
    method: "POST",
    body: formData,
  });
}

export async function deletePost(
  id: string | number
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/posts/${id}`, {
    method: "DELETE",
  });
}

export async function postPostLike(
  id: string | number,
  payload: LikePostPayload
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/posts/${id}/likes`, {
    method: "POST",
    body: payload,
  });
}

export async function postPostComment(
  id: string | number,
  payload: AddCommentPayload
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/posts/${id}/comments`, {
    method: "POST",
    body: payload,
  });
}

export async function deletePostComment(
  id: string | number
): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>(`/posts/${id}/comments`, {
    method: "DELETE",
  });
}

export async function deleteAllPosts(): Promise<ApiResponse<{ message: string }>> {
  return apiRequest<{ message: string }>("/posts", {
    method: "DELETE",
  });
}
