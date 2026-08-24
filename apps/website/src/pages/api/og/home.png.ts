import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';

type Style = Record<string, string | number>;

const colors = {
  paper: '#F6F4EE',
  ink: '#141612',
  muted: '#687064',
  line: '#D8D3C6',
  olive: '#6F8052',
};

function node(type: string, style: Style, children?: unknown) {
  return {
    type,
    props: { style, children },
  };
}

const div = (style: Style, children?: unknown) => node('div', style, children);
const span = (style: Style, children?: unknown) => node('span', style, children);

export const GET: APIRoute = async () => {
  return new ImageResponse(
    div(
      {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        background: colors.paper,
        color: colors.ink,
        overflow: 'hidden',
        fontFamily: '"Geist", "Segoe UI", sans-serif',
      },
      [
        div({
          position: 'absolute',
          left: '72px',
          right: '72px',
          top: '72px',
          height: '1px',
          background: colors.line,
        }),
        div({
          position: 'absolute',
          left: '72px',
          right: '72px',
          bottom: '72px',
          height: '1px',
          background: colors.line,
        }),
        div(
          {
            position: 'absolute',
            left: '72px',
            top: '42px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          },
          [
            div(
              {
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${colors.ink}`,
                color: colors.ink,
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: 1,
              },
              'CT'
            ),
            div(
              {
                fontSize: '26px',
                fontWeight: 500,
                lineHeight: 1,
              },
              'controlthrive'
            ),
          ]
        ),
        div(
          {
            position: 'absolute',
            left: '132px',
            top: '196px',
            width: '780px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          },
          [
            div(
              {
                display: 'flex',
                flexDirection: 'column',
                fontSize: '86px',
                lineHeight: 0.96,
                fontWeight: 500,
                letterSpacing: '0',
              },
              [
                span({}, 'Product company'),
                span({}, 'for private capital.'),
              ]
            ),
            div(
              {
                width: '600px',
                color: colors.muted,
                fontSize: '28px',
                lineHeight: 1.36,
                fontWeight: 400,
              },
              'Production AI and internal systems.'
            ),
          ]
        ),
        div({
          position: 'absolute',
          right: '72px',
          top: '72px',
          width: '1px',
          height: '486px',
          background: colors.line,
        }),
        div(
          {
            position: 'absolute',
            right: '104px',
            bottom: '96px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: colors.olive,
            fontSize: '18px',
            fontWeight: 500,
            lineHeight: 1,
          },
          [
            div({
              width: '28px',
              height: '2px',
              background: colors.olive,
            }),
            div({}, 'controlthrive.com'),
          ]
        ),
      ]
    ) as any,
    {
      width: 1200,
      height: 630,
    }
  );
};
