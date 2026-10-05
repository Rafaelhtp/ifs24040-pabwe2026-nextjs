import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPort, startServer } from "./server";
import { spawn } from "node:child_process";
import fs from "node:fs";

vi.mock("node:child_process", () => {
  const spawnMock = vi.fn();
  return {
    spawn: spawnMock,
    default: {
      spawn: spawnMock,
    },
  };
});

describe("server launcher", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getPort", () => {
    it("should return numeric port from process.env.APP_PORT", () => {
      process.env.APP_PORT = "8080";
      expect(getPort()).toBe(8080);
    });

    it("should parse .env file when process.env.APP_PORT is absent", () => {
      delete process.env.APP_PORT;
      vi.spyOn(fs, "existsSync").mockReturnValue(true);
      vi.spyOn(fs, "readFileSync").mockReturnValue("APP_PORT=4000\nOTHER=1");

      expect(getPort()).toBe(4000);
    });

    it("should fallback to 3000 when no port is specified", () => {
      delete process.env.APP_PORT;
      vi.spyOn(fs, "existsSync").mockReturnValue(false);

      expect(getPort()).toBe(3000);
    });
  });

  describe("startServer", () => {
    it("should spawn next dev by default", () => {
      startServer();
      expect(spawn).toHaveBeenCalledWith(
        expect.stringMatching(/npx/),
        ["next", "dev", "-p", expect.any(String)],
        expect.objectContaining({ stdio: "inherit", shell: true })
      );
    });

    it("should spawn next start when start command passed", () => {
      startServer("start", 5000);
      expect(spawn).toHaveBeenCalledWith(
        expect.stringMatching(/npx/),
        ["next", "start", "-p", "5000"],
        expect.objectContaining({ stdio: "inherit", shell: true })
      );
    });
  });
});
