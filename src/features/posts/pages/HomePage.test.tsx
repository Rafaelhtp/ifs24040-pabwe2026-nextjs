import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./HomePage";
import { renderWithProviders } from "@/test-utils";
import * as postActions from "../states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
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

describe("HomePage", () => {
  const mockUser = {
    id: 1,
    name: "Rafael Hutapea",
    email: "rafael@delcom.org",
    photo: "",
    created_at: "",
    updated_at: "",
  };

  const mockPosts = [
    {
      id: 101,
      user_id: 1,
      cover: "https://example.com/cover1.jpg",
      description: "Pertama kali mencoba Delcom Posts!",
      created_at: "2026-10-04T10:00:00Z",
      updated_at: "2026-10-04T10:00:00Z",
      author: {
        name: "Rafael Hutapea",
        photo: "https://example.com/avatar.jpg",
      },
      likes: [1],
      comments: [{ id: 1, comment: "Mantap", created_at: "", updated_at: "" }],
    },
    {
      id: 102,
      user_id: 2,
      cover: null,
      description: "Diskusi seputar tugas PABWE.",
      created_at: "2026-10-04T11:00:00Z",
      updated_at: "2026-10-04T11:00:00Z",
      author: {
        name: "Budi Siregar",
        photo: "",
      },
      likes: [],
      comments: [],
    },
  ];

  beforeEach(() => {
    mockSearchParams = new URLSearchParams();
    vi.restoreAllMocks();
  });

  it("should render posts list and tabs", () => {
    vi.spyOn(postActions, "asyncSetPosts").mockReturnValue((() =>
      Promise.resolve({ success: true, posts: mockPosts })) as any);

    renderWithProviders(<HomePage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: mockPosts,
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

    expect(screen.getByText("Pertama kali mencoba Delcom Posts!")).toBeInTheDocument();
    expect(screen.getByText("Diskusi seputar tugas PABWE.")).toBeInTheDocument();
  });

  it("should switch tabs to 'my' and 'all'", () => {
    const setPostsSpy = vi.spyOn(postActions, "asyncSetPosts").mockReturnValue((() =>
      Promise.resolve({ success: true, posts: mockPosts })) as any);

    renderWithProviders(<HomePage />);

    fireEvent.click(screen.getByText("Postingan Saya"));
    expect(mockPush).toHaveBeenCalledWith("/?filter=my");

    fireEvent.click(screen.getByText("Semua Postingan"));
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should handle like toggle", async () => {
    const likeSpy = vi.spyOn(postActions, "asyncLikePost").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);
    vi.spyOn(postActions, "asyncSetPosts").mockReturnValue((() =>
      Promise.resolve({ success: true, posts: mockPosts })) as any);

    renderWithProviders(<HomePage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: mockPosts,
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

    // Post 101 is already liked (likes: [1]), clicking should unlike (like: 0)
    fireEvent.click(screen.getByLabelText("Batal suka"));
    await waitFor(() => {
      expect(likeSpy).toHaveBeenCalledWith(101, { like: 0 });
    });

    // Post 102 is not liked (likes: []), clicking should like (like: 1)
    fireEvent.click(screen.getByLabelText("Sukai"));
    await waitFor(() => {
      expect(likeSpy).toHaveBeenCalledWith(102, { like: 1 });
    });
  });

  it("should filter posts with search bar", async () => {
    renderWithProviders(<HomePage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: mockPosts,
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

    const searchInput = screen.getByPlaceholderText("Cari postingan atau penulis...");
    await userEvent.type(searchInput, "PABWE");

    expect(screen.getByText("Diskusi seputar tugas PABWE.")).toBeInTheDocument();
    expect(screen.queryByText("Pertama kali mencoba Delcom Posts!")).not.toBeInTheDocument();
  });

  it("should handle delete all posts flow", async () => {
    mockSearchParams = new URLSearchParams("filter=my");
    (toolsHelper.showConfirmDialog as any).mockResolvedValueOnce(true);
    const deleteSpy = vi.spyOn(postActions, "asyncDeleteAllPosts").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);
    vi.spyOn(postActions, "asyncSetPosts").mockReturnValue((() =>
      Promise.resolve({ success: true, posts: [] })) as any);

    renderWithProviders(<HomePage />, {
      preloadedState: {
        auth: { user: mockUser, token: "tok", isAuthLogin: false, isAuthRegister: false, isAuthLogout: false, error: null },
        posts: {
          posts: [mockPosts[0]],
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

    const delAllBtn = screen.getByText("Hapus Semua");
    fireEvent.click(delAllBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalled();
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Semua postingan berhasil dihapus");
    });
  });

  it("should open and close Add Modal", () => {
    renderWithProviders(<HomePage />);

    fireEvent.click(screen.getByText("Buat Postingan"));
    expect(screen.getByText("Buat Postingan Baru")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Batal"));
    expect(screen.queryByText("Buat Postingan Baru")).not.toBeInTheDocument();
  });

  it("should show loading state when isPost is true and posts is empty", () => {
    renderWithProviders(<HomePage />, {
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

    expect(screen.getByTestId("posts-loading")).toBeInTheDocument();
  });
});
