import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import DashboardLayout from "./(dashboard)/layout";
import DashboardPage from "./(dashboard)/page";
import DetailPostPage from "./(dashboard)/posts/[postId]/page";
import UsersRoutePage from "./(dashboard)/users/page";
import ProfileRoutePage from "./(dashboard)/profile/page";
import AuthRouteLayout from "./auth/layout";
import LoginRoutePage from "./auth/login/page";
import RegisterRoutePage from "./auth/register/page";

vi.mock("@/features/posts/layouts/PostLayout", () => ({
  default: ({ children }: any) => <div data-testid="mock-post-layout">{children}</div>,
}));
vi.mock("@/features/posts/pages/HomePage", () => ({
  default: () => <div data-testid="mock-home-page" />,
}));
vi.mock("@/features/posts/pages/DetailPage", () => ({
  default: () => <div data-testid="mock-detail-page" />,
}));
vi.mock("@/features/users/pages/UsersPage", () => ({
  default: () => <div data-testid="mock-users-page" />,
}));
vi.mock("@/features/users/pages/ProfilePage", () => ({
  default: () => <div data-testid="mock-profile-page" />,
}));
vi.mock("@/features/auth/layouts/AuthLayout", () => ({
  default: ({ children }: any) => <div data-testid="mock-auth-layout">{children}</div>,
}));
vi.mock("@/features/auth/pages/LoginPage", () => ({
  default: () => <div data-testid="mock-login-page" />,
}));
vi.mock("@/features/auth/pages/RegisterPage", () => ({
  default: () => <div data-testid="mock-register-page" />,
}));

describe("App Router Route Components", () => {
  it("renders DashboardLayout", () => {
    const { getByTestId } = render(
      <DashboardLayout>
        <span>Content</span>
      </DashboardLayout>
    );
    expect(getByTestId("mock-post-layout")).toBeInTheDocument();
  });

  it("renders DashboardPage", () => {
    const { getByTestId } = render(<DashboardPage />);
    expect(getByTestId("mock-home-page")).toBeInTheDocument();
  });

  it("renders DetailPostPage", () => {
    const { getByTestId } = render(<DetailPostPage />);
    expect(getByTestId("mock-detail-page")).toBeInTheDocument();
  });

  it("renders UsersRoutePage", () => {
    const { getByTestId } = render(<UsersRoutePage />);
    expect(getByTestId("mock-users-page")).toBeInTheDocument();
  });

  it("renders ProfileRoutePage", () => {
    const { getByTestId } = render(<ProfileRoutePage />);
    expect(getByTestId("mock-profile-page")).toBeInTheDocument();
  });

  it("renders AuthRouteLayout", () => {
    const { getByTestId } = render(
      <AuthRouteLayout>
        <span>Content</span>
      </AuthRouteLayout>
    );
    expect(getByTestId("mock-auth-layout")).toBeInTheDocument();
  });

  it("renders LoginRoutePage", () => {
    const { getByTestId } = render(<LoginRoutePage />);
    expect(getByTestId("mock-login-page")).toBeInTheDocument();
  });

  it("renders RegisterRoutePage", () => {
    const { getByTestId } = render(<RegisterRoutePage />);
    expect(getByTestId("mock-register-page")).toBeInTheDocument();
  });
});
