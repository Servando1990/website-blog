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
          background:
            'linear-gradient(160deg, #f6efe4 0%, #f4ecde 54%, #ede2d3 100%)',
          color: '#1f2433',
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
                  'radial-gradient(circle at top right, rgba(183, 130, 92, 0.25) 0, transparent 35%), radial-gradient(circle at top left, rgba(214, 190, 154, 0.35) 0, transparent 30%)',
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
                gap: '18px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '62px',
                      height: '62px',
                      borderRadius: '18px',
                      border: '1px solid rgba(140, 95, 63, 0.28)',
                      background: 'rgba(255,255,255,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '"Fraunces", serif',
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#8a5138',
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
                            color: '#646b78',
                          },
                          children: 'Founder-led AI software partner',
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
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '22px',
                maxWidth: '960px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: '"Fraunces", serif',
                      fontSize: '88px',
                      lineHeight: '0.94',
                      letterSpacing: '-0.05em',
                    },
                    children: 'We help business leaders turn AI ambition into working software.',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '28px',
                      lineHeight: '1.35',
                      color: '#59606c',
                      maxWidth: '860px',
                    },
                    children:
                      'Clear strategy, stronger workflows, and founder-led delivery for teams that need a trusted technical partner.',
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
                fontSize: '22px',
                color: '#59606c',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'center',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            padding: '10px 18px',
                            borderRadius: '999px',
                            background: 'rgba(255,255,255,0.72)',
                            border: '1px solid rgba(140, 95, 63, 0.22)',
                            color: '#8a5138',
                            fontWeight: '600',
                          },
                          children: 'controlthrive.com',
                        },
                      },
                    ],
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
