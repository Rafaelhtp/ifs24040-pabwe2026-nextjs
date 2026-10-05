import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authApi from "../api/authApi";
import * as apiHelper from "@/helpers/apiHelper";
import {
  authLoginRequestAction,
  authLoginSuccessAction,
  authLoginFailAction,
  authRegisterRequestAction,
  authRegisterSuccessAction,
  authRegisterFailAction,
  authLogoutAction,
  setAuthUserAction,
  asyncSetIsAuthLogin,
  asyncSetIsAuthRegister,
  asyncSetIsAuthLogout,
} from "./action";
import { ActionType } from "@/types/action";

describe("auth actions and thunks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("action creators", () => {
    it("should create expected actions", () => {
      expect(authLoginRequestAction()).toEqual({ type: ActionType.AUTH_LOGIN_REQUEST });
      expect(authLoginSuccessAction({ user: {} as any, token: "tok" })).toEqual({
        type: ActionType.AUTH_LOGIN_SUCCESS,
        payload: { user: {} as any, token: "tok" },
      });
      expect(authLoginFailAction("err")).toEqual({
        type: ActionType.AUTH_LOGIN_FAIL,
        payload: "err",
      });
      expect(authRegisterRequestAction()).toEqual({ type: ActionType.AUTH_REGISTER_REQUEST });
      expect(authRegisterSuccessAction()).toEqual({ type: ActionType.AUTH_REGISTER_SUCCESS });
      expect(authRegisterFailAction("err")).toEqual({
        type: ActionType.AUTH_REGISTER_FAIL,
        payload: "err",
      });
      expect(authLogoutAction()).toEqual({ type: ActionType.AUTH_LOGOUT });
      expect(setAuthUserAction(null)).toEqual({
        type: ActionType.SET_AUTH_USER,
        payload: null,
      });
    });
  });

  describe("asyncSetIsAuthLogin", () => {
    it("should dispatch success and store token on successful login", async () => {
      const mockData = {
        user: { id: 1, name: "A", email: "a@b.com", photo: "", created_at: "", updated_at: "" },
        token: "jwt-token",
      };
      vi.spyOn(authApi, "postLogin").mockResolvedValueOnce({
        status: "success",
        message: "OK",
        data: mockData,
      });
      const putTokenSpy = vi.spyOn(apiHelper, "putAccessToken").mockImplementation(() => {});

      const dispatch = vi.fn();
      const result = await asyncSetIsAuthLogin({ email: "a@b.com", password: "123" })(dispatch);

      expect(dispatch).toHaveBeenCalledWith(authLoginRequestAction());
      expect(putTokenSpy).toHaveBeenCalledWith("jwt-token");
      expect(dispatch).toHaveBeenCalledWith(authLoginSuccessAction(mockData));
      expect(result).toEqual({ success: true, message: "OK" });
    });

    it("should dispatch fail when status is fail", async () => {
      vi.spyOn(authApi, "postLogin").mockResolvedValueOnce({
        status: "fail",
        message: "Kredensial salah",
      });

      const dispatch = vi.fn();
      const result = await asyncSetIsAuthLogin({ email: "a@b.com", password: "123" })(dispatch);

      expect(dispatch).toHaveBeenCalledWith(authLoginRequestAction());
      expect(dispatch).toHaveBeenCalledWith(authLoginFailAction("Kredensial salah"));
      expect(result).toEqual({ success: false, message: "Kredensial salah" });
    });

    it("should handle error rejection", async () => {
      vi.spyOn(authApi, "postLogin").mockRejectedValueOnce(new Error("Network Error"));

      const dispatch = vi.fn();
      const result = await asyncSetIsAuthLogin({ email: "a@b.com", password: "123" })(dispatch);

      expect(dispatch).toHaveBeenCalledWith(authLoginFailAction("Network Error"));
      expect(result).toEqual({ success: false, message: "Network Error" });
    });
  });

  describe("asyncSetIsAuthRegister", () => {
    it("should dispatch success on successful registration", async () => {
      vi.spyOn(authApi, "postRegister").mockResolvedValueOnce({
        status: "success",
        message: "Berhasil",
      });

      const dispatch = vi.fn();
      const result = await asyncSetIsAuthRegister({
        name: "A",
        email: "a@b.com",
        password: "123",
      })(dispatch);

      expect(dispatch).toHaveBeenCalledWith(authRegisterRequestAction());
      expect(dispatch).toHaveBeenCalledWith(authRegisterSuccessAction());
      expect(result).toEqual({ success: true, message: "Berhasil" });
    });

    it("should dispatch fail on failed registration", async () => {
      vi.spyOn(authApi, "postRegister").mockResolvedValueOnce({
        status: "fail",
        message: "Email sudah terdaftar",
      });

      const dispatch = vi.fn();
      const result = await asyncSetIsAuthRegister({
        name: "A",
        email: "a@b.com",
        password: "123",
      })(dispatch);

      expect(dispatch).toHaveBeenCalledWith(authRegisterFailAction("Email sudah terdaftar"));
      expect(result).toEqual({ success: false, message: "Email sudah terdaftar" });
    });

    it("should handle rejection during registration", async () => {
      vi.spyOn(authApi, "postRegister").mockRejectedValueOnce(new Error("Timeout"));

      const dispatch = vi.fn();
      const result = await asyncSetIsAuthRegister({
        name: "A",
        email: "a@b.com",
        password: "123",
      })(dispatch);

      expect(dispatch).toHaveBeenCalledWith(authRegisterFailAction("Timeout"));
      expect(result).toEqual({ success: false, message: "Timeout" });
    });
  });

  describe("asyncSetIsAuthLogout", () => {
    it("should remove token and dispatch logout action", async () => {
      const removeTokenSpy = vi.spyOn(apiHelper, "removeAccessToken").mockImplementation(() => {});
      const dispatch = vi.fn();

      await asyncSetIsAuthLogout()(dispatch);

      expect(removeTokenSpy).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(authLogoutAction());
    });
  });
});
