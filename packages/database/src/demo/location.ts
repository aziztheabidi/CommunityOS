/**
 * Jaffar-e-Tayyar Cooperative Housing Society — Malir, Karachi (WGS84).
 * Approximate public center; geometry offsets are relative to this origin.
 */
export const SOCIETY_ORIGIN = {
  lng: 67.196885,
  lat: 24.88446,
  district: "Malir District",
  city: "Karachi",
  postalCode: "75050",
  country: "PK",
} as const;

export function societyLngLat(dx = 0, dy = 0): [number, number] {
  return [
    Number((SOCIETY_ORIGIN.lng + dx).toFixed(6)),
    Number((SOCIETY_ORIGIN.lat + dy).toFixed(6)),
  ];
}
