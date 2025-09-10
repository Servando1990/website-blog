import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ImageResponse } from '@vercel/og';

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    return new Response('Slug is required', { status: 400 });
  }

  try {
    // Get the post by slug
    const posts = await getCollection('posts');
    const post = posts.find((p) => p.slug === slug && p.data.published);

    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    // Create the image
    return new ImageResponse(
      {
        type: 'div',
        props: {
          style: {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            background: '#1a1a1a',
            padding: 80,
            color: 'white',
            fontFamily: '"Geist Sans", system-ui, sans-serif',
          },
          children: [
            // Site branding
            {
              type: 'div',
              props: {
                style: {
                  fontSize: 24,
                  fontWeight: '500',
                  color: '#ccc',
                  marginBottom: 40,
                },
                children: 'servando.co',
              },
            },
            // Title
            {
              type: 'h1',
              props: {
                style: {
                  fontSize: 64,
                  fontWeight: '800',
                  lineHeight: 1.1,
                  margin: 0,
                  marginBottom: 32,
                  color: 'white',
                  maxWidth: '90%',
                },
                children: post.data.title,
              },
            },
            // Description
            {
              type: 'p',
              props: {
                style: {
                  fontSize: 28,
                  lineHeight: 1.4,
                  color: '#ccc',
                  margin: 0,
                  marginBottom: 40,
                  maxWidth: '85%',
                },
                children: post.data.description,
              },
            },
            // Author and date
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  fontSize: 20,
                  color: '#aaa',
                },
                children: [
                  { type: 'span', props: { children: 'Servando Torres' } },
                  { type: 'span', props: { children: '•' } },
                  { type: 'span', props: { children: post.data.date.toLocaleDateString() } },
                ],
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
};

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  
  return posts
    .filter(post => post.data.published)
    .map(post => ({
      params: { slug: post.slug },
    }));
}