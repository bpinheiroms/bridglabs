import type { Stats } from "./stats";

const POSTHOG_HOST = "https://us.posthog.com";

// One query per product, each read once over everything since it launched.
const queries = {
  overcoded: {
    project: 661856,
    sql: `SELECT
        uniq(person_id) AS visitors,
        uniqIf(person_id, event = 'company_founded') AS players,
        countIf(event = 'round_started') AS rounds
      FROM events
      WHERE timestamp >= toDateTime('2026-10-01 00:00:00')`,
  },
  adevinha: {
    project: 681912,
    sql: `SELECT
        countIf(event = 'game_started') AS games,
        countIf(event = 'answer_submitted') AS answers
      FROM events
      WHERE timestamp >= toDateTime('2026-10-01 00:00:00')
        AND event IN ('game_started', 'answer_submitted')`,
  },
  // Stripe payments already reach PostHog as events carrying their BRL amount.
  jobsSearch: {
    project: 595773,
    sql: `SELECT
        countIf(event = 'payment_confirmed') AS subscribers,
        sumIf(toFloat(properties.value_amount), event IN ('payment_confirmed', 'subscription_renewed')) AS revenue,
        countIf(event = 'mcp_request_completed') AS requests
      FROM events
      WHERE timestamp >= toDateTime('2026-09-01 00:00:00')
        AND event IN ('payment_confirmed', 'subscription_renewed', 'mcp_request_completed')`,
  },
} as const;

async function queryRow(apiKey: string, project: number, sql: string) {
  const response = await fetch(`${POSTHOG_HOST}/api/projects/${project}/query/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query: sql }, name: "bridglabs-stats" }),
  });
  if (!response.ok) throw new Error(`PostHog ${project} answered ${response.status}`);

  const { columns, results } = (await response.json()) as { columns: string[]; results: unknown[][] };
  const row = results[0] ?? [];
  return Object.fromEntries(columns.map((column, index) => [column, Number(row[index])]));
}

export async function collectStats(apiKey: string): Promise<Stats> {
  const [overcoded, adevinha, jobsSearch] = await Promise.all(
    Object.values(queries).map(({ project, sql }) => queryRow(apiKey, project, sql)),
  );

  return {
    updatedAt: new Date().toISOString(),
    overcoded: { visitors: overcoded.visitors, players: overcoded.players, rounds: overcoded.rounds },
    adevinha: { games: adevinha.games, answers: adevinha.answers },
    jobsSearch: {
      subscribers: jobsSearch.subscribers,
      revenue: jobsSearch.revenue,
      requests: jobsSearch.requests,
    },
  };
}
