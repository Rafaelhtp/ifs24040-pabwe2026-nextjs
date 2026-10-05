import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import PostLayout from "./PostLayout";
import { renderWithProviders } from "@/test-utils";
import * as apiHelper from "@/helpers/apiHelper";
import * as userActions from "@/features/users/states/action";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("PostLayout", () => {
  const mockUser = {
    id: 1,
    name: "Rafael Hutapea",
    email: "rafael@delcom.org",
    photo: "",
    created_at: "",
    updated_at: "",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should redirect to /auth/login if no token", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValueOnce(null);

    renderWithProviders(
      <PostLayout>
        <div>Dashboard Child</div>
      </PostLayout>
    );

    expect(mockReplace).toHaveBeenCalledWith("/auth/login");
  });

  it("should render children directly if user already loaded in redux", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValueOnce("valid-token");

    renderWithProviders(
      <PostLayout>
        <div data-testid="dash-child">Dashboard Child</div>
      </PostLayout>,
      {
        preloadedState: {
          auth: {
            user: mockUser,
            token: "valid-token",
            isAuthLogin: false,
            isAuthRegister: false,
            isAuthLogout: false,
            error: null,
          },
        },
      }
    );

    expect(screen.getByTestId("dash-child")).toBeInTheDocument();
  });

  it("should load profile if user is not loaded in redux", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValueOnce("valid-token");
    vi.spyOn(userActions, "asyncSetProfile").mockReturnValue((() =>
      Promise.resolve({ success: true, user: mockUser })) as any);

    renderWithProviders(
      <PostLayout>
        <div data-testid="dash-child">Dashboard Child</div>
      </PostLayout>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: "valid-token",
            isAuthLogin: false,
            isAuthRegister: false,
            isAuthLogout: false,
            error: null,
          },
        },
      }
    );

    await waitFor(() => {
      expect(screen.getByTestId("dash-child")).toBeInTheDocument();
    });
  });

  it("should still render children if profile loading fails but token exists", async () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValueOnce("valid-token");
    vi.spyOn(userActions, "asyncSetProfile").mockReturnValue((() =>
      Promise.resolve({ success: false, message: "Server busy" })) as any);

    renderWithProviders(
      <PostLayout>
        <div data-testid="dash-child">Child</div>
      </PostLayout>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: "valid-token",
            isAuthLogin: false,
            isAuthRegister: false,
            isAuthLogout: false,
            error: null,
          },
        },
      }
    );

    await waitFor(() => {
      expect(screen.getByTestId("dash-child")).toBeInTheDocument();
    });
  });

  it("should open and close mobile sidebar", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValueOnce("valid-token");

    renderWithProviders(
      <PostLayout>
        <div>Child</div>
      </PostLayout>,
      {
        preloadedState: {
          auth: {
            user: mockUser,
            token: "valid-token",
            isAuthLogin: false,
            isAuthRegister: false,
            isAuthLogout: false,
            error: null,
          },
        },
      }
    );

    fireEvent.click(screen.getByLabelText("Buka menu navigasi"));
    expect(screen.getByText("Menu Utama")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Tutup menu"));
    expect(screen.queryByText("Menu Utama")).not.toBeInTheDocument();
  });
});
