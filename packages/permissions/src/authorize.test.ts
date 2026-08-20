import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { authorize } from "./authorize.js";
import type { ActorContext } from "@communityos/types";

const actor: ActorContext = {
  userId: "user_1",
  societyId: "soc_1",
  permissions: ["residents.read", "map.resident_view"],
  geoAreaIds: ["area_a"],
};

describe("authorize", () => {
  it("allows matching tenant + permission", () => {
    const decision = authorize(actor, "residents.read", { societyId: "soc_1" });
    assert.equal(decision.allowed, true);
  });

  it("denies cross-tenant access", () => {
    const decision = authorize(actor, "residents.read", { societyId: "soc_2" });
    assert.equal(decision.allowed, false);
  });

  it("denies missing permission", () => {
    const decision = authorize(actor, "exports.create", { societyId: "soc_1" });
    assert.equal(decision.allowed, false);
  });

  it("enforces geo scope when present", () => {
    const decision = authorize(actor, "residents.read", {
      societyId: "soc_1",
      geoAreaId: "area_b",
    });
    assert.equal(decision.allowed, false);
  });
});
