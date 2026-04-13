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
          background: '#ffffff',
          color: '#111111',
          padding: '54px 64px',
          fontFamily: '"Inter", "Segoe UI", sans-serif',
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
                      border: '1px solid #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '26px',
                      fontWeight: '500',
                      color: '#4F46E5',
                      letterSpacing: '-0.03em',
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
                            fontWeight: '500',
                            letterSpacing: '-0.03em',
                          },
                          children: 'ControlThrive',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '18px',
                            color: '#6B7280',
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
                      fontSize: '76px',
                      lineHeight: '1.02',
                      letterSpacing: '-0.04em',
                      fontWeight: '500',
                    },
                    children: 'We build software for private capital teams that work on judgment.',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '28px',
                      lineHeight: '1.55',
                      color: '#6B7280',
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
                color: '#6B7280',
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
                      fontWeight: '500',
                      letterSpacing: '0.1em',
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
