import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppDispatch, useAppSelector } from "./redux";

describe("hooks/redux", () => {
  it("should return dispatch and select state correctly", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result: dispatchResult } = renderHook(() => useAppDispatch(), {
      wrapper,
    });
    expect(typeof dispatchResult.current).toBe("function");

    const { result: selectorResult } = renderHook(
      () => useAppSelector((state) => state.auth),
      { wrapper }
    );
    expect(selectorResult.current).toBeDefined();
    expect(selectorResult.current.user).toBeNull();
  });
});
