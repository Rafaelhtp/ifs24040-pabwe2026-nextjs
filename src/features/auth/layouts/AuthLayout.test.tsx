import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import AuthLayout from "./AuthLayout";
import * as apiHelper from "@/helpers/apiHelper";
import { renderWithProviders } from "@/test-utils";

const mockReplace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
  }),
}));

describe("AuthLayout", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should redirect to / if already authenticated with token", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValueOnce("existing-token");

    renderWithProviders(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );

    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("should render children if not authenticated", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValueOnce(null);

    renderWithProviders(
      <AuthLayout>
        <div data-testid="auth-child">Auth Child Content</div>
      </AuthLayout>
    );

    expect(screen.getByTestId("auth-child")).toBeInTheDocument();
  });
});
