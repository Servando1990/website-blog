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

const pillars = ['Source', 'Standardize', 'Match', 'Campaigns', 'Report'];
const activePillar = 2;

// One pillar in the rail: a dot over a label; the active one is olive.
const pillarNode = (label: string, active: boolean) =>
  div(
    {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '14px',
      width: '132px',
    },
    [
      div({
        width: active ? '16px' : '13px',
        height: active ? '16px' : '13px',
        borderRadius: '999px',
        background: active ? colors.olive : colors.paper,
        border: `1.5px solid ${active ? colors.olive : colors.muted}`,
      }),
      div(
        {
          fontFamily: '"Geist Mono", monospace',
          fontSize: '17px',
          letterSpacing: '0.04em',
          color: active ? colors.ink : colors.muted,
        },
        label
      ),
    ]
  );

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
        // frame hairlines
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
        div({
          position: 'absolute',
          right: '72px',
          top: '72px',
          width: '1px',
          height: '486px',
          background: colors.line,
        }),

        // brand
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
              { fontSize: '26px', fontWeight: 500, lineHeight: 1 },
              'controlthrive'
            ),
          ]
        ),

        // eyebrow + headline + sub
        div(
          {
            position: 'absolute',
            left: '132px',
            top: '150px',
            width: '900px',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
          },
          [
            div(
              {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: colors.olive,
                fontFamily: '"Geist Mono", monospace',
                fontSize: '20px',
                letterSpacing: '0.1em',
              },
              [
                div({
                  width: '9px',
                  height: '9px',
                  borderRadius: '999px',
                  background: colors.olive,
                }),
                div({}, 'PA-OS · CLOSED BETA'),
              ]
            ),
            div(
              {
                display: 'flex',
                flexDirection: 'column',
                fontSize: '76px',
                lineHeight: 0.98,
                fontWeight: 600,
                letterSpacing: '-0.02em',
              },
              [
                span({}, 'The operating system'),
                span({}, 'for placement agents.'),
              ]
            ),
            div(
              {
                width: '660px',
                color: colors.muted,
                fontSize: '27px',
                lineHeight: 1.34,
                fontWeight: 400,
              },
              'One agent runs the whole raise — every claim cited, nothing sent without your review.'
            ),
          ]
        ),

        // pillar rail
        div(
          {
            position: 'absolute',
            left: '128px',
            bottom: '104px',
            display: 'flex',
            alignItems: 'flex-start',
          },
          pillars.map((p, i) => pillarNode(p, i === activePillar))
        ),

        // url
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
            div({ width: '28px', height: '2px', background: colors.olive }),
            div({}, 'controlthrive.com/pa-os'),
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
