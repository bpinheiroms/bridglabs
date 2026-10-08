import { useSyncExternalStore } from "react";

export type Theme = "day" | "night";

const THEME_COLOR: Record<Theme, string> = { day: "#a9d8f5", night: "#141a33" };
const listeners = new Set<() => void>();

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "night" ? "night" : "day";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);
}

/** The portfolio always opens in daylight; night is a choice made during the visit. */
export function syncThemeColor() {
  apply("day");
}

export function toggleTheme() {
  apply(readTheme() === "night" ? "day" : "night");
  listeners.forEach((listener) => listener());
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, readTheme);
}
