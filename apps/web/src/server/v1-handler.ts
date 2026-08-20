import {
  buildMapGeoJson,
  getBusinessDetail,
  getCommunityLifeStats,
  getCommunityPeopleStats,
  getDemoSocietyByIdOrSlug,
  getMapIntelligence,
  getResidentDetail,
  isDemoDataEnabled,
  isSupabaseConfigured,
  listBusinessCategories,
  listBusinesses,
  listConnections,
  listEvents,
  listHouseholds,
  listOpportunities,
  listPosts,
  listProfessionalCategories,
  listProfessionals,
  listResidents,
  loadSocietyBundleFromSupabase,
  type DemoSocietyBundle,
} from "@communityos/database";

type ResolvedBundle = DemoSocietyBundle & { source: "supabase" | "demo" };

function parseBool(value: string | null): boolean | undefined {
  if (value === null) return undefined;
  if (value === "1" || value === "true") return true;
  if (value === "0" || value === "false") return false;
  return undefined;
}

async function resolveBundle(societyId: string): Promise<ResolvedBundle | null> {
  if (isSupabaseConfigured()) {
    try {
      const fromDb = await loadSocietyBundleFromSupabase(societyId);
      if (fromDb) return { ...fromDb, source: "supabase" };
    } catch (error) {
      console.warn("Supabase society load failed; falling back to demo if enabled.", error);
    }
  }
  if (!isDemoDataEnabled()) return null;
  const demo = getDemoSocietyByIdOrSlug(societyId);
  return demo ? { ...demo, source: "demo" } : null;
}

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

function notFound(message: string) {
  return json({ error: { code: "NOT_FOUND", message, details: [] } }, 404);
}

/**
 * Same-origin BFF for the web app (used on Vercel when NEXT_PUBLIC_API_URL is unset).
 * Mirrors Fastify /v1 routes backed by @communityos/database.
 */
