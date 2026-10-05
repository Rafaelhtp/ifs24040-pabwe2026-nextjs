import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import NavbarComponent from "./NavbarComponent";
import { renderWithProviders } from "@/test-utils";
import * as authActions from "@/features/auth/states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/helpers/toolsHelper", () => ({
  showConfirmDialog: vi.fn(),
}));

describe("NavbarComponent", () => {
  const mockUser = {
    id: 1,
    name: "Rafael Hutapea",
    email: "rafael@delcom.org",
    photo: "https://example.com/avatar.jpg",
    created_at: "2026-10-01T10:00:00Z",
    updated_at: "2026-10-01T10:00:00Z",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render user info and logo", () => {
    renderWithProviders(<NavbarComponent />, {
      preloadedState: {
        auth: {
          user: mockUser,
          token: "token",
          isAuthLogin: false,
          isAuthRegister: false,
          isAuthLogout: false,
          error: null,
        },
      },
    });

    expect(screen.getByText("Delcom Posts")).toBeInTheDocument();
    expect(screen.getByText("Rafael Hutapea")).toBeInTheDocument();
  });

  it("should render user initials when photo is absent", () => {
    renderWithProviders(<NavbarComponent />, {
      preloadedState: {
        auth: {
          user: { ...mockUser, photo: "" },
          token: "token",
          isAuthLogin: false,
          isAuthRegister: false,
          isAuthLogout: false,
          error: null,
        },
      },
    });

    expect(screen.getByText("RA")).toBeInTheDocument();
  });

  it("should call onToggleSidebar when mobile menu button clicked", () => {
    const onToggle = vi.fn();
    renderWithProviders(<NavbarComponent onToggleSidebar={onToggle} />);

    fireEvent.click(screen.getByLabelText("Buka menu navigasi"));
    expect(onToggle).toHaveBeenCalled();
  });

  it("should toggle dropdown menu and navigate to profile", () => {
    renderWithProviders(<NavbarComponent />, {
      preloadedState: {
        auth: {
          user: mockUser,
          token: "token",
          isAuthLogin: false,
          isAuthRegister: false,
          isAuthLogout: false,
          error: null,
        },
      },
    });

    const menuBtn = document.querySelector("#user-menu-button")!;
    fireEvent.click(menuBtn);

    const profileLink = screen.getByText("Profil Saya");
    expect(profileLink).toBeInTheDocument();

    fireEvent.click(profileLink);
    expect(screen.queryByText("Profil Saya")).not.toBeInTheDocument();
  });

  it("should handle logout flow when confirmed", async () => {
    (toolsHelper.showConfirmDialog as any).mockResolvedValueOnce(true);
    const logoutSpy = vi.spyOn(authActions, "asyncSetIsAuthLogout").mockReturnValue((() =>
      Promise.resolve()) as any);

    renderWithProviders(<NavbarComponent />, {
      preloadedState: {
        auth: {
          user: mockUser,
          token: "token",
          isAuthLogin: false,
          isAuthRegister: false,
          isAuthLogout: false,
          error: null,
        },
      },
    });

    fireEvent.click(document.querySelector("#user-menu-button")!);
    fireEvent.click(screen.getByText("Keluar"));

    await waitFor(() => {
      expect(logoutSpy).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("should cancel logout flow when user declines", async () => {
    (toolsHelper.showConfirmDialog as any).mockResolvedValueOnce(false);
    const logoutSpy = vi.spyOn(authActions, "asyncSetIsAuthLogout");

    renderWithProviders(<NavbarComponent />, {
      preloadedState: {
        auth: {
          user: mockUser,
          token: "token",
          isAuthLogin: false,
          isAuthRegister: false,
          isAuthLogout: false,
          error: null,
        },
      },
    });

    fireEvent.click(document.querySelector("#user-menu-button")!);
    fireEvent.click(screen.getByText("Keluar"));

    expect(logoutSpy).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
