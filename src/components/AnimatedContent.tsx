"use client";

import { ReactNode } from "react";
import { useScrollParallax } from "@/hooks/useGsapAnimation";

interface AnimatedContentProps {
  children: ReactNode;
}

export default function AnimatedContent({ children }: AnimatedContentProps) {
  const containerRef = useScrollParallax();

  return <div ref={containerRef}>{children}</div>;
}
