# Deployment Guide

This monorepo contains two Astro applications that deploy to separate domains via Vercel.

## Apps & Domains

- **Website** (`apps/website/`) → `controlthrive.com`
- **Blog** (`apps/blog/`) → `servando.co`

## Vercel Setup

### 1. Website Deployment (controlthrive.com)

1. Connect your GitHub repo to Vercel
2. When prompted for project settings:
   - **Root Directory**: `apps/website`
   - **Build Command**: `cd ../.. && npm run website:build`
   - **Output Directory**: `dist`
   - **Install Command**: `cd ../.. && npm install`
3. Set custom domain to `controlthrive.com`

### 2. Blog Deployment (servando.co) (TODO: servando.co hasn't been setup yet)

1. Create a new Vercel project from the same GitHub repo
2. When prompted for project settings:
   - **Root Directory**: `apps/blog`
   - **Build Command**: `cd ../.. && npm run blog:build`
   - **Output Directory**: `dist`
   - **Install Command**: `cd ../.. && npm install`
3. Set custom domain to `servando.co`

## Local Development

```bash
# Install dependencies
npm install

# Run website locally
npm run website:dev

# Run blog locally  
npm run blog:dev

# Build both apps
npm run build

# Run Python tools for blog
cd tools && uv run python check_links.py ../apps/blog
```

## Monorepo Benefits

✅ **Shared Design System**: Both apps use the same UI package from `packages/ui/`
✅ **Content Cross-Referencing**: Website can reference blog posts, blog can link to services
✅ **Unified Development**: Single repo, shared tooling, consistent styling
✅ **Independent Deployments**: Each app deploys separately to its own domain

## Environment Variables

If you need environment variables, set them separately for each Vercel project:

- Website project: Set website-specific vars
- Blog project: Set blog-specific vars

## Content Cross-Referencing

The shared UI package (`packages/ui`) provides utilities for cross-referencing content:

```typescript
import { getBlogPostReference, getWebsitePageReference } from '@website-blog/ui';

// Reference a blog post from the website
const post = getBlogPostReference('building-ai-powered-apps');

// Reference the website from a blog post  
const homepage = getWebsitePageReference('home');
```