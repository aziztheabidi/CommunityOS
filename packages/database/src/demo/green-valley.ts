export type DemoGeoJsonGeometry =
  | { type: "Point"; coordinates: [number, number] }
  | { type: "Polygon"; coordinates: number[][][] }
  | { type: "LineString"; coordinates: number[][] };

export type DemoSocietyBundle = {
  society: {
    id: string;
    slug: string;
    name: string;
    timezone: string;
  };
  settings: {
    heatmapMinBucketSize: number;
    branding: { primaryLabel: string; tagline: string };
  };
  levels: Array<{ key: string; label: string; sortOrder: number }>;
  areas: Array<{
    id: string;
    levelKey: string;
    parentId: string | null;
    name: string;
    code: string;
    sortOrder: number;
    geomJson: DemoGeoJsonGeometry;
    centroidJson: DemoGeoJsonGeometry;
    residentEstimate: number;
    householdEstimate: number;
  }>;
  features: Array<{
    id: string;
    featureType: string;
    name: string;
    description: string;
    geomJson: DemoGeoJsonGeometry;
  }>;
  properties: Array<{
    id: string;
    geoAreaId: string;
    label: string;
    addressLine: string;
    propertyType: string;
    status: string;
    geomJson: DemoGeoJsonGeometry;
  }>;
  stats: {
    residents: number;
    households: number;
    properties: number;
    phases: number;
    sectors: number;
    blocks: number;
    amenities: number;
    upcomingEvents: number;
    openOpportunities: number;
  };
};

/** Fictional society footprint near a temperate suburban grid (WGS84). */
const ORIGIN = { lng: 73.055, lat: 33.715 };

function poly(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): DemoGeoJsonGeometry {
  return {
    type: "Polygon",
    coordinates: [
      [
        [ORIGIN.lng + x0, ORIGIN.lat + y0],
        [ORIGIN.lng + x1, ORIGIN.lat + y0],
        [ORIGIN.lng + x1, ORIGIN.lat + y1],
        [ORIGIN.lng + x0, ORIGIN.lat + y1],
        [ORIGIN.lng + x0, ORIGIN.lat + y0],
      ],
    ],
  };
}

function point(x: number, y: number): DemoGeoJsonGeometry {
  return { type: "Point", coordinates: [ORIGIN.lng + x, ORIGIN.lat + y] };
}

function centroidOf(x0: number, y0: number, x1: number, y1: number): DemoGeoJsonGeometry {
  return point((x0 + x1) / 2, (y0 + y1) / 2);
}

const SOCIETY_ID = "soc_demo_jaffar_e_tayyar";

