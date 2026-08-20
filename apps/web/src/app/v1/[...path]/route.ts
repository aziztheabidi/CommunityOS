import { handleV1Request } from "@/server/v1-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path?: string[] }> };

async function handle(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const url = new URL(request.url);
  // Ensure pathname is /v1/... even if the catch-all omits the prefix in some runtimes.
  if (!url.pathname.startsWith("/v1")) {
    const suffix = path?.length ? `/${path.join("/")}` : "";
    url.pathname = `/v1${suffix}`;
  }
  return handleV1Request(new Request(url, request));
}

export const GET = handle;
