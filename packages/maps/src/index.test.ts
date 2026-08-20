import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveGeoPrecision, shouldSuppressAggregate } from "./index.js";

describe("resolveGeoPrecision", () => {
  it("returns the more restrictive precision", () => {
    assert.equal(resolveGeoPrecision("exact", "sector"), "sector");
    assert.equal(resolveGeoPrecision("block", "exact"), "block");
  });
});

describe("shouldSuppressAggregate", () => {
  it("suppresses low-N buckets", () => {
    assert.equal(shouldSuppressAggregate(3, 5), true);
    assert.equal(shouldSuppressAggregate(5, 5), false);
  });
});
