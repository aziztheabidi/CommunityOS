import { loadEnv } from "@communityos/config";
import { buildServer } from "./app.js";

async function main() {
  const env = loadEnv();
  const app = await buildServer();
  await app.listen({ host: env.API_HOST, port: env.API_PORT });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
