import type { ActorContext } from "@communityos/types";
import type { Permission } from "./catalog.js";

export interface AuthzResource {
  societyId: string;
  geoAreaId?: string;
}

export type AuthzDecision = { allowed: true } | { allowed: false; reason: string };

export function authorize(
  actor: ActorContext,
  permission: Permission,
  resource: AuthzResource,
): AuthzDecision {
  if (actor.societyId !== resource.societyId) {
    return { allowed: false, reason: "Tenant mismatch" };
  }

  if (!actor.permissions.includes(permission)) {
    return { allowed: false, reason: `Missing permission ${permission}` };
  }

  if (
    resource.geoAreaId &&
    actor.geoAreaIds &&
    actor.geoAreaIds.length > 0 &&
    !actor.geoAreaIds.includes(resource.geoAreaId)
  ) {
    return { allowed: false, reason: "Outside geo scope" };
  }

  return { allowed: true };
}

export function hasPermission(actor: ActorContext, permission: Permission): boolean {
  return actor.permissions.includes(permission);
}
