"use client";

import { prepareWithSegments } from "@chenglou/pretext";
import { useEffect, useRef } from "react";

const GLYPH_CHARSET = " .·:•°+*oO0#";
const GLYPH_WEIGHTS = [300, 500, 700] as const;
const FIELD_OVERSAMPLE = 2;
const FALLBACK_RAMP = " .·:•°+*oO#";
const EMPTY_GLYPH = '<span class="hero-signal__glyph is-space">&nbsp;</span>';
const GLYPH_FONT_FAMILY =
  '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif';
const FALLBACK_ROWS = createFallbackRows(19, 36);

type PaletteEntry = {
  brightness: number;
  char: string;
  weight: number;
  width: number;
};

type Particle = {
  channel: number;
  drift: number;
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

type GlyphToken = {
  className: string;
  html: string;
  isSpace: boolean;
};

type RgbColor = [number, number, number];

type ColorSwatch = {
  accents: [RgbColor, RgbColor, RgbColor];
  base: RgbColor;
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
      const wave = Math.sin(row * 0.55 + column * 0.31);
      const drift = Math.cos(column * 0.23 - row * 0.42);
      const bloom = Math.sin(row * 0.18 - column * 0.09);
      const brightness = (wave + drift + bloom + 3) / 6;
      const glyphIndex = Math.max(
        0,
        Math.min(FALLBACK_RAMP.length - 1, Math.round(brightness * (FALLBACK_RAMP.length - 1))),
      );

      return FALLBACK_RAMP[glyphIndex]!;
    }).join(""),
  );
}

