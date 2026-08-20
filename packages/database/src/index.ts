import { PrismaClient } from "@prisma/client";
import {
  DEMO_SOCIETY,
  buildMapGeoJson,
  getDemoSocietyByIdOrSlug,
  type DemoSocietyBundle,
} from "./demo/green-valley.js";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { PrismaClient };
export type { Prisma } from "@prisma/client";
export {
  DEMO_SOCIETY,
  buildMapGeoJson,
  getDemoSocietyByIdOrSlug,
  type DemoSocietyBundle,
};

export {
  createServiceClient,
  isSupabaseConfigured,
  seedJaffarETayyarViaSupabase,
  loadSocietyBundleFromSupabase,
} from "./supabase-data.js";

export {
  listResidents,
  getResidentDetail,
  listHouseholds,
  listProfessionalCategories,
  listProfessionals,
  getCommunityPeopleStats,
  type ResidentListItem,
  type ResidentDetail,
  type HouseholdListItem,
  type ProfessionalCategoryItem,
} from "./community-people.js";

export {
  listBusinesses,
  listBusinessCategories,
  getBusinessDetail,
  type BusinessListItem,
} from "./businesses.js";

export {
  listConnections,
  listPosts,
  listEvents,
  listOpportunities,
  getCommunityLifeStats,
  getMapIntelligence,
} from "./community-life.js";

/** True when API should fall back to the built-in demo dataset. */
export function isDemoDataEnabled(): boolean {
  return process.env.COMMUNITYOS_DEMO_DATA !== "0";
}
