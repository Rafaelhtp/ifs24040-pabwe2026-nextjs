import { ActionType } from "@/types/action";
import {
  getUsers,
  getUserProfile,
  putUserProfile,
  postUserPhoto,
  putUserPassword,
  type UpdateProfilePayload,
  type UpdatePasswordPayload,
} from "../api/userApi";
import type { User } from "@/types";
import type { AppDispatch } from "@/store";
import { setAuthUserAction } from "@/features/auth/states/action";

export function getUsersRequestAction() {
  return { type: ActionType.GET_USERS_REQUEST } as const;
}

export function getUsersSuccessAction(users: User[]) {
  return { type: ActionType.GET_USERS_SUCCESS, payload: users } as const;
}

export function getUsersFailAction(error: string) {
  return { type: ActionType.GET_USERS_FAIL, payload: error } as const;
}

export function getProfileRequestAction() {
  return { type: ActionType.GET_PROFILE_REQUEST } as const;
}

export function getProfileSuccessAction(user: User) {
  return { type: ActionType.GET_PROFILE_SUCCESS, payload: user } as const;
}

export function getProfileFailAction(error: string) {
  return { type: ActionType.GET_PROFILE_FAIL, payload: error } as const;
}

export function updateProfileRequestAction() {
  return { type: ActionType.UPDATE_PROFILE_REQUEST } as const;
}

export function updateProfileSuccessAction(user: User) {
  return { type: ActionType.UPDATE_PROFILE_SUCCESS, payload: user } as const;
}

export function updateProfileFailAction(error: string) {
  return { type: ActionType.UPDATE_PROFILE_FAIL, payload: error } as const;
}

export function updatePhotoRequestAction() {
  return { type: ActionType.UPDATE_PHOTO_REQUEST } as const;
}

export function updatePhotoSuccessAction(user: User) {
  return { type: ActionType.UPDATE_PHOTO_SUCCESS, payload: user } as const;
}

export function updatePhotoFailAction(error: string) {
  return { type: ActionType.UPDATE_PHOTO_FAIL, payload: error } as const;
}

export function updatePasswordRequestAction() {
  return { type: ActionType.UPDATE_PASSWORD_REQUEST } as const;
}

export function updatePasswordSuccessAction() {
  return { type: ActionType.UPDATE_PASSWORD_SUCCESS } as const;
}

export function updatePasswordFailAction(error: string) {
  return { type: ActionType.UPDATE_PASSWORD_FAIL, payload: error } as const;
}

export type UsersAction =
  | ReturnType<typeof getUsersRequestAction>
  | ReturnType<typeof getUsersSuccessAction>
  | ReturnType<typeof getUsersFailAction>
  | ReturnType<typeof getProfileRequestAction>
  | ReturnType<typeof getProfileSuccessAction>
  | ReturnType<typeof getProfileFailAction>
  | ReturnType<typeof updateProfileRequestAction>
  | ReturnType<typeof updateProfileSuccessAction>
  | ReturnType<typeof updateProfileFailAction>
  | ReturnType<typeof updatePhotoRequestAction>
  | ReturnType<typeof updatePhotoSuccessAction>
  | ReturnType<typeof updatePhotoFailAction>
  | ReturnType<typeof updatePasswordRequestAction>
  | ReturnType<typeof updatePasswordSuccessAction>
  | ReturnType<typeof updatePasswordFailAction>;

// Thunks
export function asyncSetUsers() {
  return async (dispatch: AppDispatch) => {
    dispatch(getUsersRequestAction());
    try {
      const response = await getUsers();
      if (response.status === "success" && response.data?.users) {
        dispatch(getUsersSuccessAction(response.data.users));
        return { success: true, users: response.data.users };
      }
      const errorMsg = response.message || "Gagal mengambil daftar pengguna";
      dispatch(getUsersFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(getUsersFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncSetProfile() {
  return async (dispatch: AppDispatch) => {
    dispatch(getProfileRequestAction());
    try {
      const response = await getUserProfile();
      if (response.status === "success" && response.data?.user) {
        dispatch(getProfileSuccessAction(response.data.user));
        dispatch(setAuthUserAction(response.data.user));
        return { success: true, user: response.data.user };
      }
      const errorMsg = response.message || "Gagal mengambil profil";
      dispatch(getProfileFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(getProfileFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncUpdateProfile(payload: UpdateProfilePayload) {
  return async (dispatch: AppDispatch) => {
    dispatch(updateProfileRequestAction());
    try {
      const response = await putUserProfile(payload);
      if (response.status === "success" && response.data?.user) {
        dispatch(updateProfileSuccessAction(response.data.user));
        dispatch(setAuthUserAction(response.data.user));
        return { success: true, message: response.message, user: response.data.user };
      }
      const errorMsg = response.message || "Gagal memperbarui profil";
      dispatch(updateProfileFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(updateProfileFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncUpdatePhoto(photoFile: File) {
  return async (dispatch: AppDispatch) => {
    dispatch(updatePhotoRequestAction());
    try {
      const response = await postUserPhoto(photoFile);
      if (response.status === "success" && response.data?.user) {
        dispatch(updatePhotoSuccessAction(response.data.user));
        dispatch(setAuthUserAction(response.data.user));
        return { success: true, message: response.message, user: response.data.user };
      }
      const errorMsg = response.message || "Gagal memperbarui foto profil";
      dispatch(updatePhotoFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(updatePhotoFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}

export function asyncUpdatePassword(payload: UpdatePasswordPayload) {
  return async (dispatch: AppDispatch) => {
    dispatch(updatePasswordRequestAction());
    try {
      const response = await putUserPassword(payload);
      if (response.status === "success") {
        dispatch(updatePasswordSuccessAction());
        return { success: true, message: response.message };
      }
      const errorMsg = response.message || "Gagal mengubah kata sandi";
      dispatch(updatePasswordFailAction(errorMsg));
      return { success: false, message: errorMsg };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
      dispatch(updatePasswordFailAction(errorMsg));
      return { success: false, message: errorMsg };
    }
  };
}
