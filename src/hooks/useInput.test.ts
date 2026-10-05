import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("should initialize with default empty string", () => {
    const { result } = renderHook(() => useInput());
    const [value] = result.current;
    expect(value).toBe("");
  });

  it("should initialize with provided value", () => {
    const { result } = renderHook(() => useInput("initial"));
    const [value] = result.current;
    expect(value).toBe("initial");
  });

  it("should handle event change", () => {
    const { result } = renderHook(() => useInput(""));
    const [, onChange] = result.current;

    act(() => {
      onChange({ target: { value: "new value" } } as any);
    });

    const [value] = result.current;
    expect(value).toBe("new value");
  });

  it("should handle direct string change", () => {
    const { result } = renderHook(() => useInput(""));
    const [, onChange] = result.current;

    act(() => {
      onChange("direct string");
    });

    const [value] = result.current;
    expect(value).toBe("direct string");
  });
});
