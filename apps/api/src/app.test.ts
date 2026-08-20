import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SignJWT } from "jose";
import { buildServer } from "./app.js";

describe("api health", () => {
  it("returns ok", async () => {
    const app = await buildServer();
    const response = await app.inject({ method: "GET", url: "/health" });
    assert.equal(response.statusCode, 200);
    const body = response.json() as { ok: boolean };
    assert.equal(body.ok, true);
    await app.close();
  });

  it("rejects unauthenticated /v1/me", async () => {
    const app = await buildServer();
    const response = await app.inject({ method: "GET", url: "/v1/me" });
    assert.equal(response.statusCode, 401);
    await app.close();
  });

  it("accepts a valid HS256 access token", async () => {
    process.env.SUPABASE_JWT_SECRET = "test-jwt-secret";
    const token = await new SignJWT({ email: "engineer@communityos.local", role: "authenticated" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject("user_test_1")
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(new TextEncoder().encode("test-jwt-secret"));

    const app = await buildServer();
    const response = await app.inject({
      method: "GET",
      url: "/v1/me",
      headers: { authorization: `Bearer ${token}` },
    });
    assert.equal(response.statusCode, 200);
    const body = response.json() as { data: { subject: string; email: string | null } };
    assert.equal(body.data.subject, "user_test_1");
    assert.equal(body.data.email, "engineer@communityos.local");
    await app.close();
    delete process.env.SUPABASE_JWT_SECRET;
  });
});
