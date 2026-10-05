import { describe, it, expect } from "vitest";
import authReducer, { initialAuthState } from "./reducer";
import { ActionType } from "@/types/action";

describe("authReducer", () => {
  it("should return initial state when called without state or action", () => {
    // @ts-expect-error test undefined action
    expect(authReducer(undefined, undefined)).toEqual(initialAuthState);
  });

  it("should return unchanged state for unknown action", () => {
    const state = authReducer(initialAuthState, { type: "UNKNOWN" });
    expect(state).toEqual(initialAuthState);
  });

  it("should handle AUTH_LOGIN_REQUEST", () => {
    const state = authReducer(initialAuthState, { type: ActionType.AUTH_LOGIN_REQUEST });
    expect(state.isAuthLogin).toBe(true);
    expect(state.isAuthLogout).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should handle AUTH_LOGIN_SUCCESS", () => {
    const user = { id: 1, name: "A", email: "a@b.com", photo: "", created_at: "", updated_at: "" };
    const state = authReducer(initialAuthState, {
      type: ActionType.AUTH_LOGIN_SUCCESS,
      payload: { user, token: "token-abc" },
    });
    expect(state.isAuthLogin).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.token).toBe("token-abc");
    expect(state.error).toBeNull();
  });

  it("should handle AUTH_LOGIN_FAIL", () => {
    const state = authReducer(
      { ...initialAuthState, isAuthLogin: true },
      { type: ActionType.AUTH_LOGIN_FAIL, payload: "Login gagal" }
    );
    expect(state.isAuthLogin).toBe(false);
    expect(state.error).toBe("Login gagal");
  });

  it("should handle AUTH_REGISTER_REQUEST", () => {
    const state = authReducer(initialAuthState, { type: ActionType.AUTH_REGISTER_REQUEST });
    expect(state.isAuthRegister).toBe(true);
    expect(state.error).toBeNull();
  });

  it("should handle AUTH_REGISTER_SUCCESS", () => {
    const state = authReducer(
      { ...initialAuthState, isAuthRegister: true },
      { type: ActionType.AUTH_REGISTER_SUCCESS }
    );
    expect(state.isAuthRegister).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should handle AUTH_REGISTER_FAIL", () => {
    const state = authReducer(
      { ...initialAuthState, isAuthRegister: true },
      { type: ActionType.AUTH_REGISTER_FAIL, payload: "Registrasi gagal" }
    );
    expect(state.isAuthRegister).toBe(false);
    expect(state.error).toBe("Registrasi gagal");
  });

  it("should handle AUTH_LOGOUT", () => {
    const state = authReducer(
      {
        ...initialAuthState,
        user: { id: 1 } as any,
        token: "tok",
      },
      { type: ActionType.AUTH_LOGOUT }
    );
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthLogout).toBe(true);
  });

  it("should handle SET_AUTH_USER", () => {
    const user = { id: 2, name: "B", email: "b@b.com", photo: "", created_at: "", updated_at: "" };
    const state = authReducer(initialAuthState, {
      type: ActionType.SET_AUTH_USER,
      payload: user,
    });
    expect(state.user).toEqual(user);
  });
});
