import { useEffect, useRef } from "react";
import { PerspectiveCamera, Vector3, WebGLRenderer } from "three";
import { useTheme } from "@/theme";
import {
  CAREER_LEAD,
  clamp,
  heightAt,
  lombardAt,
  smooth,
  stopState,
  streetAt,
} from "@/world/route";
import { createWorld, type WorldOptions } from "@/world/scene";

/**
 * `portrait`: a framed view of the bridge that sits in the page and ignores the scroll.
 * `ambient`: a faint backdrop behind the whole page, flying the route as the page scrolls.
 */
export type WorldMode = "portrait" | "ambient";

interface WorldProps extends WorldOptions {
  mode: WorldMode;
  /** Bruno's full-body portrait, shown standing on the pier at the end of the route. */
  figure: string;
}

/** Seconds the route position takes to catch up with the scroll. */
const ROUTE_SMOOTHING = 0.32;

/** Where he stands on the pier, and how tall he is in world units. */
const FIGURE = { x: 331, y: 3.2, z: 145.4, height: 8.6, ratio: 571 / 1457 };

interface Pose {
  position: Vector3;
  target: Vector3;
}

const makePose = (): Pose => ({ position: new Vector3(), target: new Vector3() });

/** From the shore below the bridge, looking along it toward Marin. */
function bridgePose(out: Pose) {
  out.position.set(160, 8, 14);
  out.target.set(-40, 60, -104);
}

/** In front of and above the car, watching it come down the switchbacks. */
function lombardPose(travel: number, reach: number, out: Pose) {
  const car = lombardAt(travel);
  out.position.set(230 + (car.x - 230) * 0.25 - 3, car.y + 27 * reach, car.z + 54 * reach);
  out.target.set(230 + (car.x - 230) * 0.5, car.y + 3, car.z - 10);
}

/** Riding behind the cable car, looking down the street to the bay. */
function tramPose(travel: number, reach: number, out: Pose) {
  const tram = streetAt(travel);
  const z = tram.z - 26 * reach;
  // High enough above both the car and the ground under the camera. A rounded
  // maximum: a hard one would jolt the camera where one takes over from the other.
  const overCar = tram.y + 11.5 * reach;
  const overGround = heightAt(tram.x, z) + 6.5;
  const height = (overCar + overGround + Math.hypot(overCar - overGround, 3)) / 2;
  out.position.set(tram.x - 4, height, z);
  out.target.set(tram.x + 1.5, tram.y - 4, tram.z + 36);
}

/** Low over the water, looking back at the pier and the city above it. */
function pierPose(out: Pose) {
  out.position.set(300, 7.5, 198);
  out.target.set(344, 17, 112);
}

const gaze = new Vector3();

/**
 * Flies from one pose to another, climbing by `arc` midway to clear the
 * rooftops. The camera turns from one heading to the other instead of sliding
 * its target across the ground: two scenes that face opposite ways would
 * otherwise leave it staring straight down at the roofs halfway through.
 */
