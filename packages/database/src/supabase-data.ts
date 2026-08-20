import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { DEMO_SOCIETY } from "./demo/green-valley.js";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} in environment`);
  }
  return value;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createServiceClient(): SupabaseClient {
  return createClient(requiredEnv("SUPABASE_URL"), requiredEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function seedJaffarETayyarViaSupabase(
  client: SupabaseClient = createServiceClient(),
): Promise<{ societyId: string }> {
  const now = new Date().toISOString();
  const society = DEMO_SOCIETY.society;

  const { error: societyError } = await client.from("societies").upsert(
    {
      id: society.id,
      slug: society.slug,
      name: society.name,
      timezone: society.timezone,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    { onConflict: "id" },
  );
  if (societyError) throw societyError;

  const { error: settingsError } = await client.from("society_settings").upsert(
    {
      id: `settings_${society.id}`,
      societyId: society.id,
      heatmapMinBucketSize: DEMO_SOCIETY.settings.heatmapMinBucketSize,
      featureFlags: {},
      branding: DEMO_SOCIETY.settings.branding,
      createdAt: now,
      updatedAt: now,
    },
    { onConflict: "societyId" },
  );
  if (settingsError) throw settingsError;

  const { error: levelsError } = await client.from("geo_level_definitions").upsert(
    DEMO_SOCIETY.levels.map((level) => ({
      id: `level_${society.id}_${level.key}`,
      societyId: society.id,
      key: level.key,
      label: level.label,
      sortOrder: level.sortOrder,
      createdAt: now,
      updatedAt: now,
    })),
    { onConflict: "societyId,key" },
  );
  if (levelsError) throw levelsError;

  // Parents before children
  const orderedAreas = [...DEMO_SOCIETY.areas].sort((a, b) => {
    const rank = (levelKey: string) =>
      levelKey === "phase" ? 0 : levelKey === "sector" ? 1 : 2;
    return rank(a.levelKey) - rank(b.levelKey) || a.sortOrder - b.sortOrder;
  });

  for (const area of orderedAreas) {
    const { error } = await client.from("geo_areas").upsert(
      {
        id: area.id,
        societyId: society.id,
        levelKey: area.levelKey,
        parentId: area.parentId,
        name: area.name,
        code: area.code,
        sortOrder: area.sortOrder,
        geomJson: area.geomJson,
        centroidJson: area.centroidJson,
        metadata: {
          residentEstimate: area.residentEstimate,
          householdEstimate: area.householdEstimate,
        },
        createdAt: now,
        updatedAt: now,
      },
      { onConflict: "id" },
    );
    if (error) throw error;
  }

  const { error: featuresError } = await client.from("geo_features").upsert(
    DEMO_SOCIETY.features.map((feature) => ({
      id: feature.id,
      societyId: society.id,
      featureType: feature.featureType,
      name: feature.name,
      description: feature.description,
      geomJson: feature.geomJson,
      properties: {},
      createdAt: now,
      updatedAt: now,
    })),
    { onConflict: "id" },
  );
  if (featuresError) throw featuresError;

  const { error: propertiesError } = await client.from("properties").upsert(
    DEMO_SOCIETY.properties.map((property) => ({
      id: property.id,
      societyId: society.id,
      geoAreaId: property.geoAreaId,
      label: property.label,
      addressLine: property.addressLine,
      propertyType: property.propertyType,
      status: property.status,
      geomJson: property.geomJson,
      metadata: {},
      createdAt: now,
      updatedAt: now,
    })),
    { onConflict: "id" },
  );
  if (propertiesError) throw propertiesError;

  return { societyId: society.id };
}

export async function loadSocietyBundleFromSupabase(
  idOrSlug: string,
  client: SupabaseClient = createServiceClient(),
) {
  const { data: society, error: societyError } = await client
    .from("societies")
    .select("id, slug, name, timezone, society_settings(heatmapMinBucketSize, branding)")
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .maybeSingle();

  if (societyError) throw societyError;
  if (!society) return null;

  const societyId = society.id as string;

  const [{ data: levels }, { data: areas }, { data: features }, { data: properties }] =
    await Promise.all([
      client
        .from("geo_level_definitions")
        .select("key, label, sortOrder")
        .eq("societyId", societyId)
        .order("sortOrder"),
      client
        .from("geo_areas")
        .select(
          "id, levelKey, parentId, name, code, sortOrder, geomJson, centroidJson, metadata",
        )
        .eq("societyId", societyId)
        .order("sortOrder"),
      client
        .from("geo_features")
        .select("id, featureType, name, description, geomJson")
        .eq("societyId", societyId),
      client
        .from("properties")
        .select("id, geoAreaId, label, addressLine, propertyType, status, geomJson")
        .eq("societyId", societyId),
    ]);

  const settingsRow = Array.isArray(society.society_settings)
    ? society.society_settings[0]
    : society.society_settings;

  const mappedAreas = (areas ?? []).map((area) => {
    const metadata = (area.metadata ?? {}) as {
      residentEstimate?: number;
      householdEstimate?: number;
    };
    return {
      id: area.id as string,
      levelKey: area.levelKey as string,
      parentId: (area.parentId as string | null) ?? null,
      name: area.name as string,
      code: (area.code as string) ?? "",
      sortOrder: (area.sortOrder as number) ?? 0,
      geomJson: area.geomJson,
      centroidJson: area.centroidJson,
      residentEstimate: metadata.residentEstimate ?? 0,
      householdEstimate: metadata.householdEstimate ?? 0,
    };
  });

  return {
    society: {
      id: societyId,
      slug: society.slug as string,
      name: society.name as string,
      timezone: society.timezone as string,
    },
    settings: {
      heatmapMinBucketSize: (settingsRow?.heatmapMinBucketSize as number) ?? 5,
      branding: (settingsRow?.branding as { primaryLabel: string; tagline: string }) ?? {
        primaryLabel: society.name as string,
        tagline: "",
      },
    },
    levels: (levels ?? []).map((level) => ({
      key: level.key as string,
      label: level.label as string,
      sortOrder: (level.sortOrder as number) ?? 0,
    })),
    areas: mappedAreas,
    features: (features ?? []).map((feature) => ({
      id: feature.id as string,
      featureType: feature.featureType as string,
      name: feature.name as string,
      description: (feature.description as string) ?? "",
      geomJson: feature.geomJson,
    })),
    properties: (properties ?? []).map((property) => ({
      id: property.id as string,
      geoAreaId: (property.geoAreaId as string) ?? "",
      label: property.label as string,
      addressLine: (property.addressLine as string) ?? "",
      propertyType: property.propertyType as string,
      status: property.status as string,
      geomJson: property.geomJson,
    })),
    stats: {
      residents: mappedAreas
        .filter((area) => area.levelKey === "phase")
        .reduce((sum, area) => sum + area.residentEstimate, 0),
      households: mappedAreas
        .filter((area) => area.levelKey === "phase")
        .reduce((sum, area) => sum + area.householdEstimate, 0),
      properties: (properties ?? []).length,
      phases: mappedAreas.filter((area) => area.levelKey === "phase").length,
      sectors: mappedAreas.filter((area) => area.levelKey === "sector").length,
      blocks: mappedAreas.filter((area) => area.levelKey === "block").length,
      amenities: (features ?? []).length,
      upcomingEvents: DEMO_SOCIETY.stats.upcomingEvents,
      openOpportunities: DEMO_SOCIETY.stats.openOpportunities,
    },
  };
}
