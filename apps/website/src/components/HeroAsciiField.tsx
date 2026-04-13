"use client";

import { prepareWithSegments } from "@chenglou/pretext";
import { useEffect, useRef } from "react";

const GLYPH_CHARSET =
  " .,:;!+-=*#@%&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const GLYPH_WEIGHTS = [300, 500, 700] as const;
const GLYPH_STYLES = ["normal", "italic"] as const;
const FIELD_OVERSAMPLE = 2;
const FALLBACK_RAMP = " .,:;-=+*#%@";
const EMPTY_GLYPH = '<span class="hero-signal__glyph is-space">&nbsp;</span>';
const GLYPH_FONT_FAMILY =
  '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif';
const FALLBACK_ROWS = createFallbackRows(18, 34);

type FontStyleVariant = (typeof GLYPH_STYLES)[number];

type PaletteEntry = {
  brightness: number;
  char: string;
  style: FontStyleVariant;
  weight: number;
  width: number;
};

type Particle = {
  vx: number;
  vy: number;
  x: number;
  y: number;
};

type FieldStamp = {
  radiusX: number;
  radiusY: number;
  sizeX: number;
  values: Float32Array;
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
    <aside className="hero-signal surface-panel-strong" aria-labelledby="hero-signal-title">
      <div className="hero-signal__head">
        <span className="hero-signal__eyebrow">Workflow signal</span>
        <p className="hero-signal__title" id="hero-signal-title">
          High-context inputs, clarified.
        </p>
        <p className="hero-signal__note">
          A live typographic sketch of research, operating detail, and investor context moving
          toward something a team can actually use.
        </p>
      </div>

      <div className="hero-signal__viewport">
        <div className="hero-signal__art" ref={artRef} aria-hidden="true">
          {FALLBACK_ROWS.map((row, index) => (
            <div className="hero-signal__row" key={index}>
              {row}
            </div>
          ))}
        </div>
      </div>

      <div className="hero-signal__legend" aria-label="Representative workflow areas">
        <span>Investor coverage</span>
        <span>Research synthesis</span>
        <span>Internal tooling</span>
      </div>
    </aside>
  );
}

function createFallbackRows(rowCount: number, columnCount: number): string[] {
  return Array.from({ length: rowCount }, (_, row) =>
    Array.from({ length: columnCount }, (_, column) => {
      const wave = Math.sin(row * 0.56 + column * 0.28);
      const drift = Math.cos(column * 0.18 - row * 0.43);
      const brightness = (wave + drift + 2) / 4;
      const glyphIndex = Math.max(
        0,
        Math.min(FALLBACK_RAMP.length - 1, Math.round(brightness * (FALLBACK_RAMP.length - 1))),
      );

      return FALLBACK_RAMP[glyphIndex]!;
    }).join(""),
  );
}

