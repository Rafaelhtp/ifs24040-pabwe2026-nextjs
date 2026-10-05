import { ActionType } from "@/types/action";
import {
  getPosts,
  getPostDetail,
  postPost,
  putPost,
  postPostCover,
  deletePost,
  postPostLike,
  postPostComment,
  deletePostComment,
  deleteAllPosts,
  type GetPostsParams,
  type AddPostPayload,
  type UpdatePostPayload,
  type LikePostPayload,
  type AddCommentPayload,
} from "../api/postApi";
import type { Post } from "@/types";
import type { AppDispatch } from "@/store";

// Action Creators
export function getPostsRequestAction() {
  return { type: ActionType.GET_POSTS_REQUEST } as const;
}

export function getPostsSuccessAction(posts: Post[]) {
  return { type: ActionType.GET_POSTS_SUCCESS, payload: posts } as const;
}

export function getPostsFailAction(error: string) {
  return { type: ActionType.GET_POSTS_FAIL, payload: error } as const;
}

export function getPostDetailRequestAction() {
  return { type: ActionType.GET_POST_DETAIL_REQUEST } as const;
}

export function getPostDetailSuccessAction(post: Post) {
  return { type: ActionType.GET_POST_DETAIL_SUCCESS, payload: post } as const;
}

export function getPostDetailFailAction(error: string) {
  return { type: ActionType.GET_POST_DETAIL_FAIL, payload: error } as const;
}

export function addPostRequestAction() {
  return { type: ActionType.ADD_POST_REQUEST } as const;
}

export function addPostSuccessAction() {
  return { type: ActionType.ADD_POST_SUCCESS } as const;
}

export function addPostFailAction(error: string) {
  return { type: ActionType.ADD_POST_FAIL, payload: error } as const;
}

export function changePostRequestAction() {
  return { type: ActionType.CHANGE_POST_REQUEST } as const;
}

export function changePostSuccessAction() {
  return { type: ActionType.CHANGE_POST_SUCCESS } as const;
}

export function changePostFailAction(error: string) {
  return { type: ActionType.CHANGE_POST_FAIL, payload: error } as const;
}

export function changeCoverPostRequestAction() {
  return { type: ActionType.CHANGE_COVER_POST_REQUEST } as const;
}

export function changeCoverPostSuccessAction() {
  return { type: ActionType.CHANGE_COVER_POST_SUCCESS } as const;
}

export function changeCoverPostFailAction(error: string) {
  return { type: ActionType.CHANGE_COVER_POST_FAIL, payload: error } as const;
}

export function deletePostRequestAction() {
  return { type: ActionType.DELETE_POST_REQUEST } as const;
}

export function deletePostSuccessAction() {
  return { type: ActionType.DELETE_POST_SUCCESS } as const;
}

export function deletePostFailAction(error: string) {
  return { type: ActionType.DELETE_POST_FAIL, payload: error } as const;
}

export function likePostRequestAction() {
  return { type: ActionType.LIKE_POST_REQUEST } as const;
}

export function likePostSuccessAction() {
  return { type: ActionType.LIKE_POST_SUCCESS } as const;
}

export function likePostFailAction(error: string) {
  return { type: ActionType.LIKE_POST_FAIL, payload: error } as const;
}

export function addCommentRequestAction() {
  return { type: ActionType.ADD_COMMENT_REQUEST } as const;
}

export function addCommentSuccessAction() {
  return { type: ActionType.ADD_COMMENT_SUCCESS } as const;
}

export function addCommentFailAction(error: string) {
  return { type: ActionType.ADD_COMMENT_FAIL, payload: error } as const;
}

export function deleteCommentRequestAction() {
  return { type: ActionType.DELETE_COMMENT_REQUEST } as const;
}

export function deleteCommentSuccessAction() {
  return { type: ActionType.DELETE_COMMENT_SUCCESS } as const;
}

export function deleteCommentFailAction(error: string) {
  return { type: ActionType.DELETE_COMMENT_FAIL, payload: error } as const;
}

export function deleteAllPostsRequestAction() {
  return { type: ActionType.DELETE_ALL_POSTS_REQUEST } as const;
}

export function deleteAllPostsSuccessAction() {
  return { type: ActionType.DELETE_ALL_POSTS_SUCCESS } as const;
}

export function deleteAllPostsFailAction(error: string) {
  return { type: ActionType.DELETE_ALL_POSTS_FAIL, payload: error } as const;
}

export function resetPostStatusAction() {
  return { type: ActionType.RESET_POST_STATUS } as const;
}

