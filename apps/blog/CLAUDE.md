# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is Servando Torres's personal blog built with Astro. The site features AI/ML technical content and personal writing with modern web performance and type-safe content management.

## Build Commands

```bash
# Install dependencies
npm install

# Development server with live reload
npm run dev

# Build static site
npm run build

# Preview production build
npm run preview

# Utility scripts
python scripts/check_links.py          # Verify all links in markdown files
python scripts/generate_sitemap.py     # Generate SEO sitemap with AI summaries
python scripts/generate_desc.py        # Add AI-generated descriptions to posts
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
3. Run `python scripts/generate_desc.py` to generate AI descriptions if needed
4. Links should be verified with `python scripts/check_links.py`
5. Categories automatically generate dynamic routes at `/categories/[category]`

## Important Notes

- The site is live at https://servando.co/
- Git repository: https://github.com/vandotorres/blog/
- Modern dark theme with consistent branding
- RSS feed generation via Astro RSS integration
- Type-safe content validation ensures data integrity

## Shortlink CLI Rule

- When adding new external links to any blog post, always use the `scripts/shortlinks.py` CLI to generate a shortlink.
- Always use the `--blog-tag` option to tag the link with the blog's slug or filename.
- Example usage:
  ```bash
  uv run python scripts/shortlinks.py "https://example.com" --title "Descriptive Title" --desc "Short description" --tags "tag1,tag2" --external-id "unique-id-for-link" --blog-tag "blog-slug"
  ```
