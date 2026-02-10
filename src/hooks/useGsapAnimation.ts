"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useScrollParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero entrance animation
      const heroElements = containerRef.current?.querySelectorAll("[data-hero]");
      if (heroElements && heroElements.length > 0) {
        gsap.fromTo(
          heroElements,
          {
            opacity: 0,
            y: 80,
            filter: "blur(10px)"
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }

      // Delayed entrance animation for non-hero elements
      const entranceElements = containerRef.current?.querySelectorAll("[data-entrance]");
      if (entranceElements && entranceElements.length > 0) {
        gsap.fromTo(
          entranceElements,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            delay: 1.0,
          }
        );
      }

      // Float animation (continuous)
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el) => {
        gsap.to(el, {
          y: -20,
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // Glow pulse animation
      gsap.utils.toArray<HTMLElement>("[data-glow]").forEach((el) => {
        gsap.to(el, {
          opacity: 0.6,
          scale: 1.1,
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}
