import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UsersPage from "./UsersPage";
import { renderWithProviders } from "@/test-utils";
import * as userActions from "../states/action";

describe("UsersPage", () => {
  const mockUsers = [
    {
      id: 1,
      name: "Rafael Hutapea",
      email: "rafael@delcom.org",
      photo: "https://example.com/photo.png",
      created_at: "2026-10-01T10:00:00Z",
      updated_at: "2026-10-01T10:00:00Z",
    },
    {
      id: 2,
      name: "Budi Siregar",
      email: "budi@delcom.org",
      photo: "",
      created_at: "2026-10-02T10:00:00Z",
      updated_at: "2026-10-02T10:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch users on mount and display them", () => {
    const spy = vi.spyOn(userActions, "asyncSetUsers").mockReturnValue((() =>
      Promise.resolve({ success: true, users: mockUsers })) as any);

    renderWithProviders(<UsersPage />, {
      preloadedState: {
        users: {
          users: mockUsers,
          profile: null,
          isUsers: false,
          isProfile: false,
          isUpdateProfile: false,
          isUpdatePhoto: false,
          isUpdatePassword: false,
          error: null,
        },
      },
    });

    expect(spy).toHaveBeenCalled();
    expect(screen.getByText("Rafael Hutapea")).toBeInTheDocument();
    expect(screen.getByText("Budi Siregar")).toBeInTheDocument();
  });

  it("should filter users with search input", async () => {
    renderWithProviders(<UsersPage />, {
      preloadedState: {
        users: {
          users: mockUsers,
          profile: null,
          isUsers: false,
          isProfile: false,
          isUpdateProfile: false,
          isUpdatePhoto: false,
          isUpdatePassword: false,
          error: null,
        },
      },
    });

    const searchInput = screen.getByPlaceholderText("Cari nama atau email...");
    await userEvent.type(searchInput, "Rafael");

    expect(screen.getByText("Rafael Hutapea")).toBeInTheDocument();
    expect(screen.queryByText("Budi Siregar")).not.toBeInTheDocument();

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "nonexistent");
    expect(screen.getByText("Pengguna Tidak Ditemukan")).toBeInTheDocument();
  });

  it("should show loading indicator when isUsers is true and users is empty", () => {
    renderWithProviders(<UsersPage />, {
      preloadedState: {
        users: {
          users: [],
          profile: null,
          isUsers: true,
          isProfile: false,
          isUpdateProfile: false,
          isUpdatePhoto: false,
          isUpdatePassword: false,
          error: null,
        },
      },
    });

    expect(screen.getByTestId("users-loading")).toBeInTheDocument();
  });
});
