import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';
import { caseStudies, getCaseStudyBySlug } from '../../../../lib/caseStudies';

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <path d="M44 184V270H420" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M420 270L344 224M420 270L344 316" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;

function getTitleFontSize(title: string): number {
  if (title.length > 54) return 62;
  if (title.length > 42) return 70;
  return 78;
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response('Case study slug is required', { status: 400 });
  }

  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy) {
    return new Response('Case study not found', { status: 404 });
  }

  const titleFontSize = getTitleFontSize(caseStudy.title);

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#000000',
          color: '#FFFFFF',
          padding: '54px 64px',
          fontFamily: '"Geist", "Inter", "Segoe UI", sans-serif',
          position: 'relative',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '22px',
              },
              children: [
                {
                  type: 'img',
                  props: {
                    src: logoDataUri,
                    width: 86,
                    height: 86,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '30px',
                      fontWeight: '700',
                      letterSpacing: '0.16em',
                    },
                    children: 'CONTROLTHRIVE',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                maxWidth: '1000px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: `${titleFontSize}px`,
                      lineHeight: '1.05',
                      fontWeight: '800',
                      letterSpacing: '-0.03em',
                      textTransform: 'uppercase',
                    },
                    children: caseStudy.title,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '24px',
                      fontWeight: '600',
                      opacity: '0.98',
                      letterSpacing: '0.1em',
                    },
                    children: 'CASE STUDY',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: '600',
                      padding: '10px 18px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 255, 255, 0.45)',
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                    children: caseStudy.industry,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '22px',
                      opacity: '0.84',
                    },
                    children: 'controlthrive.com',
                  },
                },
              ],
            },
          },
        ],
      },
    } as any,
    {
      width: 1200,
      height: 630,
    }
  );
};

export async function getStaticPaths() {
  return caseStudies.map((caseStudy) => ({
    params: { slug: caseStudy.slug },
  }));
}
