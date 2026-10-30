import { useEffect, useRef, useState } from "react";
import { useInView } from "@/useInView";

/** A number that runs up to its value the first time it scrolls into view. */
export default function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref);
  const [shown, setShown] = useState(0);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!seen || reduced) return;

    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const progress = Math.min((now - start) / 1200, 1);
      setShown(value * (1 - (1 - progress) ** 3));
      if (progress < 1) frame = requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(frame);
  }, [seen, reduced, value]);

  return (
    <span ref={ref} className="count-up" aria-label={format(value)}>
      {format(reduced ? value : shown)}
    </span>
  );
}
