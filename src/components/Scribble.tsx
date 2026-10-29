import { useRef } from "react";
import { useInView } from "@/useInView";

/** A pen arrow that curls down from the headline to the paragraph, drawn once it is seen. */
export default function Scribble() {
  const ref = useRef<SVGSVGElement>(null);
  const drawn = useInView(ref);

  return (
    <svg ref={ref} className="scribble" viewBox="0 0 120 130" aria-hidden="true" data-drawn={drawn || undefined}>
      <path pathLength={1} d="M112 6C62 2 18 22 12 64c-5 36 30 56 84 52" />
      <path pathLength={1} className="scribble-head" d="M80 103l17 13-19 9" />
    </svg>
  );
}
