import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: [
        "src/features/**/states/**/*.{ts,tsx}",
        "src/features/**/api/**/*.{ts,tsx}",
        "src/helpers/**/*.{ts,tsx}",
        "src/hooks/**/*.{ts,tsx}",
        "src/lib/**/*.{ts,tsx}",
        "src/store.ts",
      ],
      exclude: [
        "src/setupTests.ts",
        "src/test-utils.tsx",
        "src/server.ts",
        "src/types/**",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "src/app/layout.tsx",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
