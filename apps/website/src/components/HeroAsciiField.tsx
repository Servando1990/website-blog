"use client";

import { prepareWithSegments } from "@chenglou/pretext";
import { useEffect, useRef } from "react";

const GLYPH_CHARSET =
  " .,:;!+-=*#@%&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const GLYPH_WEIGHTS = [300, 500, 800] as const;
const GLYPH_STYLES = ["normal", "italic"] as const;
const FIELD_OVERSAMPLE = 2;
const FIELD_DECAY = 0.82;
const PRIMARY_ATTRACTOR_FORCE = 0.22;
const SECONDARY_ATTRACTOR_FORCE = 0.05;
const GLYPH_FONT_FAMILY =
  '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif';
const PARTICLE_RADIUS = 14;
const PRIMARY_ATTRACTOR_RADIUS = 30;
const SECONDARY_ATTRACTOR_RADIUS = 12;
const EMPTY_GLYPH = '<span class="hero-signal__glyph is-space">&nbsp;</span>';
const FALLBACK_RAMP = " .,:;!+-=*#@";
const FALLBACK_ROWS = createFallbackRows(19, 36);

type FontStyleVariant = (typeof GLYPH_STYLES)[number];

type PaletteEntry = {
  brightness: number;
  char: string;
  style: FontStyleVariant;
  weight: number;
  width: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type FieldStamp = {
  radiusX: number;
  radiusY: number;
  sizeX: number;
  sizeY: number;
  values: Float32Array;
};

type GlyphToken = {
  className: string;
  html: string;
  isSpace: boolean;
};

export function HeroAsciiField() {
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = artRef.current;
    if (host === null) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanupScene = () => {};
    let rebuildHandle = 0;
    let isDisposed = false;

    const rebuild = () => {
      cleanupScene();
      cleanupScene = mountAsciiField(host, { reducedMotion: motionQuery.matches });
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

    const resizeObserver = new ResizeObserver(() => {
      scheduleRebuild();
    });
    resizeObserver.observe(host);

    const handleMotionPreference = () => {
      scheduleRebuild();
    };

    motionQuery.addEventListener?.("change", handleMotionPreference);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(rebuildHandle);
      motionQuery.removeEventListener?.("change", handleMotionPreference);
      resizeObserver.disconnect();
      cleanupScene();
    };
  }, []);

  return (
    <div className="hero-signal" aria-hidden="true" role="presentation">
      <div className="hero-signal__wash hero-signal__wash--one" />
      <div className="hero-signal__wash hero-signal__wash--two" />
      <div className="hero-signal__wash hero-signal__wash--three" />

      <div className="hero-signal__art" ref={artRef}>
        {FALLBACK_ROWS.map((row, index) => (
          <div className="hero-signal__row" key={index}>
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}

function createFallbackRows(rowCount: number, columnCount: number): string[] {
  return Array.from({ length: rowCount }, (_, row) =>
    Array.from({ length: columnCount }, (_, column) => {
      const wave = Math.sin(row * 0.46 + column * 0.3);
      const bloom = Math.cos(column * 0.18 - row * 0.41);
      const brightness = (wave + bloom + 2) / 4;
      const glyphIndex = Math.max(
        0,
        Math.min(FALLBACK_RAMP.length - 1, Math.round(brightness * (FALLBACK_RAMP.length - 1))),
      );

      return FALLBACK_RAMP[glyphIndex]!;
    }).join(""),
  );
}

function mountAsciiField(host: HTMLDivElement, options: { reducedMotion: boolean }) {
  const width = Math.max(host.clientWidth, 360);
  const height = Math.max(host.clientHeight, Math.min(width * 1.16, 540), 360);
  const columns = clamp(Math.round(width / 21), 14, 22);
  const rows = clamp(Math.round(height / 20), 16, 24);
  const lineHeight = clamp(height / rows, 18, 26);
  const cellWidth = width / columns;
  const fontSize = clamp(Math.min(cellWidth * 1.48, lineHeight * 1.08), 16, 25);

  host.style.setProperty("--hero-signal-font-size", `${fontSize}px`);
  host.style.setProperty("--hero-signal-line-height", `${lineHeight}px`);
  host.textContent = "";

  const rowNodes = Array.from({ length: rows }, () => {
    const rowNode = document.createElement("div");
    rowNode.className = "hero-signal__row";
    rowNode.style.height = `${lineHeight}px`;
    rowNode.style.lineHeight = `${lineHeight}px`;
    host.appendChild(rowNode);
    return rowNode;
  });

  const brightnessCanvas = document.createElement("canvas");
  brightnessCanvas.width = 28;
  brightnessCanvas.height = 28;

  const brightnessContext = brightnessCanvas.getContext("2d", { willReadFrequently: true });
  if (brightnessContext === null) {
    applyFallbackRows(host);
    return () => {};
  }

  const palette = createPalette(brightnessContext, fontSize);
  if (palette.length === 0) {
    applyFallbackRows(host);
    return () => {};
  }

  const lookup = buildLookup(palette, cellWidth);
  const fieldColumns = columns * FIELD_OVERSAMPLE;
  const fieldRows = rows * FIELD_OVERSAMPLE;
  const brightnessField = new Float32Array(fieldColumns * fieldRows);
  const simulationWidth = clamp(Math.round(width * 0.46), 180, 260);
  const simulationHeight = Math.round(simulationWidth * (height / width));
  const fieldScaleX = fieldColumns / simulationWidth;
  const fieldScaleY = fieldRows / simulationHeight;
  const particleCount = clamp(Math.round(columns * rows * 0.3), 64, 108);
  const particles = createParticles(particleCount, simulationWidth, simulationHeight);
  const particleFieldStamp = createFieldStamp(PARTICLE_RADIUS, fieldScaleX, fieldScaleY);
  const primaryAttractorFieldStamp = createFieldStamp(
    PRIMARY_ATTRACTOR_RADIUS,
    fieldScaleX,
    fieldScaleY,
  );
  const secondaryAttractorFieldStamp = createFieldStamp(
    SECONDARY_ATTRACTOR_RADIUS,
    fieldScaleX,
    fieldScaleY,
  );
  const previousRows = new Array<string>(rows).fill("");

  const renderFrame = (timestamp: number) => {
    const primaryAttractorX = Math.cos(timestamp * 0.0007) * simulationWidth * 0.25 + simulationWidth / 2;
    const primaryAttractorY =
      Math.sin(timestamp * 0.0011) * simulationHeight * 0.3 + simulationHeight / 2;
    const secondaryAttractorX =
      Math.cos(timestamp * 0.0013 + Math.PI) * simulationWidth * 0.2 + simulationWidth / 2;
    const secondaryAttractorY =
      Math.sin(timestamp * 0.0009 + Math.PI) * simulationHeight * 0.25 + simulationHeight / 2;

    decayField(brightnessField, FIELD_DECAY);

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
        particle.x += simulationWidth + PARTICLE_RADIUS * 2;
      } else if (particle.x > simulationWidth + PARTICLE_RADIUS) {
        particle.x -= simulationWidth + PARTICLE_RADIUS * 2;
      }

      if (particle.y < -PARTICLE_RADIUS) {
        particle.y += simulationHeight + PARTICLE_RADIUS * 2;
      } else if (particle.y > simulationHeight + PARTICLE_RADIUS) {
        particle.y -= simulationHeight + PARTICLE_RADIUS * 2;
      }

      splatFieldStamp(
        brightnessField,
        fieldColumns,
        fieldRows,
        fieldScaleX,
        fieldScaleY,
        particle.x,
        particle.y,
        particleFieldStamp,
      );
    }

    splatFieldStamp(
      brightnessField,
      fieldColumns,
      fieldRows,
      fieldScaleX,
      fieldScaleY,
      primaryAttractorX,
      primaryAttractorY,
      primaryAttractorFieldStamp,
    );
    splatFieldStamp(
      brightnessField,
      fieldColumns,
      fieldRows,
      fieldScaleX,
      fieldScaleY,
      secondaryAttractorX,
      secondaryAttractorY,
      secondaryAttractorFieldStamp,
    );

    for (let row = 0; row < rows; row += 1) {
      let rowMarkup = "";
      const rowStart = row * FIELD_OVERSAMPLE * fieldColumns;

      for (let column = 0; column < columns; column += 1) {
        const columnStart = column * FIELD_OVERSAMPLE;
        const brightness = sampleField(
          brightnessField,
          fieldColumns,
          rowStart,
          columnStart,
          FIELD_OVERSAMPLE,
        );

        if (brightness < 0.026) {
          rowMarkup += EMPTY_GLYPH;
          continue;
        }

        const brightnessByte = Math.min(255, Math.round(brightness * 255));
        const token = lookup[brightnessByte]!;
        if (token.isSpace) {
          rowMarkup += EMPTY_GLYPH;
          continue;
        }

        const opacity = clamp(0.14 + brightness * 1.1, 0.14, 0.98);
        rowMarkup += `<span class="hero-signal__glyph ${token.className}" style="opacity: ${opacity.toFixed(3)}">${token.html}</span>`;
      }

      if (rowMarkup !== previousRows[row]) {
        previousRows[row] = rowMarkup;
        rowNodes[row]!.innerHTML = rowMarkup;
      }
    }
  };

  renderFrame(performance.now());

  if (options.reducedMotion) {
    return () => {
      host.style.removeProperty("--hero-signal-font-size");
      host.style.removeProperty("--hero-signal-line-height");
    };
  }

  let animationFrame = 0;
  let lastTimestamp = 0;
  const frameInterval = 1000 / 24;

  const animate = (timestamp: number) => {
    if (timestamp - lastTimestamp >= frameInterval) {
      lastTimestamp = timestamp;
      renderFrame(timestamp);
    }

    animationFrame = window.requestAnimationFrame(animate);
  };

  animationFrame = window.requestAnimationFrame(animate);

  return () => {
    window.cancelAnimationFrame(animationFrame);
    host.style.removeProperty("--hero-signal-font-size");
    host.style.removeProperty("--hero-signal-line-height");
  };
}

function applyFallbackRows(host: HTMLDivElement) {
  host.innerHTML = FALLBACK_ROWS.map((row) => `<div class="hero-signal__row">${row}</div>`).join("");
}

function createPalette(
  brightnessContext: CanvasRenderingContext2D,
  fontSize: number,
): PaletteEntry[] {
  const palette: PaletteEntry[] = [];
  const glyphSize = brightnessContext.canvas.width;

  for (const style of GLYPH_STYLES) {
    for (const weight of GLYPH_WEIGHTS) {
      const font = `${style === "italic" ? "italic " : ""}${weight} ${fontSize}px ${GLYPH_FONT_FAMILY}`;

      for (const char of GLYPH_CHARSET) {
        if (char === " ") {
          continue;
        }

        const width = measureGlyphWidth(char, font);
        if (width <= 0) {
          continue;
        }

        brightnessContext.clearRect(0, 0, glyphSize, glyphSize);
        brightnessContext.font = font;
        brightnessContext.fillStyle = "#ffffff";
        brightnessContext.textAlign = "center";
        brightnessContext.textBaseline = "middle";
        brightnessContext.fillText(char, glyphSize / 2, glyphSize / 2 + 1);

        const pixels = brightnessContext.getImageData(0, 0, glyphSize, glyphSize).data;
        let alphaTotal = 0;

        for (let index = 3; index < pixels.length; index += 4) {
          alphaTotal += pixels[index]!;
        }

        palette.push({
          brightness: alphaTotal / (255 * glyphSize * glyphSize),
          char,
          style,
          weight,
          width,
        });
      }
    }
  }

  const highestBrightness = Math.max(...palette.map((entry) => entry.brightness), 1);
  for (let index = 0; index < palette.length; index += 1) {
    palette[index]!.brightness /= highestBrightness;
  }

  return palette.sort((left, right) => left.brightness - right.brightness);
}

function buildLookup(palette: PaletteEntry[], targetCellWidth: number): GlyphToken[] {
  return Array.from({ length: 256 }, (_, brightnessIndex) => {
    const targetBrightness = brightnessIndex / 255;
    if (targetBrightness < 0.026) {
      return { className: "is-space", html: "&nbsp;", isSpace: true };
    }

    const match = findClosestPaletteEntry(palette, targetBrightness, targetCellWidth);
    const weightClass = match.weight === 300 ? "w3" : match.weight === 500 ? "w5" : "w7";
    const styleClass = match.style === "italic" ? " is-italic" : "";

    return {
      className: `${weightClass}${styleClass}`,
      html: escapeHtml(match.char),
      isSpace: false,
    };
  });
}

function findClosestPaletteEntry(
  palette: PaletteEntry[],
  targetBrightness: number,
  targetCellWidth: number,
) {
  let lowerBound = 0;
  let upperBound = palette.length - 1;

  while (lowerBound < upperBound) {
    const middle = (lowerBound + upperBound) >> 1;
    if (palette[middle]!.brightness < targetBrightness) {
      lowerBound = middle + 1;
    } else {
      upperBound = middle;
    }
  }

  let bestScore = Number.POSITIVE_INFINITY;
  let bestEntry = palette[lowerBound]!;
  const searchStart = Math.max(0, lowerBound - 15);
  const searchEnd = Math.min(palette.length, lowerBound + 15);

  for (let index = searchStart; index < searchEnd; index += 1) {
    const entry = palette[index]!;
    const brightnessError = Math.abs(entry.brightness - targetBrightness) * 2.5;
    const widthError = Math.abs(entry.width - targetCellWidth) / targetCellWidth;
    const score = brightnessError + widthError;

    if (score < bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return bestEntry;
}

function measureGlyphWidth(char: string, font: string) {
  const prepared = prepareWithSegments(char, font);
  return prepared.widths[0] ?? 0;
}

function createParticles(count: number, simulationWidth: number, simulationHeight: number): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 40 + 20;

    return {
      x: simulationWidth / 2 + Math.cos(angle) * radius,
      y: simulationHeight / 2 + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    };
  });
}

