import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import ChangeCoverModal from "./ChangeCoverModal";
import { renderWithProviders } from "@/test-utils";
import * as postActions from "../states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

vi.mock("@/helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
  showErrorDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
}));

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when isOpen is false", () => {
    const { container } = renderWithProviders(
      <ChangeCoverModal isOpen={false} postId={1} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should display current cover if provided", () => {
    renderWithProviders(
      <ChangeCoverModal
        isOpen={true}
        postId={1}
        currentCover="https://example.com/cover.jpg"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByAltText("Sampul Saat Ini")).toBeInTheDocument();
  });

  it("should validate if no file selected upon submit", () => {
    renderWithProviders(
      <ChangeCoverModal isOpen={true} postId={1} onClose={vi.fn()} />
    );

    const form = screen.getByText("Unggah Sampul").closest("form")!;
    fireEvent.submit(form);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
      "Silakan pilih gambar sampul terlebih dahulu"
    );
  });

  it("should handle file selection and successful upload", async () => {
    window.URL.createObjectURL = vi.fn().mockReturnValue("blob:preview");
    const changeCoverSpy = vi.spyOn(postActions, "asyncChangeCoverPost").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <ChangeCoverModal
        isOpen={true}
        postId={1}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    const fileInput = document.querySelector("#cover-file-input")!;
    const file = new File(["dummy"], "new-cover.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByAltText("Preview Sampul Baru")).toBeInTheDocument();

    const form = screen.getByText("Unggah Sampul").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(changeCoverSpy).toHaveBeenCalledWith(1, file);
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should handle upload failure", async () => {
    window.URL.createObjectURL = vi.fn().mockReturnValue("blob:preview");
    vi.spyOn(postActions, "asyncChangeCoverPost").mockReturnValue((() =>
      Promise.resolve({ success: false, message: "Upload failed" })) as any);

    renderWithProviders(
      <ChangeCoverModal isOpen={true} postId={1} onClose={vi.fn()} />
    );

    const fileInput = document.querySelector("#cover-file-input")!;
    const file = new File(["dummy"], "new-cover.jpg", { type: "image/jpeg" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    const form = screen.getByText("Unggah Sampul").closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Upload failed");
    });
  });

  it("should reset and close on cancel", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ChangeCoverModal isOpen={true} postId={1} onClose={onClose} />
    );

    fireEvent.click(screen.getByText("Batal"));
    expect(onClose).toHaveBeenCalled();
  });
});
