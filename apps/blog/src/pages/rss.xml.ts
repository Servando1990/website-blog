import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  
  // Filter published posts and sort by date (newest first)
  const publishedPosts = posts
    .filter(post => post.data.published)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: "Servando's Blog",
    description: 'AI, machine learning, and technology insights from Servando Torres',
    site: context.site || 'https://www.servando.co',
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/posts/${post.slug}/`,
      categories: post.data.categories,
      // Add custom namespaces for additional metadata
      customData: `
        <author>servando@controlthrive.com (Servando Torres)</author>
        ${post.data.tags ? post.data.tags.map(tag => `<tag>${tag}</tag>`).join('') : ''}
      `.trim(),
    })),
    customData: `
      <language>en-us</language>
      <copyright>Copyright © ${new Date().getFullYear()} Servando Torres</copyright>
      <managingEditor>servando@controlthrive.com (Servando Torres)</managingEditor>
      <webMaster>servando@controlthrive.com (Servando Torres)</webMaster>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <generator>Astro RSS</generator>
    `.trim(),
  });
}