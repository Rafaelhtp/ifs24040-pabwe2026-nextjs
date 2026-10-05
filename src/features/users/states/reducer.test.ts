import { describe, it, expect } from "vitest";
import usersReducer, { initialUsersState } from "./reducer";
import { ActionType } from "@/types/action";

describe("usersReducer", () => {
  it("should return initial state when called with undefined", () => {
    expect(usersReducer(undefined, undefined)).toEqual(initialUsersState);
    expect(usersReducer(initialUsersState, null as any)).toEqual(initialUsersState);
  });

  it("should return unchanged state for unknown action", () => {
    expect(usersReducer(initialUsersState, { type: "UNKNOWN" })).toEqual(initialUsersState);
  });

  it("should handle GET_USERS actions", () => {
    const s1 = usersReducer(initialUsersState, { type: ActionType.GET_USERS_REQUEST });
    expect(s1.isUsers).toBe(true);

    const users = [{ id: 1, name: "A", email: "a@b.com", photo: "", created_at: "", updated_at: "" }];
    const s2 = usersReducer(s1, { type: ActionType.GET_USERS_SUCCESS, payload: users });
    expect(s2.isUsers).toBe(false);
    expect(s2.users).toEqual(users);

    const s3 = usersReducer(s1, { type: ActionType.GET_USERS_FAIL, payload: "err" });
    expect(s3.isUsers).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle GET_PROFILE actions", () => {
    const s1 = usersReducer(initialUsersState, { type: ActionType.GET_PROFILE_REQUEST });
    expect(s1.isProfile).toBe(true);

    const user = { id: 1, name: "A", email: "a@b.com", photo: "", created_at: "", updated_at: "" };
    const s2 = usersReducer(s1, { type: ActionType.GET_PROFILE_SUCCESS, payload: user });
    expect(s2.isProfile).toBe(false);
    expect(s2.profile).toEqual(user);

    const s3 = usersReducer(s1, { type: ActionType.GET_PROFILE_FAIL, payload: "err" });
    expect(s3.isProfile).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle UPDATE_PROFILE actions", () => {
    const s1 = usersReducer(initialUsersState, { type: ActionType.UPDATE_PROFILE_REQUEST });
    expect(s1.isUpdateProfile).toBe(true);

    const user = { id: 1, name: "New", email: "a@b.com", photo: "", created_at: "", updated_at: "" };
    const s2 = usersReducer(s1, { type: ActionType.UPDATE_PROFILE_SUCCESS, payload: user });
    expect(s2.isUpdateProfile).toBe(false);
    expect(s2.profile).toEqual(user);

    const s3 = usersReducer(s1, { type: ActionType.UPDATE_PROFILE_FAIL, payload: "err" });
    expect(s3.isUpdateProfile).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle UPDATE_PHOTO actions", () => {
    const s1 = usersReducer(initialUsersState, { type: ActionType.UPDATE_PHOTO_REQUEST });
    expect(s1.isUpdatePhoto).toBe(true);

    const user = { id: 1, name: "A", email: "a@b.com", photo: "new.png", created_at: "", updated_at: "" };
    const s2 = usersReducer(s1, { type: ActionType.UPDATE_PHOTO_SUCCESS, payload: user });
    expect(s2.isUpdatePhoto).toBe(false);
    expect(s2.profile).toEqual(user);

    const s3 = usersReducer(s1, { type: ActionType.UPDATE_PHOTO_FAIL, payload: "err" });
    expect(s3.isUpdatePhoto).toBe(false);
    expect(s3.error).toBe("err");
  });

  it("should handle UPDATE_PASSWORD actions", () => {
    const s1 = usersReducer(initialUsersState, { type: ActionType.UPDATE_PASSWORD_REQUEST });
    expect(s1.isUpdatePassword).toBe(true);

    const s2 = usersReducer(s1, { type: ActionType.UPDATE_PASSWORD_SUCCESS });
    expect(s2.isUpdatePassword).toBe(false);

    const s3 = usersReducer(s1, { type: ActionType.UPDATE_PASSWORD_FAIL, payload: "err" });
    expect(s3.isUpdatePassword).toBe(false);
    expect(s3.error).toBe("err");
  });
});
