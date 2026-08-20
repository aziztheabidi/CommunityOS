import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEMO_SOCIETY, buildMapGeoJson, getDemoSocietyByIdOrSlug } from "./green-valley.js";

describe("green valley demo", () => {
  it("resolves society by slug", () => {
    assert.equal(
      getDemoSocietyByIdOrSlug("jaffar-e-tayyar")?.society.name,
      DEMO_SOCIETY.society.name,
    );
  });

  it("builds layered geojson", () => {
    const collection = buildMapGeoJson(DEMO_SOCIETY, ["sector"]);
    assert.equal(collection.type, "FeatureCollection");
    assert.ok(
      collection.features.every(
        (feature: { properties: { layer?: string } }) => feature.properties.layer === "sector",
      ),
    );
  });
});
