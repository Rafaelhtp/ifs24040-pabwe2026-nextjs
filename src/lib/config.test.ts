import { describe, it, expect } from "vitest";
import { DELCOM_BASEURL, APP_PORT } from "./config";

describe("lib/config", () => {
  it("should have default or environment values", () => {
    expect(DELCOM_BASEURL).toBeDefined();
    expect(typeof DELCOM_BASEURL).toBe("string");
    expect(APP_PORT).toBeDefined();
    expect(typeof APP_PORT).toBe("number");
  });
});
