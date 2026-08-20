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

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/** Lazy so importing this package (e.g. demo/BFF paths) does not require DATABASE_URL. */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());
    const value = Reflect.get(client, property, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

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
