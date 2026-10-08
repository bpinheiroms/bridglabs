/**
 * The geography of the world and the route through it. Pure maths, no
 * three.js: the page reads this too, and must not pull the 3D bundle in.
 */

export const clamp = (value: number, low: number, high: number) =>
  Math.min(high, Math.max(low, value));

export const smooth = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/** Lombard Street: the crooked block, descending toward +z. */
export const LOMBARD = { x: 230, top: -36, bottom: 44, sway: 11, turns: 4 };
/** The cable-car street: straight down the hill to the waterfront. */
export const STREET = { x: 330, top: -26, bottom: 100 };
export const BRIDGE = { z: -80, half: 150, tower: 64, deck: 14, height: 52 };

const bump = (
  x: number,
  z: number,
  cx: number,
  cz: number,
  height: number,
  sx: number,
  sz: number,
) => height * Math.exp(-((x - cx) ** 2 / (2 * sx * sx) + (z - cz) ** 2 / (2 * sz * sz)));

/** 1 inside the ellipse, falling to 0 just past its edge. */
const island = (x: number, z: number, cx: number, cz: number, rx: number, rz: number) =>
  1 - smooth((Math.hypot((x - cx) / rx, (z - cz) / rz) - 0.88) / 0.12);

/** Ground height. Below zero is under the bay. */
export function heightAt(x: number, z: number) {
  const city = Math.max(island(x, z, 300, -10, 150, 135), island(x, z, 200, -85, 62, 50));
  const marin = island(x, z, -300, -110, 175, 160);
  const land = Math.max(city, marin);
  if (land <= 0) return -6;

  const hills =
    bump(x, z, 230, -50, 46, 48, 62) + // Russian Hill, under Lombard
    bump(x, z, 330, -40, 50, 55, 58) + // Nob Hill, under the cable-car street
    bump(x, z, 185, -85, 13, 40, 40) + // bluff where the bridge lands
    bump(x, z, -190, -95, 26, 35, 35) + // Marin headland
    bump(x, z, -280, -160, 58, 70, 80) +
    bump(x, z, -370, -60, 44, 60, 60);

  return land * (3 + hills) - (1 - land) * 6;
}

export interface Point {
  x: number;
  y: number;
  z: number;
}

export function lombardAt(t: number): Point {
  const z = lerp(LOMBARD.top, LOMBARD.bottom, t);
  const x = LOMBARD.x + LOMBARD.sway * Math.sin(t * Math.PI * 2 * LOMBARD.turns);
  return { x, y: heightAt(x, z), z };
}

export function streetAt(t: number): Point {
  const z = lerp(STREET.top, STREET.bottom, t);
  return { x: STREET.x, y: heightAt(STREET.x, z), z };
}

/**
 * Turns a section's scroll progress into the stop the visitor is at and how
 * far along the route the vehicle is. The vehicle slows through each stop
 * rather than halting, so a steady scroll gives a steady ride. `lead` reserves the start of the
 * section for the camera to travel in from the previous scene.
 */
export function stopState(progress: number, stops: number, lead = 0) {
  const local = clamp((progress - lead) / (1 - lead), 0, 1);
  const position = local * (stops - 1);
  const index = Math.min(stops - 2, Math.floor(position));
  const travel = (index + smooth((position - index - 0.1) / 0.8)) / (stops - 1);

  return { active: Math.round(position), travel, arrival: smooth(progress / (lead || 1)) };
}

/** Scroll progress at which a stop is the active one. */
export function stopProgress(index: number, stops: number, lead = 0) {
  return lead + (1 - lead) * (index / (stops - 1));
}

/** How far a tall section with a pinned stage has been scrolled, 0 to 1. */
export function pinnedProgress(element: Element) {
  const bounds = element.getBoundingClientRect();
  const travel = bounds.height - window.innerHeight;
  if (travel <= 0) return bounds.top <= 0 ? 1 : 0;
  return clamp(-bounds.top / travel, 0, 1);
}

/** Share of the career section spent flying from Lombard to the cable car. */
export const CAREER_LEAD = 0.14;
