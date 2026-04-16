"use client";

import { useEffect, useRef } from "react";

const ROWS = 28;
const LINE_HEIGHT = 16;
const TARGET_ROW_WIDTH = 440;
const CANVAS_WIDTH = 220;
const CANVAS_HEIGHT = Math.round(CANVAS_WIDTH * ((ROWS * LINE_HEIGHT) / TARGET_ROW_WIDTH));
const PARTICLE_COUNT = 120;
const PARTICLE_RADIUS = 14;
const SECONDARY_ATTRACTOR_RADIUS = 12;
const PRIMARY_ATTRACTOR_RADIUS = 30;
const PRIMARY_ATTRACTOR_FORCE = 0.22;
const SECONDARY_ATTRACTOR_FORCE = 0.05;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export function HeroAsciiField() {
  const sourceBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = sourceBoxRef.current;
    if (host === null) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanupScene = () => {};
    let rebuildHandle = 0;
    let isDisposed = false;

    const rebuild = () => {
      cleanupScene();
      cleanupScene = mountSourceField(host, { reducedMotion: motionQuery.matches });
    };

    const scheduleRebuild = () => {
      cancelAnimationFrame(rebuildHandle);
      rebuildHandle = window.requestAnimationFrame(() => {
        if (!isDisposed) {
          rebuild();
        }
      });
    };

    scheduleRebuild();

    const handleMotionPreference = () => {
      scheduleRebuild();
    };

    motionQuery.addEventListener?.("change", handleMotionPreference);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(rebuildHandle);
      motionQuery.removeEventListener?.("change", handleMotionPreference);
      cleanupScene();
    };
  }, []);

  return (
    <div className="hero-signal" aria-hidden="true" role="presentation">
      <div className="hero-signal__wash hero-signal__wash--one" />
      <div className="hero-signal__wash hero-signal__wash--two" />
      <div className="hero-signal__wash hero-signal__wash--three" />

      <div className="hero-signal__art" id="source-box" ref={sourceBoxRef}>
        <div className="hero-signal__placeholder" />
      </div>
    </div>
  );
}

