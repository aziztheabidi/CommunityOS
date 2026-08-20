import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { startWorker } from "./worker.js";

describe("worker stub", () => {
  it("boots", () => {
    const result = startWorker();
    assert.equal(result.status, "ready");
  });
});
