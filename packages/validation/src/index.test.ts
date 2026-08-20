import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { societySlugSchema } from "./index.js";

describe("societySlugSchema", () => {
  it("accepts kebab-case", () => {
    assert.equal(societySlugSchema.parse("green-valley"), "green-valley");
  });

  it("rejects uppercase", () => {
    assert.throws(() => societySlugSchema.parse("Green"));
  });
});