function mountAsciiField(host: HTMLDivElement, options: { reducedMotion: boolean }) {
  const width = Math.max(host.clientWidth, 320);
  const height = Math.max(host.clientHeight, Math.min(width * 0.92, 420), 280);
  const columns = clamp(Math.round(width / 14), 24, 34);
  const rows = clamp(Math.round(height / 18), 15, 22);
  const lineHeight = clamp(height / rows, 15, 20);
  const cellWidth = width / columns;
  const fontSize = clamp(Math.min(cellWidth * 1.18, lineHeight * 0.94), 12, 17);
  const swatch = readColorSwatch(host);

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
  const colorFields = [
    new Float32Array(fieldColumns * fieldRows),
    new Float32Array(fieldColumns * fieldRows),
    new Float32Array(fieldColumns * fieldRows),
  ] as const;
  const particleCount = clamp(Math.round(columns * rows * 0.1), 30, 64);
  const particles = createParticles(particleCount, columns, rows);
  const particleStamp = createFieldStamp(1.05);
  const colorStamp = createFieldStamp(1.3);
  const majorAttractorStamp = createFieldStamp(2.45);
  const minorAttractorStamp = createFieldStamp(1.75);
  const previousRows = new Array<string>(rows).fill("");

  const renderFrame = (timestamp: number) => {
    const attractors = [
      {
        x: columns * 0.24 + Math.cos(timestamp * 0.00031) * columns * 0.08,
        y: rows * 0.34 + Math.sin(timestamp * 0.00047) * rows * 0.16,
      },
      {
        x: columns * 0.76 + Math.sin(timestamp * 0.00027 + 1.1) * columns * 0.08,
        y: rows * 0.3 + Math.cos(timestamp * 0.00041 + 0.2) * rows * 0.14,
      },
      {
        x: columns * 0.54 + Math.cos(timestamp * 0.00023 + Math.PI) * columns * 0.18,
        y: rows * 0.72 + Math.sin(timestamp * 0.00038 + Math.PI * 0.35) * rows * 0.11,
      },
    ] as const;

    decayField(brightnessField, 0.875);
    for (let index = 0; index < colorFields.length; index += 1) {
      decayField(colorFields[index], 0.885);
    }

    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index]!;
      const primary = attractors[particle.channel]!;
      const secondary = attractors[(particle.channel + 1) % attractors.length]!;
      const primaryDx = primary.x - particle.x;
      const primaryDy = primary.y - particle.y;
      const secondaryDx = secondary.x - particle.x;
      const secondaryDy = secondary.y - particle.y;
      const primaryDistance = Math.sqrt(primaryDx * primaryDx + primaryDy * primaryDy) + 1;
      const secondaryDistance = Math.sqrt(secondaryDx * secondaryDx + secondaryDy * secondaryDy) + 1;

      particle.vx += (primaryDx / primaryDistance) * 0.022;
      particle.vy += (primaryDy / primaryDistance) * 0.022;
      particle.vx += (secondaryDx / secondaryDistance) * 0.005;
      particle.vy += (secondaryDy / secondaryDistance) * 0.005;
      particle.vx += Math.cos(timestamp * 0.001 + particle.drift) * 0.0016;
      particle.vy += Math.sin(timestamp * 0.0012 + particle.drift) * 0.0016;
      particle.vx += (Math.random() - 0.5) * 0.012;
      particle.vy += (Math.random() - 0.5) * 0.012;
      particle.vx *= 0.968;
      particle.vy *= 0.968;
      particle.x = wrap(particle.x + particle.vx, columns);
      particle.y = wrap(particle.y + particle.vy, rows);

      splatFieldStamp(brightnessField, fieldColumns, fieldRows, particle.x, particle.y, particleStamp, 0.9);
      splatFieldStamp(
        colorFields[particle.channel],
        fieldColumns,
        fieldRows,
        particle.x,
        particle.y,
        colorStamp,
        0.64,
      );
    }

    for (let index = 0; index < attractors.length; index += 1) {
      const attractor = attractors[index]!;
      const stamp = index === 2 ? majorAttractorStamp : minorAttractorStamp;
      splatFieldStamp(brightnessField, fieldColumns, fieldRows, attractor.x, attractor.y, stamp, 0.92);
      splatFieldStamp(colorFields[index], fieldColumns, fieldRows, attractor.x, attractor.y, stamp, 0.82);
    }

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
        const channelValues = colorFields.map((field) =>
          sampleField(field, fieldColumns, rowStart, columnStart, FIELD_OVERSAMPLE),
        ) as [number, number, number];
        const totalColor = channelValues[0] + channelValues[1] + channelValues[2];

        if (brightness < 0.028 && totalColor < 0.04) {
          rowMarkup += EMPTY_GLYPH;
          continue;
        }

        const brightnessByte = Math.min(255, Math.round(brightness * 255));
        const token = lookup[brightnessByte]!;
        if (token.isSpace) {
          rowMarkup += EMPTY_GLYPH;
          continue;
        }

        const color = mixColor(swatch, channelValues, brightness);
        const opacity = clamp(0.18 + brightness * 1.08 + totalColor * 0.12, 0.18, 0.96);
        rowMarkup += `<span class="hero-signal__glyph ${token.className}" style="color: rgb(${color[0]} ${color[1]} ${color[2]}); opacity: ${opacity.toFixed(3)}">${token.html}</span>`;
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
  const frameInterval = 1000 / 20;

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

  for (const weight of GLYPH_WEIGHTS) {
    const font = `${weight} ${fontSize}px ${GLYPH_FONT_FAMILY}`;

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
        weight,
        width,
      });
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

    return {
      className: weightClass,
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
  const searchStart = Math.max(0, lowerBound - 12);
  const searchEnd = Math.min(palette.length, lowerBound + 13);

  for (let index = searchStart; index < searchEnd; index += 1) {
    const entry = palette[index]!;
    const brightnessError = Math.abs(entry.brightness - targetBrightness) * 2.3;
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
  return Array.from({ length: count }, (_, index) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.min(columns, rows) * 0.24 + Math.min(columns, rows) * 0.08;

    return {
      channel: index % 3,
      drift: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
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

  if (distance <= 0.42) {
    return 0.48 + (0.18 - 0.48) * (distance / 0.42);
  }

  return 0.18 * (1 - (distance - 0.42) / 0.58);
}

function splatFieldStamp(
  targetField: Float32Array,
  fieldColumns: number,
  fieldRows: number,
  centerX: number,
  centerY: number,
  stamp: FieldStamp,
  scale: number,
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
      targetField[fieldIndex] = Math.min(1, targetField[fieldIndex]! + stampValue * scale);
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

function mixColor(
  swatch: ColorSwatch,
  channelValues: [number, number, number],
  brightness: number,
): RgbColor {
  const channelTotal = channelValues[0] + channelValues[1] + channelValues[2];
  if (channelTotal <= 0.0001) {
    return swatch.base;
  }

  const accent = [0, 0, 0] as RgbColor;
  for (let index = 0; index < swatch.accents.length; index += 1) {
    const weight = channelValues[index] / channelTotal;
    accent[0] += swatch.accents[index]![0] * weight;
    accent[1] += swatch.accents[index]![1] * weight;
    accent[2] += swatch.accents[index]![2] * weight;
  }

  const tintStrength = clamp(0.22 + brightness * 0.88 + channelTotal * 0.08, 0.22, 0.92);
  return [
    Math.round(swatch.base[0] * (1 - tintStrength) + accent[0] * tintStrength),
    Math.round(swatch.base[1] * (1 - tintStrength) + accent[1] * tintStrength),
    Math.round(swatch.base[2] * (1 - tintStrength) + accent[2] * tintStrength),
  ];
}

function readColorSwatch(host: HTMLDivElement): ColorSwatch {
  const styles = getComputedStyle(host);

  return {
    accents: [
      parseRgbVariable(styles.getPropertyValue("--hero-signal-color-a-rgb"), [124, 147, 116]),
      parseRgbVariable(styles.getPropertyValue("--hero-signal-color-b-rgb"), [214, 167, 94]),
      parseRgbVariable(styles.getPropertyValue("--hero-signal-color-c-rgb"), [112, 140, 171]),
    ],
    base: parseRgbVariable(styles.getPropertyValue("--hero-signal-base-rgb"), [34, 38, 44]),
  };
}

function parseRgbVariable(value: string, fallback: RgbColor): RgbColor {
  const parts = value
    .trim()
    .split(/\s+/)
    .map((segment) => Number.parseInt(segment, 10))
    .filter((segment) => Number.isFinite(segment));

  if (parts.length !== 3) {
    return fallback;
  }

  return [parts[0]!, parts[1]!, parts[2]!];
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

function wrap(value: number, length: number) {
  if (value < 0) {
    return value + length;
  }

  if (value >= length) {
    return value - length;
  }

  return value;
}
