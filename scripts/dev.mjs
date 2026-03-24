import { spawn } from "node:child_process";
import path from "node:path";

const workspaceRoot = process.cwd();
const viteBin = path.join(workspaceRoot, "node_modules", "vite", "bin", "vite.js");
const processes = [];

function run(name, command, args, extraEnv = {}) {
  const child = spawn(command, args, {
    cwd: workspaceRoot,
    env: {
      ...process.env,
      ...extraEnv,
    },
    stdio: ["inherit", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${name}] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${name}] ${chunk}`);
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      process.exitCode = code ?? 1;
    }
  });

  processes.push(child);
}

run("server", process.execPath, ["server/server.mjs"], {
  NODE_ENV: "development",
  PORT: process.env.PORT ?? "3001",
});

run("client", process.execPath, [viteBin], {
  NODE_ENV: "development",
});

function shutdown(signal) {
  for (const child of processes) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
