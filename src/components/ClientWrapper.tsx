"use client";

import { ReactNode } from "react";
import SmoothScroll from "./SmoothScroll";

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return <SmoothScroll>{children}</SmoothScroll>;
}