function mountAsciiField(host: HTMLDivElement, options: { reducedMotion: boolean }) {
  const width = Math.max(host.clientWidth, 280);
  const height = Math.max(host.clientHeight, Math.min(width * 0.82, 360), 240);
  const columns = clamp(Math.round(width / 12.5), 26, 36);
  const rows = clamp(Math.round(height / 16.4), 14, 20);
  const cellWidth = width / columns;
  const lineHeight = clamp(height / rows, 13.5, 18);
  const fontSize = clamp(Math.min(cellWidth * 1.12, lineHeight * 0.88), 10.5, 15);

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
  brightnessCanvas.width = 32;
  brightnessCanvas.height = 32;

  const brightnessContext = brightnessCanvas.getContext("2d", { willReadFrequently: true });
  if (brightnessContext === null) {
    host.innerHTML = FALLBACK_ROWS.map((row) => `<div class="hero-signal__row">${row}</div>`).join(
      "",
    );
    return () => {};
  }

  const palette = createPalette(brightnessContext, fontSize);
  if (palette.length === 0) {
    host.innerHTML = FALLBACK_ROWS.map((row) => `<div class="hero-signal__row">${row}</div>`).join(
      "",
    );
    return () => {};
  }

  const targetCellWidth = width / columns;
  const lookup = buildLookup(palette, targetCellWidth);
  const fieldColumns = columns * FIELD_OVERSAMPLE;
  const fieldRows = rows * FIELD_OVERSAMPLE;
  const brightnessField = new Float32Array(fieldColumns * fieldRows);
  const particleCount = clamp(Math.round(columns * rows * 0.075), 20, 52);
  const particles = createParticles(particleCount, columns, rows);
  const particleStamp = createFieldStamp(0.95);
  const largeAttractorStamp = createFieldStamp(1.95);
  const smallAttractorStamp = createFieldStamp(1.2);
  const previousRows = new Array<string>(rows).fill("");

  const renderFrame = (timestamp: number) => {
    const primaryAttractorX = columns / 2 + Math.cos(timestamp * 0.00052) * columns * 0.18;
    const primaryAttractorY = rows / 2 + Math.sin(timestamp * 0.00081) * rows * 0.24;
    const secondaryAttractorX =
      columns / 2 + Math.cos(timestamp * 0.00073 + Math.PI) * columns * 0.24;
    const secondaryAttractorY =
      rows / 2 + Math.sin(timestamp * 0.00061 + Math.PI * 0.6) * rows * 0.18;

    for (let index = 0; index < brightnessField.length; index += 1) {
      brightnessField[index] = brightnessField[index]! * 0.84;
    }

    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index]!;
      const primaryDx = primaryAttractorX - particle.x;
      const primaryDy = primaryAttractorY - particle.y;
      const secondaryDx = secondaryAttractorX - particle.x;
      const secondaryDy = secondaryAttractorY - particle.y;
      const primaryDistanceSquared = primaryDx * primaryDx + primaryDy * primaryDy;
      const secondaryDistanceSquared = secondaryDx * secondaryDx + secondaryDy * secondaryDy;
      const usePrimary = primaryDistanceSquared <= secondaryDistanceSquared;
      const attractorDx = usePrimary ? primaryDx : secondaryDx;
      const attractorDy = usePrimary ? primaryDy : secondaryDy;
      const force = usePrimary ? 0.022 : 0.014;
      const distance = Math.sqrt(Math.min(primaryDistanceSquared, secondaryDistanceSquared)) + 1;

      particle.vx += (attractorDx / distance) * force + (Math.random() - 0.5) * 0.014;
      particle.vy += (attractorDy / distance) * force + (Math.random() - 0.5) * 0.014;
      particle.vx *= 0.965;
      particle.vy *= 0.965;
      particle.x = wrap(particle.x + particle.vx, columns);
      particle.y = wrap(particle.y + particle.vy, rows);

      splatFieldStamp(brightnessField, fieldColumns, fieldRows, particle.x, particle.y, particleStamp);
    }

    splatFieldStamp(
      brightnessField,
      fieldColumns,
      fieldRows,
      primaryAttractorX,
      primaryAttractorY,
      largeAttractorStamp,
    );
    splatFieldStamp(
      brightnessField,
      fieldColumns,
      fieldRows,
      secondaryAttractorX,
      secondaryAttractorY,
      smallAttractorStamp,
    );

    for (let row = 0; row < rows; row += 1) {
      let rowMarkup = "";
      const rowStart = row * FIELD_OVERSAMPLE * fieldColumns;

      for (let column = 0; column < columns; column += 1) {
        const columnStart = column * FIELD_OVERSAMPLE;
        let brightness = 0;

        for (let sampleY = 0; sampleY < FIELD_OVERSAMPLE; sampleY += 1) {
          const sampleRowOffset = rowStart + sampleY * fieldColumns + columnStart;

          for (let sampleX = 0; sampleX < FIELD_OVERSAMPLE; sampleX += 1) {
            brightness += brightnessField[sampleRowOffset + sampleX]!;
          }
        }

        const normalizedBrightness = Math.min(
          255,
          Math.round((brightness / (FIELD_OVERSAMPLE * FIELD_OVERSAMPLE)) * 255),
        );

        rowMarkup += lookup[normalizedBrightness]!;
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

function buildLookup(palette: PaletteEntry[], targetCellWidth: number): string[] {
  return Array.from({ length: 256 }, (_, brightnessIndex) => {
    const targetBrightness = brightnessIndex / 255;
    if (targetBrightness < 0.03) {
      return EMPTY_GLYPH;
    }

    const match = findClosestPaletteEntry(palette, targetBrightness, targetCellWidth);
    const weightClass =
      match.weight === 300 ? "w3" : match.weight === 500 ? "w5" : "w7";
    const styleClass = match.style === "italic" ? " is-italic" : "";

    return `<span class="hero-signal__glyph ${weightClass}${styleClass}">${escapeHtml(match.char)}</span>`;
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
  const searchStart = Math.max(0, lowerBound - 14);
  const searchEnd = Math.min(palette.length, lowerBound + 15);

  for (let index = searchStart; index < searchEnd; index += 1) {
    const entry = palette[index]!;
    const brightnessError = Math.abs(entry.brightness - targetBrightness) * 2.45;
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

function createParticles(count: number, columns: number, rows: number): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.min(columns, rows) * 0.14 + Math.min(columns, rows) * 0.08;

    return {
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      x: columns / 2 + Math.cos(angle) * radius,
      y: rows / 2 + Math.sin(angle) * radius,
    };
  });
}

function createFieldStamp(radius: number): FieldStamp {
  const fieldRadius = radius * FIELD_OVERSAMPLE;
  const radiusX = Math.ceil(fieldRadius);
  const radiusY = Math.ceil(fieldRadius);
  const sizeX = radiusX * 2 + 1;
  const sizeY = radiusY * 2 + 1;
  const values = new Float32Array(sizeX * sizeY);

  for (let y = -radiusY; y <= radiusY; y += 1) {
    for (let x = -radiusX; x <= radiusX; x += 1) {
      const normalizedDistance = Math.sqrt((x / fieldRadius) ** 2 + (y / fieldRadius) ** 2);
      values[(y + radiusY) * sizeX + x + radiusX] = radialAlpha(normalizedDistance);
    }
  }

  return {
    radiusX,
    radiusY,
    sizeX,
    values,
  };
}

function radialAlpha(distance: number) {
  if (distance >= 1) {
    return 0;
  }

  if (distance <= 0.4) {
    return 0.44 + (0.16 - 0.44) * (distance / 0.4);
  }

  return 0.16 * (1 - (distance - 0.4) / 0.6);
}

function splatFieldStamp(
  brightnessField: Float32Array,
  fieldColumns: number,
  fieldRows: number,
  centerX: number,
  centerY: number,
  stamp: FieldStamp,
) {
  const gridCenterX = Math.round(centerX * FIELD_OVERSAMPLE);
  const gridCenterY = Math.round(centerY * FIELD_OVERSAMPLE);

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
      brightnessField[fieldIndex] = Math.min(1, brightnessField[fieldIndex]! + stampValue);
    }
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

function wrap(value: number, length: number) {
  if (value < 0) {
    return value + length;
  }

  if (value >= length) {
    return value - length;
  }

  return value;
}
