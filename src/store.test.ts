import { describe, it, expect } from "vitest";
import { store, setupStore } from "./store";

describe("store", () => {
  it("should have initial state for auth, users, and posts", () => {
    const state = store.getState();
    expect(state.auth).toBeDefined();
    expect(state.users).toBeDefined();
    expect(state.posts).toBeDefined();
  });

  it("setupStore should accept preloaded state", () => {
    const customStore = setupStore({
      auth: {
        user: {
          id: 1,
          name: "John",
          email: "john@delcom.org",
          photo: "",
          created_at: "",
          updated_at: "",
        },
        token: "xyz",
        isAuthLogin: false,
        isAuthRegister: false,
        isAuthLogout: false,
        error: null,
      },
    });

    expect(customStore.getState().auth.user?.name).toBe("John");
  });
});
