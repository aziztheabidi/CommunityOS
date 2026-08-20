export type SocietyId = string;
export type PlatformUserId = string;

export type MembershipStatus = "active" | "invited" | "suspended" | "left";

export interface SocietySummary {
  id: SocietyId;
  slug: string;
  name: string;
}

export interface ActorContext {
  userId: PlatformUserId;
  societyId: SocietyId;
  permissions: string[];
  geoAreaIds?: string[];
}

export type VisibilityLevel =
  | "private"
  | "household"
  | "connections"
  | "members"
  | "society_admin"
  | "public";

export interface PageInfo {
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface Paginated<T> {
  data: T[];
  pageInfo: PageInfo;
}
