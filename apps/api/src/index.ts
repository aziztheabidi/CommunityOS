import { config } from "dotenv";
import { resolve } from "node:path";
import { loadEnv } from "@communityos/config";
import { buildServer } from "./app.js";

// Load monorepo root .env then local overrides
config({ path: resolve(process.cwd(), "../../.env") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const env = loadEnv();
  const app = await buildServer();
  await app.listen({ host: env.API_HOST, port: env.API_PORT });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
