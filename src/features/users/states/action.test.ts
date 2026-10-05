import { describe, it, expect, vi, beforeEach } from "vitest";
import * as userApi from "../api/userApi";
import {
  getUsersRequestAction,
  getUsersSuccessAction,
  getUsersFailAction,
  getProfileRequestAction,
  getProfileSuccessAction,
  getProfileFailAction,
  updateProfileRequestAction,
  updateProfileSuccessAction,
  updateProfileFailAction,
  updatePhotoRequestAction,
  updatePhotoSuccessAction,
  updatePhotoFailAction,
  updatePasswordRequestAction,
  updatePasswordSuccessAction,
  updatePasswordFailAction,
  asyncSetUsers,
  asyncSetProfile,
  asyncUpdateProfile,
  asyncUpdatePhoto,
  asyncUpdatePassword,
} from "./action";
import { ActionType } from "@/types/action";

describe("users actions and thunks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("action creators", () => {
    it("should create expected actions", () => {
      expect(getUsersRequestAction()).toEqual({ type: ActionType.GET_USERS_REQUEST });
      expect(getUsersSuccessAction([])).toEqual({ type: ActionType.GET_USERS_SUCCESS, payload: [] });
      expect(getUsersFailAction("err")).toEqual({ type: ActionType.GET_USERS_FAIL, payload: "err" });

      expect(getProfileRequestAction()).toEqual({ type: ActionType.GET_PROFILE_REQUEST });
      expect(getProfileSuccessAction({} as any)).toEqual({ type: ActionType.GET_PROFILE_SUCCESS, payload: {} });
      expect(getProfileFailAction("err")).toEqual({ type: ActionType.GET_PROFILE_FAIL, payload: "err" });

      expect(updateProfileRequestAction()).toEqual({ type: ActionType.UPDATE_PROFILE_REQUEST });
      expect(updateProfileSuccessAction({} as any)).toEqual({ type: ActionType.UPDATE_PROFILE_SUCCESS, payload: {} });
      expect(updateProfileFailAction("err")).toEqual({ type: ActionType.UPDATE_PROFILE_FAIL, payload: "err" });

      expect(updatePhotoRequestAction()).toEqual({ type: ActionType.UPDATE_PHOTO_REQUEST });
      expect(updatePhotoSuccessAction({} as any)).toEqual({ type: ActionType.UPDATE_PHOTO_SUCCESS, payload: {} });
      expect(updatePhotoFailAction("err")).toEqual({ type: ActionType.UPDATE_PHOTO_FAIL, payload: "err" });

      expect(updatePasswordRequestAction()).toEqual({ type: ActionType.UPDATE_PASSWORD_REQUEST });
      expect(updatePasswordSuccessAction()).toEqual({ type: ActionType.UPDATE_PASSWORD_SUCCESS });
      expect(updatePasswordFailAction("err")).toEqual({ type: ActionType.UPDATE_PASSWORD_FAIL, payload: "err" });
    });
  });

  describe("asyncSetUsers", () => {
    it("should handle success", async () => {
      const users = [{ id: 1, name: "A", email: "a@b.com", photo: "", created_at: "", updated_at: "" }];
      vi.spyOn(userApi, "getUsers").mockResolvedValueOnce({
        status: "success",
        message: "OK",
        data: { users },
      });

      const dispatch = vi.fn();
      const res = await asyncSetUsers()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(getUsersRequestAction());
      expect(dispatch).toHaveBeenCalledWith(getUsersSuccessAction(users));
      expect(res).toEqual({ success: true, users });
    });

    it("should handle failure", async () => {
      vi.spyOn(userApi, "getUsers").mockResolvedValueOnce({
        status: "fail",
        message: "Error fetching",
      });

      const dispatch = vi.fn();
      const res = await asyncSetUsers()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(getUsersFailAction("Error fetching"));
      expect(res).toEqual({ success: false, message: "Error fetching" });
    });

    it("should handle exception", async () => {
      vi.spyOn(userApi, "getUsers").mockRejectedValueOnce(new Error("Network"));

      const dispatch = vi.fn();
      const res = await asyncSetUsers()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(getUsersFailAction("Network"));
      vi.spyOn(userApi, "getUsers").mockResolvedValueOnce({ status: "fail", message: "" });
      const resDefUsers = await asyncSetUsers()(dispatch);
      expect(resDefUsers.message).toBe("Gagal mengambil daftar pengguna");

      vi.spyOn(userApi, "getUsers").mockRejectedValueOnce("Non error");
      const resNonErrUsers = await asyncSetUsers()(dispatch);
      expect(resNonErrUsers.message).toBe("Terjadi kesalahan");
    });
  });

  describe("asyncSetProfile", () => {
    it("should handle success", async () => {
      const user = { id: 1, name: "A", email: "a@b.com", photo: "", created_at: "", updated_at: "" };
      vi.spyOn(userApi, "getUserProfile").mockResolvedValueOnce({
        status: "success",
        message: "OK",
        data: { user },
      });

      const dispatch = vi.fn();
      const res = await asyncSetProfile()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(getProfileRequestAction());
      expect(dispatch).toHaveBeenCalledWith(getProfileSuccessAction(user));
      expect(res).toEqual({ success: true, user });
    });

    it("should handle failure and exception", async () => {
      vi.spyOn(userApi, "getUserProfile").mockResolvedValueOnce({
        status: "fail",
        message: "Unauthorized",
      });

      const dispatch = vi.fn();
      const res = await asyncSetProfile()(dispatch);
      expect(res.success).toBe(false);

      vi.spyOn(userApi, "getUserProfile").mockResolvedValueOnce({ status: "fail", message: "" });
      const resDefProf = await asyncSetProfile()(dispatch);
      expect(resDefProf.message).toBe("Gagal mengambil profil");

      vi.spyOn(userApi, "getUserProfile").mockRejectedValueOnce(new Error("Net Error"));
      const resErr = await asyncSetProfile()(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(userApi, "getUserProfile").mockRejectedValueOnce("Net Error");
      const resNonErrProf = await asyncSetProfile()(dispatch);
      expect(resNonErrProf.message).toBe("Terjadi kesalahan");
    });
  });

  describe("asyncUpdateProfile", () => {
    it("should handle success and error", async () => {
      const user = { id: 1, name: "New", email: "new@b.com", photo: "", created_at: "", updated_at: "" };
      vi.spyOn(userApi, "putUserProfile").mockResolvedValueOnce({
        status: "success",
        message: "Updated",
        data: { user },
      });

      const dispatch = vi.fn();
      const res = await asyncUpdateProfile({ name: "New", email: "new@b.com" })(dispatch);
      expect(res.success).toBe(true);

      vi.spyOn(userApi, "putUserProfile").mockResolvedValueOnce({
        status: "fail",
        message: "Failed",
      });
      const resFail = await asyncUpdateProfile({ name: "New", email: "new@b.com" })(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(userApi, "putUserProfile").mockResolvedValueOnce({ status: "fail", message: "" });
      const resDefUpd = await asyncUpdateProfile({ name: "New", email: "new@b.com" })(dispatch);
      expect(resDefUpd.message).toBe("Gagal memperbarui profil");

      vi.spyOn(userApi, "putUserProfile").mockRejectedValueOnce(new Error("Net Error"));
      const resErr = await asyncUpdateProfile({ name: "New", email: "new@b.com" })(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(userApi, "putUserProfile").mockRejectedValueOnce("Net Error");
      const resNonErrUpd = await asyncUpdateProfile({ name: "New", email: "new@b.com" })(dispatch);
      expect(resNonErrUpd.message).toBe("Terjadi kesalahan");
    });
  });

  describe("asyncUpdatePhoto", () => {
    it("should handle success and error", async () => {
      const user = { id: 1, name: "New", email: "new@b.com", photo: "new.jpg", created_at: "", updated_at: "" };
      vi.spyOn(userApi, "postUserPhoto").mockResolvedValueOnce({
        status: "success",
        message: "Updated",
        data: { user },
      });

      const dispatch = vi.fn();
      const file = new File(["dummy"], "img.png");
      const res = await asyncUpdatePhoto(file)(dispatch);
      expect(res.success).toBe(true);

      vi.spyOn(userApi, "postUserPhoto").mockResolvedValueOnce({
        status: "fail",
        message: "Invalid file",
      });
      const resFail = await asyncUpdatePhoto(file)(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(userApi, "postUserPhoto").mockResolvedValueOnce({ status: "fail", message: "" });
      const resDefPhoto = await asyncUpdatePhoto(file)(dispatch);
      expect(resDefPhoto.message).toBe("Gagal memperbarui foto profil");

      vi.spyOn(userApi, "postUserPhoto").mockRejectedValueOnce(new Error("Upload Error"));
      const resErr = await asyncUpdatePhoto(file)(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(userApi, "postUserPhoto").mockRejectedValueOnce("Upload Error");
      const resNonErrPhoto = await asyncUpdatePhoto(file)(dispatch);
      expect(resNonErrPhoto.message).toBe("Terjadi kesalahan");
    });
  });

  describe("asyncUpdatePassword", () => {
    it("should handle success and error", async () => {
      vi.spyOn(userApi, "putUserPassword").mockResolvedValueOnce({
        status: "success",
        message: "Password changed",
      });

      const dispatch = vi.fn();
      const res = await asyncUpdatePassword({ password: "old", new_password: "new" })(dispatch);
      expect(res.success).toBe(true);

      vi.spyOn(userApi, "putUserPassword").mockResolvedValueOnce({
        status: "fail",
        message: "Wrong password",
      });
      const resFail = await asyncUpdatePassword({ password: "old", new_password: "new" })(dispatch);
      expect(resFail.success).toBe(false);

      vi.spyOn(userApi, "putUserPassword").mockResolvedValueOnce({ status: "fail", message: "" });
      const resDefPw = await asyncUpdatePassword({ password: "old", new_password: "new" })(dispatch);
      expect(resDefPw.message).toBe("Gagal mengubah kata sandi");

      vi.spyOn(userApi, "putUserPassword").mockRejectedValueOnce(new Error("Net Error"));
      const resErr = await asyncUpdatePassword({ password: "old", new_password: "new" })(dispatch);
      expect(resErr.success).toBe(false);

      vi.spyOn(userApi, "putUserPassword").mockRejectedValueOnce("Net Error");
      const resNonErrPw = await asyncUpdatePassword({ password: "old", new_password: "new" })(dispatch);
      expect(resNonErrPw.message).toBe("Terjadi kesalahan");
    });
  });
});
