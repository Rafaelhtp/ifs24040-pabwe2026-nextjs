import { ActionType } from "@/types/action";
import type { User } from "@/types";
import type { AuthAction } from "./action";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthLogin: boolean;
  isAuthRegister: boolean;
  isAuthLogout: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthLogin: false,
  isAuthRegister: false,
  isAuthLogout: false,
  error: null,
};

export function authReducer(
  state = initialAuthState,
  action: { type: string; [key: string]: any } = { type: "" }
): AuthState {
  if (!action) return state;

  switch (action.type) {
    case ActionType.AUTH_LOGIN_REQUEST:
      return {
        ...state,
        isAuthLogin: true,
        isAuthLogout: false,
        error: null,
      };
    case ActionType.AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        isAuthLogin: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case ActionType.AUTH_LOGIN_FAIL:
      return {
        ...state,
        isAuthLogin: false,
        error: action.payload,
      };
    case ActionType.AUTH_REGISTER_REQUEST:
      return {
        ...state,
        isAuthRegister: true,
        error: null,
      };
    case ActionType.AUTH_REGISTER_SUCCESS:
      return {
        ...state,
        isAuthRegister: false,
        error: null,
      };
    case ActionType.AUTH_REGISTER_FAIL:
      return {
        ...state,
        isAuthRegister: false,
        error: action.payload,
      };
    case ActionType.AUTH_LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthLogin: false,
        isAuthRegister: false,
        isAuthLogout: true,
        error: null,
      };
    case ActionType.SET_AUTH_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

export default authReducer;
