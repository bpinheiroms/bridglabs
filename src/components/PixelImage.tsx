import { useEffect, useRef } from "react";

interface PixelImageProps {
  src: string;
  /** Logical resolution: the image is resampled to grid × grid and scaled up without smoothing. */
  grid: number;
  /** Fraction of the grid the image may occupy, for logos that need breathing room. */
  fit?: number;
}

export default function PixelImage({ src, grid, fit = 1 }: PixelImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let cancelled = false;
    const image = new Image();
    image.decoding = "async";

    image.onload = () => {
      if (cancelled) return;

      const ratio = image.naturalWidth && image.naturalHeight
        ? image.naturalWidth / image.naturalHeight
        : 1;
      const box = Math.max(1, Math.round(grid * fit));
      const width = ratio >= 1 ? box : Math.max(1, Math.round(box * ratio));
      const height = ratio >= 1 ? Math.max(1, Math.round(box / ratio)) : box;

      // Halving in stages averages each block of source pixels; a single
      // large downscale would skip most of them and leave the logo speckled.
      let source: CanvasImageSource = image;
      for (const scale of [4, 2]) {
        const stage = document.createElement("canvas");
        stage.width = width * scale;
        stage.height = height * scale;
        const stageContext = stage.getContext("2d");
        if (!stageContext) continue;
        stageContext.imageSmoothingQuality = "high";
        stageContext.drawImage(source, 0, 0, stage.width, stage.height);
        source = stage;
      }

      context.clearRect(0, 0, grid, grid);
      context.imageSmoothingQuality = "high";
      context.drawImage(
        source,
        Math.floor((grid - width) / 2),
        Math.floor((grid - height) / 2),
        width,
        height,
      );
      canvas.dataset.ready = "true";
    };

    image.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, grid, fit]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pixel-image"
      width={grid}
      height={grid}
    />
  );
}
