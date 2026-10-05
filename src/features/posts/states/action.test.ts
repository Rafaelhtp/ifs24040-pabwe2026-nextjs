import { describe, it, expect, vi, beforeEach } from "vitest";
import * as postApi from "../api/postApi";
import {
  getPostsRequestAction,
  getPostsSuccessAction,
  getPostsFailAction,
  getPostDetailRequestAction,
  getPostDetailSuccessAction,
  getPostDetailFailAction,
  addPostRequestAction,
  addPostSuccessAction,
  addPostFailAction,
  changePostRequestAction,
  changePostSuccessAction,
  changePostFailAction,
  changeCoverPostRequestAction,
  changeCoverPostSuccessAction,
  changeCoverPostFailAction,
  deletePostRequestAction,
  deletePostSuccessAction,
  deletePostFailAction,
  likePostRequestAction,
  likePostSuccessAction,
  likePostFailAction,
  addCommentRequestAction,
  addCommentSuccessAction,
  addCommentFailAction,
  deleteCommentRequestAction,
  deleteCommentSuccessAction,
  deleteCommentFailAction,
  deleteAllPostsRequestAction,
  deleteAllPostsSuccessAction,
  deleteAllPostsFailAction,
  resetPostStatusAction,
  asyncSetPosts,
  asyncSetPostDetail,
  asyncAddPost,
  asyncChangePost,
  asyncChangeCoverPost,
  asyncDeletePost,
  asyncLikePost,
  asyncAddComment,
  asyncDeleteComment,
  asyncDeleteAllPosts,
} from "./action";
import { ActionType } from "@/types/action";

