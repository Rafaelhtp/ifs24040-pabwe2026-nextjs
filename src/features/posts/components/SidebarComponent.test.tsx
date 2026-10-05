import React from "react";
import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import SidebarComponent from "./SidebarComponent";
import { renderWithProviders } from "@/test-utils";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams("filter=my"),
}));

describe("SidebarComponent", () => {
  it("should render navigation links and active states", () => {
    renderWithProviders(<SidebarComponent />);

    expect(screen.getByText("Semua Postingan")).toBeInTheDocument();
    expect(screen.getByText("Postingan Saya")).toBeInTheDocument();
    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
  });

  it("should render drawer and trigger onClose on backdrop click", () => {
    const onClose = vi.fn();
    renderWithProviders(<SidebarComponent isOpen={true} onClose={onClose} />);

    expect(screen.getByText("Menu Utama")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Tutup menu"));
    expect(onClose).toHaveBeenCalled();
  });
});
