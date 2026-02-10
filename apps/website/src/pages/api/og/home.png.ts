import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';

const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <path d="M44 184V270H420" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M420 270L344 224M420 270L344 316" stroke="#ffffff" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;

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
          background: '#000000',
          color: '#FFFFFF',
          padding: '54px 64px',
          fontFamily: '"Geist", "Inter", "Segoe UI", sans-serif',
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
                gap: '24px',
                maxWidth: '1000px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '86px',
                      lineHeight: '0.98',
                      fontWeight: '800',
                      letterSpacing: '-0.03em',
                      textTransform: 'uppercase',
                    },
                    children: 'Strategic AI Solutions',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '34px',
                      lineHeight: '1.25',
                      opacity: '0.9',
                    },
                    children: 'AI Partners for Capital Markets',
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
                    children: 'HOMEPAGE',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '22px',
                      opacity: '0.84',
                    },
                    children: 'www.controlthrive.com',
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