describe("posts actions and thunks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("action creators", () => {
    it("should return expected action shapes", () => {
      expect(getPostsRequestAction()).toEqual({ type: ActionType.GET_POSTS_REQUEST });
      expect(getPostsSuccessAction([])).toEqual({ type: ActionType.GET_POSTS_SUCCESS, payload: [] });
      expect(getPostsFailAction("err")).toEqual({ type: ActionType.GET_POSTS_FAIL, payload: "err" });

      expect(getPostDetailRequestAction()).toEqual({ type: ActionType.GET_POST_DETAIL_REQUEST });
      expect(getPostDetailSuccessAction({} as any)).toEqual({ type: ActionType.GET_POST_DETAIL_SUCCESS, payload: {} });
      expect(getPostDetailFailAction("err")).toEqual({ type: ActionType.GET_POST_DETAIL_FAIL, payload: "err" });

      expect(addPostRequestAction()).toEqual({ type: ActionType.ADD_POST_REQUEST });
      expect(addPostSuccessAction()).toEqual({ type: ActionType.ADD_POST_SUCCESS });
      expect(addPostFailAction("err")).toEqual({ type: ActionType.ADD_POST_FAIL, payload: "err" });

      expect(changePostRequestAction()).toEqual({ type: ActionType.CHANGE_POST_REQUEST });
      expect(changePostSuccessAction()).toEqual({ type: ActionType.CHANGE_POST_SUCCESS });
      expect(changePostFailAction("err")).toEqual({ type: ActionType.CHANGE_POST_FAIL, payload: "err" });

      expect(changeCoverPostRequestAction()).toEqual({ type: ActionType.CHANGE_COVER_POST_REQUEST });
      expect(changeCoverPostSuccessAction()).toEqual({ type: ActionType.CHANGE_COVER_POST_SUCCESS });
      expect(changeCoverPostFailAction("err")).toEqual({ type: ActionType.CHANGE_COVER_POST_FAIL, payload: "err" });

      expect(deletePostRequestAction()).toEqual({ type: ActionType.DELETE_POST_REQUEST });
      expect(deletePostSuccessAction()).toEqual({ type: ActionType.DELETE_POST_SUCCESS });
      expect(deletePostFailAction("err")).toEqual({ type: ActionType.DELETE_POST_FAIL, payload: "err" });

      expect(likePostRequestAction()).toEqual({ type: ActionType.LIKE_POST_REQUEST });
      expect(likePostSuccessAction()).toEqual({ type: ActionType.LIKE_POST_SUCCESS });
      expect(likePostFailAction("err")).toEqual({ type: ActionType.LIKE_POST_FAIL, payload: "err" });

      expect(addCommentRequestAction()).toEqual({ type: ActionType.ADD_COMMENT_REQUEST });
      expect(addCommentSuccessAction()).toEqual({ type: ActionType.ADD_COMMENT_SUCCESS });
      expect(addCommentFailAction("err")).toEqual({ type: ActionType.ADD_COMMENT_FAIL, payload: "err" });

      expect(deleteCommentRequestAction()).toEqual({ type: ActionType.DELETE_COMMENT_REQUEST });
      expect(deleteCommentSuccessAction()).toEqual({ type: ActionType.DELETE_COMMENT_SUCCESS });
      expect(deleteCommentFailAction("err")).toEqual({ type: ActionType.DELETE_COMMENT_FAIL, payload: "err" });

      expect(deleteAllPostsRequestAction()).toEqual({ type: ActionType.DELETE_ALL_POSTS_REQUEST });
      expect(deleteAllPostsSuccessAction()).toEqual({ type: ActionType.DELETE_ALL_POSTS_SUCCESS });
      expect(deleteAllPostsFailAction("err")).toEqual({ type: ActionType.DELETE_ALL_POSTS_FAIL, payload: "err" });

      expect(resetPostStatusAction()).toEqual({ type: ActionType.RESET_POST_STATUS });
    });
  });

  describe("asyncSetPosts", () => {
    it("should handle success and errors", async () => {
      const posts = [{ id: 1, description: "Test" } as any];
      vi.spyOn(postApi, "getPosts").mockResolvedValueOnce({
        status: "success",
        message: "OK",
        data: { posts },
      });

      const dispatch = vi.fn();
      const res = await asyncSetPosts({ is_me: 1 })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(getPostsSuccessAction(posts));
      expect(res.success).toBe(true);

      vi.spyOn(postApi, "getPosts").mockResolvedValueOnce({
        status: "fail",
        message: "Err",
      });
      const resFail = await asyncSetPosts()(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(postApi, "getPosts").mockResolvedValueOnce({
        status: "fail",
        message: "",
      });
      const resFailEmpty = await asyncSetPosts()(dispatch);
      expect(resFailEmpty.success).toBe(false);

      vi.spyOn(postApi, "getPosts").mockRejectedValueOnce(new Error("Net"));
      const resErr = await asyncSetPosts()(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(postApi, "getPosts").mockRejectedValueOnce("String error");
      const resErrStr = await asyncSetPosts()(dispatch);
      expect(resErrStr.success).toBe(false);
    });
  });

  describe("asyncSetPostDetail", () => {
    it("should handle success and errors", async () => {
      const post = { id: 1, description: "Test" } as any;
      vi.spyOn(postApi, "getPostDetail").mockResolvedValueOnce({
        status: "success",
        message: "OK",
        data: { post },
      });

      const dispatch = vi.fn();
      const res = await asyncSetPostDetail(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(getPostDetailSuccessAction(post));
      expect(res.success).toBe(true);

      vi.spyOn(postApi, "getPostDetail").mockResolvedValueOnce({
        status: "fail",
        message: "Err",
      });
      const resFail = await asyncSetPostDetail(1)(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(postApi, "getPostDetail").mockResolvedValueOnce({
        status: "fail",
        message: "",
      });
      const resFailEmpty = await asyncSetPostDetail(1)(dispatch);
      expect(resFailEmpty.success).toBe(false);

      vi.spyOn(postApi, "getPostDetail").mockRejectedValueOnce(new Error("Net"));
      const resErr = await asyncSetPostDetail(1)(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(postApi, "getPostDetail").mockRejectedValueOnce("String error");
      const resErrStr = await asyncSetPostDetail(1)(dispatch);
      expect(resErrStr.success).toBe(false);
    });
  });

  describe("asyncAddPost", () => {
    it("should handle success and errors", async () => {
      vi.spyOn(postApi, "postPost").mockResolvedValueOnce({
        status: "success",
        message: "Created",
      });

      const dispatch = vi.fn();
      const res = await asyncAddPost({ description: "Desc" })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(addPostSuccessAction());
      expect(res.success).toBe(true);

      vi.spyOn(postApi, "postPost").mockResolvedValueOnce({
        status: "fail",
        message: "Err",
      });
      const resFail = await asyncAddPost({ description: "Desc" })(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(postApi, "postPost").mockResolvedValueOnce({
        status: "fail",
        message: "",
      });
      const resFailEmpty = await asyncAddPost({ description: "Desc" })(dispatch);
      expect(resFailEmpty.success).toBe(false);

      vi.spyOn(postApi, "postPost").mockRejectedValueOnce(new Error("Net"));
      const resErr = await asyncAddPost({ description: "Desc" })(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(postApi, "postPost").mockRejectedValueOnce("String error");
      const resErrStr = await asyncAddPost({ description: "Desc" })(dispatch);
      expect(resErrStr.success).toBe(false);
    });
  });

  describe("asyncChangePost", () => {
    it("should handle success and errors", async () => {
      vi.spyOn(postApi, "putPost").mockResolvedValueOnce({
        status: "success",
        message: "Updated",
      });

      const dispatch = vi.fn();
      const res = await asyncChangePost(1, { description: "Desc" })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(changePostSuccessAction());
      expect(res.success).toBe(true);

      vi.spyOn(postApi, "putPost").mockResolvedValueOnce({
        status: "fail",
        message: "Err",
      });
      const resFail = await asyncChangePost(1, { description: "Desc" })(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(postApi, "putPost").mockResolvedValueOnce({
        status: "fail",
        message: "",
      });
      const resFailEmpty = await asyncChangePost(1, { description: "Desc" })(dispatch);
      expect(resFailEmpty.success).toBe(false);

      vi.spyOn(postApi, "putPost").mockRejectedValueOnce(new Error("Net"));
      const resErr = await asyncChangePost(1, { description: "Desc" })(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(postApi, "putPost").mockRejectedValueOnce("String error");
      const resErrStr = await asyncChangePost(1, { description: "Desc" })(dispatch);
      expect(resErrStr.success).toBe(false);
    });
  });

  describe("asyncChangeCoverPost", () => {
    it("should handle success and errors", async () => {
      vi.spyOn(postApi, "postPostCover").mockResolvedValueOnce({
        status: "success",
        message: "Cover updated",
      });

      const dispatch = vi.fn();
      const file = new File(["a"], "cover.jpg");
      const res = await asyncChangeCoverPost(1, file)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(changeCoverPostSuccessAction());
      expect(res.success).toBe(true);

      vi.spyOn(postApi, "postPostCover").mockResolvedValueOnce({
        status: "fail",
        message: "Err",
      });
      const resFail = await asyncChangeCoverPost(1, file)(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(postApi, "postPostCover").mockResolvedValueOnce({
        status: "fail",
        message: "",
      });
      const resFailEmpty = await asyncChangeCoverPost(1, file)(dispatch);
      expect(resFailEmpty.success).toBe(false);

      vi.spyOn(postApi, "postPostCover").mockRejectedValueOnce(new Error("Net"));
      const resErr = await asyncChangeCoverPost(1, file)(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(postApi, "postPostCover").mockRejectedValueOnce("String error");
      const resErrStr = await asyncChangeCoverPost(1, file)(dispatch);
      expect(resErrStr.success).toBe(false);
    });
  });

  describe("asyncDeletePost", () => {
    it("should handle success and errors", async () => {
      vi.spyOn(postApi, "deletePost").mockResolvedValueOnce({
        status: "success",
        message: "Deleted",
      });

      const dispatch = vi.fn();
      const res = await asyncDeletePost(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(deletePostSuccessAction());
      expect(res.success).toBe(true);

      vi.spyOn(postApi, "deletePost").mockResolvedValueOnce({
        status: "fail",
        message: "Err",
      });
      const resFail = await asyncDeletePost(1)(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(postApi, "deletePost").mockResolvedValueOnce({
        status: "fail",
        message: "",
      });
      const resFailEmpty = await asyncDeletePost(1)(dispatch);
      expect(resFailEmpty.success).toBe(false);

      vi.spyOn(postApi, "deletePost").mockRejectedValueOnce(new Error("Net"));
      const resErr = await asyncDeletePost(1)(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(postApi, "deletePost").mockRejectedValueOnce("String error");
      const resErrStr = await asyncDeletePost(1)(dispatch);
      expect(resErrStr.success).toBe(false);
    });
  });

  describe("asyncLikePost", () => {
    it("should handle success and errors", async () => {
      vi.spyOn(postApi, "postPostLike").mockResolvedValueOnce({
        status: "success",
        message: "Liked",
      });

      const dispatch = vi.fn();
      const res = await asyncLikePost(1, { is_like: 1 })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(likePostSuccessAction());
      expect(res.success).toBe(true);

      vi.spyOn(postApi, "postPostLike").mockResolvedValueOnce({
        status: "fail",
        message: "Err",
      });
      const resFail = await asyncLikePost(1, { is_like: 1 })(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(postApi, "postPostLike").mockResolvedValueOnce({
        status: "fail",
        message: "",
      });
      const resFailEmpty = await asyncLikePost(1, { is_like: 1 })(dispatch);
      expect(resFailEmpty.success).toBe(false);

      vi.spyOn(postApi, "postPostLike").mockRejectedValueOnce(new Error("Net"));
      const resErr = await asyncLikePost(1, { is_like: 1 })(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(postApi, "postPostLike").mockRejectedValueOnce("String error");
      const resErrStr = await asyncLikePost(1, { is_like: 1 })(dispatch);
      expect(resErrStr.success).toBe(false);
    });
  });

  describe("asyncAddComment", () => {
    it("should handle success and errors", async () => {
      vi.spyOn(postApi, "postPostComment").mockResolvedValueOnce({
        status: "success",
        message: "Commented",
      });

      const dispatch = vi.fn();
      const res = await asyncAddComment(1, { comment: "Great" })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(addCommentSuccessAction());
      expect(res.success).toBe(true);

      vi.spyOn(postApi, "postPostComment").mockResolvedValueOnce({
        status: "fail",
        message: "Err",
      });
      const resFail = await asyncAddComment(1, { comment: "Great" })(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(postApi, "postPostComment").mockResolvedValueOnce({
        status: "fail",
        message: "",
      });
      const resFailEmpty = await asyncAddComment(1, { comment: "Great" })(dispatch);
      expect(resFailEmpty.success).toBe(false);

      vi.spyOn(postApi, "postPostComment").mockRejectedValueOnce(new Error("Net"));
      const resErr = await asyncAddComment(1, { comment: "Great" })(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(postApi, "postPostComment").mockRejectedValueOnce("String error");
      const resErrStr = await asyncAddComment(1, { comment: "Great" })(dispatch);
      expect(resErrStr.success).toBe(false);
    });
  });

  describe("asyncDeleteComment", () => {
    it("should handle success and errors", async () => {
      vi.spyOn(postApi, "deletePostComment").mockResolvedValueOnce({
        status: "success",
        message: "Deleted comment",
      });

      const dispatch = vi.fn();
      const res = await asyncDeleteComment(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(deleteCommentSuccessAction());
      expect(res.success).toBe(true);

      vi.spyOn(postApi, "deletePostComment").mockResolvedValueOnce({
        status: "fail",
        message: "Err",
      });
      const resFail = await asyncDeleteComment(1)(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(postApi, "deletePostComment").mockResolvedValueOnce({
        status: "fail",
        message: "",
      });
      const resFailEmpty = await asyncDeleteComment(1)(dispatch);
      expect(resFailEmpty.success).toBe(false);

      vi.spyOn(postApi, "deletePostComment").mockRejectedValueOnce(new Error("Net"));
      const resErr = await asyncDeleteComment(1)(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(postApi, "deletePostComment").mockRejectedValueOnce("String error");
      const resErrStr = await asyncDeleteComment(1)(dispatch);
      expect(resErrStr.success).toBe(false);
    });
  });

  describe("asyncDeleteAllPosts", () => {
    it("should handle success and errors", async () => {
      vi.spyOn(postApi, "deleteAllPosts").mockResolvedValueOnce({
        status: "success",
        message: "Deleted all",
      });

      const dispatch = vi.fn();
      const res = await asyncDeleteAllPosts()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(deleteAllPostsSuccessAction());
      expect(res.success).toBe(true);

      vi.spyOn(postApi, "deleteAllPosts").mockResolvedValueOnce({
        status: "fail",
        message: "Err",
      });
      const resFail = await asyncDeleteAllPosts()(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(postApi, "deleteAllPosts").mockResolvedValueOnce({
        status: "fail",
        message: "",
      });
      const resFailEmpty = await asyncDeleteAllPosts()(dispatch);
      expect(resFailEmpty.success).toBe(false);

      vi.spyOn(postApi, "deleteAllPosts").mockRejectedValueOnce(new Error("Net"));
      const resErr = await asyncDeleteAllPosts()(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(postApi, "deleteAllPosts").mockRejectedValueOnce("String error");
      const resErrStr = await asyncDeleteAllPosts()(dispatch);
      expect(resErrStr.success).toBe(false);
    });
  });
});
