"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useScrollParallax() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Smooth scroll effect using GSAP
    const smoothScroll = () => {
      gsap.to(window, {
        scrollTo: { y: window.scrollY },
        ease: "power2.out",
      });
    };

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

      // Parallax with data-speed attribute
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "1");
        const direction = speed > 1 ? -1 : 1;
        const movement = Math.abs(1 - speed) * 300;

        gsap.to(el, {
          y: movement * direction,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      // Fade + slide in on scroll
      gsap.utils.toArray<HTMLElement>("[data-scroll-fade]").forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 60,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 60%",
              scrub: 1,
            },
          }
        );
      });

      // Reveal from left
      gsap.utils.toArray<HTMLElement>("[data-reveal-left]").forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            x: -100,
            rotateY: 15
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
            },
          }
        );
      });

      // Reveal from right
      gsap.utils.toArray<HTMLElement>("[data-reveal-right]").forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            x: 100,
            rotateY: -15
          },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 50%",
              scrub: 1,
            },
          }
        );
      });

      // Scale up on scroll
      gsap.utils.toArray<HTMLElement>("[data-scale]").forEach((el) => {
        gsap.fromTo(
          el,
          {
            scale: 0.8,
            opacity: 0
          },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 55%",
              scrub: 1,
            },
          }
        );
      });

      // Text reveal character by character
      gsap.utils.toArray<HTMLElement>("[data-text-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 100,
            skewY: 7
          },
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Rotate on scroll
      gsap.utils.toArray<HTMLElement>("[data-rotate]").forEach((el) => {
        gsap.to(el, {
          rotation: 360,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });

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
