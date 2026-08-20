import { startWorker } from "./worker.js";

const boot = startWorker();
console.log(
  JSON.stringify({
    service: "communityos-worker",
    ...boot,
    message: "Worker scaffold online. Job processors arrive in later milestones.",
  }),
);

if (!process.env.WORKER_KEEPALIVE) {
  setTimeout(() => process.exit(0), 50);
}
