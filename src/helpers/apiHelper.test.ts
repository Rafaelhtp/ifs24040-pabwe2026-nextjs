import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  apiRequest,
  ACCESS_TOKEN_KEY,
} from "./apiHelper";

describe("apiHelper", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("Token Management", () => {
    it("should store and retrieve token", () => {
      expect(getAccessToken()).toBeNull();
      putAccessToken("token-123");
      expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("token-123");
      expect(getAccessToken()).toBe("token-123");
    });

    it("should remove token", () => {
      putAccessToken("token-123");
      removeAccessToken();
      expect(getAccessToken()).toBeNull();
    });

    it("should handle SSR when window is undefined", () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error test SSR
      delete globalThis.window;
      expect(getAccessToken()).toBeNull();
      putAccessToken("token");
      removeAccessToken();
      globalThis.window = originalWindow;
    });
  });

  describe("apiRequest", () => {
    it("should make GET request with default base URL", async () => {
      const mockData = { status: "success", message: "OK", data: {} };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const res = await apiRequest("/posts");
      expect(res).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/posts"),
        expect.anything()
      );
    });

    it("should handle full http url", async () => {
      const mockData = { status: "success", message: "OK" };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const res = await apiRequest("https://example.com/api/test");
      expect(res).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(
        "https://example.com/api/test",
        expect.anything()
      );
    });

    it("should append query params", async () => {
      const mockData = { status: "success", message: "OK" };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      await apiRequest("/posts", {
        params: { is_me: 1, filter: "active", ignored: undefined, empty: null },
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\?is_me=1&filter=active/),
        expect.anything()
      );
    });

    it("should attach Authorization header when token exists", async () => {
      putAccessToken("my-secret-token");
      const mockData = { status: "success", message: "OK" };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      await apiRequest("/posts");

      const calledHeaders = (fetch as any).mock.calls[0][1].headers;
      expect(calledHeaders.get("Authorization")).toBe("Bearer my-secret-token");
    });

    it("should serialize JSON body and set Content-Type", async () => {
      const mockData = { status: "success", message: "Created" };
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      await apiRequest("/posts", {
        method: "POST",
        body: { description: "Hello test" },
      });

      const calledHeaders = (fetch as any).mock.calls[0][1].headers;
      expect(calledHeaders.get("Content-Type")).toBe("application/json");
      expect((fetch as any).mock.calls[0][1].body).toBe(
        JSON.stringify({ description: "Hello test" })
      );
    });

    it("should support FormData and string bodies", async () => {
      const formData = new FormData();
      formData.append("key", "val");

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "success" }),
      } as Response);

      await apiRequest("/upload", { method: "POST", body: formData });
      expect((fetch as any).mock.calls[0][1].body).toBe(formData);

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "success" }),
      } as Response);

      await apiRequest("/raw", { method: "POST", body: "raw-string" });
      expect((fetch as any).mock.calls[1][1].body).toBe("raw-string");
    });

    it("should handle JSON parse error gracefully", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: false,
        statusText: "Internal Error",
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      const res = await apiRequest("/error");
      expect(res.status).toBe("error");
      expect(res.message).toBe("Internal Error");
    });

    it("should handle JSON parse error on ok response gracefully", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        statusText: "",
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      const res = await apiRequest("/empty");
      expect(res.status).toBe("success");
    });

    it("should format relative url without leading slash", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: "success" }),
      } as unknown as Response);

      await apiRequest("posts");
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/posts$/),
        expect.anything()
      );
    });

    it("should fallback message when statusText is empty on error", async () => {
      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
        ok: false,
        statusText: "",
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      const res = await apiRequest("/error");
      expect(res.status).toBe("error");
      expect(res.message).toBe("Terjadi kesalahan saat memproses data");
    });
  });
});
