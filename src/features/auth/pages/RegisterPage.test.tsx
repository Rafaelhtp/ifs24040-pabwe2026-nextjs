import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "./RegisterPage";
import { renderWithProviders } from "@/test-utils";
import * as authAction from "../states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
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

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should validate empty name", async () => {
    renderWithProviders(<RegisterPage />);

    fireEvent.click(document.querySelector("#register-submit-button")!);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Nama lengkap wajib diisi");
    expect(await screen.findByRole("alert")).toHaveTextContent("Nama lengkap wajib diisi");
  });

  it("should validate empty email", async () => {
    renderWithProviders(<RegisterPage />);

    await userEvent.type(document.querySelector("#register-name-input")!, "Rafael Hutapea");
    fireEvent.click(document.querySelector("#register-submit-button")!);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Email wajib diisi");
  });

  it("should validate empty password", async () => {
    renderWithProviders(<RegisterPage />);

    await userEvent.type(document.querySelector("#register-name-input")!, "Rafael Hutapea");
    await userEvent.type(document.querySelector("#register-email-input")!, "rafael@delcom.org");
    fireEvent.click(document.querySelector("#register-submit-button")!);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Kata sandi wajib diisi");
  });

  it("should validate password length less than 6", async () => {
    renderWithProviders(<RegisterPage />);

    await userEvent.type(document.querySelector("#register-name-input")!, "Rafael Hutapea");
    await userEvent.type(document.querySelector("#register-email-input")!, "rafael@delcom.org");
    await userEvent.type(document.querySelector("#register-password-input")!, "123");
    fireEvent.click(document.querySelector("#register-submit-button")!);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Kata sandi minimal 6 karakter");
  });

  it("should validate mismatched passwords", async () => {
    renderWithProviders(<RegisterPage />);

    await userEvent.type(document.querySelector("#register-name-input")!, "Rafael Hutapea");
    await userEvent.type(document.querySelector("#register-email-input")!, "rafael@delcom.org");
    await userEvent.type(document.querySelector("#register-password-input")!, "123456");
    await userEvent.type(document.querySelector("#register-confirm-password-input")!, "654321");
    fireEvent.click(document.querySelector("#register-submit-button")!);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Konfirmasi kata sandi tidak cocok");
  });

  it("should handle successful registration", async () => {
    vi.spyOn(authAction, "asyncSetIsAuthRegister").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);

    renderWithProviders(<RegisterPage />);

    await userEvent.type(document.querySelector("#register-name-input")!, "Rafael Hutapea");
    await userEvent.type(document.querySelector("#register-email-input")!, "rafael@delcom.org");
    await userEvent.type(document.querySelector("#register-password-input")!, "password123");
    await userEvent.type(document.querySelector("#register-confirm-password-input")!, "password123");
    fireEvent.click(document.querySelector("#register-submit-button")!);

    await waitFor(() => {
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("should handle failed registration", async () => {
    vi.spyOn(authAction, "asyncSetIsAuthRegister").mockReturnValue((() =>
      Promise.resolve({ success: false, message: "Email sudah terdaftar" })) as any);

    renderWithProviders(<RegisterPage />);

    await userEvent.type(document.querySelector("#register-name-input")!, "Rafael Hutapea");
    await userEvent.type(document.querySelector("#register-email-input")!, "existing@delcom.org");
    await userEvent.type(document.querySelector("#register-password-input")!, "password123");
    await userEvent.type(document.querySelector("#register-confirm-password-input")!, "password123");
    fireEvent.click(document.querySelector("#register-submit-button")!);

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Email sudah terdaftar");
      expect(screen.getByRole("alert")).toHaveTextContent("Email sudah terdaftar");
    });
  });

  it("should show loading state when isAuthRegister is true", () => {
    renderWithProviders(<RegisterPage />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          isAuthLogin: false,
          isAuthRegister: true,
          isAuthLogout: false,
          error: null,
        },
      },
    });

    const submitBtn = document.querySelector("#register-submit-button")!;
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent("Mendaftarkan...");
  });
});
