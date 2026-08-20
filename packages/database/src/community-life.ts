import { createServiceClient, isSupabaseConfigured } from "./supabase-data.js";
import { DEMO_COMMUNITY_LIFE } from "./demo/community-life.js";
import { DEMO_PEOPLE } from "./demo/people.js";

const SOCIETY = "soc_demo_jaffar_e_tayyar";

function residentName(id: string, map: Map<string, string>) {
  return map.get(id) ?? DEMO_PEOPLE.residents.find((row) => row.id === id)?.fullName ?? "Resident";
}

export async function listConnections(
  societyId: string = SOCIETY,
  filters: { status?: string } = {},
) {
  if (isSupabaseConfigured()) {
    try {
      const client = createServiceClient();
      let query = client
        .from("connections")
        .select("id, fromResidentId, toResidentId, status, message, createdAt")
        .eq("societyId", societyId)
        .order("createdAt", { ascending: false });
      if (filters.status) query = query.eq("status", filters.status);
      const { data, error } = await query;
      if (error) throw error;
      if (data?.length) {
        const ids = [
          ...new Set(data.flatMap((row) => [row.fromResidentId as string, row.toResidentId as string])),
        ];
        const { data: residents } = await client.from("residents").select("id, fullName, headline").in("id", ids);
        const nameMap = new Map((residents ?? []).map((row) => [row.id as string, row.fullName as string]));
        const headlineMap = new Map(
          (residents ?? []).map((row) => [row.id as string, (row.headline as string | null) ?? null]),
        );
        return {
          source: "supabase" as const,
          data: data.map((row) => ({
            id: row.id as string,
            status: row.status as string,
            message: (row.message as string | null) ?? null,
            createdAt: row.createdAt as string,
            from: {
              id: row.fromResidentId as string,
              fullName: nameMap.get(row.fromResidentId as string) ?? "Resident",
              headline: headlineMap.get(row.fromResidentId as string) ?? null,
            },
            to: {
              id: row.toResidentId as string,
              fullName: nameMap.get(row.toResidentId as string) ?? "Resident",
              headline: headlineMap.get(row.toResidentId as string) ?? null,
            },
          })),
        };
      }
    } catch (error) {
      console.warn("Supabase connections failed; using demo.", error);
    }
  }

  let rows = DEMO_COMMUNITY_LIFE.connections;
  if (filters.status) rows = rows.filter((row) => row.status === filters.status);
  const people = new Map(DEMO_PEOPLE.residents.map((row) => [row.id, row]));
  return {
    source: "demo" as const,
    data: rows.map((row) => ({
      id: row.id,
      status: row.status,
      message: row.message,
      createdAt: new Date().toISOString(),
      from: {
        id: row.fromResidentId,
        fullName: people.get(row.fromResidentId)?.fullName ?? "Resident",
        headline: people.get(row.fromResidentId)?.headline ?? null,
      },
      to: {
        id: row.toResidentId,
        fullName: people.get(row.toResidentId)?.fullName ?? "Resident",
        headline: people.get(row.toResidentId)?.headline ?? null,
      },
    })),
  };
}

export async function listPosts(societyId: string = SOCIETY, filters: { kind?: string } = {}) {
  if (isSupabaseConfigured()) {
    try {
      const client = createServiceClient();
      let query = client
        .from("posts")
        .select("id, authorId, kind, body, geoAreaId, isPinned, createdAt")
        .eq("societyId", societyId)
        .order("isPinned", { ascending: false })
        .order("createdAt", { ascending: false });
      if (filters.kind) query = query.eq("kind", filters.kind);
      const { data, error } = await query;
      if (error) throw error;
      if (data?.length) {
        const postIds = data.map((row) => row.id as string);
        const authorIds = [...new Set(data.map((row) => row.authorId as string))];
        const [{ data: authors }, { data: reactions }, { data: comments }] = await Promise.all([
          client.from("residents").select("id, fullName").in("id", authorIds),
          client.from("reactions").select("postId").in("postId", postIds),
          client.from("comments").select("postId").in("postId", postIds),
        ]);
        const nameMap = new Map((authors ?? []).map((row) => [row.id as string, row.fullName as string]));
        const reactionCounts = new Map<string, number>();
        for (const reaction of reactions ?? []) {
          reactionCounts.set(
            reaction.postId as string,
            (reactionCounts.get(reaction.postId as string) ?? 0) + 1,
          );
        }
        const commentCounts = new Map<string, number>();
        for (const comment of comments ?? []) {
          commentCounts.set(
            comment.postId as string,
            (commentCounts.get(comment.postId as string) ?? 0) + 1,
          );
        }
        return {
          source: "supabase" as const,
          data: data.map((row) => ({
            id: row.id as string,
            authorId: row.authorId as string,
            authorName: nameMap.get(row.authorId as string) ?? "Resident",
            kind: row.kind as string,
            body: row.body as string,
            geoAreaId: (row.geoAreaId as string | null) ?? null,
            isPinned: Boolean(row.isPinned),
            createdAt: row.createdAt as string,
            reactionCount: reactionCounts.get(row.id as string) ?? 0,
            commentCount: commentCounts.get(row.id as string) ?? 0,
          })),
        };
      }
    } catch (error) {
      console.warn("Supabase posts failed; using demo.", error);
    }
  }

  let rows = DEMO_COMMUNITY_LIFE.posts;
  if (filters.kind) rows = rows.filter((row) => row.kind === filters.kind);
  return { source: "demo" as const, data: rows };
}

