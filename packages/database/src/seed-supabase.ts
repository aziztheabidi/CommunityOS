/**
 * Seed Jaffar-e-Tayyar Society into Supabase using the service role key.
 * Does not require DATABASE_URL.
 *
 * Usage from repo root:
 *   pnpm db:seed:supabase
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { seedJaffarETayyarViaSupabase } from "./supabase-data.js";

config({ path: resolve(process.cwd(), "../../.env") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const result = await seedJaffarETayyarViaSupabase();
  console.log(`Seeded society ${result.societyId} into Supabase.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
