export interface CaseStudy {
  slug: string;
  title: string;
  industry: string;
  summary: string;
  tags: string[];
  isPublished: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'price-optimization-saas',
    title: 'Price Optimization for SaaS Product',
    industry: 'SaaS',
    summary:
      'Designed an end-to-end dynamic pricing optimization system with business constraints and multi-objective optimization.',
    tags: ['Machine Learning', 'Pricing Strategy', 'Revenue Optimization'],
    isPublished: true,
  },
  {
    slug: 'ai-matching-engine-manufacturing',
    title: 'AI Matching Engine',
    industry: 'Manufacturing',
    summary:
      'Integrated a matching engine across multiple data sources to resolve large-scale duplicate and incomplete records.',
    tags: ['AI/ML', 'Supply Chain', 'Process Optimization'],
    isPublished: true,
  },
  {
    slug: 'earnings-dashboard-finance-research',
    title: 'Earnings Call Dashboard for Financial Research',
    industry: 'Private Equity',
    summary:
      'Built a dashboard to process earnings calls from 500+ portfolio companies and surface sentiment-driven insights.',
    tags: ['NLP', 'Dashboard', 'Financial Analytics'],
    isPublished: true,
  },
  {
    slug: 'earnings-dashboard-private-equity',
    title: 'Earnings Call Dashboard for Private Equity Firm',
    industry: 'Private Equity',
    summary:
      'Developed a sentiment and insights dashboard for private equity teams to monitor portfolio company earnings calls.',
    tags: ['NLP', 'Dashboard', 'Financial Analytics'],
    isPublished: false,
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