export async function listEvents(societyId: string = SOCIETY) {
  if (isSupabaseConfigured()) {
    try {
      const client = createServiceClient();
      const { data, error } = await client
        .from("events")
        .select(
          "id, hostId, title, summary, locationName, geoAreaId, startsAt, capacity, geomJson",
        )
        .eq("societyId", societyId)
        .order("startsAt", { ascending: true });
      if (error) throw error;
      if (data?.length) {
        const eventIds = data.map((row) => row.id as string);
        const hostIds = [...new Set(data.map((row) => row.hostId).filter(Boolean))] as string[];
        const [{ data: hosts }, { data: rsvps }] = await Promise.all([
          hostIds.length
            ? client.from("residents").select("id, fullName").in("id", hostIds)
            : Promise.resolve({ data: [] as Array<{ id: string; fullName: string }> }),
          client.from("event_rsvps").select("eventId, status").in("eventId", eventIds),
        ]);
        const nameMap = new Map((hosts ?? []).map((row) => [row.id as string, row.fullName as string]));
        return {
          source: "supabase" as const,
          data: data.map((row) => {
            const eventRsvps = (rsvps ?? []).filter((item) => item.eventId === row.id);
            return {
              id: row.id as string,
              hostId: (row.hostId as string | null) ?? null,
              hostName: row.hostId ? (nameMap.get(row.hostId as string) ?? null) : null,
              title: row.title as string,
              summary: (row.summary as string | null) ?? null,
              locationName: (row.locationName as string | null) ?? null,
              geoAreaId: (row.geoAreaId as string | null) ?? null,
              startsAt: row.startsAt as string,
              capacity: (row.capacity as number | null) ?? null,
              goingCount: eventRsvps.filter((item) => item.status === "going").length,
              interestedCount: eventRsvps.filter((item) => item.status === "interested").length,
              geomJson: row.geomJson as { type: "Point"; coordinates: [number, number] } | null,
            };
          }),
        };
      }
    } catch (error) {
      console.warn("Supabase events failed; using demo.", error);
    }
  }

  return { source: "demo" as const, data: DEMO_COMMUNITY_LIFE.events };
}

