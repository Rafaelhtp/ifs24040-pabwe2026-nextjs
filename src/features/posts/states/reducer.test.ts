import { describe, it, expect } from "vitest";
import postsReducer, { initialPostsState } from "./reducer";
import { ActionType } from "@/types/action";

describe("postsReducer", () => {
  it("should return initial state when called with undefined", () => {
    // @ts-expect-error test undefined
    expect(postsReducer(undefined, undefined)).toEqual(initialPostsState);
  });

  it("should return unchanged state for unknown action", () => {
    expect(postsReducer(initialPostsState, { type: "UNKNOWN" })).toEqual(initialPostsState);
  });

  it("should handle GET_POSTS actions", () => {
    const s1 = postsReducer(initialPostsState, { type: ActionType.GET_POSTS_REQUEST });
    expect(s1.isPost).toBe(true);

    const posts = [{ id: 1, description: "Test" } as any];
    const s2 = postsReducer(s1, { type: ActionType.GET_POSTS_SUCCESS, payload: posts });
    expect(s2.isPost).toBe(false);
    expect(s2.posts).toEqual(posts);

    const s3 = postsReducer(s1, { type: ActionType.GET_POSTS_FAIL, payload: "err" });
    expect(s3.isPost).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle GET_POST_DETAIL actions", () => {
    const s1 = postsReducer(initialPostsState, { type: ActionType.GET_POST_DETAIL_REQUEST });
    expect(s1.isPost).toBe(true);

    const post = { id: 1, description: "Detail" } as any;
    const s2 = postsReducer(s1, { type: ActionType.GET_POST_DETAIL_SUCCESS, payload: post });
    expect(s2.isPost).toBe(false);
    expect(s2.post).toEqual(post);

    const s3 = postsReducer(s1, { type: ActionType.GET_POST_DETAIL_FAIL, payload: "err" });
    expect(s3.isPost).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle ADD_POST actions", () => {
    const s1 = postsReducer(initialPostsState, { type: ActionType.ADD_POST_REQUEST });
    expect(s1.isPostAdd).toBe(true);
    expect(s1.isPostAdded).toBe(false);

    const s2 = postsReducer(s1, { type: ActionType.ADD_POST_SUCCESS });
    expect(s2.isPostAdd).toBe(false);
    expect(s2.isPostAdded).toBe(true);

    const s3 = postsReducer(s1, { type: ActionType.ADD_POST_FAIL, payload: "err" });
    expect(s3.isPostAdd).toBe(false);
    expect(s3.isPostAdded).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle CHANGE_POST actions", () => {
    const s1 = postsReducer(initialPostsState, { type: ActionType.CHANGE_POST_REQUEST });
    expect(s1.isPostChange).toBe(true);

    const s2 = postsReducer(s1, { type: ActionType.CHANGE_POST_SUCCESS });
    expect(s2.isPostChange).toBe(false);
    expect(s2.isPostChanged).toBe(true);

    const s3 = postsReducer(s1, { type: ActionType.CHANGE_POST_FAIL, payload: "err" });
    expect(s3.isPostChange).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle CHANGE_COVER_POST actions", () => {
    const s1 = postsReducer(initialPostsState, { type: ActionType.CHANGE_COVER_POST_REQUEST });
    expect(s1.isPostChangeCover).toBe(true);

    const s2 = postsReducer(s1, { type: ActionType.CHANGE_COVER_POST_SUCCESS });
    expect(s2.isPostChangeCover).toBe(false);
    expect(s2.isPostChangedCover).toBe(true);

    const s3 = postsReducer(s1, { type: ActionType.CHANGE_COVER_POST_FAIL, payload: "err" });
    expect(s3.isPostChangeCover).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle DELETE_POST actions", () => {
    const s1 = postsReducer(initialPostsState, { type: ActionType.DELETE_POST_REQUEST });
    expect(s1.isPostDelete).toBe(true);

    const s2 = postsReducer(s1, { type: ActionType.DELETE_POST_SUCCESS });
    expect(s2.isPostDelete).toBe(false);
    expect(s2.isPostDeleted).toBe(true);

    const s3 = postsReducer(s1, { type: ActionType.DELETE_POST_FAIL, payload: "err" });
    expect(s3.isPostDelete).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle LIKE_POST actions", () => {
    const s1 = postsReducer(initialPostsState, { type: ActionType.LIKE_POST_REQUEST });
    expect(s1.isPostLike).toBe(true);

    const s2 = postsReducer(s1, { type: ActionType.LIKE_POST_SUCCESS });
    expect(s2.isPostLike).toBe(false);
    expect(s2.isPostLiked).toBe(true);

    const s3 = postsReducer(s1, { type: ActionType.LIKE_POST_FAIL, payload: "err" });
    expect(s3.isPostLike).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle ADD_COMMENT actions", () => {
    const s1 = postsReducer(initialPostsState, { type: ActionType.ADD_COMMENT_REQUEST });
    expect(s1.isPostAddComment).toBe(true);

    const s2 = postsReducer(s1, { type: ActionType.ADD_COMMENT_SUCCESS });
    expect(s2.isPostAddComment).toBe(false);
    expect(s2.isPostAddedComment).toBe(true);

    const s3 = postsReducer(s1, { type: ActionType.ADD_COMMENT_FAIL, payload: "err" });
    expect(s3.isPostAddComment).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle DELETE_COMMENT actions", () => {
    const s1 = postsReducer(initialPostsState, { type: ActionType.DELETE_COMMENT_REQUEST });
    expect(s1.isPostDeleteComment).toBe(true);

    const s2 = postsReducer(s1, { type: ActionType.DELETE_COMMENT_SUCCESS });
    expect(s2.isPostDeleteComment).toBe(false);
    expect(s2.isPostDeletedComment).toBe(true);

    const s3 = postsReducer(s1, { type: ActionType.DELETE_COMMENT_FAIL, payload: "err" });
    expect(s3.isPostDeleteComment).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle DELETE_ALL_POSTS actions", () => {
    const s1 = postsReducer(initialPostsState, { type: ActionType.DELETE_ALL_POSTS_REQUEST });
    expect(s1.isPostDeleteAll).toBe(true);

    const s2 = postsReducer(s1, { type: ActionType.DELETE_ALL_POSTS_SUCCESS });
    expect(s2.isPostDeleteAll).toBe(false);
    expect(s2.isPostDeletedAll).toBe(true);

    const s3 = postsReducer(s1, { type: ActionType.DELETE_ALL_POSTS_FAIL, payload: "err" });
    expect(s3.isPostDeleteAll).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle RESET_POST_STATUS action", () => {
    const modifiedState = {
      ...initialPostsState,
      isPostAdded: true,
      isPostChanged: true,
      isPostChangedCover: true,
      isPostDeleted: true,
      isPostLiked: true,
      isPostAddedComment: true,
      isPostDeletedComment: true,
      isPostDeletedAll: true,
    };

    const res = postsReducer(modifiedState, { type: ActionType.RESET_POST_STATUS });
    expect(res.isPostAdded).toBe(false);
    expect(res.isPostChanged).toBe(false);
    expect(res.isPostChangedCover).toBe(false);
    expect(res.isPostDeleted).toBe(false);
    expect(res.isPostLiked).toBe(false);
    expect(res.isPostAddedComment).toBe(false);
    expect(res.isPostDeletedComment).toBe(false);
    expect(res.isPostDeletedAll).toBe(false);
  });
});
