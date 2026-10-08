import type { SpriteArt } from "@/sprites";

interface SpriteProps {
  art: SpriteArt;
  /** Maps each character of the art to a CSS colour; unmapped characters use currentColor. */
  colors?: Record<string, string>;
  className?: string;
}

export default function Sprite({ art, colors, className }: SpriteProps) {
  const width = art[0]?.length ?? 0;
  const runs: { x: number; y: number; length: number; fill: string }[] = [];

  art.forEach((row, y) => {
    let x = 0;

    while (x < row.length) {
      const char = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === char) end += 1;

      if (char !== ".") {
        runs.push({ x, y, length: end - x, fill: colors?.[char] ?? "currentColor" });
      }

      x = end;
    }
  });

  return (
    <svg
      aria-hidden="true"
      className={className ? `sprite ${className}` : "sprite"}
      focusable="false"
      shapeRendering="crispEdges"
      viewBox={`0 0 ${width} ${art.length}`}
    >
      {runs.map((run) => (
        <rect
          key={`${run.x}-${run.y}`}
          x={run.x}
          y={run.y}
          width={run.length}
          height={1}
          style={{ fill: run.fill }}
        />
      ))}
    </svg>
  );
}
