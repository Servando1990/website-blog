import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  integrations: [mdx(), tailwind()],
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
  site: 'https://servando.co',
  base: '/',
});