export async function listOpportunities(
  societyId: string = SOCIETY,
  filters: { kind?: string; status?: string; q?: string } = {},
) {
  if (isSupabaseConfigured()) {
    try {
      const client = createServiceClient();
      let query = client
        .from("opportunities")
        .select(
          "id, posterId, kind, status, title, summary, compensation, isRemoteOk, createdAt",
        )
        .eq("societyId", societyId)
        .order("createdAt", { ascending: false });
      if (filters.kind) query = query.eq("kind", filters.kind);
      if (filters.status) query = query.eq("status", filters.status);
      const { data, error } = await query;
      if (error) throw error;
      if (data?.length) {
        const ids = data.map((row) => row.id as string);
        const posterIds = [...new Set(data.map((row) => row.posterId).filter(Boolean))] as string[];
        const [{ data: posters }, { data: apps }] = await Promise.all([
          posterIds.length
            ? client.from("residents").select("id, fullName").in("id", posterIds)
            : Promise.resolve({ data: [] as Array<{ id: string; fullName: string }> }),
          client.from("opportunity_applications").select("opportunityId").in("opportunityId", ids),
        ]);
        const nameMap = new Map((posters ?? []).map((row) => [row.id as string, row.fullName as string]));
        const appCounts = new Map<string, number>();
        for (const app of apps ?? []) {
          appCounts.set(
            app.opportunityId as string,
            (appCounts.get(app.opportunityId as string) ?? 0) + 1,
          );
        }
        let rows = data.map((row) => ({
          id: row.id as string,
          posterId: (row.posterId as string | null) ?? null,
          posterName: row.posterId ? (nameMap.get(row.posterId as string) ?? null) : null,
          kind: row.kind as string,
          status: row.status as string,
          title: row.title as string,
          summary: (row.summary as string | null) ?? null,
          compensation: (row.compensation as string | null) ?? null,
          isRemoteOk: Boolean(row.isRemoteOk),
          applicationCount: appCounts.get(row.id as string) ?? 0,
        }));
        if (filters.q) {
          const q = filters.q.toLowerCase();
          rows = rows.filter(
            (row) =>
              row.title.toLowerCase().includes(q) ||
              (row.summary ?? "").toLowerCase().includes(q) ||
              row.kind.toLowerCase().includes(q),
          );
        }
        return { source: "supabase" as const, data: rows };
      }
    } catch (error) {
      console.warn("Supabase opportunities failed; using demo.", error);
    }
  }

  let rows = DEMO_COMMUNITY_LIFE.opportunities;
  if (filters.kind) rows = rows.filter((row) => row.kind === filters.kind);
  if (filters.status) rows = rows.filter((row) => row.status === filters.status);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.summary.toLowerCase().includes(q) ||
        row.kind.toLowerCase().includes(q),
    );
  }
  return { source: "demo" as const, data: rows };
}

export async function getCommunityLifeStats(societyId: string = SOCIETY) {
  const [connections, posts, events, opportunities] = await Promise.all([
    listConnections(societyId, { status: "accepted" }),
    listPosts(societyId),
    listEvents(societyId),
    listOpportunities(societyId, { status: "open" }),
  ]);
  return {
    connections: connections.data.length,
    posts: posts.data.length,
    upcomingEvents: events.data.length,
    openOpportunities: opportunities.data.length,
    source: connections.source,
  };
}

export async function getMapIntelligence(
  societyId: string = SOCIETY,
  areaId?: string,
) {
  const [{ listResidents }, { listBusinesses }, events] = await Promise.all([
    import("./community-people.js"),
    import("./businesses.js"),
    listEvents(societyId),
  ]);
  const [residents, businesses] = await Promise.all([
    listResidents(societyId),
    listBusinesses(societyId),
  ]);

  let areaResidents = residents.data;
  let areaBusinesses = businesses.data;
  let areaEvents = events.data;
  if (areaId) {
    areaResidents = areaResidents.filter((row) => row.geoAreaId === areaId);
    areaBusinesses = areaBusinesses.filter((row) => row.geoAreaId === areaId);
    areaEvents = areaEvents.filter((row) => row.geoAreaId === areaId);
  }

  const professionBuckets = new Map<string, number>();
  for (const resident of areaResidents) {
    const key = resident.primaryProfession ?? "Unspecified";
    professionBuckets.set(key, (professionBuckets.get(key) ?? 0) + 1);
  }

  const minBucket = 1; // demo threshold; production uses society settings (≥5)
  const professions = [...professionBuckets.entries()]
    .map(([label, count]) => ({ label, count, suppressed: count > 0 && count < minBucket }))
    .filter((row) => !row.suppressed)
    .sort((a, b) => b.count - a.count);

  return {
    source: residents.source,
    areaId: areaId ?? null,
    residents: areaResidents.length,
    mentors: areaResidents.filter((row) => row.openToMentoring).length,
    hiringResidents: areaResidents.filter((row) => row.hiring).length,
    businesses: areaBusinesses.length,
    hiringBusinesses: areaBusinesses.filter((row) => row.isHiring).length,
    upcomingEvents: areaEvents.length,
    professions,
    sampleResidents: areaResidents.slice(0, 5).map((row) => ({
      id: row.id,
      fullName: row.fullName,
      headline: row.headline,
    })),
    sampleBusinesses: areaBusinesses.slice(0, 4).map((row) => ({
      id: row.id,
      name: row.name,
      categoryLabel: row.categoryLabel,
    })),
  };
}

/** @internal helper kept for potential future use */
export function resolveResidentName(id: string) {
  return residentName(id, new Map());
}
