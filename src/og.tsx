import "@fontsource-variable/geist-mono";
import "@fontsource-variable/geist";
import { createRoot } from "react-dom/client";
import "@/app/globals.css";
import Sprite from "@/components/Sprite";
import { brand } from "@/sprites";
import World from "@/world/World";

const root = document.getElementById("root");

/*
 * The share image, composed from the real site: the same world at its opening
 * shot of the bridge, with the name lockup over it. With no page sections to
 * scroll, the camera simply holds that first frame.
 */
if (root) {
  createRoot(root).render(
    <div style={{ height: 630, overflow: "hidden", position: "relative", width: 1200 }}>
      {/* The stops are never in shot here; the world only needs some to exist. */}
      <World
        logos={["/jobs-search-logo.svg", "/sentuni-logo.png"]}
        years={["2022", "2015"]}
        figure="/bruno-full.webp"
      />

      <div style={{ left: 72, position: "absolute", top: 56, zIndex: 1 }}>
        <img
          src="/illustrations/bruno-portrait-v4.webp"
          alt=""
          style={{ display: "block", height: 116, imageRendering: "pixelated", width: 116 }}
        />
        <h1
          style={{
            fontSize: 98,
            letterSpacing: "-0.03em",
            lineHeight: 0.96,
            margin: "16px 0 0",
            maxWidth: "8ch",
          }}
        >
          Bruno Pinheiro
        </h1>
        <p
          style={{
            background: "var(--ink)",
            color: "var(--surface)",
            display: "inline-block",
            fontFamily: "var(--font-pixel)",
            fontSize: 30,
            lineHeight: 1.25,
            margin: "26px 0 0",
            padding: "10px 16px 9px",
          }}
        >
          Senior Software Engineer &amp; Founder
        </p>
      </div>

      <p
        className="wordmark"
        style={{
          bottom: 44,
          fontSize: 26,
          left: 76,
          margin: 0,
          padding: "8px 16px 8px 8px",
          position: "absolute",
          zIndex: 1,
        }}
      >
        <Sprite
          art={brand}
          colors={{ "#": "var(--ink)", b: "var(--surface)" }}
          className="wordmark-mark"
        />
        <span>
          bridg<span>/labs</span>
        </span>
      </p>
    </div>,
  );
}
