import { useRef, type ReactNode } from "react";
import { useInView } from "@/useInView";

export type MarkKind = "highlight" | "underline";

/**
 * A phrase marked by hand: a highlighter stroke behind it, or a pen line under
 * it, drawn the first time it scrolls into view.
 */
export default function Mark({ kind, children }: { kind: MarkKind; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const drawn = useInView(ref);

  return (
    <mark ref={ref} className="mark" data-kind={kind} data-drawn={drawn || undefined}>
      {children}
    </mark>
  );
}
