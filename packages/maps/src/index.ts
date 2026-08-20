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
  phase: "#0f6b6b33",
  sector: "#1d8a8a55",
  block: "#c45c2644",
};

export const AREA_LINE_COLORS: Record<string, string> = {
  phase: "#0b4f4f",
  sector: "#0f6b6b",
  block: "#c45c26",
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
