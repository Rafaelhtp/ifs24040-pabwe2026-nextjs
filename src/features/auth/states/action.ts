import { ActionType } from "@/types/action";
import { postLogin, postRegister, type LoginPayload, type RegisterPayload } from "../api/authApi";
import { putAccessToken, removeAccessToken } from "@/helpers/apiHelper";
import type { User, AuthLoginResponseData } from "@/types";
import type { AppDispatch } from "@/store";

// Action Creators
export function authLoginRequestAction() {
  return { type: ActionType.AUTH_LOGIN_REQUEST } as const;
}

export function authLoginSuccessAction(payload: AuthLoginResponseData) {
  return { type: ActionType.AUTH_LOGIN_SUCCESS, payload } as const;
}

export function authLoginFailAction(error: string) {
  return { type: ActionType.AUTH_LOGIN_FAIL, payload: error } as const;
}

export function authRegisterRequestAction() {
  return { type: ActionType.AUTH_REGISTER_REQUEST } as const;
}

export function authRegisterSuccessAction() {
  return { type: ActionType.AUTH_REGISTER_SUCCESS } as const;
}

export function authRegisterFailAction(error: string) {
  return { type: ActionType.AUTH_REGISTER_FAIL, payload: error } as const;
}

export function authLogoutAction() {
  return { type: ActionType.AUTH_LOGOUT } as const;
}

export function setAuthUserAction(user: User | null) {
  return { type: ActionType.SET_AUTH_USER, payload: user } as const;
}

export type AuthAction =
  | ReturnType<typeof authLoginRequestAction>
  | ReturnType<typeof authLoginSuccessAction>
  | ReturnType<typeof authLoginFailAction>
  | ReturnType<typeof authRegisterRequestAction>
  | ReturnType<typeof authRegisterSuccessAction>
  | ReturnType<typeof authRegisterFailAction>
  | ReturnType<typeof authLogoutAction>
  | ReturnType<typeof setAuthUserAction>;

// Thunks
export function asyncSetIsAuthLogin(payload: LoginPayload) {
  return async (dispatch: AppDispatch) => {
    dispatch(authLoginRequestAction());
    try {
      const response = await postLogin(payload);
      if (response.status === "success" && response.data) {
        putAccessToken(response.data.token);
        dispatch(authLoginSuccessAction(response.data));
        return { success: true, message: response.message };
      }
      const errorMsg = response.message || "Gagal login";
      dispatch(authLoginFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(authLoginFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncSetIsAuthRegister(payload: RegisterPayload) {
  return async (dispatch: AppDispatch) => {
    dispatch(authRegisterRequestAction());
    try {
      const response = await postRegister(payload);
      if (response.status === "success") {
        dispatch(authRegisterSuccessAction());
        return { success: true, message: response.message };
      }
      const errorMsg = response.message || "Gagal registrasi";
      dispatch(authRegisterFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(authRegisterFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncSetIsAuthLogout() {
  return async (dispatch: AppDispatch) => {
    removeAccessToken();
    dispatch(authLogoutAction());
  };
}
