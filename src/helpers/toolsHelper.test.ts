import { describe, it, expect, vi } from "vitest";
import Swal from "sweetalert2";
import {
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
  formatDate,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe("toolsHelper", () => {
  it("showSuccessDialog should trigger Swal.fire with success icon", async () => {
    (Swal.fire as any).mockResolvedValueOnce({ isConfirmed: true });
    await showSuccessDialog("Berhasil!", "Judul");

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "success",
        title: "Judul",
        text: "Berhasil!",
      })
    );
  });

  it("showSuccessDialog should use default title if not provided", async () => {
    (Swal.fire as any).mockResolvedValueOnce({ isConfirmed: true });
    await showSuccessDialog("Berhasil!");

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Berhasil",
      })
    );
  });

  it("showErrorDialog should trigger Swal.fire with error icon", async () => {
    (Swal.fire as any).mockResolvedValueOnce({ isConfirmed: true });
    await showErrorDialog("Gagal!", "Error");

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "error",
        title: "Error",
        text: "Gagal!",
      })
    );
  });

  it("showWarningDialog should trigger Swal.fire with warning icon", async () => {
    (Swal.fire as any).mockResolvedValueOnce({ isConfirmed: true });
    await showWarningDialog("Peringatan!", "Perhatian");

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "warning",
        title: "Perhatian",
        text: "Peringatan!",
      })
    );
  });

  it("showConfirmDialog should return true when user confirms", async () => {
    (Swal.fire as any).mockResolvedValueOnce({ isConfirmed: true });
    const result = await showConfirmDialog("Yakin?");

    expect(result).toBe(true);
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "question",
        title: "Konfirmasi",
        text: "Yakin?",
      })
    );
  });

  it("showConfirmDialog should return false when user cancels", async () => {
    (Swal.fire as any).mockResolvedValueOnce({ isConfirmed: false });
    const result = await showConfirmDialog("Yakin?", "Title");

    expect(result).toBe(false);
  });

  describe("formatDate", () => {
    it("should format valid ISO string to Indonesian date", () => {
      const formatted = formatDate("2026-10-04T12:00:00Z");
      expect(formatted).toContain("2026");
      expect(formatted).toContain("Oktober");
    });

    it("should return '-' for empty or invalid date", () => {
      expect(formatDate("")).toBe("-");
      expect(formatDate("invalid-date-string")).toBe("-");
    });
  });
});