export async function handleV1Request(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/v1/, "") || "/";
  const q = url.searchParams;

  if (request.method !== "GET") {
    return json({ error: { code: "METHOD_NOT_ALLOWED", message: "Only GET is supported" } }, 405);
  }

  if (path === "/societies") {
    const bundle = await resolveBundle("jaffar-e-tayyar");
    if (!bundle) return json({ data: [] });
    return json({
      data: [
        {
          id: bundle.society.id,
          slug: bundle.society.slug,
          name: bundle.society.name,
          timezone: bundle.society.timezone,
          source: bundle.source,
        },
      ],
    });
  }

  const societyMatch = path.match(/^\/societies\/([^/]+)(.*)$/);
  if (!societyMatch) {
    return notFound("Route not found");
  }

  const societyId = decodeURIComponent(societyMatch[1]!);
  const rest = societyMatch[2] || "";

  if (rest === "" || rest === "/") {
    const bundle = await resolveBundle(societyId);
    if (!bundle) return notFound("Society not found");
    let stats = bundle.stats;
    try {
      const [people, life] = await Promise.all([
        getCommunityPeopleStats(bundle.society.id),
        getCommunityLifeStats(bundle.society.id),
      ]);
      if (people.residents > 0) {
        stats = { ...stats, residents: people.residents, households: people.households };
      }
      if (life.upcomingEvents > 0 || life.openOpportunities > 0) {
        stats = {
          ...stats,
          upcomingEvents: life.upcomingEvents,
          openOpportunities: life.openOpportunities,
        };
      }
    } catch {
      // keep geography estimates
    }
    return json({
      data: { ...bundle.society, settings: bundle.settings, stats, source: bundle.source },
    });
  }

  if (rest === "/geo/levels") {
    const bundle = await resolveBundle(societyId);
    if (!bundle) return notFound("Society not found");
    return json({ data: bundle.levels });
  }

  if (rest === "/geo/areas") {
    const bundle = await resolveBundle(societyId);
    if (!bundle) return notFound("Society not found");
    const levelKey = q.get("levelKey");
    const areas = levelKey
      ? bundle.areas.filter((area) => area.levelKey === levelKey)
      : bundle.areas;
    return json({ data: areas });
  }

  if (rest === "/geo/features") {
    const bundle = await resolveBundle(societyId);
    if (!bundle) return notFound("Society not found");
    return json({ data: bundle.features });
  }

  if (rest === "/properties") {
    const bundle = await resolveBundle(societyId);
    if (!bundle) return notFound("Society not found");
    let rows = bundle.properties;
    const status = q.get("status");
    const type = q.get("type");
    const query = q.get("q");
    if (status) rows = rows.filter((row) => row.status === status);
    if (type) rows = rows.filter((row) => row.propertyType === type);
    if (query) {
      const needle = query.toLowerCase();
      rows = rows.filter(
        (row) =>
          row.label.toLowerCase().includes(needle) ||
          row.addressLine.toLowerCase().includes(needle),
      );
    }
    return json({ data: rows, pageInfo: { nextCursor: null, hasNextPage: false } });
  }

  if (rest === "/map/geojson") {
    const bundle = await resolveBundle(societyId);
    if (!bundle) return notFound("Society not found");
    const layers = (q.get("layers") ?? "")
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
    return json(collection);
  }

  if (rest === "/people/stats") {
    return json({ data: await getCommunityPeopleStats(societyId) });
  }

  if (rest === "/residents") {
    const result = await listResidents(societyId, {
      q: q.get("q") ?? undefined,
      mentoring: parseBool(q.get("mentoring")),
      hiring: parseBool(q.get("hiring")),
      lookingForWork: parseBool(q.get("lookingForWork")),
    });
    return json({
      data: result.data,
      source: result.source,
      pageInfo: { nextCursor: null, hasNextPage: false },
    });
  }

  const residentMatch = rest.match(/^\/residents\/([^/]+)$/);
  if (residentMatch) {
    const result = await getResidentDetail(decodeURIComponent(residentMatch[1]!), societyId);
    if (!result) return notFound("Resident not found");
    return json({ data: result.data, source: result.source });
  }

  if (rest === "/households") {
    const result = await listHouseholds(societyId);
    return json({ data: result.data, source: result.source });
  }

  if (rest === "/professional-categories") {
    const result = await listProfessionalCategories(societyId);
    return json({ data: result.data, source: result.source });
  }

  if (rest === "/professionals") {
    const result = await listProfessionals(societyId, {
      categoryKey: q.get("categoryKey") ?? undefined,
      professionKey: q.get("professionKey") ?? undefined,
      mentoring: parseBool(q.get("mentoring")),
      q: q.get("q") ?? undefined,
    });
    return json({
      data: result.data,
      source: result.source,
      pageInfo: { nextCursor: null, hasNextPage: false },
    });
  }

  if (rest === "/business-categories") {
    const result = await listBusinessCategories(societyId);
    return json({ data: result.data, source: result.source });
  }

  if (rest === "/businesses") {
    const result = await listBusinesses(societyId, {
      q: q.get("q") ?? undefined,
      categoryKey: q.get("categoryKey") ?? undefined,
      hiring: parseBool(q.get("hiring")),
      residentOwned: parseBool(q.get("residentOwned")),
    });
    return json({
      data: result.data,
      source: result.source,
      pageInfo: { nextCursor: null, hasNextPage: false },
    });
  }

  const businessMatch = rest.match(/^\/businesses\/([^/]+)$/);
  if (businessMatch) {
    const result = await getBusinessDetail(decodeURIComponent(businessMatch[1]!), societyId);
    if (!result) return notFound("Business not found");
    return json({ data: result.data, source: result.source });
  }

  if (rest === "/connections") {
    const result = await listConnections(societyId, { status: q.get("status") ?? undefined });
    return json({ data: result.data, source: result.source });
  }

  if (rest === "/posts") {
    const result = await listPosts(societyId, { kind: q.get("kind") ?? undefined });
    return json({
      data: result.data,
      source: result.source,
      pageInfo: { nextCursor: null, hasNextPage: false },
    });
  }

  if (rest === "/events") {
    const result = await listEvents(societyId);
    return json({ data: result.data, source: result.source });
  }

  if (rest === "/opportunities") {
    const result = await listOpportunities(societyId, {
      kind: q.get("kind") ?? undefined,
      status: q.get("status") ?? undefined,
      q: q.get("q") ?? undefined,
    });
    return json({
      data: result.data,
      source: result.source,
      pageInfo: { nextCursor: null, hasNextPage: false },
    });
  }

  if (rest === "/community/stats") {
    return json({ data: await getCommunityLifeStats(societyId) });
  }

  if (rest === "/map/intelligence") {
    const data = await getMapIntelligence(societyId, q.get("areaId") ?? undefined);
    return json({ data });
  }

  return notFound("Route not found");
}
