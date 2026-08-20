import { loadEnv } from "@communityos/config";

/**
 * Milestone 0 worker stub. BullMQ processors land with imports/analytics jobs.
 */
export function startWorker(): { status: "ready"; queueBackend: string } {
  const env = loadEnv();
  return {
    status: "ready",
    queueBackend: env.REDIS_URL ? "redis" : "unconfigured",
  };
}
