import type { FastifyPluginAsync } from "fastify";

export const meRoutes: FastifyPluginAsync = async (app) => {
  app.get("/me", async (request, reply) => {
    if (!request.auth) {
      return reply.code(401).send({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
          details: [],
        },
      });
    }

    return {
      data: {
        subject: request.auth.sub,
        email: request.auth.email ?? null,
        role: request.auth.role ?? null,
      },
    };
  });
};
