import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildServer } from "./app.js";

describe("society geography api", () => {
  it("lists demo societies", async () => {
    const app = await buildServer();
    const response = await app.inject({ method: "GET", url: "/v1/societies" });
    assert.equal(response.statusCode, 200);
    const body = response.json() as { data: Array<{ slug: string }> };
    assert.equal(body.data[0]?.slug, "jaffar-e-tayyar");
    await app.close();
  });

  it("returns map geojson with sector polygons", async () => {
    const app = await buildServer();
    const response = await app.inject({
      method: "GET",
      url: "/v1/societies/jaffar-e-tayyar/map/geojson?layers=sector,amenities",
    });
    assert.equal(response.statusCode, 200);
    const body = response.json() as {
      type: string;
      features: Array<{ properties: { layer?: string } }>;
    };
    assert.equal(body.type, "FeatureCollection");
    assert.ok(body.features.some((feature) => feature.properties.layer === "sector"));
    assert.ok(body.features.some((feature) => feature.properties.layer === "amenities"));
    await app.close();
  });

  it("filters properties by status", async () => {
    const app = await buildServer();
    const response = await app.inject({
      method: "GET",
      url: "/v1/societies/demo/properties?status=occupied",
    });
    assert.equal(response.statusCode, 200);
    const body = response.json() as { data: Array<{ status: string }> };
    assert.ok(body.data.length > 0);
    assert.ok(body.data.every((row) => row.status === "occupied"));
    await app.close();
  });
});
