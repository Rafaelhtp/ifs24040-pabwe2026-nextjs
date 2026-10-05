import { ActionType } from "@/types/action";
import type { User } from "@/types";
import type { UsersAction } from "./action";

export interface UsersState {
  users: User[];
  profile: User | null;
  isUsers: boolean;
  isProfile: boolean;
  isUpdateProfile: boolean;
  isUpdatePhoto: boolean;
  isUpdatePassword: boolean;
  error: string | null;
}

export const initialUsersState: UsersState = {
  users: [],
  profile: null,
  isUsers: false,
  isProfile: false,
  isUpdateProfile: false,
  isUpdatePhoto: false,
  isUpdatePassword: false,
  error: null,
};

export function usersReducer(
  state = initialUsersState,
  action: { type: string; [key: string]: any } = { type: "" }
): UsersState {
  if (!action) return state;

  switch (action.type) {
    case ActionType.GET_USERS_REQUEST:
      return { ...state, isUsers: true, error: null };
    case ActionType.GET_USERS_SUCCESS:
      return { ...state, isUsers: false, users: action.payload, error: null };
    case ActionType.GET_USERS_FAIL:
      return { ...state, isUsers: false, error: action.payload };

    case ActionType.GET_PROFILE_REQUEST:
      return { ...state, isProfile: true, error: null };
    case ActionType.GET_PROFILE_SUCCESS:
      return { ...state, isProfile: false, profile: action.payload, error: null };
    case ActionType.GET_PROFILE_FAIL:
      return { ...state, isProfile: false, error: action.payload };

    case ActionType.UPDATE_PROFILE_REQUEST:
      return { ...state, isUpdateProfile: true, error: null };
    case ActionType.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        isUpdateProfile: false,
        profile: action.payload,
        error: null,
      };
    case ActionType.UPDATE_PROFILE_FAIL:
      return { ...state, isUpdateProfile: false, error: action.payload };

    case ActionType.UPDATE_PHOTO_REQUEST:
      return { ...state, isUpdatePhoto: true, error: null };
    case ActionType.UPDATE_PHOTO_SUCCESS:
      return {
        ...state,
        isUpdatePhoto: false,
        profile: action.payload,
        error: null,
      };
    case ActionType.UPDATE_PHOTO_FAIL:
      return { ...state, isUpdatePhoto: false, error: action.payload };

    case ActionType.UPDATE_PASSWORD_REQUEST:
      return { ...state, isUpdatePassword: true, error: null };
    case ActionType.UPDATE_PASSWORD_SUCCESS:
      return { ...state, isUpdatePassword: false, error: null };
    case ActionType.UPDATE_PASSWORD_FAIL:
      return { ...state, isUpdatePassword: false, error: action.payload };

    default:
      return state;
  }
}

export default usersReducer;
