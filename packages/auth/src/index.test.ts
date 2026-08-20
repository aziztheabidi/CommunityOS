import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseBearerToken, verifyAccessToken } from "./index.js";

describe("parseBearerToken", () => {
  it("parses bearer headers", () => {
    assert.equal(parseBearerToken("Bearer abc"), "abc");
    assert.equal(parseBearerToken("basic x"), null);
  });
});

describe("verifyAccessToken", () => {
  it("verifies HS256 tokens when jwt secret is provided", async () => {
    const { SignJWT } = await import("jose");
    const secret = "unit-test-secret";
    const token = await new SignJWT({ email: "a@b.co" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("sub-1")
      .sign(new TextEncoder().encode(secret));

    const claims = await verifyAccessToken(token, { jwtSecret: secret });
    assert.equal(claims.sub, "sub-1");
    assert.equal(claims.email, "a@b.co");
  });
});
