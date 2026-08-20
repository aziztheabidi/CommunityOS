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