export const DEMO_SOCIETY: DemoSocietyBundle = {
  society: {
    id: SOCIETY_ID,
    slug: "jaffar-e-tayyar",
    name: "Jaffar-e-Tayyar Society",
    timezone: "Asia/Karachi",
  },
  settings: {
    heatmapMinBucketSize: 5,
    branding: {
      primaryLabel: "Jaffar-e-Tayyar",
      tagline: "Connected community. Shared opportunity.",
    },
  },
  levels: [
    { key: "phase", label: "Phase", sortOrder: 1 },
    { key: "sector", label: "Sector", sortOrder: 2 },
    { key: "block", label: "Block", sortOrder: 3 },
  ],
  areas: [
    {
      id: "area_phase_1",
      levelKey: "phase",
      parentId: null,
      name: "Phase 1",
      code: "P1",
      sortOrder: 1,
      geomJson: poly(-0.012, -0.008, 0.004, 0.01),
      centroidJson: centroidOf(-0.012, -0.008, 0.004, 0.01),
      residentEstimate: 4820,
      householdEstimate: 1210,
    },
    {
      id: "area_phase_2",
      levelKey: "phase",
      parentId: null,
      name: "Phase 2",
      code: "P2",
      sortOrder: 2,
      geomJson: poly(0.004, -0.008, 0.016, 0.01),
      centroidJson: centroidOf(0.004, -0.008, 0.016, 0.01),
      residentEstimate: 3160,
      householdEstimate: 840,
    },
    {
      id: "area_sector_a",
      levelKey: "sector",
      parentId: "area_phase_1",
      name: "Sector A",
      code: "A",
      sortOrder: 1,
      geomJson: poly(-0.012, 0.001, -0.004, 0.01),
      centroidJson: centroidOf(-0.012, 0.001, -0.004, 0.01),
      residentEstimate: 1680,
      householdEstimate: 420,
    },
    {
      id: "area_sector_b",
      levelKey: "sector",
      parentId: "area_phase_1",
      name: "Sector B",
      code: "B",
      sortOrder: 2,
      geomJson: poly(-0.004, 0.001, 0.004, 0.01),
      centroidJson: centroidOf(-0.004, 0.001, 0.004, 0.01),
      residentEstimate: 1920,
      householdEstimate: 480,
    },
    {
      id: "area_sector_c",
      levelKey: "sector",
      parentId: "area_phase_1",
      name: "Sector C",
      code: "C",
      sortOrder: 3,
      geomJson: poly(-0.012, -0.008, 0.004, 0.001),
      centroidJson: centroidOf(-0.012, -0.008, 0.004, 0.001),
      residentEstimate: 1220,
      householdEstimate: 310,
    },
    {
      id: "area_sector_d",
      levelKey: "sector",
      parentId: "area_phase_2",
      name: "Sector D",
      code: "D",
      sortOrder: 1,
      geomJson: poly(0.004, 0.001, 0.016, 0.01),
      centroidJson: centroidOf(0.004, 0.001, 0.016, 0.01),
      residentEstimate: 1740,
      householdEstimate: 450,
    },
    {
      id: "area_sector_e",
      levelKey: "sector",
      parentId: "area_phase_2",
      name: "Sector E",
      code: "E",
      sortOrder: 2,
      geomJson: poly(0.004, -0.008, 0.016, 0.001),
      centroidJson: centroidOf(0.004, -0.008, 0.016, 0.001),
      residentEstimate: 1420,
      householdEstimate: 390,
    },
    {
      id: "area_block_a1",
      levelKey: "block",
      parentId: "area_sector_a",
      name: "Block A1",
      code: "A1",
      sortOrder: 1,
      geomJson: poly(-0.012, 0.0055, -0.008, 0.01),
      centroidJson: centroidOf(-0.012, 0.0055, -0.008, 0.01),
      residentEstimate: 420,
      householdEstimate: 105,
    },
    {
      id: "area_block_a2",
      levelKey: "block",
      parentId: "area_sector_a",
      name: "Block A2",
      code: "A2",
      sortOrder: 2,
      geomJson: poly(-0.008, 0.0055, -0.004, 0.01),
      centroidJson: centroidOf(-0.008, 0.0055, -0.004, 0.01),
      residentEstimate: 390,
      householdEstimate: 98,
    },
    {
      id: "area_block_b1",
      levelKey: "block",
      parentId: "area_sector_b",
      name: "Block B1",
      code: "B1",
      sortOrder: 1,
      geomJson: poly(-0.004, 0.0055, 0.0, 0.01),
      centroidJson: centroidOf(-0.004, 0.0055, 0.0, 0.01),
      residentEstimate: 510,
      householdEstimate: 128,
    },
    {
      id: "area_block_b2",
      levelKey: "block",
      parentId: "area_sector_b",
      name: "Block B2",
      code: "B2",
      sortOrder: 2,
      geomJson: poly(0.0, 0.0055, 0.004, 0.01),
      centroidJson: centroidOf(0.0, 0.0055, 0.004, 0.01),
      residentEstimate: 460,
      householdEstimate: 116,
    },
    {
      id: "area_block_d1",
      levelKey: "block",
      parentId: "area_sector_d",
      name: "Block D1",
      code: "D1",
      sortOrder: 1,
      geomJson: poly(0.004, 0.0055, 0.01, 0.01),
      centroidJson: centroidOf(0.004, 0.0055, 0.01, 0.01),
      residentEstimate: 480,
      householdEstimate: 120,
    },
  ],
  features: [
    {
      id: "feat_main_gate",
      featureType: "gate",
      name: "Main Gate",
      description: "Primary entry with visitor management",
      geomJson: point(-0.004, -0.0082),
    },
    {
      id: "feat_east_gate",
      featureType: "gate",
      name: "East Gate",
      description: "Residents & service vehicles",
      geomJson: point(0.0162, 0.001),
    },
    {
      id: "feat_central_park",
      featureType: "park",
      name: "Central Park",
      description: "Playgrounds, walking track, weekend markets",
      geomJson: point(-0.002, 0.003),
    },
    {
      id: "feat_community_center",
      featureType: "community_center",
      name: "Community Center",
      description: "Events hall, committee rooms, coworking corner",
      geomJson: point(0.001, -0.002),
    },
    {
      id: "feat_school",
      featureType: "school",
      name: "Jaffar-e-Tayyar Academy",
      description: "Primary & secondary campus",
      geomJson: point(-0.009, 0.007),
    },
    {
      id: "feat_mosque",
      featureType: "place_of_worship",
      name: "Masjid Al-Noor",
      description: "Central congregational mosque",
      geomJson: point(0.008, 0.006),
    },
    {
      id: "feat_clinic",
      featureType: "medical",
      name: "Valley Care Clinic",
      description: "General practice & urgent care",
      geomJson: point(0.011, -0.003),
    },
    {
      id: "feat_office",
      featureType: "office",
      name: "Society Management Office",
      description: "Admin desk, billing, complaints",
      geomJson: point(-0.001, -0.006),
    },
    {
      id: "feat_commercial",
      featureType: "commercial",
      name: "Plaza Market",
      description: "Groceries, pharmacy, cafes",
      geomJson: point(0.006, -0.005),
    },
  ],
  properties: [
    {
      id: "prop_a1_12",
      geoAreaId: "area_block_a1",
      label: "House A1-12",
      addressLine: "12, Block A1, Sector A, Phase 1",
      propertyType: "house",
      status: "occupied",
      geomJson: point(-0.0105, 0.0075),
    },
    {
      id: "prop_a1_18",
      geoAreaId: "area_block_a1",
      label: "House A1-18",
      addressLine: "18, Block A1, Sector A, Phase 1",
      propertyType: "house",
      status: "occupied",
      geomJson: point(-0.0095, 0.0082),
    },
    {
      id: "prop_a2_05",
      geoAreaId: "area_block_a2",
      label: "House A2-05",
      addressLine: "5, Block A2, Sector A, Phase 1",
      propertyType: "house",
      status: "vacant",
      geomJson: point(-0.0065, 0.007),
    },
    {
      id: "prop_b1_22",
      geoAreaId: "area_block_b1",
      label: "Villa B1-22",
      addressLine: "22, Block B1, Sector B, Phase 1",
      propertyType: "house",
      status: "occupied",
      geomJson: point(-0.0025, 0.0078),
    },
    {
      id: "prop_b1_31",
      geoAreaId: "area_block_b1",
      label: "Apartment B1-31",
      addressLine: "31-A, Block B1, Sector B, Phase 1",
      propertyType: "apartment",
      status: "occupied",
      geomJson: point(-0.0015, 0.0068),
    },
    {
      id: "prop_b2_08",
      geoAreaId: "area_block_b2",
      label: "House B2-08",
      addressLine: "8, Block B2, Sector B, Phase 1",
      propertyType: "house",
      status: "under_construction",
      geomJson: point(0.002, 0.0072),
    },
    {
      id: "prop_c_44",
      geoAreaId: "area_sector_c",
      label: "Plot C-44",
      addressLine: "Plot 44, Sector C, Phase 1",
      propertyType: "plot",
      status: "vacant",
      geomJson: point(-0.006, -0.004),
    },
    {
      id: "prop_d1_09",
      geoAreaId: "area_block_d1",
      label: "House D1-09",
      addressLine: "9, Block D1, Sector D, Phase 2",
      propertyType: "house",
      status: "occupied",
      geomJson: point(0.0065, 0.0075),
    },
    {
      id: "prop_d1_16",
      geoAreaId: "area_block_d1",
      label: "Commercial D1-16",
      addressLine: "16, Block D1, Sector D, Phase 2",
      propertyType: "commercial",
      status: "occupied",
      geomJson: point(0.008, 0.008),
    },
    {
      id: "prop_e_03",
      geoAreaId: "area_sector_e",
      label: "House E-03",
      addressLine: "3, Sector E, Phase 2",
      propertyType: "house",
      status: "occupied",
      geomJson: point(0.01, -0.0045),
    },
    {
      id: "prop_e_21",
      geoAreaId: "area_sector_e",
      label: "House E-21",
      addressLine: "21, Sector E, Phase 2",
      propertyType: "house",
      status: "occupied",
      geomJson: point(0.012, -0.003),
    },
    {
      id: "prop_e_27",
      geoAreaId: "area_sector_e",
      label: "Mixed E-27",
      addressLine: "27, Sector E, Phase 2",
      propertyType: "mixed",
      status: "occupied",
      geomJson: point(0.0135, -0.0055),
    },
  ],
  stats: {
    residents: 7980,
    households: 2050,
    properties: 2140,
    phases: 2,
    sectors: 5,
    blocks: 48,
    amenities: 9,
    upcomingEvents: 6,
    openOpportunities: 14,
  },
};

