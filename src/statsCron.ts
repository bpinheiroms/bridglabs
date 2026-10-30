import { collectStats } from "./statsCollector";

type R2Binding = {
  put(
    key: string,
    value: string,
    options: { httpMetadata: { contentType: string; cacheControl: string } },
  ): Promise<unknown>;
};

type ExecutionContext = {
  waitUntil(promise: Promise<unknown>): void;
};

type Env = {
  BUCKET: R2Binding;
  POSTHOG_API_KEY: string;
};

/** Writes today's numbers where the page reads them, at stats.bridglabs.com/stats.json. */
async function publishStats(env: Env) {
  const stats = await collectStats(env.POSTHOG_API_KEY);
  await env.BUCKET.put("stats.json", JSON.stringify(stats), {
    httpMetadata: { contentType: "application/json", cacheControl: "public, max-age=3600" },
  });
}

export default {
  async scheduled(_controller: unknown, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(publishStats(env));
  },
};
