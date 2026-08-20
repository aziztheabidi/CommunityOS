import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { parseBearerToken, verifyAccessToken } from "@communityos/auth";
import type { AuthClaims } from "@communityos/auth";

declare module "fastify" {
  interface FastifyRequest {
    auth: AuthClaims | null;
  }
}

export type AuthPluginOptions = {
  jwtSecret?: string;
  supabaseUrl?: string;
};

const authPluginImpl: FastifyPluginAsync<AuthPluginOptions> = async (app, opts) => {
  app.decorateRequest("auth", null);

  app.addHook("onRequest", async (request) => {
    const token = parseBearerToken(request.headers.authorization);
    if (!token) {
      request.auth = null;
      return;
    }

    try {
      request.auth = await verifyAccessToken(token, {
        jwtSecret: opts.jwtSecret,
        supabaseUrl: opts.supabaseUrl,
      });
    } catch {
      request.auth = null;
    }
  });
};

/** Break Fastify encapsulation so auth applies to sibling route plugins. */
export const authPlugin = fp(authPluginImpl, {
  name: "communityos-auth",
});
