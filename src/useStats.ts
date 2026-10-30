import { useEffect, useState } from "react";
import { isStats, snapshot, type Stats } from "@/stats";

// Published once a day by the bridglabs-stats Worker; see stats/wrangler.jsonc.
const STATS_URL = "https://stats.bridglabs.com/stats.json";

/** Today's product numbers from the Worker, starting from the bundled snapshot. */
export function useStats() {
  const [stats, setStats] = useState<Stats>(snapshot);

  useEffect(() => {
    const controller = new AbortController();

    fetch(STATS_URL, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((fresh: unknown) => {
        if (isStats(fresh)) setStats(fresh);
      })
      // The snapshot stays on screen when the request fails.
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return stats;
}
