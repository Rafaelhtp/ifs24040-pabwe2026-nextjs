import { ActionType } from "@/types/action";
import type { Post } from "@/types";
import type { PostsAction } from "./action";

export interface PostsState {
  posts: Post[];
  post: Post | null;
  isPost: boolean;
  isPostAdd: boolean;
  isPostAdded: boolean;
  isPostChange: boolean;
  isPostChanged: boolean;
  isPostChangeCover: boolean;
  isPostChangedCover: boolean;
  isPostDelete: boolean;
  isPostDeleted: boolean;
  isPostLike: boolean;
  isPostLiked: boolean;
  isPostAddComment: boolean;
  isPostAddedComment: boolean;
  isPostDeleteComment: boolean;
  isPostDeletedComment: boolean;
  isPostDeleteAll: boolean;
  isPostDeletedAll: boolean;
  error: string | null;
}

export const initialPostsState: PostsState = {
  posts: [],
  post: null,
  isPost: false,
  isPostAdd: false,
  isPostAdded: false,
  isPostChange: false,
  isPostChanged: false,
  isPostChangeCover: false,
  isPostChangedCover: false,
  isPostDelete: false,
  isPostDeleted: false,
  isPostLike: false,
  isPostLiked: false,
  isPostAddComment: false,
  isPostAddedComment: false,
  isPostDeleteComment: false,
  isPostDeletedComment: false,
  isPostDeleteAll: false,
  isPostDeletedAll: false,
  error: null,
};

export function postsReducer(
  state = initialPostsState,
  action: { type: string; [key: string]: any } = { type: "" }
): PostsState {
  if (!action) return state;

  switch (action.type) {
    case ActionType.GET_POSTS_REQUEST:
      return { ...state, isPost: true, error: null };
    case ActionType.GET_POSTS_SUCCESS:
      return { ...state, isPost: false, posts: action.payload, error: null };
    case ActionType.GET_POSTS_FAIL:
      return { ...state, isPost: false, error: action.payload };

    case ActionType.GET_POST_DETAIL_REQUEST:
      return { ...state, isPost: true, error: null };
    case ActionType.GET_POST_DETAIL_SUCCESS:
      return { ...state, isPost: false, post: action.payload, error: null };
    case ActionType.GET_POST_DETAIL_FAIL:
      return { ...state, isPost: false, error: action.payload };

    case ActionType.ADD_POST_REQUEST:
      return { ...state, isPostAdd: true, isPostAdded: false, error: null };
    case ActionType.ADD_POST_SUCCESS:
      return { ...state, isPostAdd: false, isPostAdded: true, error: null };
    case ActionType.ADD_POST_FAIL:
      return { ...state, isPostAdd: false, isPostAdded: false, error: action.payload };

    case ActionType.CHANGE_POST_REQUEST:
      return { ...state, isPostChange: true, isPostChanged: false, error: null };
    case ActionType.CHANGE_POST_SUCCESS:
      return { ...state, isPostChange: false, isPostChanged: true, error: null };
    case ActionType.CHANGE_POST_FAIL:
      return { ...state, isPostChange: false, isPostChanged: false, error: action.payload };

    case ActionType.CHANGE_COVER_POST_REQUEST:
      return { ...state, isPostChangeCover: true, isPostChangedCover: false, error: null };
    case ActionType.CHANGE_COVER_POST_SUCCESS:
      return { ...state, isPostChangeCover: false, isPostChangedCover: true, error: null };
    case ActionType.CHANGE_COVER_POST_FAIL:
      return { ...state, isPostChangeCover: false, isPostChangedCover: false, error: action.payload };

    case ActionType.DELETE_POST_REQUEST:
      return { ...state, isPostDelete: true, isPostDeleted: false, error: null };
    case ActionType.DELETE_POST_SUCCESS:
      return { ...state, isPostDelete: false, isPostDeleted: true, error: null };
    case ActionType.DELETE_POST_FAIL:
      return { ...state, isPostDelete: false, isPostDeleted: false, error: action.payload };

    case ActionType.LIKE_POST_REQUEST:
      return { ...state, isPostLike: true, isPostLiked: false, error: null };
    case ActionType.LIKE_POST_SUCCESS:
      return { ...state, isPostLike: false, isPostLiked: true, error: null };
    case ActionType.LIKE_POST_FAIL:
      return { ...state, isPostLike: false, isPostLiked: false, error: action.payload };

    case ActionType.ADD_COMMENT_REQUEST:
      return { ...state, isPostAddComment: true, isPostAddedComment: false, error: null };
    case ActionType.ADD_COMMENT_SUCCESS:
      return { ...state, isPostAddComment: false, isPostAddedComment: true, error: null };
    case ActionType.ADD_COMMENT_FAIL:
      return { ...state, isPostAddComment: false, isPostAddedComment: false, error: action.payload };

    case ActionType.DELETE_COMMENT_REQUEST:
      return { ...state, isPostDeleteComment: true, isPostDeletedComment: false, error: null };
    case ActionType.DELETE_COMMENT_SUCCESS:
      return { ...state, isPostDeleteComment: false, isPostDeletedComment: true, error: null };
    case ActionType.DELETE_COMMENT_FAIL:
      return { ...state, isPostDeleteComment: false, isPostDeletedComment: false, error: action.payload };

    case ActionType.DELETE_ALL_POSTS_REQUEST:
      return { ...state, isPostDeleteAll: true, isPostDeletedAll: false, error: null };
    case ActionType.DELETE_ALL_POSTS_SUCCESS:
      return { ...state, isPostDeleteAll: false, isPostDeletedAll: true, error: null };
    case ActionType.DELETE_ALL_POSTS_FAIL:
      return { ...state, isPostDeleteAll: false, isPostDeletedAll: false, error: action.payload };

    case ActionType.RESET_POST_STATUS:
      return {
        ...state,
        isPostAdded: false,
        isPostChanged: false,
        isPostChangedCover: false,
        isPostDeleted: false,
        isPostLiked: false,
        isPostAddedComment: false,
        isPostDeletedComment: false,
        isPostDeletedAll: false,
      };

    default:
      return state;
  }
}

export default postsReducer;