function mountSourceField(host: HTMLDivElement, options: { reducedMotion: boolean }) {
  host.textContent = "";

  const simulationCanvas = document.createElement("canvas");
  simulationCanvas.width = CANVAS_WIDTH;
  simulationCanvas.height = CANVAS_HEIGHT;
  simulationCanvas.className = "source-canvas";

  const simulationContext = simulationCanvas.getContext("2d", { willReadFrequently: true });
  if (simulationContext === null) {
    host.innerHTML = '<div class="hero-signal__placeholder"></div>';
    return () => {};
  }

  host.appendChild(simulationCanvas);

  const particles = createParticles();
  const spriteCache = new Map<number, HTMLCanvasElement>();

  const getSpriteCanvas = (radius: number) => {
    const cachedCanvas = spriteCache.get(radius);
    if (cachedCanvas !== undefined) {
      return cachedCanvas;
    }

    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = radius * 2;
    spriteCanvas.height = radius * 2;

    const spriteContext = spriteCanvas.getContext("2d");
    if (spriteContext === null) {
      return spriteCanvas;
    }

    const gradient = spriteContext.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, "rgba(255,255,255,0.45)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.15)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    spriteContext.fillStyle = gradient;
    spriteContext.fillRect(0, 0, radius * 2, radius * 2);

    spriteCache.set(radius, spriteCanvas);
    return spriteCanvas;
  };

  const renderFrame = (timestamp: number) => {
    const primaryAttractorX = Math.cos(timestamp * 0.0007) * CANVAS_WIDTH * 0.25 + CANVAS_WIDTH / 2;
    const primaryAttractorY = Math.sin(timestamp * 0.0011) * CANVAS_HEIGHT * 0.3 + CANVAS_HEIGHT / 2;
    const secondaryAttractorX =
      Math.cos(timestamp * 0.0013 + Math.PI) * CANVAS_WIDTH * 0.2 + CANVAS_WIDTH / 2;
    const secondaryAttractorY =
      Math.sin(timestamp * 0.0009 + Math.PI) * CANVAS_HEIGHT * 0.25 + CANVAS_HEIGHT / 2;

    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index]!;
      const primaryDx = primaryAttractorX - particle.x;
      const primaryDy = primaryAttractorY - particle.y;
      const secondaryDx = secondaryAttractorX - particle.x;
      const secondaryDy = secondaryAttractorY - particle.y;
      const primaryDistanceSquared = primaryDx * primaryDx + primaryDy * primaryDy;
      const secondaryDistanceSquared = secondaryDx * secondaryDx + secondaryDy * secondaryDy;
      const usePrimaryAttractor = primaryDistanceSquared < secondaryDistanceSquared;
      const dx = usePrimaryAttractor ? primaryDx : secondaryDx;
      const dy = usePrimaryAttractor ? primaryDy : secondaryDy;
      const distance = Math.sqrt(Math.min(primaryDistanceSquared, secondaryDistanceSquared)) + 1;
      const force = usePrimaryAttractor ? PRIMARY_ATTRACTOR_FORCE : SECONDARY_ATTRACTOR_FORCE;

      particle.vx += (dx / distance) * force;
      particle.vy += (dy / distance) * force;
      particle.vx += (Math.random() - 0.5) * 0.25;
      particle.vy += (Math.random() - 0.5) * 0.25;
      particle.vx *= 0.97;
      particle.vy *= 0.97;
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -PARTICLE_RADIUS) {
        particle.x += CANVAS_WIDTH + PARTICLE_RADIUS * 2;
      } else if (particle.x > CANVAS_WIDTH + PARTICLE_RADIUS) {
        particle.x -= CANVAS_WIDTH + PARTICLE_RADIUS * 2;
      }

      if (particle.y < -PARTICLE_RADIUS) {
        particle.y += CANVAS_HEIGHT + PARTICLE_RADIUS * 2;
      } else if (particle.y > CANVAS_HEIGHT + PARTICLE_RADIUS) {
        particle.y -= CANVAS_HEIGHT + PARTICLE_RADIUS * 2;
      }
    }

    simulationContext.fillStyle = "rgba(0,0,0,0.18)";
    simulationContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    simulationContext.globalCompositeOperation = "lighter";

    const particleSprite = getSpriteCanvas(PARTICLE_RADIUS);
    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index]!;
      simulationContext.drawImage(particleSprite, particle.x - PARTICLE_RADIUS, particle.y - PARTICLE_RADIUS);
    }

    simulationContext.drawImage(
      getSpriteCanvas(PRIMARY_ATTRACTOR_RADIUS),
      primaryAttractorX - PRIMARY_ATTRACTOR_RADIUS,
      primaryAttractorY - PRIMARY_ATTRACTOR_RADIUS,
    );
    simulationContext.drawImage(
      getSpriteCanvas(SECONDARY_ATTRACTOR_RADIUS),
      secondaryAttractorX - SECONDARY_ATTRACTOR_RADIUS,
      secondaryAttractorY - SECONDARY_ATTRACTOR_RADIUS,
    );
    simulationContext.globalCompositeOperation = "source-over";
  };

  renderFrame(performance.now());

  if (options.reducedMotion) {
    return () => {
      spriteCache.clear();
    };
  }

  let animationFrame = 0;

  const animate = (timestamp: number) => {
    renderFrame(timestamp);
    animationFrame = window.requestAnimationFrame(animate);
  };

  animationFrame = window.requestAnimationFrame(animate);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    spriteCache.clear();
  };
}

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 40 + 20;

    return {
      x: CANVAS_WIDTH / 2 + Math.cos(angle) * radius,
      y: CANVAS_HEIGHT / 2 + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    };
  });
}
