import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export function getPort(): number {
  if (process.env.APP_PORT && !Number.isNaN(Number(process.env.APP_PORT))) {
    return Number(process.env.APP_PORT);
  }
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const match = envContent.match(/APP_PORT\s*=\s*(\d+)/);
    if (match && match[1]) {
      return Number(match[1]);
    }
  }
  return 3000;
}

export function startServer(command: string = "dev", port: number = getPort()) {
  const isWin = process.platform === "win32";
  const cmd = isWin ? "npx.cmd" : "npx";
  const args = ["next", command === "start" ? "start" : "dev", "-p", String(port)];

  return spawn(cmd, args, {
    stdio: "inherit",
    shell: true,
  });
}

const isMainModule =
  typeof process !== "undefined" &&
  process.argv[1] &&
  (process.argv[1].endsWith("server.ts") || process.argv[1].endsWith("server.js"));

if (isMainModule) {
  const mode = process.argv[2] || "dev";
  const port = getPort();
  console.log(`Starting Delcom Posts in ${mode} mode on port ${port}...`);
  startServer(mode, port);
}
