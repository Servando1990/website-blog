import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  integrations: [
    mdx(), 
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Custom function to set priorities
      serialize(item) {
        if (item.url.includes('/posts/')) {
          item.changefreq = 'monthly';
          item.priority = 0.8;
        }
        if (item.url.endsWith('/')) {
          item.priority = 0.9; // Higher priority for main pages
        }
        return item;
      }
    })
  ],
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
      wrap: true,
    },
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            className: ['heading-link'],
            ariaLabel: 'Link to this section',
          },
        },
      ],
    ],
  },
  site: 'https://www.servando.co',
  base: '/',
});
