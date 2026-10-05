import { describe, it, expect, vi } from "vitest";
import * as apiHelper from "@/helpers/apiHelper";
import {
  getPosts,
  getPostDetail,
  postPost,
  putPost,
  postPostCover,
  deletePost,
  postPostLike,
  postPostComment,
  deletePostComment,
  deleteAllPosts,
} from "./postApi";

describe("postApi", () => {
  it("getPosts should call apiRequest with /posts and params", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
      data: { posts: [] },
    });

    const res = await getPosts({ is_me: 1 });
    expect(spy).toHaveBeenCalledWith("/posts", {
      method: "GET",
      params: { is_me: 1 },
    });
    expect(res.status).toBe("success");
  });

  it("getPostDetail should call apiRequest with /posts/:id GET", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
      data: { post: {} as any },
    });

    const res = await getPostDetail(10);
    expect(spy).toHaveBeenCalledWith("/posts/10", { method: "GET" });
    expect(res.status).toBe("success");
  });

  it("postPost should call apiRequest with /posts POST", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
      data: { post: {} as any },
    });

    const res = await postPost({ description: "Desc" });
    expect(spy).toHaveBeenCalledWith("/posts", {
      method: "POST",
      body: { description: "Desc" },
    });
    expect(res.status).toBe("success");
  });

  it("putPost should call apiRequest with /posts/:id PUT", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
      data: { post: {} as any },
    });

    const res = await putPost(10, { description: "New Desc" });
    expect(spy).toHaveBeenCalledWith("/posts/10", {
      method: "PUT",
      body: { description: "New Desc" },
    });
    expect(res.status).toBe("success");
  });

  it("postPostCover should call apiRequest with FormData", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
      data: { post: {} as any },
    });

    const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
    const res = await postPostCover(10, file);
    expect(spy).toHaveBeenCalledWith(
      "/posts/10/cover",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      })
    );
    expect(res.status).toBe("success");
  });

  it("deletePost should call apiRequest with /posts/:id DELETE", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
    });

    const res = await deletePost(10);
    expect(spy).toHaveBeenCalledWith("/posts/10", { method: "DELETE" });
    expect(res.status).toBe("success");
  });

  it("postPostLike should call apiRequest with /posts/:id/likes POST", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
    });

    const res = await postPostLike(10, { like: 1 });
    expect(spy).toHaveBeenCalledWith("/posts/10/likes", {
      method: "POST",
      body: { like: 1 },
    });
    expect(res.status).toBe("success");
  });

  it("postPostComment should call apiRequest with /posts/:id/comments POST", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
    });

    const res = await postPostComment(10, { comment: "Nice" });
    expect(spy).toHaveBeenCalledWith("/posts/10/comments", {
      method: "POST",
      body: { comment: "Nice" },
    });
    expect(res.status).toBe("success");
  });

  it("deletePostComment should call apiRequest with /posts/:id/comments DELETE", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
    });

    const res = await deletePostComment(10);
    expect(spy).toHaveBeenCalledWith("/posts/10/comments", { method: "DELETE" });
    expect(res.status).toBe("success");
  });

  it("deleteAllPosts should call apiRequest with /posts DELETE", async () => {
    const spy = vi.spyOn(apiHelper, "apiRequest").mockResolvedValueOnce({
      status: "success",
      message: "OK",
    });

    const res = await deleteAllPosts();
    expect(spy).toHaveBeenCalledWith("/posts", { method: "DELETE" });
    expect(res.status).toBe("success");
  });
});
