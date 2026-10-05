import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Providers from "./Providers";

describe("Providers component", () => {
  it("should render children properly inside Redux Provider", () => {
    render(
      <Providers>
        <div data-testid="child-element">Child Content</div>
      </Providers>
    );

    expect(screen.getByTestId("child-element")).toHaveTextContent("Child Content");
  });
});
