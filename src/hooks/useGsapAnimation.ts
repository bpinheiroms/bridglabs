import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useScrollParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    let refreshFrame = 0;

    const ctx = gsap.context(() => {
      const heroElements = container.querySelectorAll<HTMLElement>("[data-hero]");

      gsap.fromTo(
        heroElements,
        { opacity: 0, y: 28, filter: "blur(7px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.86,
          stagger: 0.09,
          ease: "power3.out",
          delay: 0.08,
        }
      );

      const journey = container.querySelector<HTMLElement>("[data-journey]");
      const routeProgress =
        container.querySelector<HTMLElement>("[data-route-progress]");

      if (journey && routeProgress) {
        gsap.fromTo(
          routeProgress,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            ease: "none",
            scrollTrigger: {
              trigger: journey,
              start: "top 72%",
              end: "bottom 72%",
              scrub: 0.35,
            },
          }
        );
      }

      const entries =
        container.querySelectorAll<HTMLElement>("[data-journey-entry]");

      entries.forEach((entry) => {
        const content = entry.querySelector<HTMLElement>(
          ".milestone, .journey-closing"
        );
        const date = entry.querySelector<HTMLElement>(".journey-date");
        const node = entry.querySelector<HTMLElement>(".journey-node");
        const projectRows = entry.querySelectorAll<HTMLElement>("[data-project-row]");

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: entry,
            start: "top 84%",
            once: true,
          },
        });

        if (date) {
          timeline.fromTo(
            date,
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
          );
        }

        if (node) {
          timeline.fromTo(
            node,
            { opacity: 0, scale: 0.4 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.42,
              ease: "back.out(2.4)",
            },
            "<+0.04"
          );
        }

        if (content) {
          timeline.fromTo(
            content,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.68,
              ease: "power3.out",
            },
            "<+0.02"
          );
        }

        if (projectRows.length > 0) {
          timeline.fromTo(
            projectRows,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.48,
              stagger: 0.08,
              ease: "power2.out",
            },
            "-=0.32"
          );
        }

      });

      const projectRows =
        container.querySelectorAll<HTMLElement>("[data-project-row]");

      projectRows.forEach((row, index) => {
        const stamp = row.querySelector<HTMLElement>("[data-stamp]");
        if (!stamp) return;

        const stampRotation = index % 2 === 0 ? -5 : 4;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: row,
              start: "top 76%",
              once: true,
            },
          })
          .fromTo(
            stamp,
            {
              opacity: 0,
              scale: 1.75,
              rotation: stampRotation - 13,
              filter: "blur(2px)",
            },
            {
              opacity: 0.88,
              scale: 1,
              rotation: stampRotation,
              filter: "blur(0px)",
              transformOrigin: "50% 50%",
              duration: 0.34,
              ease: "back.out(3.5)",
            }
          )
          .to(
            row,
            {
              x: -2,
              duration: 0.055,
              ease: "power1.out",
            },
            "<+0.16"
          )
          .to(row, {
            x: 0,
            duration: 0.12,
            ease: "power2.out",
          });
      });

      const entranceElements =
        container.querySelectorAll<HTMLElement>("[data-entrance]");

      entranceElements.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.62,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 92%",
              once: true,
            },
          }
        );
      });

      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    }, container);

    return () => {
      cancelAnimationFrame(refreshFrame);
      ctx.revert();
    };
  }, []);

  return containerRef;
}
