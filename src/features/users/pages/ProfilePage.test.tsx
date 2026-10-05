import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfilePage from "./ProfilePage";
import { renderWithProviders } from "@/test-utils";
import * as userActions from "../states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

vi.mock("@/helpers/toolsHelper", async () => {
  const actual = await vi.importActual<typeof toolsHelper>("@/helpers/toolsHelper");
  return {
    ...actual,
    showSuccessDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
    showErrorDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
  };
});

describe("ProfilePage", () => {
  const mockProfile = {
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

  it("should fetch profile if profile is null", () => {
    const spy = vi.spyOn(userActions, "asyncSetProfile").mockReturnValue((() =>
      Promise.resolve({ success: true, user: mockProfile })) as any);

    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          users: [],
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
  });

  it("should validate and update personal info successfully", async () => {
    vi.spyOn(userActions, "asyncUpdateProfile").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);

    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          users: [],
          profile: mockProfile,
          isUsers: false,
          isProfile: false,
          isUpdateProfile: false,
          isUpdatePhoto: false,
          isUpdatePassword: false,
          error: null,
        },
      },
    });

    const nameInput = screen.getByLabelText("Nama Lengkap");
    await userEvent.clear(nameInput);
    fireEvent.click(screen.getByText("Simpan Profil"));
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Nama lengkap tidak boleh kosong");

    await userEvent.type(nameInput, "Rafael Updated");
    const emailInput = screen.getByLabelText("Alamat Email");
    await userEvent.clear(emailInput);
    fireEvent.click(screen.getByText("Simpan Profil"));
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Email tidak boleh kosong");

    await userEvent.type(emailInput, "newemail@delcom.org");
    fireEvent.click(screen.getByText("Simpan Profil"));

    await waitFor(() => {
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Profil berhasil diperbarui!");
    });
  });

  it("should handle update profile failure", async () => {
    vi.spyOn(userActions, "asyncUpdateProfile").mockReturnValue((() =>
      Promise.resolve({ success: false, message: "Email sudah digunakan" })) as any);

    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          users: [],
          profile: mockProfile,
          isUsers: false,
          isProfile: false,
          isUpdateProfile: false,
          isUpdatePhoto: false,
          isUpdatePassword: false,
          error: null,
        },
      },
    });

    fireEvent.click(screen.getByText("Simpan Profil"));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Email sudah digunakan");
    });
  });

  it("should handle photo upload and failure", async () => {
    const updatePhotoSpy = vi.spyOn(userActions, "asyncUpdatePhoto");
    updatePhotoSpy.mockReturnValueOnce((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);

    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          users: [],
          profile: mockProfile,
          isUsers: false,
          isProfile: false,
          isUpdateProfile: false,
          isUpdatePhoto: false,
          isUpdatePassword: false,
          error: null,
        },
      },
    });

    const fileInput = document.querySelector("#profile-photo-upload")!;
    const file = new File(["dummy"], "avatar.png", { type: "image/png" });

    // Mock createObjectURL
    window.URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url");

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Foto profil berhasil diperbarui!");
    });

    // Test photo upload failure
    updatePhotoSpy.mockReturnValueOnce((() =>
      Promise.resolve({ success: false, message: "File terlalu besar" })) as any);

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("File terlalu besar");
    });
  });

  it("should validate and update password", async () => {
    const updatePwSpy = vi.spyOn(userActions, "asyncUpdatePassword");
    updatePwSpy.mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);

    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          users: [],
          profile: mockProfile,
          isUsers: false,
          isProfile: false,
          isUpdateProfile: false,
          isUpdatePhoto: false,
          isUpdatePassword: false,
          error: null,
        },
      },
    });

    const submitBtn = screen.getByText("Ubah Kata Sandi");

    // Empty current password
    fireEvent.click(submitBtn);
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Kata sandi saat ini wajib diisi");

    // Empty new password
    await userEvent.type(screen.getByLabelText("Kata Sandi Saat Ini"), "oldpassword123");
    fireEvent.click(submitBtn);
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Kata sandi baru wajib diisi");

    // Short new password
    await userEvent.type(screen.getByLabelText("Kata Sandi Baru"), "123");
    fireEvent.click(submitBtn);
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Kata sandi baru minimal 6 karakter");

    // Mismatched confirmation
    await userEvent.clear(screen.getByLabelText("Kata Sandi Baru"));
    await userEvent.type(screen.getByLabelText("Kata Sandi Baru"), "newsecret123");
    await userEvent.type(screen.getByLabelText("Konfirmasi Kata Sandi Baru"), "different123");
    fireEvent.click(submitBtn);
    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Konfirmasi kata sandi baru tidak cocok");

    // Matching confirmation
    await userEvent.clear(screen.getByLabelText("Konfirmasi Kata Sandi Baru"));
    await userEvent.type(screen.getByLabelText("Konfirmasi Kata Sandi Baru"), "newsecret123");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalledWith("Kata sandi berhasil diubah!");
    });
  });

  it("should handle update password failure", async () => {
    vi.spyOn(userActions, "asyncUpdatePassword").mockReturnValue((() =>
      Promise.resolve({ success: false, message: "Kata sandi lama salah" })) as any);

    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          users: [],
          profile: mockProfile,
          isUsers: false,
          isProfile: false,
          isUpdateProfile: false,
          isUpdatePhoto: false,
          isUpdatePassword: false,
          error: null,
        },
      },
    });

    await userEvent.type(screen.getByLabelText("Kata Sandi Saat Ini"), "wrongold");
    await userEvent.type(screen.getByLabelText("Kata Sandi Baru"), "newsecret123");
    await userEvent.type(screen.getByLabelText("Konfirmasi Kata Sandi Baru"), "newsecret123");
    fireEvent.click(screen.getByText("Ubah Kata Sandi"));

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Kata sandi lama salah");
    });
  });

  it("should render loading indicators and buttons in loading state", () => {
    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          users: [],
          profile: mockProfile,
          isUsers: false,
          isProfile: false,
          isUpdateProfile: true,
          isUpdatePhoto: true,
          isUpdatePassword: true,
          error: null,
        },
      },
    });

    expect(screen.getByText("Menyimpan...")).toBeInTheDocument();
    expect(screen.getByText("Mengubah...")).toBeInTheDocument();
  });

  it("should render fallback initials when photo is not present or name is empty", () => {
    const { unmount } = renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          users: [],
          profile: { id: 2, name: "Alpha Beta", email: "ab@delcom.org", photo: "", created_at: "", updated_at: "" },
          isUsers: false,
          isProfile: false,
          isUpdateProfile: false,
          isUpdatePhoto: false,
          isUpdatePassword: false,
          error: null,
        },
      },
    });

    expect(screen.getByText("AL")).toBeInTheDocument();
    unmount();

    renderWithProviders(<ProfilePage />, {
      preloadedState: {
        users: {
          users: [],
          profile: { id: 3, name: "", email: "noname@delcom.org", photo: "", created_at: "", updated_at: "" },
          isUsers: false,
          isProfile: false,
          isUpdateProfile: false,
          isUpdatePhoto: false,
          isUpdatePassword: false,
          error: null,
        },
      },
    });

    expect(screen.getByText("U")).toBeInTheDocument();
  });
});
