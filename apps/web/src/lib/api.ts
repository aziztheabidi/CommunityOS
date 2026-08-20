const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const DEFAULT_SOCIETY_ID = "soc_demo_jaffar_e_tayyar";

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`API ${path} failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export type SocietySummary = {
  id: string;
  slug: string;
  name: string;
  timezone: string;
  source?: string;
};

export type SocietyDetail = SocietySummary & {
  settings: {
    heatmapMinBucketSize: number;
    branding: { primaryLabel: string; tagline: string };
  };
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

export type GeoArea = {
  id: string;
  levelKey: string;
  parentId: string | null;
  name: string;
  code: string;
  sortOrder: number;
  residentEstimate: number;
  householdEstimate: number;
};

export type PropertyRow = {
  id: string;
  geoAreaId: string;
  label: string;
  addressLine: string;
  propertyType: string;
  status: string;
};

export type GeoFeature = {
  id: string;
  featureType: string;
  name: string;
  description: string;
};

export type MapFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    id: string;
    properties: Record<string, unknown>;
    geometry: {
      type: string;
      coordinates: unknown;
    };
  }>;
};

export type ResidentRow = {
  id: string;
  fullName: string;
  preferredName: string | null;
  headline: string | null;
  status: string;
  geoAreaId: string | null;
  geoAreaName: string | null;
  employmentStatus: string;
  openToMentoring: boolean;
  lookingForWork: boolean;
  hiring: boolean;
  volunteerAvail: boolean;
  primaryProfession: string | null;
  skills: string[];
};

export type ResidentDetail = ResidentRow & {
  bio: string | null;
  email: string | null;
  phone: string | null;
  yearsExperience: number | null;
  openToNetworking: boolean;
  openToConsulting: boolean;
  openToFreelance: boolean;
  profileCompleteness: number;
  professions: Array<{
    title: string | null;
    label: string;
    categoryLabel: string | null;
    isPrimary: boolean;
  }>;
  employment: Array<{
    employer: string | null;
    jobTitle: string;
    isCurrent: boolean;
    startYear: number | null;
  }>;
  household: { id: string; label: string | null; role: string; isPrimary: boolean } | null;
};

export type HouseholdRow = {
  id: string;
  label: string | null;
  propertyId: string | null;
  householdSize: number;
  primaryResidentId: string | null;
  members: Array<{
    id: string;
    fullName: string;
    role: string;
    isPrimary: boolean;
    headline: string | null;
  }>;
};

export type ProfessionalCategory = {
  id: string;
  key: string;
  label: string;
  sortOrder: number;
  professions: Array<{ id: string; key: string; label: string }>;
};

export function fetchSocieties() {
  return apiGet<{ data: SocietySummary[] }>("/v1/societies");
}

export function fetchSociety(societyId = DEFAULT_SOCIETY_ID) {
  return apiGet<{ data: SocietyDetail }>(`/v1/societies/${societyId}`);
}

export function fetchGeoAreas(societyId = DEFAULT_SOCIETY_ID, levelKey?: string) {
  const query = levelKey ? `?levelKey=${encodeURIComponent(levelKey)}` : "";
  return apiGet<{ data: GeoArea[] }>(`/v1/societies/${societyId}/geo/areas${query}`);
}

export function fetchProperties(societyId = DEFAULT_SOCIETY_ID, params?: { q?: string; status?: string }) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.status) search.set("status", params.status);
  const suffix = search.toString() ? `?${search}` : "";
  return apiGet<{ data: PropertyRow[] }>(`/v1/societies/${societyId}/properties${suffix}`);
}

export function fetchFeatures(societyId = DEFAULT_SOCIETY_ID) {
  return apiGet<{ data: GeoFeature[] }>(`/v1/societies/${societyId}/geo/features`);
}

export function fetchMapGeoJson(societyId = DEFAULT_SOCIETY_ID, layers: string[]) {
  const query = layers.length ? `?layers=${encodeURIComponent(layers.join(","))}` : "";
  return apiGet<MapFeatureCollection>(`/v1/societies/${societyId}/map/geojson${query}`);
}

export function fetchResidents(
  societyId = DEFAULT_SOCIETY_ID,
  params?: { q?: string; mentoring?: boolean; hiring?: boolean; lookingForWork?: boolean },
) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.mentoring) search.set("mentoring", "true");
  if (params?.hiring) search.set("hiring", "true");
  if (params?.lookingForWork) search.set("lookingForWork", "true");
  const suffix = search.toString() ? `?${search}` : "";
  return apiGet<{ data: ResidentRow[]; source?: string }>(
    `/v1/societies/${societyId}/residents${suffix}`,
  );
}

export function fetchResident(residentId: string, societyId = DEFAULT_SOCIETY_ID) {
  return apiGet<{ data: ResidentDetail; source?: string }>(
    `/v1/societies/${societyId}/residents/${residentId}`,
  );
}

export function fetchHouseholds(societyId = DEFAULT_SOCIETY_ID) {
  return apiGet<{ data: HouseholdRow[]; source?: string }>(
    `/v1/societies/${societyId}/households`,
  );
}

export function fetchProfessionalCategories(societyId = DEFAULT_SOCIETY_ID) {
  return apiGet<{ data: ProfessionalCategory[]; source?: string }>(
    `/v1/societies/${societyId}/professional-categories`,
  );
}

export function fetchProfessionals(
  societyId = DEFAULT_SOCIETY_ID,
  params?: { categoryKey?: string; professionKey?: string; mentoring?: boolean; q?: string },
) {
  const search = new URLSearchParams();
  if (params?.categoryKey) search.set("categoryKey", params.categoryKey);
  if (params?.professionKey) search.set("professionKey", params.professionKey);
  if (params?.mentoring) search.set("mentoring", "true");
  if (params?.q) search.set("q", params.q);
  const suffix = search.toString() ? `?${search}` : "";
  return apiGet<{ data: ResidentRow[]; source?: string }>(
    `/v1/societies/${societyId}/professionals${suffix}`,
  );
}

export function fetchPeopleStats(societyId = DEFAULT_SOCIETY_ID) {
  return apiGet<{
    data: {
      residents: number;
      households: number;
      mentors: number;
      hiring: number;
      lookingForWork: number;
      source: string;
    };
  }>(`/v1/societies/${societyId}/people/stats`);
}

export type BusinessCategory = {
  id: string;
  key: string;
  label: string;
  sortOrder: number;
};

export type BusinessRow = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  categoryKey: string;
  categoryLabel: string;
  phone: string | null;
  geoAreaId: string | null;
  geoAreaName: string | null;
  addressLine: string | null;
  isResidentOwned: boolean;
  isHiring: boolean;
  offersResidentDiscount: boolean;
  verification: string;
  owners: Array<{ residentId: string; fullName: string; title: string | null }>;
  services: string[];
};

export function fetchBusinessCategories(societyId = DEFAULT_SOCIETY_ID) {
  return apiGet<{ data: BusinessCategory[]; source?: string }>(
    `/v1/societies/${societyId}/business-categories`,
  );
}

export function fetchBusinesses(
  societyId = DEFAULT_SOCIETY_ID,
  params?: { q?: string; categoryKey?: string; hiring?: boolean; residentOwned?: boolean },
) {
  const search = new URLSearchParams();
  if (params?.q) search.set("q", params.q);
  if (params?.categoryKey) search.set("categoryKey", params.categoryKey);
  if (params?.hiring) search.set("hiring", "true");
  if (params?.residentOwned) search.set("residentOwned", "true");
  const suffix = search.toString() ? `?${search}` : "";
  return apiGet<{ data: BusinessRow[]; source?: string }>(
    `/v1/societies/${societyId}/businesses${suffix}`,
  );
}

export type ConnectionRow = {
  id: string;
  status: string;
  message: string | null;
  createdAt: string;
  from: { id: string; fullName: string; headline: string | null };
  to: { id: string; fullName: string; headline: string | null };
};

export type PostRow = {
  id: string;
  authorId: string;
  authorName: string;
  kind: string;
  body: string;
  geoAreaId: string | null;
  isPinned: boolean;
  createdAt: string;
  reactionCount: number;
  commentCount: number;
};

export type EventRow = {
  id: string;
  hostId: string | null;
  hostName: string | null;
  title: string;
  summary: string | null;
  locationName: string | null;
  geoAreaId: string | null;
  startsAt: string;
  capacity: number | null;
  goingCount: number;
  interestedCount: number;
};

export type OpportunityRow = {
  id: string;
  posterId: string | null;
  posterName: string | null;
  kind: string;
  status: string;
  title: string;
  summary: string | null;
  compensation: string | null;
  isRemoteOk: boolean;
  applicationCount: number;
};

export type MapIntelligence = {
  source: string;
  areaId: string | null;
  residents: number;
  mentors: number;
  hiringResidents: number;
  businesses: number;
  hiringBusinesses: number;
  upcomingEvents: number;
  professions: Array<{ label: string; count: number; suppressed: boolean }>;
  sampleResidents: Array<{ id: string; fullName: string; headline: string | null }>;
  sampleBusinesses: Array<{ id: string; name: string; categoryLabel: string }>;
};

export function fetchConnections(societyId = DEFAULT_SOCIETY_ID, status?: string) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiGet<{ data: ConnectionRow[]; source?: string }>(
    `/v1/societies/${societyId}/connections${query}`,
  );
}

export function fetchPosts(societyId = DEFAULT_SOCIETY_ID, kind?: string) {
  const query = kind ? `?kind=${encodeURIComponent(kind)}` : "";
  return apiGet<{ data: PostRow[]; source?: string }>(`/v1/societies/${societyId}/posts${query}`);
}

export function fetchEvents(societyId = DEFAULT_SOCIETY_ID) {
  return apiGet<{ data: EventRow[]; source?: string }>(`/v1/societies/${societyId}/events`);
}

export function fetchOpportunities(
  societyId = DEFAULT_SOCIETY_ID,
  params?: { kind?: string; status?: string; q?: string },
) {
  const search = new URLSearchParams();
  if (params?.kind) search.set("kind", params.kind);
  if (params?.status) search.set("status", params.status);
  if (params?.q) search.set("q", params.q);
  const suffix = search.toString() ? `?${search}` : "";
  return apiGet<{ data: OpportunityRow[]; source?: string }>(
    `/v1/societies/${societyId}/opportunities${suffix}`,
  );
}

export function fetchCommunityStats(societyId = DEFAULT_SOCIETY_ID) {
  return apiGet<{
    data: {
      connections: number;
      posts: number;
      upcomingEvents: number;
      openOpportunities: number;
      source: string;
    };
  }>(`/v1/societies/${societyId}/community/stats`);
}

export function fetchMapIntelligence(societyId = DEFAULT_SOCIETY_ID, areaId?: string) {
  const query = areaId ? `?areaId=${encodeURIComponent(areaId)}` : "";
  return apiGet<{ data: MapIntelligence }>(
    `/v1/societies/${societyId}/map/intelligence${query}`,
  );
}