function createFieldStamp(radiusPx: number, fieldScaleX: number, fieldScaleY: number): FieldStamp {
  const fieldRadiusX = radiusPx * fieldScaleX;
  const fieldRadiusY = radiusPx * fieldScaleY;
  const radiusX = Math.ceil(fieldRadiusX);
  const radiusY = Math.ceil(fieldRadiusY);
  const sizeX = radiusX * 2 + 1;
  const sizeY = radiusY * 2 + 1;
  const values = new Float32Array(sizeX * sizeY);

  for (let y = -radiusY; y <= radiusY; y += 1) {
    for (let x = -radiusX; x <= radiusX; x += 1) {
      const normalizedDistance = Math.sqrt((x / fieldRadiusX) ** 2 + (y / fieldRadiusY) ** 2);
      values[(y + radiusY) * sizeX + x + radiusX] = radialAlpha(normalizedDistance);
    }
  }

  return { radiusX, radiusY, sizeX, sizeY, values };
}

function radialAlpha(distance: number) {
  if (distance >= 1) {
    return 0;
  }

  if (distance <= 0.35) {
    return 0.45 + (0.15 - 0.45) * (distance / 0.35);
  }

  return 0.15 * (1 - (distance - 0.35) / 0.65);
}

function splatFieldStamp(
  targetField: Float32Array,
  fieldColumns: number,
  fieldRows: number,
  fieldScaleX: number,
  fieldScaleY: number,
  centerX: number,
  centerY: number,
  stamp: FieldStamp,
) {
  const gridCenterX = Math.round(centerX * fieldScaleX);
  const gridCenterY = Math.round(centerY * fieldScaleY);

  for (let y = -stamp.radiusY; y <= stamp.radiusY; y += 1) {
    const gridY = gridCenterY + y;
    if (gridY < 0 || gridY >= fieldRows) {
      continue;
    }

    const fieldRowOffset = gridY * fieldColumns;
    const stampRowOffset = (y + stamp.radiusY) * stamp.sizeX;

    for (let x = -stamp.radiusX; x <= stamp.radiusX; x += 1) {
      const gridX = gridCenterX + x;
      if (gridX < 0 || gridX >= fieldColumns) {
        continue;
      }

      const stampValue = stamp.values[stampRowOffset + x + stamp.radiusX]!;
      if (stampValue === 0) {
        continue;
      }

      const fieldIndex = fieldRowOffset + gridX;
      targetField[fieldIndex] = Math.min(1, targetField[fieldIndex]! + stampValue);
    }
  }
}

function sampleField(
  field: Float32Array,
  fieldColumns: number,
  rowStart: number,
  columnStart: number,
  oversample: number,
) {
  let total = 0;

  for (let sampleY = 0; sampleY < oversample; sampleY += 1) {
    const sampleRowOffset = rowStart + sampleY * fieldColumns + columnStart;
    for (let sampleX = 0; sampleX < oversample; sampleX += 1) {
      total += field[sampleRowOffset + sampleX]!;
    }
  }

  return total / (oversample * oversample);
}

function decayField(field: Float32Array, amount: number) {
  for (let index = 0; index < field.length; index += 1) {
    field[index] = field[index]! * amount;
  }
}

function escapeHtml(value: string) {
  if (value === "&") {
    return "&amp;";
  }

  if (value === "<") {
    return "&lt;";
  }

  if (value === ">") {
    return "&gt;";
  }

  if (value === '"') {
    return "&quot;";
  }

  return value;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(maximum, value));
}
