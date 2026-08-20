import type { FastifyPluginAsync } from "fastify";
import {
  getBusinessDetail,
  getCommunityLifeStats,
  getCommunityPeopleStats,
  getMapIntelligence,
  getResidentDetail,
  listBusinessCategories,
  listBusinesses,
  listConnections,
  listEvents,
  listHouseholds,
  listOpportunities,
  listPosts,
  listProfessionalCategories,
  listProfessionals,
  listResidents,
} from "@communityos/database";

function parseBool(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  if (value === "1" || value === "true") return true;
  if (value === "0" || value === "false") return false;
  return undefined;
}

export const communityRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Params: { societyId: string } }>(
    "/societies/:societyId/people/stats",
    async (request) => {
      const stats = await getCommunityPeopleStats(request.params.societyId);
      return { data: stats };
    },
  );

  app.get<{
    Params: { societyId: string };
    Querystring: { q?: string; mentoring?: string; hiring?: string; lookingForWork?: string };
  }>("/societies/:societyId/residents", async (request) => {
    const result = await listResidents(request.params.societyId, {
      q: request.query.q,
      mentoring: parseBool(request.query.mentoring),
      hiring: parseBool(request.query.hiring),
      lookingForWork: parseBool(request.query.lookingForWork),
    });
    return {
      data: result.data,
      source: result.source,
      pageInfo: { nextCursor: null, hasNextPage: false },
    };
  });

  app.get<{ Params: { societyId: string; residentId: string } }>(
    "/societies/:societyId/residents/:residentId",
    async (request, reply) => {
      const result = await getResidentDetail(request.params.residentId, request.params.societyId);
      if (!result) {
        return reply.code(404).send({
          error: { code: "NOT_FOUND", message: "Resident not found", details: [] },
        });
      }
      return { data: result.data, source: result.source };
    },
  );

  app.get<{ Params: { societyId: string } }>(
    "/societies/:societyId/households",
    async (request) => {
      const result = await listHouseholds(request.params.societyId);
      return { data: result.data, source: result.source };
    },
  );

  app.get<{ Params: { societyId: string } }>(
    "/societies/:societyId/professional-categories",
    async (request) => {
      const result = await listProfessionalCategories(request.params.societyId);
      return { data: result.data, source: result.source };
    },
  );

  app.get<{
    Params: { societyId: string };
    Querystring: { categoryKey?: string; professionKey?: string; mentoring?: string; q?: string };
  }>("/societies/:societyId/professionals", async (request) => {
    const result = await listProfessionals(request.params.societyId, {
      categoryKey: request.query.categoryKey,
      professionKey: request.query.professionKey,
      mentoring: parseBool(request.query.mentoring),
      q: request.query.q,
    });
    return {
      data: result.data,
      source: result.source,
      pageInfo: { nextCursor: null, hasNextPage: false },
    };
  });

  app.get<{ Params: { societyId: string } }>(
    "/societies/:societyId/business-categories",
    async (request) => {
      const result = await listBusinessCategories(request.params.societyId);
      return { data: result.data, source: result.source };
    },
  );

  app.get<{
    Params: { societyId: string };
    Querystring: { q?: string; categoryKey?: string; hiring?: string; residentOwned?: string };
  }>("/societies/:societyId/businesses", async (request) => {
    const result = await listBusinesses(request.params.societyId, {
      q: request.query.q,
      categoryKey: request.query.categoryKey,
      hiring: parseBool(request.query.hiring),
      residentOwned: parseBool(request.query.residentOwned),
    });
    return {
      data: result.data,
      source: result.source,
      pageInfo: { nextCursor: null, hasNextPage: false },
    };
  });

  app.get<{ Params: { societyId: string; businessId: string } }>(
    "/societies/:societyId/businesses/:businessId",
    async (request, reply) => {
      const result = await getBusinessDetail(request.params.businessId, request.params.societyId);
      if (!result) {
        return reply.code(404).send({
          error: { code: "NOT_FOUND", message: "Business not found", details: [] },
        });
      }
      return { data: result.data, source: result.source };
    },
  );

  app.get<{
    Params: { societyId: string };
    Querystring: { status?: string };
  }>("/societies/:societyId/connections", async (request) => {
    const result = await listConnections(request.params.societyId, {
      status: request.query.status,
    });
    return { data: result.data, source: result.source };
  });

  app.get<{
    Params: { societyId: string };
    Querystring: { kind?: string };
  }>("/societies/:societyId/posts", async (request) => {
    const result = await listPosts(request.params.societyId, { kind: request.query.kind });
    return {
      data: result.data,
      source: result.source,
      pageInfo: { nextCursor: null, hasNextPage: false },
    };
  });

  app.get<{ Params: { societyId: string } }>(
    "/societies/:societyId/events",
    async (request) => {
      const result = await listEvents(request.params.societyId);
      return { data: result.data, source: result.source };
    },
  );

  app.get<{
    Params: { societyId: string };
    Querystring: { kind?: string; status?: string; q?: string };
  }>("/societies/:societyId/opportunities", async (request) => {
    const result = await listOpportunities(request.params.societyId, {
      kind: request.query.kind,
      status: request.query.status,
      q: request.query.q,
    });
    return {
      data: result.data,
      source: result.source,
      pageInfo: { nextCursor: null, hasNextPage: false },
    };
  });

  app.get<{ Params: { societyId: string } }>(
    "/societies/:societyId/community/stats",
    async (request) => {
      const stats = await getCommunityLifeStats(request.params.societyId);
      return { data: stats };
    },
  );

  app.get<{
    Params: { societyId: string };
    Querystring: { areaId?: string };
  }>("/societies/:societyId/map/intelligence", async (request) => {
    const data = await getMapIntelligence(request.params.societyId, request.query.areaId);
    return { data };
  });
};
