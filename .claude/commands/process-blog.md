# Process Blog Post

Run the complete blog post processing workflow:
1. Check all links in markdown files
2. Generate AI-powered descriptions and frontmatter
3. Generate SEO sitemap with AI summaries

Execute the following commands in order from the tools directory:

## Step 1: Link Validation
```bash
cd tools && uv run python check_links.py ../apps/blog
```

## Step 2: Generate Descriptions & Frontmatter
If link checking succeeds, proceed with:

```bash
cd tools && uv run python generate_desc.py --root-dir ../apps/blog/src/content
```

## Step 3: Generate SEO Sitemap
```bash
cd tools && uv run python generate_sitemap.py --root-dir ../apps/blog/src/content --output-file ../apps/blog/sitemap.yaml
```

After running all scripts successfully, provide a summary of what was processed.
