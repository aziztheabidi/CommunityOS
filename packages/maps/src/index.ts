export const MAP_LAYERS = [
  "society_boundary",
  "phase",
  "sector",
  "block",
  "property",
  "amenities",
  "businesses",
  "events",
  "resident_density",
  "profession_heatmap",
] as const;

export type MapLayerId = (typeof MAP_LAYERS)[number];

/** Default view for Jaffar-e-Tayyar CHS, Malir, Karachi (WGS84). */
export const DEFAULT_MAP_CENTER: [number, number] = [67.196885, 24.88446];
export const DEFAULT_MAP_ZOOM = 15;

export type BasemapId = "satellite" | "streets";

export type MapStyleSpec = {
  version: 8;
  sources: Record<
    string,
    {
      type: "raster";
      tiles: string[];
      tileSize: number;
      attribution: string;
      maxzoom?: number;
    }
  >;
  layers: Array<{
    id: string;
    type: "raster";
    source: string;
    minzoom?: number;
    maxzoom?: number;
  }>;
};

/**
 * Raster basemaps for MapLibre. Geometry stays in PostGIS / GeoJSON independently.
 * Satellite uses Esri World Imagery (attribution required); streets uses OSM.
 */
export function buildBasemapStyle(basemap: BasemapId = "satellite"): MapStyleSpec {
  if (basemap === "streets") {
    return {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
          maxzoom: 19,
        },
      },
      layers: [{ id: "basemap-streets", type: "raster", source: "osm" }],
    };
  }

  return {
    version: 8,
    sources: {
      esri_imagery: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution:
          "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        maxzoom: 19,
      },
      esri_labels: {
        type: "raster",
        tiles: [
          "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "Labels © Esri",
        maxzoom: 19,
      },
    },
    layers: [
      { id: "basemap-satellite", type: "raster", source: "esri_imagery" },
      { id: "basemap-labels", type: "raster", source: "esri_labels" },
    ],
  };
}

export type GeoPrecision = "exact" | "plot" | "block" | "sector" | "phase" | "society" | "hidden";

export function resolveGeoPrecision(
  viewerMax: GeoPrecision,
  subjectPreference: GeoPrecision,
): GeoPrecision {
  const order: GeoPrecision[] = [
    "hidden",
    "society",
    "phase",
    "sector",
    "block",
    "plot",
    "exact",
  ];
  const viewerIdx = order.indexOf(viewerMax);
  const subjectIdx = order.indexOf(subjectPreference);
  return order[Math.min(viewerIdx, subjectIdx)] ?? "hidden";
}

export function shouldSuppressAggregate(count: number, minBucketSize: number): boolean {
  return count > 0 && count < minBucketSize;
}

export type LayerToggle = {
  id: string;
  label: string;
  defaultOn?: boolean;
};

export const DEFAULT_MAP_LAYER_TOGGLES: LayerToggle[] = [
  { id: "phase", label: "Phases", defaultOn: true },
  { id: "sector", label: "Sectors", defaultOn: true },
  { id: "block", label: "Blocks", defaultOn: false },
  { id: "amenities", label: "Amenities", defaultOn: true },
  { id: "properties", label: "Properties", defaultOn: true },
  { id: "businesses", label: "Businesses", defaultOn: true },
  { id: "events", label: "Events", defaultOn: false },
];

export const AREA_FILL_COLORS: Record<string, string> = {
  phase: "#ffffff33",
  sector: "#5eead455",
  block: "#f5f3ef66",
};

export const AREA_LINE_COLORS: Record<string, string> = {
  phase: "#ffffff",
  sector: "#99f6e4",
  block: "#f5f3ef",
};

export const FEATURE_MARKER_COLORS: Record<string, string> = {
  gate: "#0b1f24",
  park: "#1f7a4d",
  school: "#0f6b6b",
  place_of_worship: "#5b4b8a",
  medical: "#b42318",
  commercial: "#c45c26",
  office: "#355c7d",
  community_center: "#0f6b6b",
  amenity: "#0f6b6b",
  other: "#6b7280",
};
