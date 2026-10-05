import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";
import { renderWithProviders } from "@/test-utils";
import * as authAction from "../states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
}));

vi.mock("@/helpers/toolsHelper", async () => {
  const actual = await vi.importActual<typeof toolsHelper>("@/helpers/toolsHelper");
  return {
    ...actual,
    showSuccessDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
    showErrorDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should render required selectors", () => {
    renderWithProviders(<LoginPage />);

    expect(document.querySelector("#login-email-input")).toBeInTheDocument();
    expect(document.querySelector("#login-password-input")).toBeInTheDocument();
    expect(document.querySelector("#login-submit-button")).toBeInTheDocument();
  });

  it("should validate empty email", async () => {
    renderWithProviders(<LoginPage />);

    fireEvent.click(document.querySelector("#login-submit-button")!);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Email wajib diisi");
    expect(await screen.findByRole("alert")).toHaveTextContent("Email wajib diisi");
  });

  it("should validate empty password", async () => {
    renderWithProviders(<LoginPage />);

    const emailInput = document.querySelector("#login-email-input")!;
    await userEvent.type(emailInput, "test@delcom.org");

    fireEvent.click(document.querySelector("#login-submit-button")!);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Kata sandi wajib diisi");
    expect(await screen.findByRole("alert")).toHaveTextContent("Kata sandi wajib diisi");
  });

  it("should handle successful login and redirect", async () => {
    vi.spyOn(authAction, "asyncSetIsAuthLogin").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);

    renderWithProviders(<LoginPage />);

    await userEvent.type(document.querySelector("#login-email-input")!, "user@delcom.org");
    await userEvent.type(document.querySelector("#login-password-input")!, "password123");

    fireEvent.click(document.querySelector("#login-submit-button")!);

    await waitFor(() => {
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("should handle failed login", async () => {
    vi.spyOn(authAction, "asyncSetIsAuthLogin").mockReturnValue((() =>
      Promise.resolve({ success: false, message: "Email atau kata sandi salah" })) as any);

    renderWithProviders(<LoginPage />);

    await userEvent.type(document.querySelector("#login-email-input")!, "user@delcom.org");
    await userEvent.type(document.querySelector("#login-password-input")!, "wrongpassword");

    fireEvent.click(document.querySelector("#login-submit-button")!);

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Email atau kata sandi salah");
      expect(screen.getByRole("alert")).toHaveTextContent("Email atau kata sandi salah");
    });
  });

  it("should show loading state when isAuthLogin is true", () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthLogin: true,
          isAuthRegister: false,
          isAuthLogout: false,
          error: null,
        },
      },
    });

    const submitBtn = document.querySelector("#login-submit-button")!;
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent("Memproses...");
  });
});
