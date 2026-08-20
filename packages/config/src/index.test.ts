import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadEnv } from "./index.js";

describe("loadEnv", () => {
  it("applies defaults", () => {
    const env = loadEnv({ NODE_ENV: "development" });
    assert.equal(env.API_PORT, 4000);
    assert.equal(env.CORS_ORIGIN, "http://localhost:3000");
  });
});
