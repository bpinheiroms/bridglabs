import { useEffect, useState, type RefObject } from "react";

const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | undefined;

/** One observer for every mark on the page; each element is let go once it has been seen. */
function shared() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    // Seen once it is well inside the screen, not as it peeks over the bottom edge.
    { rootMargin: "0px 0px -10% 0px", threshold: 0.8 },
  );
  return observer;
}

/** True from the moment the element has scrolled into view, and for good after that. */
export function useInView(ref: RefObject<Element | null>) {
  const [seen, setSeen] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const element = ref.current;
    if (!element || seen) return;

    callbacks.set(element, () => setSeen(true));
    shared().observe(element);

    return () => {
      callbacks.delete(element);
      observer?.unobserve(element);
    };
  }, [ref, seen]);

  return seen;
}
