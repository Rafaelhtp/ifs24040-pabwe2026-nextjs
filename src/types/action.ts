export const ActionType = {
  // Auth
  AUTH_LOGIN_REQUEST: "auth/loginRequest",
  AUTH_LOGIN_SUCCESS: "auth/loginSuccess",
  AUTH_LOGIN_FAIL: "auth/loginFail",
  AUTH_REGISTER_REQUEST: "auth/registerRequest",
  AUTH_REGISTER_SUCCESS: "auth/registerSuccess",
  AUTH_REGISTER_FAIL: "auth/registerFail",
  AUTH_LOGOUT: "auth/logout",
  SET_AUTH_USER: "auth/setAuthUser",

  // Users
  GET_USERS_REQUEST: "users/getUsersRequest",
  GET_USERS_SUCCESS: "users/getUsersSuccess",
  GET_USERS_FAIL: "users/getUsersFail",

  GET_PROFILE_REQUEST: "users/getProfileRequest",
  GET_PROFILE_SUCCESS: "users/getProfileSuccess",
  GET_PROFILE_FAIL: "users/getProfileFail",

  UPDATE_PROFILE_REQUEST: "users/updateProfileRequest",
  UPDATE_PROFILE_SUCCESS: "users/updateProfileSuccess",
  UPDATE_PROFILE_FAIL: "users/updateProfileFail",

  UPDATE_PHOTO_REQUEST: "users/updatePhotoRequest",
  UPDATE_PHOTO_SUCCESS: "users/updatePhotoSuccess",
  UPDATE_PHOTO_FAIL: "users/updatePhotoFail",

  UPDATE_PASSWORD_REQUEST: "users/updatePasswordRequest",
  UPDATE_PASSWORD_SUCCESS: "users/updatePasswordSuccess",
  UPDATE_PASSWORD_FAIL: "users/updatePasswordFail",

  // Posts
  GET_POSTS_REQUEST: "posts/getPostsRequest",
  GET_POSTS_SUCCESS: "posts/getPostsSuccess",
  GET_POSTS_FAIL: "posts/getPostsFail",

  GET_POST_DETAIL_REQUEST: "posts/getPostDetailRequest",
  GET_POST_DETAIL_SUCCESS: "posts/getPostDetailSuccess",
  GET_POST_DETAIL_FAIL: "posts/getPostDetailFail",

  ADD_POST_REQUEST: "posts/addPostRequest",
  ADD_POST_SUCCESS: "posts/addPostSuccess",
  ADD_POST_FAIL: "posts/addPostFail",

  CHANGE_POST_REQUEST: "posts/changePostRequest",
  CHANGE_POST_SUCCESS: "posts/changePostSuccess",
  CHANGE_POST_FAIL: "posts/changePostFail",

  CHANGE_COVER_POST_REQUEST: "posts/changeCoverPostRequest",
  CHANGE_COVER_POST_SUCCESS: "posts/changeCoverPostSuccess",
  CHANGE_COVER_POST_FAIL: "posts/changeCoverPostFail",

  DELETE_POST_REQUEST: "posts/deletePostRequest",
  DELETE_POST_SUCCESS: "posts/deletePostSuccess",
  DELETE_POST_FAIL: "posts/deletePostFail",

  LIKE_POST_REQUEST: "posts/likePostRequest",
  LIKE_POST_SUCCESS: "posts/likePostSuccess",
  LIKE_POST_FAIL: "posts/likePostFail",

  ADD_COMMENT_REQUEST: "posts/addCommentRequest",
  ADD_COMMENT_SUCCESS: "posts/addCommentSuccess",
  ADD_COMMENT_FAIL: "posts/addCommentFail",

  DELETE_COMMENT_REQUEST: "posts/deleteCommentRequest",
  DELETE_COMMENT_SUCCESS: "posts/deleteCommentSuccess",
  DELETE_COMMENT_FAIL: "posts/deleteCommentFail",

  DELETE_ALL_POSTS_REQUEST: "posts/deleteAllPostsRequest",
  DELETE_ALL_POSTS_SUCCESS: "posts/deleteAllPostsSuccess",
  DELETE_ALL_POSTS_FAIL: "posts/deleteAllPostsFail",

  RESET_POST_STATUS: "posts/resetPostStatus",
} as const;

export type ActionTypeValues = typeof ActionType[keyof typeof ActionType];
