"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useScrollParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroElements = containerRef.current?.querySelectorAll("[data-hero]");
      if (heroElements && heroElements.length > 0) {
        gsap.fromTo(
          heroElements,
          {
            opacity: 0,
            y: 36,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.11,
            ease: "power3.out",
            delay: 0.12,
          }
        );
      }

      const projectElements =
        containerRef.current?.querySelectorAll<HTMLElement>("[data-project]");

      projectElements?.forEach((entry, index) => {
        const revealTarget =
          entry.querySelector<HTMLElement>("article") ?? entry;
        const node = entry.querySelector<HTMLElement>(".timeline-node");
        const stamp = entry.querySelector<HTMLElement>("[data-stamp]");
        const stampRotation = index % 2 === 0 ? -5 : 4;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: entry,
            start: "top 82%",
            once: true,
          },
        });

        timeline.fromTo(
          revealTarget,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            ease: "power3.out",
          }
        );

        if (node) {
          timeline.fromTo(
            node,
            { scale: 0.35, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.42,
              ease: "back.out(2.4)",
            },
            "<+0.12"
          );
        }

        if (stamp) {
          timeline.fromTo(
            stamp,
            {
              opacity: 0,
              scale: 1.75,
              rotation: stampRotation - 13,
              filter: "blur(2px)",
            },
            {
              opacity: 1,
              scale: 1,
              rotation: stampRotation,
              filter: "blur(0px)",
              duration: 0.34,
              ease: "back.out(3.5)",
            },
            "-=0.06"
          );

          timeline
            .to(
              revealTarget,
              {
                x: -2,
                duration: 0.055,
                ease: "power1.out",
              },
              "<+0.16"
            )
            .to(revealTarget, {
              x: 0,
              duration: 0.12,
              ease: "power2.out",
            });
        }
      });

      const nextEntry =
        containerRef.current?.querySelector<HTMLElement>("[data-next]");

      if (nextEntry) {
        const nextCard = nextEntry.querySelector<HTMLElement>("article");
        const nextNode =
          nextEntry.querySelector<HTMLElement>(".timeline-node");

        gsap
          .timeline({
            scrollTrigger: {
              trigger: nextEntry,
              start: "top 82%",
              once: true,
            },
          })
          .fromTo(
            nextCard,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            }
          )
          .fromTo(
            nextNode,
            { opacity: 0, scale: 0.35 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.45,
              ease: "back.out(2.4)",
            },
            "<+0.12"
          );
      }

      const entranceElements =
        containerRef.current?.querySelectorAll<HTMLElement>("[data-entrance]");

      entranceElements?.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 94%",
              once: true,
            },
          }
        );
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return containerRef;
}
