# Astro Blog with Automation Scripts

This Astro blog maintains the same workflow and automation capabilities as the original MkDocs blog, with enhanced performance and modern web standards.

## 🚀 Quick Start

```bash
# Install dependencies
npm install
pip install -r requirements-doc.txt

# Development
npm run dev

# Build
npm run build
```

## 📁 Content Structure

```
src/
├── content/
│   └── writing/
│       └── posts/          # Your blog posts go here
│           ├── my-post.md
│           └── ...
├── pages/
│   ├── writing/           # Writing section landing page
│   ├── posts/            # All posts + individual post pages
│   └── categories/       # Category pages
└── layouts/              # Reusable layouts
```

## ✍️ Writing Workflow

### 1. Create a New Post

```bash
# Create new post file
touch src/content/writing/posts/my-new-post.md
```

### 2. Add Frontmatter

```yaml
---
title: 'My New Post'
date: 2024-01-28
description: 'A compelling description for SEO'
categories: ['AI', 'Tutorial']
published: true
---
# Your content here...
```

### 3. Preview & Publish

```bash
npm run dev  # Preview at http://localhost:4321
```

Post will automatically appear in:

- Home page (if recent)
- Writing section
- All posts page
- Relevant category pages
- Search results

## 🤖 Automation Scripts

All your familiar automation scripts work with Astro:

### Link Checking

```bash
python scripts/check_links.py
```

Validates all URLs in your markdown files.

### AI Description Generation

```bash
python scripts/generate_desc.py --root-dir src/content
```

Generates SEO descriptions, categories, and tags using AI.

### Sitemap Generation

```bash
python scripts/generate_sitemap.py --root-dir src/content
```

Creates intelligent content summaries with AI.

### Shortlink Creation

```bash
python scripts/shortlinks.py create "https://example.com" --title "My Link" --blog-tag "my-post"
```

Creates Dub shortlinks for external URLs.

## 🔧 Script Configuration

The scripts have been adapted for Astro's content structure:

- **Default path**: `src/content` (instead of `docs`)
- **Date format**: Compatible with Astro's date handling
- **Frontmatter**: Ensures `published: true` field exists
- **Categories**: Same category system as MkDocs

## 🎯 Key Features

### Content Management

- ✅ Same `writing/posts/` structure as MkDocs
- ✅ Compatible frontmatter format
- ✅ Automatic categorization and indexing
- ✅ Search and filtering
- ✅ Cross-linking between posts

### Performance

- ✅ Zero JavaScript by default
- ✅ Optimized static site generation
- ✅ Fast build times
- ✅ Excellent SEO

### Automation

- ✅ AI-powered content enhancement
- ✅ Link validation
- ✅ Sitemap generation
- ✅ Shortlink management

## 🔄 Migration from MkDocs

### Content Migration

```bash
# Copy your posts (adjust paths as needed)
cp -r ../docs/writing/posts/* src/content/writing/posts/

# Update frontmatter dates (remove quotes if needed)
# Change: date: "2024-01-28"
# To: date: 2024-01-28
```

### Script Usage

```bash
# Your existing commands work with minor path changes:

# Before (MkDocs):
python generate_desc.py --root-dir docs

# After (Astro):
python scripts/generate_desc.py --root-dir src/content
```

## 📝 Frontmatter Fields

```yaml
---
title: 'Required - Post title'
date: 2024-01-28 # Required - YYYY-MM-DD format
description: 'Required - SEO description'
categories: ['Required', 'Array'] # Required - Array of categories
published: true # Required - Boolean
tags: ['Optional', 'Array'] # Optional - Array of tags
featured: false # Optional - Boolean
---
```

## 🌐 Navigation Structure

- **Home** (`/`) - Site homepage with recent posts
- **Writing** (`/writing`) - Writing section overview
- **Posts** (`/posts`) - All posts with search and filtering
- **Categories** (`/categories`) - Browse posts by category
- **About** (`/about`) - About page

## 🎨 Theming

The blog uses a minimal dark theme with:

- Consistent color scheme across all pages
- Responsive design for mobile and desktop
- Syntax highlighting for code blocks
- Category-based color coding

## 🔧 Development

### Adding New Pages

Create `.astro` files in `src/pages/`

### Modifying Layouts

Edit files in `src/layouts/`

### Styling

Global styles are in `src/layouts/Layout.astro`

### Content Collections

Content schema is defined in `src/content/config.ts`

## 📊 Performance Benefits vs MkDocs

- **Faster builds**: Vite-powered development
- **Smaller bundles**: Zero JS by default
- **Better SEO**: Modern meta tag handling
- **Enhanced UX**: Instant navigation and search

## 🤝 Compatibility

- ✅ Same writing workflow as MkDocs
- ✅ Compatible automation scripts
- ✅ Same content organization
- ✅ Familiar frontmatter format
- ✅ Easy migration path

---

**Ready to start writing!** Just add markdown files to `src/content/writing/posts/` and your content will automatically appear throughout the site.
