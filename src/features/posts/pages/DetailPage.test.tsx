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

  it("should open edit and cover modals", () => {
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

    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByText("Edit Postingan")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Sampul"));
    expect(screen.getByText("Ubah Sampul Postingan")).toBeInTheDocument();
  });
});
