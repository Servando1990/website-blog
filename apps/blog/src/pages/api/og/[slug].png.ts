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
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: 80,
            color: 'white',
            fontFamily: '"Geist Sans", system-ui, sans-serif',
          },
          children: [
            // Main content centered
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  maxWidth: 900,
                  gap: 32,
                },
                children: [
                  // Author name
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 32,
                        fontWeight: '600',
                        opacity: 0.9,
                      },
                      children: 'Servando Torres',
                    },
                  },
                  // Title
                  {
                    type: 'h1',
                    props: {
                      style: {
                        fontSize: 72,
                        fontWeight: '700',
                        lineHeight: 1.1,
                        margin: 0,
                      },
                      children: post.data.title,
                    },
                  },
                  // Description
                  {
                    type: 'p',
                    props: {
                      style: {
                        fontSize: 32,
                        lineHeight: 1.3,
                        opacity: 0.9,
                        margin: 0,
                      },
                      children: post.data.description,
                    },
                  },
                  // Date
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontSize: 24,
                        opacity: 0.8,
                      },
                      children: post.data.date.toLocaleDateString(),
                    },
                  },
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