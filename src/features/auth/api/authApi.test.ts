import { describe, it, expect, vi } from "vitest";
import * as apiHelper from "@/helpers/apiHelper";
import { postLogin, postRegister } from "./authApi";

describe("authApi", () => {
  it("postLogin should call apiRequest with /auth/login POST", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "Berhasil login",
      data: {
        user: { id: 1, name: "A", email: "a@b.com", photo: "", created_at: "", updated_at: "" },
        token: "token123",
      },
    });

    const res = await postLogin({ email: "a@b.com", password: "123" });
    expect(spy).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: { email: "a@b.com", password: "123" },
    });
    expect(res.status).toBe("success");
  });

  it("postRegister should call apiRequest with /auth/register POST", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "Berhasil daftar",
      data: { message: "ok" },
    });

    const res = await postRegister({ name: "A", email: "a@b.com", password: "123" });
    expect(spy).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: { name: "A", email: "a@b.com", password: "123" },
    });
    expect(res.status).toBe("success");
  });
});
