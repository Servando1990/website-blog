# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is Servando Torres's personal blog built with Astro. The site features AI/ML technical content and personal writing with modern web performance and type-safe content management.

## Build Commands

```bash
# Install dependencies
npm install

# Development server with live reload (run from monorepo root)
npm run blog:dev

# Build static site (run from monorepo root)  
npm run blog:build

# Preview production build (run from app directory)
npm run preview

# Utility scripts (run from monorepo root)
cd tools && uv run python check_links.py ../apps/blog          # Verify all links in markdown files
cd tools && uv run python generate_sitemap.py ../apps/blog     # Generate SEO sitemap with AI summaries
cd tools && uv run python generate_desc.py ../apps/blog        # Add AI-generated descriptions to posts
cd tools && uv run python shortlinks.py                        # URL shortening utility
```

## Architecture

The site uses Astro framework for modern static site generation:

- **Content**: Type-safe content collections in `src/content/posts/`
- **Blog posts**: Markdown files with frontmatter validation via Zod schemas
- **Configuration**: `astro.config.mjs` defines integrations and build settings
- **Automation**: Enhanced Python scripts for SEO optimization and link checking
- **Components**: Astro components in `src/layouts/` and `src/pages/`
- **Styling**: Tailwind CSS with custom theme system and scoped components

Key architectural decisions:

- Modern web framework with file-based routing and static generation
- Type-safe content management with Astro content collections
- Component-based architecture for reusability and maintainability
- Tailwind CSS with custom design system and dark mode support
- AI-powered tools for SEO metadata generation
- Built-in performance optimizations and modern JavaScript features

## Adding Content

When adding new blog posts:

1. Create markdown file in `src/content/posts/`
2. Include frontmatter with date, title, description, categories, and published status
3. Run `cd tools && uv run python generate_desc.py ../apps/blog` to generate AI descriptions if needed
4. Links should be verified with `cd tools && uv run python check_links.py ../apps/blog`
5. Categories automatically generate dynamic routes at `/categories/[category]`

## Important Notes

- The site will be deployed at https://servando.co/
- Modern dark theme with consistent branding
- RSS feed generation via Astro RSS integration
- Type-safe content validation ensures data integrity
- Google Analytics enabled (tag: G-B63GHWTW4B)

## Thought Leadership Post Rules

**Structure:** Core insights upfront → glossary of key terms → concrete examples → actionable next steps

**Opening Format:** Use "The core insight:" or "Two core insights:" followed by direct statement. Include series positioning: "This is part of the Series Name. I'm focusing on X because it's where theory meets practice."

**Subheadings:** Avoid corny/dramatic language. Use direct, descriptive headers like "Implementation Strategy" instead of "The Evolution from Chunks to Context" or "Why Agents Need Different Information Architecture" instead of "The Persistence Advantage: Why Agents Change Everything"

**Citations:** Weave research naturally to support arguments. Use descriptive link text ("research shows", "Anthropic's approach"). Position strategically where they strengthen specific points.

**Key insights to emphasize:** "Bad context is cheap but toxic" (computational cheapness ≠ business value), coding agents as leading edge, economics/ergonomics matter, transferable principles across industries.

**Tone:** Concise, practical urgency ("this matters now"), concrete metrics, honest about complexity. First-person perspective from consulting experience.

**Consulting Attribution:** Include early reference: "Through my consulting work, I help companies..." and conclude with collaboration invitation: "If these approaches resonate with your challenges or if you're interested in working together, I'd love to help."

**Cross-linking:** Note at the end to use blog-crosslink-optimizer agent to enhance posts with natural internal links that add reader value.

PREFERBLY NO MORE THAN 4 MIN READ 

## Voice and Framing

**CRITICAL: This is YOUR thought leadership, not client documentation.**

**NEVER:**
- Reference "the client", "they", "the team", "the company"
- Use phrases like "they wanted", "they needed", "they asked for"
- Frame as executing client requirements
- Use third-party language: "their system", "their challenge"

## Shortlink CLI Rule

- When adding new external links to any blog post, always use the `tools/shortlinks.py` CLI to generate a shortlink.
- Always use the `--blog-tag` option to tag the link with the blog's slug or filename.
- Example usage:
  ```bash
  cd tools && uv run python shortlinks.py "https://example.com" --title "Descriptive Title" --desc "Short description" --tags "tag1,tag2" --external-id "unique-id-for-link" --blog-tag "blog-slug"
  ```
