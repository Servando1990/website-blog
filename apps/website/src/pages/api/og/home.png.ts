import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';

export const GET: APIRoute = async () => {
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
          background: '#f3f0e8',
          color: '#1e2433',
          padding: '54px 64px',
          fontFamily: '"Instrument Sans", "Segoe UI", sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '62px',
                      height: '62px',
                      borderRadius: '16px',
                      border: '1px solid rgba(78, 91, 122, 0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '"Fraunces", serif',
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#26324a',
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
                            fontSize: '32px',
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
                            color: '#5f6775',
                          },
                          children: 'Founder-led software partner for private capital',
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
                display: 'flex',
                flexDirection: 'column',
                gap: '22px',
                maxWidth: '970px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: '"Fraunces", serif',
                      fontSize: '82px',
                      lineHeight: '0.94',
                      letterSpacing: '-0.05em',
                    },
                    children: 'We build software for private capital teams that work on judgment.',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '28px',
                      lineHeight: '1.35',
                      color: '#5f6775',
                      maxWidth: '900px',
                    },
                    children:
                      'Investor coverage, portfolio monitoring, and internal systems designed for teams that need software people can actually use.',
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
                fontSize: '22px',
                color: '#5f6775',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    children: 'controlthrive.com',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontWeight: '600',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    },
                    children: 'Homepage',
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
