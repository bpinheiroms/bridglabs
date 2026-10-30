import { useEffect, useState } from "react";
import { isStats, snapshot, type Stats } from "@/stats";

/** Today's product numbers from the Worker, starting from the bundled snapshot. */
export function useStats() {
  const [stats, setStats] = useState<Stats>(snapshot);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/stats", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((fresh: unknown) => {
        if (isStats(fresh)) setStats(fresh);
      })
      // The snapshot stays on screen when the request fails, as in local dev.
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return stats;
}
