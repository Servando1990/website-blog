#!/usr/bin/env python3
"""Render simple markdown resumes to compact A4 PDFs without external deps."""

from __future__ import annotations

import re
import sys
import textwrap
from dataclasses import dataclass
from pathlib import Path


PAGE_WIDTH = 595.28
PAGE_HEIGHT = 841.89
MARGIN_X = 46
TOP_MARGIN = 48
BOTTOM_MARGIN = 44

LINK_RE = re.compile(r"\[([^\]]+)\]\([^)]+\)")


@dataclass(frozen=True)
class Style:
    font: str
    size: float
    leading: float
    space_before: float = 0
    space_after: float = 0
    indent: float = 0


STYLES: dict[str, Style] = {
    "title": Style(font="F2", size=21, leading=24, space_after=4),
    "subtitle": Style(font="F2", size=12, leading=14, space_after=6),
    "h2": Style(font="F2", size=13, leading=15, space_before=5, space_after=2),
    "h3": Style(font="F2", size=11.5, leading=13, space_before=3, space_after=1),
    "body": Style(font="F1", size=10.2, leading=11.9),
    "bullet": Style(font="F1", size=10, leading=11.6, indent=16),
}


def strip_markdown(text: str) -> str:
    text = LINK_RE.sub(r"\1", text)
    return text.replace("**", "").replace("`", "").strip()


def wrap_text(text: str, style: Style, available_width: float) -> list[str]:
    avg_char_width = style.size * 0.52
    width = max(20, int(available_width / avg_char_width))
    return textwrap.wrap(
        text,
        width=width,
        break_long_words=False,
        break_on_hyphens=False,
    ) or [""]


def parse_markdown(markdown: str) -> list[tuple[Style, str, float]]:
    blocks: list[tuple[Style, str, float]] = []

    for raw_line in markdown.splitlines():
        line = raw_line.rstrip()
        if not line.strip():
            blocks.append((Style(font="", size=0, leading=4), "", 0))
            continue

        if line.startswith("# "):
            style = STYLES["title"]
            blocks.append((style, strip_markdown(line[2:]), 0))
            continue

        if line.startswith("## "):
            style = STYLES["h2"]
            blocks.append((style, strip_markdown(line[3:]), 0))
            continue

        if line.startswith("### "):
            style = STYLES["h3"]
            blocks.append((style, strip_markdown(line[4:]), 0))
            continue

        if line.startswith("- "):
            style = STYLES["bullet"]
            blocks.append((style, strip_markdown(line[2:]), style.indent))
            continue

        style = STYLES["body"]
        if "|" in line and not line.startswith("http"):
            style = STYLES["subtitle"]
        blocks.append((style, strip_markdown(line), 0))

    return blocks


def layout(markdown: str) -> list[list[tuple[str, float, float, str, float]]]:
    blocks = parse_markdown(markdown)
    pages: list[list[tuple[str, float, float, str, float]]] = [[]]
    y = PAGE_HEIGHT - TOP_MARGIN

    def ensure_space(required: float) -> None:
        nonlocal y
        if y - required < BOTTOM_MARGIN:
            pages.append([])
            y = PAGE_HEIGHT - TOP_MARGIN

    for style, text, indent in blocks:
        if not style.font:
            y -= style.leading
            continue

        if style.space_before:
            ensure_space(style.space_before)
            y -= style.space_before

        available_width = PAGE_WIDTH - (2 * MARGIN_X) - indent
        wrapped = wrap_text(text, style, available_width)
        required = len(wrapped) * style.leading + style.space_after
        ensure_space(required)

        for index, segment in enumerate(wrapped):
            draw_x = MARGIN_X + indent
            draw_text = segment
            if style is STYLES["bullet"]:
                if index == 0:
                    draw_text = f"- {segment}"
                else:
                    draw_x += 10
            pages[-1].append((draw_text, draw_x, y, style.font, style.size))
            y -= style.leading

        if style.space_after:
            y -= style.space_after

    return [page for page in pages if page]


def pdf_escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_content_stream(page: list[tuple[str, float, float, str, float]]) -> bytes:
    commands: list[str] = []
    for text, x, y, font, size in page:
        commands.append(
            f"BT /{font} {size:.2f} Tf 1 0 0 1 {x:.2f} {y:.2f} Tm ({pdf_escape(text)}) Tj ET"
        )
    return "\n".join(commands).encode("latin-1", errors="replace")


def write_pdf(pages: list[list[tuple[str, float, float, str, float]]], output_path: Path) -> None:
    objects: dict[int, bytes] = {
        1: b"<< /Type /Catalog /Pages 2 0 R >>",
        3: b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        4: b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    }

    page_refs: list[str] = []
    next_object = 5

    for page in pages:
        page_object = next_object
        content_object = next_object + 1
        page_refs.append(f"{page_object} 0 R")

        content = build_content_stream(page)
        objects[content_object] = (
            f"<< /Length {len(content)} >>\nstream\n".encode("ascii")
            + content
            + b"\nendstream"
        )
        objects[page_object] = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_WIDTH:.2f} {PAGE_HEIGHT:.2f}] "
            "/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> "
            f"/Contents {content_object} 0 R >>".encode("ascii")
        )
        next_object += 2

    objects[2] = f"<< /Type /Pages /Count {len(page_refs)} /Kids [{' '.join(page_refs)}] >>".encode(
        "ascii"
    )

    max_object = max(objects)
    output = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0] * (max_object + 1)

    for object_number in range(1, max_object + 1):
        payload = objects[object_number]
        offsets[object_number] = len(output)
        output.extend(f"{object_number} 0 obj\n".encode("ascii"))
        output.extend(payload)
        output.extend(b"\nendobj\n")

    xref_offset = len(output)
    output.extend(f"xref\n0 {max_object + 1}\n".encode("ascii"))
    output.extend(b"0000000000 65535 f \n")

    for object_number in range(1, max_object + 1):
        output.extend(f"{offsets[object_number]:010d} 00000 n \n".encode("ascii"))

    output.extend(
        (
            f"trailer\n<< /Size {max_object + 1} /Root 1 0 R >>\n"
            f"startxref\n{xref_offset}\n%%EOF\n"
        ).encode("ascii")
    )

    output_path.write_bytes(output)


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("Usage: markdown_to_pdf.py input.md output.pdf", file=sys.stderr)
        return 1

    input_path = Path(argv[1]).resolve()
    output_path = Path(argv[2]).resolve()

    markdown = input_path.read_text(encoding="utf-8")
    pages = layout(markdown)
    write_pdf(pages, output_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
