# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro-based website for ControlThrive - an AI/ML consulting business founded by Servando Torres. The project has been modernized from vanilla HTML/JS to use Astro with Tailwind CSS and shadcn/ui components.

- **Main website** (Astro) - Modern marketing site with services, testimonials, and contact information
- **Coming soon page** (`coming-soon.html`) - Legacy simple landing page with embedded calendar booking

The site uses Astro Islands for interactive components and is deployed on Vercel.

## Development Commands

```bash
# Start development server (Astro dev server on localhost:4321)
npm run dev
# or
npm start

# Build the site
npm run build

# Preview built site
npm run preview

# Type check
astro check
```

## Architecture & Structure

### Astro Structure
- `src/pages/index.astro` - Main homepage built with Astro components
- `src/layouts/Layout.astro` - Base layout with theme support and fonts
- `src/components/` - Modular Astro components for each section
- `coming-soon.html` - Legacy simple landing page (still available)
- `astro.config.mjs` - Astro configuration with Tailwind and React integrations
- `tailwind.config.mjs` - Tailwind configuration with custom theme system
- `vercel.json` - Vercel deployment config

### Component Architecture
- **Header.astro** - Navigation with theme toggle
- **Hero.astro** - Main hero section with CTA
- **TrustedBy.astro** - Company logos section
- **Solutions.astro** - Features list with checkmarks
- **Industries.astro** - Industry cards with modal functionality
- **Testimonials.astro** - Expandable testimonial cards
- **Partners.astro** - Partner logos section
- **Footer.astro** - Simple footer

### Interactive Islands (React Components)
- **ThemeToggle.tsx** - Dark/light mode switcher
- **IndustryModal.tsx** - Modal for industry expertise details
- **TestimonialCard.tsx** - Expandable testimonial cards

### Design System
Inspired by provided reference images with:
- **Dark theme**: Pure black (`bg-black`) with subtle grey borders, white text, gold accent colors
- **Light theme**: Warm cream (`#eeece2`) background with black text, minimal contrast
- **Typography**: Geist font family with clean hierarchy
- **Colors**: Semantic color system with `light-*` and `dark-*` prefixes
- **Icons**: Lucide React icons instead of images

### Key Features
- Dual theme system (dark/light) with localStorage persistence
- Responsive design with mobile-first approach
- Interactive testimonial expansion/collapse via React islands
- Modal system for industry expertise display
- Structured data (JSON-LD) for SEO
- Cal.com integration for meeting booking
- shadcn/ui components for consistent styling

### Dependencies
- `astro` - Main framework with static site generation
- `@astrojs/tailwind` & `@astrojs/react` - Framework integrations
- `tailwindcss` - Utility-first CSS framework
- `react` & `react-dom` - For interactive islands
- `lucide-react` - Icon library
- `class-variance-authority`, `clsx`, `tailwind-merge` - Utility libraries

## Deployment

The site deploys to Vercel with:
- Astro builds to `dist/` directory for static deployment
- Currently `vercel.json` still routes to `coming-soon.html` (legacy)
- To switch to new Astro site, update `vercel.json` routes to point to Astro build output
- Astro generates optimized static files with proper routing

## Development Notes

- All content preserved exactly from original `index.html`
- Design heavily inspired by provided reference images for dark/light themes
- Interactive functionality moved to React islands for better performance
- Company logos fetched from Google favicons API (same as original)
- Theme system persists user preference in localStorage
- All external links and Cal.com integrations maintained

## Important Notes

- Google Analytics enabled (tag: G-LLMXBYB3P8)