export function getDemoSocietyByIdOrSlug(idOrSlug: string): DemoSocietyBundle | null {
  if (
    idOrSlug === DEMO_SOCIETY.society.id ||
    idOrSlug === DEMO_SOCIETY.society.slug ||
    idOrSlug === "demo" ||
    idOrSlug === "green-valley" ||
    idOrSlug === "soc_demo_green_valley"
  ) {
    return DEMO_SOCIETY;
  }
  return null;
}

export function buildMapGeoJson(
  bundle: DemoSocietyBundle,
  layers: string[],
): {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    id: string;
    properties: Record<string, unknown>;
    geometry: DemoGeoJsonGeometry;
  }>;
} {
  const features: Array<{
    type: "Feature";
    id: string;
    properties: Record<string, unknown>;
    geometry: DemoGeoJsonGeometry;
  }> = [];
  const want = new Set(
    layers.length ? layers : ["phase", "sector", "block", "amenities", "properties"],
  );

  for (const area of bundle.areas) {
    if (!want.has(area.levelKey)) continue;
    features.push({
      type: "Feature",
      id: area.id,
      properties: {
        id: area.id,
        name: area.name,
        code: area.code,
        levelKey: area.levelKey,
        parentId: area.parentId,
        residentEstimate: area.residentEstimate,
        householdEstimate: area.householdEstimate,
        layer: area.levelKey,
      },
      geometry: area.geomJson,
    });
  }

  if (want.has("amenities") || want.has("features")) {
    for (const feature of bundle.features) {
      features.push({
        type: "Feature",
        id: feature.id,
        properties: {
          id: feature.id,
          name: feature.name,
          description: feature.description,
          featureType: feature.featureType,
          layer: "amenities",
        },
        geometry: feature.geomJson,
      });
    }
  }

  if (want.has("properties")) {
    for (const property of bundle.properties) {
      features.push({
        type: "Feature",
        id: property.id,
        properties: {
          id: property.id,
          name: property.label,
          addressLine: property.addressLine,
          propertyType: property.propertyType,
          status: property.status,
          geoAreaId: property.geoAreaId,
          layer: "properties",
        },
        geometry: property.geomJson,
      });
    }
  }

  return { type: "FeatureCollection", features };
}
