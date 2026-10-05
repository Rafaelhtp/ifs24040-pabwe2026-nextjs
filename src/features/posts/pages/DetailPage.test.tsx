import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DetailPage from "./DetailPage";
import { renderWithProviders } from "@/test-utils";
import * as postActions from "../states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useParams: () => ({ postId: "10" }),
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/helpers/toolsHelper", async () => {
  const actual = await vi.importActual<typeof toolsHelper>("@/helpers/toolsHelper");
  return {
    ...actual,
    showConfirmDialog: vi.fn(),
    showSuccessDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
    showErrorDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
  };
});

describe("DetailPage", () => {
  const mockUser = {
    id: 1,
    name: "Rafael Hutapea",
    email: "rafael@delcom.org",
    photo: "",
    created_at: "",
    updated_at: "",
  };

  const mockPost = {
    id: 10,
    user_id: 1,
    cover: "https://example.com/cover.jpg",
    description: "Detail postingan tentang Delcom.",
    created_at: "2026-10-04T10:00:00Z",
    updated_at: "2026-10-04T10:00:00Z",
    author: {
      name: "Rafael Hutapea",
      photo: "https://example.com/avatar.jpg",
    },
    likes: [1],
    comments: [
      {
        id: 50,
        comment: "Komentar pertama saya",
        created_at: "2026-10-04T10:30:00Z",
        updated_at: "2026-10-04T10:30:00Z",
      },
    ],
    my_comment: {
      id: 50,
      comment: "Komentar pertama saya",
      created_at: "2026-10-04T10:30:00Z",
      updated_at: "2026-10-04T10:30:00Z",
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should show loading indicator when isPost is true and post is null", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        posts: {
          posts: [],
          post: null,
          isPost: true,
          isPostAdd: false,
          isPostAdded: false,
          isPostChange: false,
          isPostChanged: false,
          isPostChangeCover: false,
          isPostChangedCover: false,
          isPostDelete: false,
          isPostDeleted: false,
          isPostLike: false,
          isPostLiked: false,
          isPostAddComment: false,
          isPostAddedComment: false,
          isPostDeleteComment: false,
          isPostDeletedComment: false,
          isPostDeleteAll: false,
          isPostDeletedAll: false,
          error: null,
        },
      },
    });

    expect(screen.getByTestId("detail-loading")).toBeInTheDocument();
  });

  it("should show not found message if post is null and not loading", () => {
    vi.spyOn(postActions, "asyncSetPostDetail").mockReturnValue((() =>
      Promise.resolve({ success: false, message: "Not found" })) as any);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        posts: {
          posts: [],
          post: null,
          isPost: false,
          isPostAdd: false,
          isPostAdded: false,
          isPostChange: false,
          isPostChanged: false,
          isPostChangeCover: false,
          isPostChangedCover: false,
          isPostDelete: false,
          isPostDeleted: false,
          isPostLike: false,
          isPostLiked: false,
          isPostAddComment: false,
          isPostAddedComment: false,
          isPostDeleteComment: false,
          isPostDeletedComment: false,
          isPostDeleteAll: false,
          isPostDeletedAll: false,
          error: null,
        },
      },
    });

    expect(screen.getByText("Postingan Tidak Ditemukan")).toBeInTheDocument();
  });

  it("should render post detail, author info, and owner controls", () => {
    renderWithProviders(<DetailPage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: [],
          post: mockPost,
          isPost: false,
          isPostAdd: false,
          isPostAdded: false,
          isPostChange: false,
          isPostChanged: false,
          isPostChangeCover: false,
          isPostChangedCover: false,
          isPostDelete: false,
          isPostDeleted: false,
          isPostLike: false,
          isPostLiked: false,
          isPostAddComment: false,
          isPostAddedComment: false,
          isPostDeleteComment: false,
          isPostDeletedComment: false,
          isPostDeleteAll: false,
          isPostDeletedAll: false,
          error: null,
        },
      },
    });

    expect(screen.getByText("Detail postingan tentang Delcom.")).toBeInTheDocument();
    expect(screen.getByText("Sampul")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Hapus Postingan")).toBeInTheDocument();
    expect(screen.getByText("Hapus Komentar")).toBeInTheDocument();
  });

  it("should toggle like on like button click", async () => {
    const likeSpy = vi.spyOn(postActions, "asyncLikePost").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);
    vi.spyOn(postActions, "asyncSetPostDetail").mockReturnValue((() =>
      Promise.resolve({ success: true, post: mockPost })) as any);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: [],
          post: mockPost,
          isPost: false,
          isPostAdd: false,
          isPostAdded: false,
          isPostChange: false,
          isPostChanged: false,
          isPostChangeCover: false,
          isPostChangedCover: false,
          isPostDelete: false,
          isPostDeleted: false,
          isPostLike: false,
          isPostLiked: false,
          isPostAddComment: false,
          isPostAddedComment: false,
          isPostDeleteComment: false,
          isPostDeletedComment: false,
          isPostDeleteAll: false,
          isPostDeletedAll: false,
          error: null,
        },
      },
    });

    fireEvent.click(screen.getByText("1 Suka"));
    await waitFor(() => {
      expect(likeSpy).toHaveBeenCalledWith(10, { like: 0 });
    });
  });

  it("should validate and add comment", async () => {
    const addCommentSpy = vi.spyOn(postActions, "asyncAddComment").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);
    vi.spyOn(postActions, "asyncSetPostDetail").mockReturnValue((() =>
      Promise.resolve({ success: true, post: mockPost })) as any);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: [],
          post: mockPost,
          isPost: false,
          isPostAdd: false,
          isPostAdded: false,
          isPostChange: false,
          isPostChanged: false,
          isPostChangeCover: false,
          isPostChangedCover: false,
          isPostDelete: false,
          isPostDeleted: false,
          isPostLike: false,
          isPostLiked: false,
          isPostAddComment: false,
          isPostAddedComment: false,
          isPostDeleteComment: false,
          isPostDeletedComment: false,
          isPostDeleteAll: false,
          isPostDeletedAll: false,
          error: null,
        },
      },
    });

    const submitBtn = screen.getByText("Kirim Komentar");
    fireEvent.click(submitBtn);
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Komentar tidak boleh kosong");

    const input = screen.getByLabelText("Tulis Komentar");
    await userEvent.type(input, "Komentar baru");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(addCommentSpy).toHaveBeenCalledWith(10, { comment: "Komentar baru" });
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Komentar berhasil ditambahkan!");
    });
  });

  it("should handle delete comment", async () => {
    (toolsHelper.showConfirmDialog as any).mockResolvedValueOnce(true);
    const deleteCommentSpy = vi.spyOn(postActions, "asyncDeleteComment").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);
    vi.spyOn(postActions, "asyncSetPostDetail").mockReturnValue((() =>
      Promise.resolve({ success: true, post: mockPost })) as any);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: [],
          post: mockPost,
          isPost: false,
          isPostAdd: false,
          isPostAdded: false,
          isPostChange: false,
          isPostChanged: false,
          isPostChangeCover: false,
          isPostChangedCover: false,
          isPostDelete: false,
          isPostDeleted: false,
          isPostLike: false,
          isPostLiked: false,
          isPostAddComment: false,
          isPostAddedComment: false,
          isPostDeleteComment: false,
          isPostDeletedComment: false,
          isPostDeleteAll: false,
          isPostDeletedAll: false,
          error: null,
        },
      },
    });

    const deleteCommentBtn = screen.getByLabelText("Hapus komentar");
    fireEvent.click(deleteCommentBtn);

    await waitFor(() => {
      expect(deleteCommentSpy).toHaveBeenCalledWith(10);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Komentar berhasil dihapus!");
    });
  });

  it("should handle delete post", async () => {
    (toolsHelper.showConfirmDialog as any).mockResolvedValueOnce(true);
    const deletePostSpy = vi.spyOn(postActions, "asyncDeletePost").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: [],
          post: mockPost,
          isPost: false,
          isPostAdd: false,
          isPostAdded: false,
          isPostChange: false,
          isPostChanged: false,
          isPostChangeCover: false,
          isPostChangedCover: false,
          isPostDelete: false,
          isPostDeleted: false,
          isPostLike: false,
          isPostLiked: false,
          isPostAddComment: false,
          isPostAddedComment: false,
          isPostDeleteComment: false,
          isPostDeletedComment: false,
          isPostDeleteAll: false,
          isPostDeletedAll: false,
          error: null,
        },
      },
    });

    fireEvent.click(screen.getByText("Hapus Postingan"));

    await waitFor(() => {
      expect(deletePostSpy).toHaveBeenCalledWith(10);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Postingan berhasil dihapus!");
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("should handle delete comment failure", async () => {
    (toolsHelper.showConfirmDialog as any).mockResolvedValueOnce(true);
    vi.spyOn(postActions, "asyncDeleteComment").mockReturnValue((() =>
      Promise.resolve({ success: false, message: "Gagal hapus komentar" })) as any);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: [],
          post: mockPost,
          isPost: false,
          isPostAdd: false,
          isPostAdded: false,
          isPostChange: false,
          isPostChanged: false,
          isPostChangeCover: false,
          isPostChangedCover: false,
          isPostDelete: false,
          isPostDeleted: false,
          isPostLike: false,
          isPostLiked: false,
          isPostAddComment: false,
          isPostAddedComment: false,
          isPostDeleteComment: false,
          isPostDeletedComment: false,
          isPostDeleteAll: false,
          isPostDeletedAll: false,
          error: null,
        },
      },
    });

    fireEvent.click(screen.getByLabelText("Hapus komentar"));
    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Gagal hapus komentar");
    });

    (toolsHelper.showConfirmDialog as any).mockResolvedValueOnce(true);
    vi.spyOn(postActions, "asyncDeleteComment").mockReturnValue((() =>
      Promise.resolve({ success: false })) as any);

    fireEvent.click(screen.getByLabelText("Hapus komentar"));
    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Gagal menghapus komentar");
    });
  });

  it("should handle delete post failure", async () => {
    (toolsHelper.showConfirmDialog as any).mockResolvedValueOnce(true);
    vi.spyOn(postActions, "asyncDeletePost").mockReturnValue((() =>
      Promise.resolve({ success: false, message: "Gagal hapus post" })) as any);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: [],
          post: mockPost,
          isPost: false,
          isPostAdd: false,
          isPostAdded: false,
          isPostChange: false,
          isPostChanged: false,
          isPostChangeCover: false,
          isPostChangedCover: false,
          isPostDelete: false,
          isPostDeleted: false,
          isPostLike: false,
          isPostLiked: false,
          isPostAddComment: false,
          isPostAddedComment: false,
          isPostDeleteComment: false,
          isPostDeletedComment: false,
          isPostDeleteAll: false,
          isPostDeletedAll: false,
          error: null,
        },
      },
    });

    fireEvent.click(screen.getByText("Hapus Postingan"));
    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Gagal hapus post");
    });

    (toolsHelper.showConfirmDialog as any).mockResolvedValueOnce(true);
    vi.spyOn(postActions, "asyncDeletePost").mockReturnValue((() =>
      Promise.resolve({ success: false })) as any);

    fireEvent.click(screen.getByText("Hapus Postingan"));
    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Gagal menghapus postingan");
    });
  });

  it("should open edit and cover modals and handle their onSuccess/onClose callbacks", async () => {
    const detailSpy = vi.spyOn(postActions, "asyncSetPostDetail").mockReturnValue((() =>
      Promise.resolve({ success: true, post: mockPost })) as any);
    vi.spyOn(postActions, "asyncChangePost").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);
    vi.spyOn(postActions, "asyncChangeCoverPost").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);

    renderWithProviders(<DetailPage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: [],
          post: mockPost,
          isPost: false,
          isPostAdd: false,
          isPostAdded: false,
          isPostChange: false,
          isPostChanged: false,
          isPostChangeCover: false,
          isPostChangedCover: false,
          isPostDelete: false,
          isPostDeleted: false,
          isPostLike: false,
          isPostLiked: false,
          isPostAddComment: false,
          isPostAddedComment: false,
          isPostDeleteComment: false,
          isPostDeletedComment: false,
          isPostDeleteAll: false,
          isPostDeletedAll: false,
          error: null,
        },
      },
    });

    // Test Edit Modal
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Postingan")).toBeInTheDocument();

    const textarea = screen.getByLabelText("Deskripsi Postingan");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "Updated post content");
    fireEvent.click(screen.getByText("Simpan Perubahan"));

    await waitFor(() => {
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Postingan berhasil diperbarui!");
      expect(detailSpy).toHaveBeenCalled();
    });

    // Test Edit Modal Close
    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Batal"));
    expect(screen.queryByText("Edit Postingan")).not.toBeInTheDocument();

    // Test Cover Modal
    fireEvent.click(screen.getByText("Sampul"));
    expect(screen.getByText("Ubah Sampul Postingan")).toBeInTheDocument();

    const file = new File(["dummy"], "cover.png", { type: "image/png" });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(fileInput, file);

    fireEvent.click(screen.getByText("Unggah Sampul"));
    await waitFor(() => {
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Foto sampul berhasil diperbarui!");
      expect(detailSpy).toHaveBeenCalled();
    });

    // Test Cover Modal Close
    fireEvent.click(screen.getByText("Sampul"));
    fireEvent.click(screen.getByText("Batal"));
    expect(screen.queryByText("Ubah Sampul Postingan")).not.toBeInTheDocument();
  });
});