export type PostsAction =
  | ReturnType<typeof getPostsRequestAction>
  | ReturnType<typeof getPostsSuccessAction>
  | ReturnType<typeof getPostsFailAction>
  | ReturnType<typeof getPostDetailRequestAction>
  | ReturnType<typeof getPostDetailSuccessAction>
  | ReturnType<typeof getPostDetailFailAction>
  | ReturnType<typeof addPostRequestAction>
  | ReturnType<typeof addPostSuccessAction>
  | ReturnType<typeof addPostFailAction>
  | ReturnType<typeof changePostRequestAction>
  | ReturnType<typeof changePostSuccessAction>
  | ReturnType<typeof changePostFailAction>
  | ReturnType<typeof changeCoverPostRequestAction>
  | ReturnType<typeof changeCoverPostSuccessAction>
  | ReturnType<typeof changeCoverPostFailAction>
  | ReturnType<typeof deletePostRequestAction>
  | ReturnType<typeof deletePostSuccessAction>
  | ReturnType<typeof deletePostFailAction>
  | ReturnType<typeof likePostRequestAction>
  | ReturnType<typeof likePostSuccessAction>
  | ReturnType<typeof likePostFailAction>
  | ReturnType<typeof addCommentRequestAction>
  | ReturnType<typeof addCommentSuccessAction>
  | ReturnType<typeof addCommentFailAction>
  | ReturnType<typeof deleteCommentRequestAction>
  | ReturnType<typeof deleteCommentSuccessAction>
  | ReturnType<typeof deleteCommentFailAction>
  | ReturnType<typeof deleteAllPostsRequestAction>
  | ReturnType<typeof deleteAllPostsSuccessAction>
  | ReturnType<typeof deleteAllPostsFailAction>
  | ReturnType<typeof resetPostStatusAction>;

// Thunks
export function asyncSetPosts(params?: GetPostsParams) {
  return async (dispatch: AppDispatch) => {
    dispatch(getPostsRequestAction());
    try {
      const response = await getPosts(params);
      if (response.status === "success" && response.data?.posts) {
        dispatch(getPostsSuccessAction(response.data.posts));
        return { success: true, posts: response.data.posts };
      }
      const errorMsg = response.message || "Gagal mengambil postingan";
      dispatch(getPostsFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(getPostsFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncSetPostDetail(id: string | number) {
  return async (dispatch: AppDispatch) => {
    dispatch(getPostDetailRequestAction());
    try {
      const response = await getPostDetail(id);
      if (response.status === "success" && response.data?.post) {
        dispatch(getPostDetailSuccessAction(response.data.post));
        return { success: true, post: response.data.post };
      }
      const errorMsg = response.message || "Gagal mengambil detail postingan";
      dispatch(getPostDetailFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(getPostDetailFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncAddPost(payload: AddPostPayload) {
  return async (dispatch: AppDispatch) => {
    dispatch(addPostRequestAction());
    try {
      const response = await postPost(payload);
      if (response.status === "success") {
        dispatch(addPostSuccessAction());
        return { success: true, message: response.message, post: response.data?.post };
      }
      const errorMsg = response.message || "Gagal menambahkan postingan";
      dispatch(addPostFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(addPostFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncChangePost(id: string | number, payload: UpdatePostPayload) {
  return async (dispatch: AppDispatch) => {
    dispatch(changePostRequestAction());
    try {
      const response = await putPost(id, payload);
      if (response.status === "success") {
        dispatch(changePostSuccessAction());
        return { success: true, message: response.message };
      }
      const errorMsg = response.message || "Gagal mengubah postingan";
      dispatch(changePostFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(changePostFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncChangeCoverPost(id: string | number, coverFile: File) {
  return async (dispatch: AppDispatch) => {
    dispatch(changeCoverPostRequestAction());
    try {
      const response = await postPostCover(id, coverFile);
      if (response.status === "success") {
        dispatch(changeCoverPostSuccessAction());
        return { success: true, message: response.message };
      }
      const errorMsg = response.message || "Gagal mengubah sampul postingan";
      dispatch(changeCoverPostFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(changeCoverPostFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncDeletePost(id: string | number) {
  return async (dispatch: AppDispatch) => {
    dispatch(deletePostRequestAction());
    try {
      const response = await deletePost(id);
      if (response.status === "success") {
        dispatch(deletePostSuccessAction());
        return { success: true, message: response.message };
      }
      const errorMsg = response.message || "Gagal menghapus postingan";
      dispatch(deletePostFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(deletePostFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncLikePost(id: string | number, payload: LikePostPayload) {
  return async (dispatch: AppDispatch) => {
    dispatch(likePostRequestAction());
    try {
      const response = await postPostLike(id, payload);
      if (response.status === "success") {
        dispatch(likePostSuccessAction());
        return { success: true, message: response.message };
      }
      const errorMsg = response.message || "Gagal menyukai postingan";
      dispatch(likePostFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(likePostFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncAddComment(id: string | number, payload: AddCommentPayload) {
  return async (dispatch: AppDispatch) => {
    dispatch(addCommentRequestAction());
    try {
      const response = await postPostComment(id, payload);
      if (response.status === "success") {
        dispatch(addCommentSuccessAction());
        return { success: true, message: response.message };
      }
      const errorMsg = response.message || "Gagal menambahkan komentar";
      dispatch(addCommentFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(addCommentFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncDeleteComment(id: string | number) {
  return async (dispatch: AppDispatch) => {
    dispatch(deleteCommentRequestAction());
    try {
      const response = await deletePostComment(id);
      if (response.status === "success") {
        dispatch(deleteCommentSuccessAction());
        return { success: true, message: response.message };
      }
      const errorMsg = response.message || "Gagal menghapus komentar";
      dispatch(deleteCommentFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(deleteCommentFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncDeleteAllPosts() {
  return async (dispatch: AppDispatch) => {
    dispatch(deleteAllPostsRequestAction());
    try {
      const response = await deleteAllPosts();
      if (response.status === "success") {
        dispatch(deleteAllPostsSuccessAction());
        return { success: true, message: response.message };
      }
      const errorMsg = response.message || "Gagal menghapus semua postingan";
      dispatch(deleteAllPostsFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(deleteAllPostsFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}
