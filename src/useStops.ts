import { useCallback, useEffect, useState, type RefObject } from "react";
import { pinnedProgress, stopProgress, stopState } from "@/world/route";

/**
 * Which stop of a route section the visitor is at, whether its panel should be
 * showing, and a way to travel to another stop. The 3D world reads the same scroll position, so both stay in step.
 */
export function useStops(section: RefObject<HTMLElement | null>, stops: number, lead = 0) {
  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!section.current) return;
      const progress = pinnedProgress(section.current);
      const next = stopState(progress, stops, lead).active;
      setActive((previous) => (previous === next ? previous : next));

      // The panel is only up while the camera is at this section's stops: it
      // comes in as the camera arrives and leaves the moment it flies on.
      const bounds = section.current.getBoundingClientRect();
      const arrived = lead > 0 ? progress >= lead * 0.8 : bounds.top < window.innerHeight * 0.35;
      const here = arrived && bounds.bottom > window.innerHeight + 8;
      setEngaged((previous) => (previous === here ? previous : here));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [section, stops, lead]);

  const goTo = useCallback(
    (index: number) => {
      const element = section.current;
      if (!element) return;

      const top = element.getBoundingClientRect().top + window.scrollY;
      const travel = element.offsetHeight - window.innerHeight;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      window.scrollTo({
        top: Math.round(top + stopProgress(index, stops, lead) * travel),
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [section, stops, lead],
  );

  return { active, engaged, goTo };
}
