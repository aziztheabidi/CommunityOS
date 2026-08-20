import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const monorepoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

function readPkgName(dir) {
  const file = join(dir, "package.json");
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8")).name ?? null;
  } catch {
    return null;
  }
}

const cwdName = readPkgName(process.cwd());
if (cwdName === "@communityos/api") {
  console.error(`
Vercel Root Directory is "apps/api" (Fastify API). This project must deploy the Next.js web app.

In Vercel → Settings → General → Root Directory, set:
  apps/web

Enable "Include files outside the root directory", save, then redeploy.
`);
  process.exit(1);
}

const build = spawnSync(
  "pnpm",
  ["--filter", "@communityos/web...", "build"],
  { cwd: monorepoRoot, stdio: "inherit", shell: true, env: process.env },
);
if (build.status !== 0) process.exit(build.status ?? 1);

// Monorepo-root deploys need .next at the repo root.
if (cwdName === "communityos") {
  const stage = spawnSync(
    process.execPath,
    [join(monorepoRoot, "scripts", "stage-next-output.mjs")],
    { cwd: monorepoRoot, stdio: "inherit", env: process.env },
  );
  process.exit(stage.status ?? 0);
}

process.exit(0);