function blend(from: Pose, to: Pose, t: number, arc: number, out: Pose) {
  const heading = (pose: Pose) => {
    gaze.subVectors(pose.target, pose.position);
    const length = gaze.length();
    return {
      yaw: Math.atan2(gaze.z, gaze.x),
      pitch: Math.asin(gaze.y / length),
      length,
    };
  };
  const start = heading(from);
  const end = heading(to);
  const turn = ((end.yaw - start.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  const climb = Math.sin(t * Math.PI);
  const yaw = start.yaw + turn * t;
  // Mid-flight the gaze lifts a little, so the turn sweeps across the city
  // and its skyline instead of the ground directly below.
  const pitch = start.pitch + (end.pitch - start.pitch) * t + climb * (arc / 520);
  const length = start.length + (end.length - start.length) * t;

  out.position.lerpVectors(from.position, to.position, t);
  out.position.y += climb * arc;
  out.target.set(
    out.position.x + Math.cos(yaw) * Math.cos(pitch) * length,
    out.position.y + Math.sin(pitch) * length,
    out.position.z + Math.sin(yaw) * Math.cos(pitch) * length,
  );
}

/**
 * One low-resolution San Francisco, either framed in the page or behind it.
 */
export default function World(options: WorldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef(options);
  const theme = useTheme();
  const nightRef = useRef(theme === "night" ? 1 : 0);

  useEffect(() => {
    nightRef.current = theme === "night" ? 1 : 0;
  }, [theme]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    } catch {
      // No WebGL: the page keeps its sky-coloured background and stays readable.
      return;
    }

    const canvas = renderer.domElement;
    host.appendChild(canvas);

    // The world is drawn at a third of the screen's resolution, which would
    // smear a detailed portrait. So he is a real image laid over the canvas,
    // pinned to his spot on the pier.
    const figure = document.createElement("img");
    figure.className = "world-figure";
    figure.src = optionsRef.current.figure;
    figure.alt = "";
    figure.decoding = "async";
    host.appendChild(figure);
    const feet = new Vector3();
    const head = new Vector3();

    const world = createWorld(optionsRef.current);
    const productStops = optionsRef.current.logos.length;
    const careerStops = optionsRef.current.years.length;
    const camera = new PerspectiveCamera(38, 1, 1, 2200);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const portrait = optionsRef.current.mode === "portrait";

    const pose = makePose();
    const from = makePose();
    const to = makePose();
    let width = 0;
    let height = 0;
    let compact = false;
    let night = nightRef.current;
    let route = 0;
    let speed = 0;
    let started = false;
    let last = performance.now();
    let clock = 0;
    let animationFrame = 0;
    // A framed view scrolled out of sight stops drawing.
    let visible = true;

    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      compact = width < 900;
      // Rendered small and scaled up with hard edges: this is what makes it pixel art.
      const pixel = width < 700 ? 2 : 3;
      renderer.setPixelRatio(1);
      renderer.setSize(Math.ceil(width / pixel), Math.ceil(height / pixel), false);
    };

    const frame = (now: number) => {
      animationFrame = requestAnimationFrame(frame);
      const delta = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (document.hidden || !visible || !width) return;
      if (!reducedMotion) clock += delta;

      // The whole page is one position along the route:
      // 0 bridge, 1-2 Lombard, 2-3 cable car, 4 pier.
      const page = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = portrait ? 0 : page > 0 ? clamp(window.scrollY / page, 0, 1) * 4 : 0;

      // Only this one number is smoothed. The vehicles and the camera are both
      // derived from it, so nothing drifts apart. It follows the scroll like a
      // critically damped spring rather than a plain ease: a mouse wheel moves
      // the page in jumps, and an ease turns every jump into a lurch, whereas
      // the spring keeps the speed continuous and blends the jumps together.
      if (!started || reducedMotion) {
        route = scrolled;
        speed = 0;
      } else {
        const omega = 2 / ROUTE_SMOOTHING;
        const x = omega * delta;
        const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        const offset = route - scrolled;
        const push = (speed + omega * offset) * delta;
        speed = (speed - omega * push) * decay;
        route = scrolled + (offset + push) * decay;
      }
      started = true;

      const heroProgress = clamp(route, 0, 1);
      const careerProgress = clamp(route - 2, 0, 1);
      const closingProgress = clamp(route - 3, 0, 1);
      const product = stopState(clamp(route - 1, 0, 1), productStops);
      const career = stopState(careerProgress, careerStops, CAREER_LEAD);

      // A tall, narrow frame sees less to each side, so the camera stands further back.
      const reach = compact ? 1.25 : 1;

      if (portrait) {
        bridgePose(pose);
        // A slow sway around the view, so the frame reads as a place rather than a picture.
        const sway = Math.sin(clock * 0.12) * 0.07;
        gaze.subVectors(pose.position, pose.target);
        const radius = Math.hypot(gaze.x, gaze.z);
        const angle = Math.atan2(gaze.z, gaze.x) + sway;
        pose.position.x = pose.target.x + Math.cos(angle) * radius;
        pose.position.z = pose.target.z + Math.sin(angle) * radius;
      } else if (closingProgress > 0) {
        tramPose(1, reach, from);
        pierPose(to);
        blend(from, to, smooth(closingProgress), 10, pose);
      } else if (careerProgress > 0) {
        lombardPose(1, reach, from);
        tramPose(career.travel, reach, to);
        blend(from, to, career.arrival, 64, pose);
      } else if (heroProgress < 1) {
        bridgePose(from);
        lombardPose(0, reach, to);
        blend(from, to, smooth(heroProgress), 26, pose);
      } else {
        lombardPose(product.travel, reach, pose);
      }

      const target = nightRef.current;
      night = reducedMotion ? target : night + clamp(target - night, -delta * 1.4, delta * 1.4);

      camera.aspect = width / height;
      // Keep roughly the same horizontal view whatever the shape of the screen.
      camera.fov = clamp((Math.atan(0.42 / camera.aspect) * 360) / Math.PI, 38, 66);
      camera.updateProjectionMatrix();
      camera.position.copy(pose.position);
      camera.lookAt(pose.target);

      world.update({
        time: clock,
        night: smooth(night),
        // In the frame the vehicles keep their rounds on their own.
        car: portrait ? (clock * 0.04) % 1 : product.travel,
        tram: portrait ? (clock * 0.03) % 1 : career.travel,
        product: product.active,
        career: career.active,
      });
      renderer.render(world.scene, camera);

      // He appears as the camera comes down to the pier, never through the city.
      const arrival = portrait ? 0 : smooth((closingProgress - 0.35) / 0.45);
      if (arrival > 0) {
        feet.set(FIGURE.x, FIGURE.y, FIGURE.z).project(camera);
        head.set(FIGURE.x, FIGURE.y + FIGURE.height, FIGURE.z).project(camera);
        const bottom = (1 - (feet.y * 0.5 + 0.5)) * height;
        const tall = Math.round(bottom - (1 - (head.y * 0.5 + 0.5)) * height);
        const wide = Math.round(tall * FIGURE.ratio);
        const left = Math.round((feet.x * 0.5 + 0.5) * width - wide / 2);
        figure.style.height = `${tall}px`;
        figure.style.width = `${wide}px`;
        figure.style.transform = `translate(${left}px, ${Math.round(bottom - tall)}px)`;
        figure.style.opacity = String(arrival);
        figure.style.visibility = "visible";
      } else {
        figure.style.visibility = "hidden";
      }
      host.dataset.ready = "true";
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const sight = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    sight.observe(host);
    resize();
    animationFrame = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      sight.disconnect();
      world.dispose();
      renderer.dispose();
      canvas.remove();
      figure.remove();
      delete host.dataset.ready;
    };
  }, []);

  return <div ref={hostRef} className="world" data-mode={options.mode} aria-hidden="true" />;
}
