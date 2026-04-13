import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';
import { getCaseStudyBySlug, publishedCaseStudies } from '../../../../lib/caseStudies';

function getTitleFontSize(title: string): number {
  if (title.length > 54) return 54;
  if (title.length > 42) return 62;
  return 68;
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;

  if (!slug) {
    return new Response('Case study slug is required', { status: 400 });
  }

  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy || !caseStudy.isPublished) {
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
          background:
            'linear-gradient(160deg, #1f2433 0%, #242b3c 58%, #2e3647 100%)',
          color: '#f5efe4',
          padding: '54px 64px',
          fontFamily: '"Instrument Sans", "Segoe UI", sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                inset: '0',
                background:
                  'radial-gradient(circle at top right, rgba(195, 144, 105, 0.22) 0, transparent 34%), radial-gradient(circle at bottom left, rgba(111, 88, 60, 0.28) 0, transparent 26%)',
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '60px',
                            height: '60px',
                            borderRadius: '18px',
                            border: '1px solid rgba(243, 227, 206, 0.18)',
                            background: 'rgba(255,255,255,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: '"Fraunces", serif',
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#f5d5b7',
                          },
                          children: 'CT',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: '30px',
                                  fontWeight: '700',
                                },
                                children: 'ControlThrive',
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  color: 'rgba(245, 239, 228, 0.78)',
                                },
                                children: caseStudy.industry,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      padding: '10px 18px',
                      borderRadius: '999px',
                      border: '1px solid rgba(243, 227, 206, 0.18)',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#f5d5b7',
                      fontSize: '18px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                    },
                    children: 'Case Study',
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                maxWidth: '1000px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: '"Fraunces", serif',
                      fontSize: `${titleFontSize}px`,
                      lineHeight: '0.98',
                      letterSpacing: '-0.05em',
                    },
                    children: caseStudy.title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '28px',
                      lineHeight: '1.35',
                      color: 'rgba(245, 239, 228, 0.82)',
                      maxWidth: '930px',
                    },
                    children: caseStudy.summary,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '18px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                    },
                    children: caseStudy.tags.slice(0, 3).map((tag) => ({
                      type: 'div',
                      props: {
                        style: {
                          padding: '10px 16px',
                          borderRadius: '999px',
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(243, 227, 206, 0.14)',
                          fontSize: '18px',
                          color: 'rgba(245, 239, 228, 0.9)',
                        },
                        children: tag,
                      },
                    })),
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: 'rgba(245, 239, 228, 0.74)',
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
  return publishedCaseStudies.map((caseStudy) => ({
    params: { slug: caseStudy.slug },
  }));
}
