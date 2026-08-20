import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { loadEnv } from "@communityos/config";
import { authPlugin } from "./plugins/auth.js";
import { communityRoutes } from "./routes/community.js";
import { healthRoutes } from "./routes/health.js";
import { meRoutes } from "./routes/me.js";
import { societyRoutes } from "./routes/societies.js";

export async function buildServer() {
  const env = loadEnv();
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
    },
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });
  await app.register(rateLimit, {
    max: 200,
    timeWindow: "1 minute",
  });
  await app.register(authPlugin, {
    jwtSecret: env.SUPABASE_JWT_SECRET,
    supabaseUrl: env.SUPABASE_URL,
  });
  await app.register(healthRoutes);
  await app.register(meRoutes, { prefix: "/v1" });
  await app.register(societyRoutes, { prefix: "/v1" });
  await app.register(communityRoutes, { prefix: "/v1" });

  return app;
}
