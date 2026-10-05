export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  photo: string;
  created_at: string;
  updated_at: string;
}

export interface PostAuthor {
  name: string;
  photo: string;
}

export interface PostComment {
  id: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  cover: string | null;
  description: string;
  created_at: string;
  updated_at: string;
  author: PostAuthor;
  likes: number[];
  comments: PostComment[];
  my_comment?: PostComment | null;
}

export interface ApiResponse<T = unknown> {
  status: "success" | "fail" | "error";
  message: string;
  data?: T;
}

export interface AuthLoginResponseData {
  user: User;
  token: string;
}

export interface ProfileResponseData {
  user: User;
}

export interface UsersResponseData {
  users: User[];
}

export interface PostsResponseData {
  posts: Post[];
}

export interface PostDetailResponseData {
  post: Post;
}
