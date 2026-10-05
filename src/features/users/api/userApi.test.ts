import { describe, it, expect, vi } from "vitest";
import * as apiHelper from "@/helpers/apiHelper";
import {
  getUsers,
  getUserProfile,
  putUserProfile,
  postUserPhoto,
  putUserPassword,
} from "./userApi";

describe("userApi", () => {
  it("getUsers should call apiRequest with /users GET", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
      data: { users: [] },
    });

    const res = await getUsers();
    expect(spy).toHaveBeenCalledWith("/users", { method: "GET" });
    expect(res.status).toBe("success");
  });

  it("getUserProfile should call apiRequest with /users/me GET", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
      data: { user: {} as any },
    });

    const res = await getUserProfile();
    expect(spy).toHaveBeenCalledWith("/users/me", { method: "GET" });
    expect(res.status).toBe("success");
  });

  it("putUserProfile should call apiRequest with /users/me PUT", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
      data: { user: {} as any },
    });

    const res = await putUserProfile({ name: "New Name", email: "new@delcom.org" });
    expect(spy).toHaveBeenCalledWith("/users/me", {
      method: "PUT",
      body: { name: "New Name", email: "new@delcom.org" },
    });
    expect(res.status).toBe("success");
  });

  it("postUserPhoto should call apiRequest with /users/me/photo POST and FormData", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
      data: { user: {} as any },
    });

    const file = new File(["dummy content"], "photo.png", { type: "image/png" });
    const res = await postUserPhoto(file);

    expect(spy).toHaveBeenCalledWith(
      "/users/me/photo",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      })
    );
    expect(res.status).toBe("success");
  });

  it("putUserPassword should call apiRequest with /users/password PUT", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
    });

    const res = await putUserPassword({
      password: "oldPassword",
      new_password: "newPassword",
    });
    expect(spy).toHaveBeenCalledWith("/users/password", {
      method: "PUT",
      body: { password: "oldPassword", new_password: "newPassword" },
    });
    expect(res.status).toBe("success");
  });
});
