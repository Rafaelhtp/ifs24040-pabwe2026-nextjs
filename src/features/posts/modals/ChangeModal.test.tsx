import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangeModal from "./ChangeModal";
import { renderWithProviders } from "@/test-utils";
import * as postActions from "../states/action";
import * as toolsHelper from "@/helpers/toolsHelper";

vi.mock("@/helpers/toolsHelper", () => ({
  showSuccessDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
  showErrorDialog: vi.fn().mockResolvedValue({ isConfirmed: true }),
}));

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should not render when isOpen is false", () => {
    const { container } = renderWithProviders(
      <ChangeModal
        isOpen={false}
        postId={1}
        initialDescription="Old desc"
        onClose={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should populate initial description and validate empty", async () => {
    renderWithProviders(
      <ChangeModal
        isOpen={true}
        postId={1}
        initialDescription="Existing content"
        onClose={vi.fn()}
      />
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("Existing content");

    await userEvent.clear(textarea);
    fireEvent.submit(textarea.closest("form")!);

    expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith(
      "Konten postingan tidak boleh kosong"
    );
  });

  it("should handle successful update", async () => {
    const changeSpy = vi.spyOn(postActions, "asyncChangePost").mockReturnValue((() =>
      Promise.resolve({ success: true, message: "OK" })) as any);
    const onClose = vi.fn();
    const onSuccess = vi.fn();

    renderWithProviders(
      <ChangeModal
        isOpen={true}
        postId={1}
        initialDescription="Old content"
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    const textarea = screen.getByRole("textbox");
    await userEvent.clear(textarea);
    await userEvent.type(textarea, "Updated content");
    fireEvent.submit(textarea.closest("form")!);

    await waitFor(() => {
      expect(changeSpy).toHaveBeenCalledWith(1, { description: "Updated content" });
      expect(toolsHelper.showSuccessDialog).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should handle update failure", async () => {
    vi.spyOn(postActions, "asyncChangePost").mockReturnValue((() =>
      Promise.resolve({ success: false, message: "Update failed" })) as any);

    renderWithProviders(
      <ChangeModal
        isOpen={true}
        postId={1}
        initialDescription="Old content"
        onClose={vi.fn()}
      />
    );

    const textarea = screen.getByRole("textbox");
    fireEvent.submit(textarea.closest("form")!);

    await waitFor(() => {
      expect(toolsHelper.showErrorDialog).toHaveBeenCalledWith("Update failed");
    });
  });

  it("should call onClose when cancel clicked", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ChangeModal
        isOpen={true}
        postId={1}
        initialDescription="Old"
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Batal"));
    expect(onClose).toHaveBeenCalled();
  });
});
