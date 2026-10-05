import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddModal from "./AddModal";
import { renderWithProviders } from "@/test-utils";
import * as postActions from "../states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

vi.mock("@/helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
  showErrorDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
}));

describe("AddModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when isOpen is false", () => {
    const { container } = renderWithProviders(
      <AddModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should validate empty description", async () => {
    renderWithProviders(<AddModal isOpen={true} onClose={vi.fn()} />);

    const form = screen.getByRole("textbox");
    fireEvent.change(form, { target: { value: "   " } });
    fireEvent.submit(form.closest("form")!);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
      "Konten postingan tidak boleh kosong"
    );
  });

  it("should handle successful post submission", async () => {
    const addSpy = vi.spyOn(postActions, "asyncAddPost").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <AddModal isOpen={true} onClose={onClose} onSuccess={onSuccess} />
    );

    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, "Halo Delcom!");
    fireEvent.submit(textarea.closest("form")!);

    await waitFor(() => {
      expect(addSpy).toHaveBeenCalledWith({ description: "Halo Delcom!" });
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should handle submission failure", async () => {
    vi.spyOn(postActions, "asyncAddPost").mockReturnValue((() =>
      Promise.resolve({ success: false, message: "Failed" })) as any);

    renderWithProviders(<AddModal isOpen={true} onClose={vi.fn()} />);

    const textarea = screen.getByRole("textbox");
    await userEvent.type(textarea, "Halo Delcom!");
    fireEvent.submit(textarea.closest("form")!);

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Failed");
    });
  });

  it("should call onClose when cancel clicked", () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByText("Batal"));
    expect(onClose).toHaveBeenCalled();
  });
});
