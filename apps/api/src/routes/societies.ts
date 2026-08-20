import type { FastifyPluginAsync } from "fastify";
import {
  buildMapGeoJson,
  getCommunityLifeStats,
  getCommunityPeopleStats,
  getDemoSocietyByIdOrSlug,
  isDemoDataEnabled,
  isSupabaseConfigured,
  listBusinesses,
  listEvents,
  loadSocietyBundleFromSupabase,
  type DemoSocietyBundle,
} from "@communityos/database";

export const societyRoutes: FastifyPluginAsync = async (app) => {
  app.get("/societies", async () => {
    const bundle = await resolveBundle("jaffar-e-tayyar");
    if (!bundle) {
      return { data: [] };
    }
    return {
      data: [
        {
          id: bundle.society.id,
          slug: bundle.society.slug,
          name: bundle.society.name,
          timezone: bundle.society.timezone,
          source: bundle.source,
        },
      ],
    };
  });

  app.get<{ Params: { societyId: string } }>("/societies/:societyId", async (request, reply) => {
    const bundle = await resolveBundle(request.params.societyId);
    if (!bundle) {
      return reply.code(404).send({
        error: { code: "NOT_FOUND", message: "Society not found", details: [] },
      });
    }

    let stats = bundle.stats;
    try {
      const [people, life] = await Promise.all([
        getCommunityPeopleStats(bundle.society.id),
        getCommunityLifeStats(bundle.society.id),
      ]);
      if (people.residents > 0) {
        stats = {
          ...stats,
          residents: people.residents,
          households: people.households,
        };
      }
      if (life.upcomingEvents > 0 || life.openOpportunities > 0) {
        stats = {
          ...stats,
          upcomingEvents: life.upcomingEvents,
          openOpportunities: life.openOpportunities,
        };
      }
    } catch {
      // Keep geography estimates when community data is unavailable.
    }

    return {
      data: {
        ...bundle.society,
        settings: bundle.settings,
        stats,
        source: bundle.source,
      },
    };
  });

  app.get<{ Params: { societyId: string } }>(
    "/societies/:societyId/geo/levels",
    async (request, reply) => {
      const bundle = await resolveBundle(request.params.societyId);
      if (!bundle) {
        return reply.code(404).send({
          error: { code: "NOT_FOUND", message: "Society not found", details: [] },
        });
      }
      return { data: bundle.levels };
    },
  );

  app.get<{
    Params: { societyId: string };
    Querystring: { levelKey?: string };
  }>("/societies/:societyId/geo/areas", async (request, reply) => {
    const bundle = await resolveBundle(request.params.societyId);
    if (!bundle) {
      return reply.code(404).send({
        error: { code: "NOT_FOUND", message: "Society not found", details: [] },
      });
    }
    const levelKey = request.query.levelKey;
    const areas = levelKey
      ? bundle.areas.filter((area) => area.levelKey === levelKey)
      : bundle.areas;
    return { data: areas };
  });

  app.get<{
    Params: { societyId: string };
    Querystring: { status?: string; type?: string; q?: string };
  }>("/societies/:societyId/properties", async (request, reply) => {
    const bundle = await resolveBundle(request.params.societyId);
    if (!bundle) {
      return reply.code(404).send({
        error: { code: "NOT_FOUND", message: "Society not found", details: [] },
      });
    }
    let rows = bundle.properties;
    if (request.query.status) {
      rows = rows.filter((row) => row.status === request.query.status);
    }
    if (request.query.type) {
      rows = rows.filter((row) => row.propertyType === request.query.type);
    }
    if (request.query.q) {
      const q = request.query.q.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.label.toLowerCase().includes(q) ||
          row.addressLine.toLowerCase().includes(q),
      );
    }
    return {
      data: rows,
      pageInfo: { nextCursor: null, hasNextPage: false },
    };
  });

  app.get<{ Params: { societyId: string } }>(
    "/societies/:societyId/geo/features",
    async (request, reply) => {
      const bundle = await resolveBundle(request.params.societyId);
      if (!bundle) {
        return reply.code(404).send({
          error: { code: "NOT_FOUND", message: "Society not found", details: [] },
        });
      }
      return { data: bundle.features };
    },
  );

  app.get<{
    Params: { societyId: string };
    Querystring: { layers?: string };
  }>("/societies/:societyId/map/geojson", async (request, reply) => {
    const bundle = await resolveBundle(request.params.societyId);
    if (!bundle) {
      return reply.code(404).send({
        error: { code: "NOT_FOUND", message: "Society not found", details: [] },
      });
    }
    const layers = (request.query.layers ?? "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    const collection = buildMapGeoJson(bundle, layers);

    if (layers.includes("businesses")) {
      try {
        const businesses = await listBusinesses(bundle.society.id);
        for (const business of businesses.data) {
          if (!business.geomJson) continue;
          collection.features.push({
            type: "Feature",
            id: business.id,
            properties: {
              id: business.id,
              name: business.name,
              description: business.summary,
              featureType: "commercial",
              category: business.categoryLabel,
              verification: business.verification,
              layer: "businesses",
            },
            geometry: business.geomJson,
          });
        }
      } catch (error) {
        console.warn("Business map layer skipped", error);
      }
    }

    if (layers.includes("events")) {
      try {
        const events = await listEvents(bundle.society.id);
        for (const event of events.data) {
          if (!event.geomJson) continue;
          collection.features.push({
            type: "Feature",
            id: event.id,
            properties: {
              id: event.id,
              name: event.title,
              description: event.summary,
              featureType: "community_center",
              locationName: event.locationName,
              startsAt: event.startsAt,
              goingCount: event.goingCount,
              layer: "events",
            },
            geometry: event.geomJson,
          });
        }
      } catch (error) {
        console.warn("Events map layer skipped", error);
      }
    }

    return collection;
  });
};
type ResolvedBundle = DemoSocietyBundle & { source: "supabase" | "demo" };

async function resolveBundle(societyId: string): Promise<ResolvedBundle | null> {
  if (isSupabaseConfigured()) {
    try {
      const fromDb = await loadSocietyBundleFromSupabase(societyId);
      if (fromDb) {
        return { ...fromDb, source: "supabase" };
      }
    } catch (error) {
      console.warn("Supabase society load failed; falling back to demo if enabled.", error);
    }
  }

  if (!isDemoDataEnabled()) return null;
  const demo = getDemoSocietyByIdOrSlug(societyId);
  return demo ? { ...demo, source: "demo" } : null;
}
