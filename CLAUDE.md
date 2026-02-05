# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a monorepo containing two Astro applications: ControlThrive's marketing website and Servando Torres's personal blog. Both apps share a unified design system and can cross-reference content while deploying to separate domains.

## Monorepo Structure

```
website-blog/
├── apps/
│   ├── website/               # ControlThrive marketing site (controlthrive.com)
│   └── blog/                  # Personal blog (servando.co)
├── packages/
│   └── ui/                    # Shared design system package
└── tools/                     # Shared Python automation tools
```

## Build Commands

```bash
# Install all dependencies
npm install

# Development (run separately for better performance)
npm run website:dev           # Start website dev server (localhost:4321)
npm run blog:dev              # Start blog dev server (localhost:4321)

# Building
npm run website:build         # Build website only
npm run blog:build            # Build blog only  
npm run build                 # Build both apps

# Blog-specific Python tools (run from root)
cd tools && uv run python check_links.py ../apps/blog          # Validate blog links
cd tools && uv run python generate_sitemap.py ../apps/blog     # Generate SEO sitemap
cd tools && uv run python generate_desc.py ../apps/blog        # Add AI descriptions
cd tools && uv run python shortlinks.py                        # URL shortening utility
cd tools && uv run python listen_post.py ../apps/blog/src/content/posts/your-post.md  # Listen to post via TTS (auto-deleted after)

# UI package
npm run ui:build              # Build shared design system
```

## Architecture

### Monorepo Design
- **npm workspaces** for dependency management and build orchestration
- **Shared design system** (`packages/ui`) with unified Geist fonts, dark/light themes, and component library
- **Content cross-referencing system** allowing apps to reference each other's content
- **Independent deployments** to separate Vercel projects and domains

### Website App (`apps/website`)
- Astro marketing site with React islands for interactivity
- Services, testimonials, industry expertise, and contact information
- Cal.com integration for meeting booking
- shadcn/ui components with custom theme system

### Blog App (`apps/blog`) 
- Astro blog with type-safe content collections
- Markdown posts with frontmatter validation via Zod schemas
- Python automation tools for SEO and link management
- AI-powered content optimization

### Shared Design System (`packages/ui`)
- **Geist font family** (Sans & Mono) across both apps
- **Advanced dark/light theme system** with CSS variables and localStorage persistence
- **Semantic color system** using HSL variables for consistent theming
- **Content cross-referencing utilities** (`content-links.ts`, `RelatedContent.astro`)
- **Shared Tailwind configuration** with custom theme extensions

## Content Cross-Referencing

Both apps can reference each other's content using the shared UI package:

```typescript
import { getBlogPostReference, getWebsitePageReference } from '@website-blog/ui';

// Website referencing blog posts
const post = getBlogPostReference('building-ai-powered-apps');

// Blog referencing website services
const services = getWebsitePageReference('home');
```

When adding new content, update `packages/ui/content-links.ts` registry.

## Deployment

Both apps deploy independently to Vercel:

- **Website**: `controlthrive.com` (Root Directory: `apps/website`)
- **Blog**: `servando.co` (Root Directory: `apps/blog`)

Build commands use monorepo-aware paths:
- Build Command: `cd ../.. && npm run [app]:build`
- Install Command: `cd ../.. && npm install`

## Python Tools Usage

The blog includes specialized Python automation tools in the `tools/` directory:

- **Link Validation**: Verify all markdown links are working
- **SEO Optimization**: Generate sitemaps with AI-powered descriptions
- **Content Enhancement**: Add AI-generated descriptions to posts
- **URL Management**: Create and manage shortlinks for external references
- **Text-to-Speech**: Convert blog posts to audio using ElevenLabs (requires `ELEVENLABS_API_KEY` in `.env`)

Always use the shortlinks CLI with `--blog-tag` when adding external links to blog posts.

## Development Notes

- **Theme System**: Modifications to shared theme affect both apps (`packages/ui/theme.ts`)
- **Component Sharing**: Add reusable components to `packages/ui/components/`
- **Workspace Dependencies**: Use `@website-blog/ui` for internal package references
- **Build Process**: Always build shared UI package before individual apps when making changes
- **Content Management**: Blog uses Astro content collections with type safety, website uses component-based content