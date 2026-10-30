import type { Locale } from "@/i18n";

/** Product numbers the Worker gathers from PostHog once a day. */
export type Stats = {
  updatedAt: string;
  overcoded: { visitors: number; players: number; rounds: number };
  adevinha: { games: number; answers: number };
  jobsSearch: { subscribers: number; revenue: number; requests: number };
};

/** Shown until `/api/stats` answers, and whenever it cannot. */
export const snapshot: Stats = {
  updatedAt: "2026-10-30T12:00:00.000Z",
  overcoded: { visitors: 1629, players: 362, rounds: 702 },
  adevinha: { games: 536, answers: 11210 },
  jobsSearch: { subscribers: 52, revenue: 943.3, requests: 95388 },
};

export function isStats(value: unknown): value is Stats {
  const stats = value as Stats | null;
  return (
    typeof stats?.updatedAt === "string" &&
    [stats.overcoded, stats.adevinha, stats.jobsSearch].every(
      (product) => product && Object.values(product).every((n) => Number.isFinite(n)),
    )
  );
}

/** Rounds down so a count only ever undersells: 362 → +360, 1629 → +1.600, 11210 → +11 mil. */
export function formatCount(n: number, locale: Locale) {
  if (n < 100) return String(Math.floor(n));

  const step = n >= 10_000 ? 1000 : n >= 1000 ? 100 : 10;
  const floored = Math.floor(n / step) * step;
  const text =
    n >= 10_000
      ? locale === "pt"
        ? `${floored / 1000} mil`
        : `${floored / 1000}k`
      : floored.toLocaleString(locale === "pt" ? "pt-BR" : "en-US");

  return locale === "pt" ? `+${text}` : `${text}+`;
}

export function formatRevenue(n: number, locale: Locale) {
  const text = `R$ ${(Math.floor(n / 10) * 10).toLocaleString(locale === "pt" ? "pt-BR" : "en-US")}`;
  return locale === "pt" ? `+${text}` : `${text}+`;
}

export function formatDay(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "short",
  });
}

/** Puts values into a message's `{name}` slots. */
export function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (slot, name: string) => values[name] ?? slot);
}
