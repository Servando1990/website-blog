export interface InlineLink {
  text: string;
  href: string;
}

export const caseStudyInlineLinks: Record<string, InlineLink[]> = {
  'ai-investor-matching-platform-capital-advisory': [
    {
      text: 'production AI architecture for investor discovery and outreach preparation',
      href: '/blog/deal-investor-matching-architecture',
    },
    {
      text: 'live deal execution',
      href: '/blog/from-search-to-loi',
    },
  ],
  'earnings-dashboard-private-equity': [
    {
      text: 'quarterly earnings calls across the portfolio',
      href: '/case-studies/earnings-dashboard-finance-research',
    },
    {
      text: 'supporting evidence attached to each alert',
      href: '/blog/deal-investor-matching-architecture',
    },
  ],
  'earnings-dashboard-finance-research': [
    {
      text: 'more than 500 portfolio companies',
      href: '/case-studies/earnings-dashboard-private-equity',
    },
    {
      text: 'evidence stays attached to the signal',
      href: '/blog/deal-investor-matching-architecture',
    },
  ],
  'price-optimization-saas': [
    {
      text: 'multiple data sources',
      href: '/case-studies/ai-matching-engine-manufacturing',
    },
    {
      text: 'business policy and operating reality',
      href: '/blog/deal-investor-matching-architecture',
    },
  ],
  'ai-matching-engine-manufacturing': [
    {
      text: 'normalizes messy fields',
      href: '/blog/deal-investor-matching-architecture',
    },
    {
      text: 'human-in-the-loop review',
      href: '/case-studies/ai-investor-matching-platform-capital-advisory',
    },
    {
      text: 'data quality as an operational system',
      href: '/blog/deal-investor-matching-architecture',
    },
  ],
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderInlineLinks(text: string, links: InlineLink[]) {
  const matches = links
    .map((link) => {
      const start = text.indexOf(link.text);

      return start === -1
        ? null
        : {
            ...link,
            start,
            end: start + link.text.length,
          };
    })
    .filter((match): match is InlineLink & { start: number; end: number } => match !== null)
    .sort((left, right) => left.start - right.start || right.text.length - left.text.length);

  if (matches.length === 0) {
    return escapeHtml(text);
  }

  let cursor = 0;
  let html = '';

  for (const match of matches) {
    if (match.start < cursor) {
      continue;
    }

    html += escapeHtml(text.slice(cursor, match.start));
    html += `<a href="${escapeHtml(match.href)}">${escapeHtml(match.text)}</a>`;
    cursor = match.end;
  }

  html += escapeHtml(text.slice(cursor));

  return html;
}
