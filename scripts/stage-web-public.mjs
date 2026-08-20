import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

/**
 * Copy Next static export into `public/` so Vercel Project Settings that still
 * expect Output Directory = "public" can deploy the site.
 *
 * Works when cwd is the monorepo root or apps/web.
 */
const cwd = process.cwd();
const outDir = existsSync(join(cwd, "apps/web/out"))
  ? join(cwd, "apps/web/out")
  : join(cwd, "out");
const publicDir = join(cwd, "public");

if (!existsSync(outDir)) {
  console.error(`Static export missing at ${outDir}. Did next build run with output: "export"?`);
  process.exit(1);
}

rmSync(publicDir, { recursive: true, force: true });
cpSync(outDir, publicDir, { recursive: true });
console.log(`Staged ${outDir} → ${publicDir}`);
