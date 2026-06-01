"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

type Track = {
  control: Point;
  end: Point;
  offset: number;
  speed: number;
  start: Point;
};

type Node = {
  color: string;
  offset: number;
  radius: number;
  speed: number;
  track: number;
};

const FRAME_INTERVAL = 1000 / 30;
const TRACK_COUNT = 16;
const NODE_COUNT = 62;

export function HeroTrajectoryField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (context === null) {
      return;
    }
    const ctx = context;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let lastFrame = 0;
    let tracks = createTracks(0, 0);
    let nodes = createNodes();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tracks = createTracks(width, height);
      nodes = createNodes();
      render(performance.now());
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = (event.clientX - rect.left - width / 2) / Math.max(width, 1);
      pointer.targetY = (event.clientY - rect.top - height / 2) / Math.max(height, 1);
    };

    const handlePointerLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    function render(timestamp: number) {
      const isDark = document.documentElement.classList.contains("dark");
      const palette = isDark
        ? {
            line: "rgba(184, 215, 158, 0.24)",
            quietLine: "rgba(214, 170, 98, 0.1)",
            node: "rgba(244, 240, 230, 0.72)",
          }
        : {
            line: "rgba(49, 92, 45, 0.18)",
            quietLine: "rgba(214, 170, 98, 0.12)",
            node: "rgba(23, 32, 20, 0.56)",
          };

      pointer.x += (pointer.targetX - pointer.x) * 0.035;
      pointer.y += (pointer.targetY - pointer.y) * 0.035;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalCompositeOperation = isDark ? "screen" : "multiply";

      for (let index = 0; index < tracks.length; index += 1) {
        drawTrack(ctx, tracks[index]!, timestamp, index, palette, pointer);
      }

      for (let index = 0; index < nodes.length; index += 1) {
        drawNode(ctx, tracks, nodes[index]!, timestamp, palette, pointer);
      }

      ctx.restore();
    }

    function animate(timestamp: number) {
      if (timestamp - lastFrame >= FRAME_INTERVAL) {
        lastFrame = timestamp;
        render(timestamp);
      }

      if (!motionQuery.matches) {
        frame = window.requestAnimationFrame(animate);
      }
    }

    resize();
    if (!motionQuery.matches) {
      frame = window.requestAnimationFrame(animate);
    }

    const handleMotionChange = () => {
      window.cancelAnimationFrame(frame);
      render(performance.now());
      if (!motionQuery.matches) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    motionQuery.addEventListener?.("change", handleMotionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      motionQuery.removeEventListener?.("change", handleMotionChange);
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="hermes-trajectory" aria-hidden="true" />;
}

function createTracks(width: number, height: number): Track[] {
  const safeWidth = Math.max(width, 1);
  const safeHeight = Math.max(height, 1);
  const source = {
    x: safeWidth * 0.02,
    y: safeHeight * 0.62,
  };

  return Array.from({ length: TRACK_COUNT }, (_, index) => {
    const progress = index / (TRACK_COUNT - 1);
    const spread = (progress - 0.5) * 1.9;
    const wave = Math.sin(progress * Math.PI * 2.4);
    const endX = safeWidth * (0.78 + (index % 4) * 0.07);
    const endY = safeHeight * (0.16 + progress * 0.9 + wave * 0.045);
    const startY = source.y + spread * safeHeight * 0.13;

    return {
      control: {
        x: safeWidth * (0.26 + progress * 0.18),
        y: safeHeight * (0.5 + spread * 0.3 + wave * 0.08),
      },
      end: {
        x: endX,
        y: endY,
      },
      offset: Math.random() * 1000,
      speed: 0.00006 + (index % 5) * 0.000012,
      start: {
        x: source.x - Math.random() * safeWidth * 0.1,
        y: startY,
      },
    };
  });
}

function createNodes(): Node[] {
  const colors = [
    "rgba(132, 176, 103, 0.86)",
    "rgba(214, 170, 98, 0.9)",
    "rgba(142, 169, 200, 0.82)",
    "rgba(217, 130, 79, 0.78)",
  ];

  return Array.from({ length: NODE_COUNT }, (_, index) => ({
    color: colors[index % colors.length]!,
    offset: Math.random(),
    radius: 1.15 + Math.random() * Math.random() * 4.3,
    speed: 0.000025 + Math.random() * 0.000055,
    track: index % TRACK_COUNT,
  }));
}

function drawTrack(
  context: CanvasRenderingContext2D,
  track: Track,
  timestamp: number,
  index: number,
  palette: { line: string; quietLine: string },
  pointer: Point,
) {
  const phase = Math.sin(timestamp * track.speed + track.offset);
  const liftedTrack = withPointer(track, pointer, 18);

  context.beginPath();
  context.moveTo(liftedTrack.start.x, liftedTrack.start.y);
  context.quadraticCurveTo(
    liftedTrack.control.x,
    liftedTrack.control.y + phase * 10,
    liftedTrack.end.x,
    liftedTrack.end.y,
  );
  context.setLineDash([4 + (index % 3), 12 + (index % 4) * 2]);
  context.lineDashOffset = -(timestamp * (0.008 + (index % 5) * 0.002) + index * 16);
  context.lineWidth = index % 5 === 0 ? 1.1 : 0.8;
  context.strokeStyle = index % 4 === 0 ? palette.line : palette.quietLine;
  context.stroke();
  context.setLineDash([]);
}

function drawNode(
  context: CanvasRenderingContext2D,
  tracks: Track[],
  node: Node,
  timestamp: number,
  palette: { node: string },
  pointer: Point,
) {
  const track = withPointer(tracks[node.track]!, pointer, 18);
  const progress = (node.offset + timestamp * node.speed) % 1;
  const point = quadraticPoint(track.start, track.control, track.end, progress);
  const pulse = 0.72 + Math.sin(timestamp * 0.003 + node.offset * 18) * 0.28;
  const radius = node.radius * pulse;

  context.beginPath();
  context.arc(point.x, point.y, radius, 0, Math.PI * 2);
  context.fillStyle = node.radius > 4 ? node.color : palette.node;
  context.globalAlpha = 0.24 + pulse * 0.44;
  context.fill();

  if (node.radius > 3.4) {
    context.beginPath();
    context.arc(point.x, point.y, radius * 2.2, 0, Math.PI * 2);
    context.globalAlpha = 0.08;
    context.fillStyle = node.color;
    context.fill();
  }

  context.globalAlpha = 1;
}

function quadraticPoint(start: Point, control: Point, end: Point, progress: number): Point {
  const inverse = 1 - progress;

  return {
    x: inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * end.x,
    y: inverse * inverse * start.y + 2 * inverse * progress * control.y + progress * progress * end.y,
  };
}

function withPointer(track: Track, pointer: Point, strength: number): Track {
  return {
    control: {
      x: track.control.x + pointer.x * strength,
      y: track.control.y + pointer.y * strength,
    },
    end: {
      x: track.end.x + pointer.x * strength * 0.4,
      y: track.end.y + pointer.y * strength * 0.55,
    },
    offset: track.offset,
    speed: track.speed,
    start: {
      x: track.start.x - pointer.x * strength * 0.35,
      y: track.start.y - pointer.y * strength * 0.25,
    },
  };
}
