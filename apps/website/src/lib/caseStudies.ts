import type { DiagramStep } from '../components/InteractiveCaseStudyDiagram';

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudyFact {
  label: string;
  value: string;
}

export interface CaseStudyLink {
  label: string;
  href: string;
}

export interface CaseStudyHeroImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  industry: string;
  summary: string;
  cardSummary: string;
  featuredOutcome: string;
  tags: string[];
  metrics: CaseStudyMetric[];
  facts: CaseStudyFact[];
  challenge: string[];
  design: string[];
  implementationHighlights: string[];
  result: string[];
  takeaway: string;
  diagram: {
    title: string;
    subtitle: string;
    steps: DiagramStep[];
  };
  heroImage?: CaseStudyHeroImage;
  proofLink?: CaseStudyLink;
  isPublished: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'ai-investor-matching-platform-capital-advisory',
    title: 'How MVV Capital Partners operationalized investor targeting with Atlas',
    industry: 'Private Capital Advisory',
    summary:
      'What started as an investor-matching engine became Atlas: a workflow for turning deal materials, CRM history, and private-markets judgment into ranked shortlists and outreach-ready handoff.',
    cardSummary:
      'A founder-led build that helped MVV move from tacit deal knowledge and fragmented CRM context to a repeatable investor targeting and review workflow.',
    featuredOutcome:
      'A proprietary workflow that moved from scoring experiments to campaign-ready investor shortlists',
    tags: ['Private markets', 'CRM intelligence', 'Compliance-aware workflow'],
    metrics: [
      { value: '10 alpha releases', label: 'shipped in 46 days as campaign pressure increased' },
      { value: '+12 deals', label: 'were active in the operating window' },
    ],
    facts: [
      {
        label: 'Business problem',
        value: 'Investor targeting and outreach rules lived in memory, notes, and CRM sprawl',
      },
      {
        label: 'Delivery shape',
        value: 'Atlas workflow spanning matching, review, exports, and campaign handoff',
      },
      {
        label: 'Why it worked',
        value: 'The system encoded real private-capital rules instead of generic lead scoring',
      },
    ],
    challenge: [
      'Investor targeting was never just about finding similar names. For each deal, the team had to weigh mandate fit, deal structure, check-size logic, geography, relationship context, and historical notes before deciding who truly belonged on the shortlist.',
      'The bottleneck was operational as much as analytical. The system needed to rule out poor-fit targets early, surface the right contact at each firm, keep human review in the loop, and support a clean handoff into downstream outreach workflows.',
    ],
    design: [
      'We built Atlas as an internal operating layer for investor matching and outreach preparation. It accepts deal materials or pasted context, applies hard exclusions first, resolves firms to a single champion contact, scores fit across explicit weighted criteria, and uses LLM reasoning over firm-wide notes to explain why a candidate belongs on the shortlist.',
      'Over time, Atlas absorbed the business knowledge learned in execution: co-invest versus direct distinctions, investor-lead versus active-investor rules, family office / RIA / fund-of-funds / HNWI targeting, deal-type exclusions, and the difference between a warm relationship and a name that merely exists in the CRM. By April, the workflow included UI-based search, history, owner filtering, PDF and Excel exports, and one-at-a-time Clay delivery for safer downstream use.',
    ],
    implementationHighlights: [
      'Hard exclusions ran before scoring, so off-mandate investors like VCs, PE firms, or already-active conversations could be removed outright instead of showing up as misleading low-ranked suggestions.',
      'Champion-contact selection and firm-level notes aggregation pulled signal from across the firm, which fixed a major early failure mode where the wrong person or incomplete notes distorted the recommendation.',
      'Behavioral and relationship logic became first-class product rules: a contact only counted as an Active Investor after real two-way dialogue, repeated non-response became a routing signal, and conflicting notes were surfaced rather than buried.',
      'The product shipped in tight feedback loops with the operating team, reaching 10 alpha releases between March 3 and April 17 while adding auth, scoring controls, large-search reliability, owner filtering, export flows, and hardened runtime secrets under live campaign pressure.',
    ],
    result: [
      'Atlas helped MVV move from ad hoc targeting toward a repeatable system for live deal execution. The team could intake a deal, review a firm-level shortlist with reasoning, export the result, and hand approved targets into campaign workflows without rebuilding context from scratch every time.',
      'The business value went beyond ranking accuracy. The project turned tacit knowledge about investor types, deal structures, outreach sequencing, and CRM governance into reusable operating logic. That made the system more credible internally and more useful in client-facing conversations.',
    ],
    takeaway:
      'In private-capital workflows, the hard part is not generating names. It is encoding who actually belongs on the list, why they fit this structure, and how outreach should happen next. The strongest AI systems make that operator judgment reusable.',
    diagram: {
      title: 'Atlas Investor Targeting Workflow',
      subtitle: 'How deal context, private-markets rules, and CRM history became one reviewable operating flow.',
      steps: [
        {
          id: 'deal-intake',
          title: 'Deal intake',
          summary: 'Deal memos or pasted context start the run with explicit search instructions.',
          detail:
            'Operators could work from the materials they already had, then add the nuances that mattered for the specific deal structure and target profile.',
          tag: 'Input Layer',
          tone: 'source',
          metric: 'PDF or pasted deal brief',
        },
        {
          id: 'structural-filters',
          title: 'Structural filters',
          summary: 'Deal-type, lifecycle, and exclusion rules remove the wrong investor categories first.',
          detail:
            'Co-invest versus direct logic, exclusions, and CRM state rules kept clearly invalid targets out before any ranking began.',
          tag: 'Eligibility',
          tone: 'processing',
          metric: 'Rule-first filtering',
        },
        {
          id: 'relationship-resolution',
          title: 'Firm + relationship resolution',
          summary: 'One champion contact is selected while notes from the whole firm stay in scope.',
          detail:
            'Firm-level de-duplication and notes aggregation prevented arbitrary contacts from distorting the shortlist and preserved historical relationship memory.',
          tag: 'Resolution',
          tone: 'processing',
          metric: 'One line per firm',
        },
        {
          id: 'fit-scoring',
          title: 'Explainable fit scoring',
          summary: 'Remaining firms are ranked on mandate fit, check-size logic, geography, and relationship signals.',
          detail:
            'Weighted scoring made results inspectable and easy to tune as the team learned more about how different investor types behave.',
          tag: 'Scoring',
          tone: 'model',
          metric: 'Weighted fit model',
        },
        {
          id: 'review-handoff',
          title: 'Review and handoff',
          summary: 'Notes reasoning, exports, and Clay delivery keep the shortlist ready for action.',
          detail:
            'The same run could produce review-ready explanations, PDF and Excel outputs, and a safer downstream handoff into campaign operations.',
          tag: 'Outcome',
          tone: 'outcome',
          metric: 'UI, PDF, Excel, and Clay',
        },
      ],
    },
    heroImage: {
      src: '/case-studies/investor-matching-capital-partners.png',
      alt: 'MVV Capital Partners and ControlThrive Atlas case study visual',
    },
    isPublished: true,
  },
  {
    slug: 'price-optimization-saas',
    title: 'Pricing Engine for a SaaS Commerce Product',
    industry: 'SaaS',
    summary:
      'Designed and shipped a production pricing system that balanced revenue goals, demand behavior, and business constraints.',
    cardSummary:
      'An end-to-end pricing product that let the client move from a founder vision to an operational system with measurable commercial upside.',
    featuredOutcome: '35% revenue uplift while keeping pricing guardrails in place',
    tags: ['Revenue systems', 'Optimization', 'Machine learning'],
    metrics: [
      { value: '35%', label: 'revenue uplift after rollout' },
      { value: '25%', label: 'sales increase from the pricing system' },
      { value: 'Guardrailed', label: 'recommendations stayed inside policy limits' },
    ],
    facts: [
      { label: 'Business problem', value: 'Pricing needed to scale beyond manual judgment' },
      { label: 'Delivery shape', value: 'End-to-end pricing pipeline with production workflows' },
      { label: 'Why it worked', value: 'Optimization stayed tied to clear commercial constraints' },
    ],
    challenge: [
      'The founding team had a strong vision for a pricing product, but they needed a system that could pull from multiple data sources, forecast demand, optimize for different commercial goals, and feed pricing actions back into the e-commerce platform.',
      'This was not a lightweight experiment. It had to become a reliable operating system for a core commercial decision.',
    ],
    design: [
      'We built an end-to-end MLOps pipeline that ingests commerce signals, estimates demand response, and applies constrained optimization to produce recommended prices aligned with profit, GMV, and growth targets.',
      'The system was deployed in collaboration with Outerbounds, with workflows orchestrated so the client could move from batch data processing to a repeatable production path.',
    ],
    implementationHighlights: [
      'Demand curves were modeled as distributions rather than single guesses, which made pricing decisions more robust under uncertainty.',
      'Lagrangian optimization balanced growth and profitability while respecting the tradeoffs the business actually cared about.',
      'Constraint handling and repricing rules kept final recommendations aligned with business policy and operating reality.',
    ],
    result: [
      'The resulting system generated pricing actions that lifted revenue by 35% and increased sales by 25% while staying inside the guardrails the business needed.',
      'Just as important, the client moved from an ambitious concept to a durable product that could be iterated with confidence.',
    ],
    takeaway:
      'Great pricing systems do more than optimize. They translate business strategy into rules and objectives the product can reliably execute.',
    proofLink: {
      label: 'Read the Outerbounds write-up',
      href: 'https://outerbounds.com/case-studies/accelerating-ai-driven-pricing-strategies-with-outerbounds',
    },
    diagram: {
      title: 'Dynamic Pricing Pipeline',
      subtitle: 'How data, optimization, and business guardrails shape a final pricing action.',
      steps: [
        {
          id: 'raw-data',
          title: 'Commerce inputs',
          summary: 'Catalog, demand, margin, and transaction signals are pulled from source systems.',
          detail:
            'The ingestion layer unifies product, customer, and historical sales data into a dependable feature base for pricing decisions.',
          tag: 'Data Inputs',
          tone: 'source',
          metric: 'Multi-source ingestion',
        },
        {
          id: 'demand-curves',
          title: 'Demand curves',
          summary: 'Quantile models estimate how demand shifts under different price points.',
          detail:
            'Quantile regression produces a more reliable picture of likely outcomes than a single-point prediction, which improves pricing confidence.',
          tag: 'Modeling',
          tone: 'model',
          metric: 'Uncertainty-aware forecasts',
        },
        {
          id: 'optimizer',
          title: 'Commercial optimizer',
          summary: 'Objective trade-offs are tuned between profit, GMV, and growth goals.',
          detail:
            'The optimization layer applies weighted constraints to generate candidate prices aligned with the targets the business cares about.',
          tag: 'Optimization',
          tone: 'decision',
          metric: 'Multi-objective control',
        },
        {
          id: 'constraints',
          title: 'Business guardrails',
          summary: 'Operational rules enforce floors, repricing limits, and strategic boundaries.',
          detail:
            'Constraint handling validates each recommendation so published prices stay operationally safe and commercially sensible.',
          tag: 'Policy Layer',
          tone: 'processing',
          metric: 'Rule-safe outputs',
        },
        {
          id: 'outputs',
          title: 'Recommended prices',
          summary: 'Final price actions are delivered back into the commerce workflow.',
          detail:
            'Approved prices move through automated workflows so the loop between model updates and commercial execution stays repeatable.',
          tag: 'Outcome',
          tone: 'outcome',
          metric: '35% revenue uplift',
        },
      ],
    },
    isPublished: true,
  },
  {
    slug: 'ai-matching-engine-manufacturing',
    title: 'Matching Engine for a Manufacturing Data Cleanup Program',
    industry: 'Manufacturing',
    summary:
      'Built a scalable matching engine that reduced duplicate and incomplete records across multiple business units.',
    cardSummary:
      'A production data workflow that restored a cleaner single source of truth and removed meaningful manual effort from the remediation process.',
    featuredOutcome: '70% duplicate reduction across a messy multi-source record base',
    tags: ['Entity resolution', 'Operational AI', 'Process optimization'],
    metrics: [
      { value: '200k', label: 'problematic records in scope' },
      { value: '70%', label: 'duplicate reduction after rollout' },
      { value: '+1 FTE', label: 'manual effort removed from the workflow' },
    ],
    facts: [
      { label: 'Business problem', value: 'Duplicate and incomplete records across critical units' },
      { label: 'Delivery shape', value: 'Spark-based matching engine with human review' },
      { label: 'Why it worked', value: 'Automation handled scale while humans reviewed ambiguity' },
    ],
    challenge: [
      'Leaders were dealing with the consequences of roughly 200,000 duplicate and incomplete records across key units of the company. The issue affected how teams operated, trusted the CRM, and prioritized manual cleanup work.',
      'The system needed to process large record volumes, work across inconsistent sources, and still leave room for human review where confidence was lower.',
    ],
    design: [
      'We built a Spark-based matching engine with human-in-the-loop review. The pipeline normalizes messy fields, narrows comparisons through blocking keys, applies weighted scoring across identity and location signals, and routes records into action buckets for follow-through.',
      'The design balanced scale and safety: automation handled high-confidence cases while ambiguous matches stayed reviewable by people who understood the operational context.',
    ],
    implementationHighlights: [
      'Blocking keys reduced the comparison footprint dramatically by narrowing pair generation to likely candidates.',
      'Weighted scoring and validation rules separated high-confidence matches from records that needed manual review.',
      'Configuration-driven mappings allowed the pipeline to accommodate upstream schema changes without rewriting the core matching logic.',
    ],
    result: [
      'The workflow restored a cleaner single source of truth, reduced duplicates by 70%, and removed more than one full-time equivalent of manual effort from the process.',
      'The program worked because it treated data quality as an operational system, not a one-off cleanup project.',
    ],
    takeaway:
      'The best AI-enabled operations workflows know exactly where automation should stop and human review should begin.',
    proofLink: {
      label: 'Read the Databris case study',
      href: 'https://www.databris.com/case-study-details.html#case-details2',
    },
    diagram: {
      title: 'Entity Matching Flow',
      subtitle: 'How raw records become cleaner operational data with the right review checkpoints.',
      steps: [
        {
          id: 'ingest',
          title: 'Multi-source account data',
          summary: 'CRM, ERP, and operations records are consolidated into one ingestion layer.',
          detail:
            'Raw records from multiple business units are pulled into a common staging pipeline so matching can run across the full customer footprint.',
          tag: 'Data Inputs',
          tone: 'source',
          metric: '200k problematic records',
        },
        {
          id: 'normalize',
          title: 'Normalize fields',
          summary: 'Names, addresses, phone numbers, and geo fields are standardized first.',
          detail:
            'Normalization removes formatting noise and applies canonical representations to reduce false negatives during record comparison.',
          tag: 'Processing',
          tone: 'processing',
          metric: 'Schema-agnostic mappings',
        },
        {
          id: 'blocking',
          title: 'Generate candidate groups',
          summary: 'Blocking keys prevent brute-force comparison across the full dataset.',
          detail:
            'Candidate grouping narrows pair generation to likely matches, which cuts the computational footprint of downstream scoring.',
          tag: 'Candidate Generation',
          tone: 'processing',
          metric: 'Large comparison reduction',
        },
        {
          id: 'score',
          title: 'Weighted match scoring',
          summary: 'Signals across identity and location are scored to produce confidence rankings.',
          detail:
            'Feature-level weights and validation rules create confidence segments that separate high-certainty matches from ambiguous records.',
          tag: 'Model Layer',
          tone: 'model',
          metric: 'High-confidence segmentation',
        },
        {
          id: 'bucket',
          title: 'Action buckets',
          summary: 'Records route to Correct, Manual Review, or Incorrect for operational follow-through.',
          detail:
            'The final decision layer balances automation and human review so teams can remediate quickly without creating new data risk.',
          tag: 'Decision Output',
          tone: 'decision',
          metric: '70% duplicate reduction',
        },
      ],
    },
    isPublished: true,
  },
  {
    slug: 'earnings-dashboard-finance-research',
    title: 'Earnings Intelligence Platform for Financial Research',
    industry: 'Financial Research',
    summary:
      'Created a research platform that helps portfolio teams review earnings calls across 500+ companies with sentiment and playback context in one place.',
    cardSummary:
      'A research workflow that brought audio, transcript, and signal review into one interface so teams could spot risk and opportunity faster.',
    featuredOutcome: 'Portfolio teams reviewing 500+ earnings calls from one alerting surface',
    tags: ['Research workflow', 'NLP', 'Signal delivery'],
    metrics: [
      { value: '500+', label: 'portfolio companies monitored' },
      { value: 'Time-linked', label: 'sentiment signals tied to transcript evidence' },
      { value: 'Live alerts', label: 'for portfolio managers and researchers' },
    ],
    facts: [
      { label: 'Business problem', value: 'Too many earnings calls to review manually at depth' },
      { label: 'Delivery shape', value: 'Backend ingestion with a synchronized research platform' },
      { label: 'Why it worked', value: 'Signals were always tied back to evidence in context' },
    ],
    challenge: [
      'The research team needed a way to process earnings calls from more than 500 portfolio companies, surface what changed, and help portfolio managers move quickly when risk or opportunity showed up.',
      'That meant building something more useful than raw transcript search. The interface needed to keep sentiment, playback, and evidence connected in one place.',
    ],
    design: [
      'We built a FastAPI backend to ingest transcripts and audio, plus a React platform that synchronizes sentiment timelines, playback, and transcript highlights.',
      'Audio is segmented for vocal-tone inference, results are cached for fast reuse, and the final experience lets analysts jump straight to the moments that matter instead of scanning whole calls manually.',
    ],
    implementationHighlights: [
      'Audio sentiment runs on short overlapping windows so teams can see tonal changes over time instead of getting a single blunt score.',
      'Signals are returned as time-series output and rendered directly in the visualization layer for fast interpretation.',
      'Playback, charting, and transcript context stay aligned so users can validate why an alert exists.',
    ],
    result: [
      'The platform became key alert tooling for portfolio managers and researchers, helping them act on earnings-call changes more quickly and with better context.',
      'Because the evidence stays attached to the signal, the workflow supports speed without forcing users to take the model on faith.',
    ],
    takeaway:
      'High-value research tooling does not just summarize content. It makes evidence easier to reach at the moment a decision needs to be made.',
    diagram: {
      title: 'Earnings Intelligence Pipeline',
      subtitle: 'How call audio becomes research-ready alerts with evidence attached.',
      steps: [
        {
          id: 'input',
          title: 'Call audio + transcript',
          summary: 'Quarterly call audio and text are ingested from portfolio company feeds.',
          detail:
            'The pipeline combines spoken and textual context so models can read the language and detect tonal shifts in executive communication.',
          tag: 'Data Inputs',
          tone: 'source',
          metric: '500+ companies',
        },
        {
          id: 'ingestion',
          title: 'Ingestion services',
          summary: 'Audio segmentation, transcript alignment, and caching are orchestrated in backend services.',
          detail:
            'The backend handles preprocessing and retrieval so analysts can revisit prior calls quickly without unnecessary recomputation.',
          tag: 'Backend Services',
          tone: 'processing',
          metric: 'Reusable cache layer',
        },
        {
          id: 'inference',
          title: 'Signal inference',
          summary: 'NLP and vocal-tone models score confidence, tone, and notable events.',
          detail:
            'Inference combines lexical and acoustic signals to detect narrative changes and prioritize moments worth analyst attention.',
          tag: 'Model Layer',
          tone: 'model',
          metric: 'Window-based sentiment',
        },
        {
          id: 'signals',
          title: 'Timeline alignment',
          summary: 'Model output is transformed into synchronized time-series signals.',
          detail:
            'Signals are mapped to precise call timestamps so playback, charting, and transcript highlights stay aligned in the UI.',
          tag: 'Signal Processing',
          tone: 'processing',
          metric: 'Timestamp-linked output',
        },
        {
          id: 'platform',
          title: 'Research platform',
          summary: 'Portfolio managers receive prioritized call-level alerts with supporting evidence.',
          detail:
            'The final platform surfaces sentiment deltas and key excerpts so teams can act faster without losing context.',
          tag: 'Outcome',
          tone: 'outcome',
          metric: 'Live PM alerting',
        },
      ],
    },
    isPublished: true,
  },
  {
    slug: 'earnings-dashboard-private-equity',
    title: 'Portfolio Monitoring System for a Private Equity Team',
    industry: 'Private Equity',
    summary:
      'Developed a monitoring system concept for investment teams tracking portfolio company earnings calls, sentiment shifts, and analyst follow-up.',
    cardSummary:
      'A portfolio monitoring workflow designed to help investment teams prioritize what deserves a closer look after quarterly calls.',
    featuredOutcome: 'Faster portfolio review through ranked alerts and supporting evidence',
    tags: ['Portfolio monitoring', 'Analyst workflow', 'Signal review'],
    metrics: [
      { value: 'Portfolio-wide', label: 'call ingestion across monitored companies' },
      { value: 'Ranked alerts', label: 'sorted by urgency and materiality' },
      { value: 'Evidence-linked', label: 'insights tied back to source moments' },
    ],
    facts: [
      { label: 'Business problem', value: 'Analysts needed faster visibility across many earnings calls' },
      { label: 'Delivery shape', value: 'Monitoring system with ranked alerting' },
      { label: 'Why it worked', value: 'Signals stayed auditable and easy to validate' },
    ],
    challenge: [
      'Investment teams needed a faster way to review quarterly earnings calls across the portfolio and decide where deeper analyst attention was warranted.',
      'The solution had to prioritize material changes without turning the workflow into a black box that analysts could not validate.',
    ],
    design: [
      'We designed a monitoring flow that captures call artifacts, enriches them with speaker and timeline context, runs risk and sentiment inference, and turns the output into ranked alerts for the investment team.',
      'The system keeps the supporting evidence attached to each alert so analysts can move from signal to source without leaving the workflow.',
    ],
    implementationHighlights: [
      'Transcript and audio features were combined so the system could capture both semantic and tonal shifts.',
      'Urgency-based prioritization helped analysts focus on the calls most likely to matter first.',
      'Alerts stayed tied to evidence so teams could validate the model output quickly and confidently.',
    ],
    result: [
      'The concept gave the investment team a clearer way to triage portfolio updates, with ranked signals and source-linked evidence that made follow-up faster.',
      'Even as a hidden case study, it reflects the same principle as the published work: business users trust AI more when the reasoning stays inspectable.',
    ],
    takeaway:
      'For portfolio monitoring, the right interface is as important as the model. Signal quality matters, but so does how quickly a team can validate and act on it.',
    diagram: {
      title: 'Private Equity Monitoring Pipeline',
      subtitle: 'How call intelligence becomes ranked analyst actions.',
      steps: [
        {
          id: 'capture',
          title: 'Call data capture',
          summary: 'Earnings call recordings and transcripts are collected for each portfolio company.',
          detail:
            'The intake layer standardizes incoming call artifacts so they can be processed with consistent quality and metadata.',
          tag: 'Data Inputs',
          tone: 'source',
          metric: 'Portfolio-wide ingestion',
        },
        {
          id: 'enrich',
          title: 'Signal enrichment',
          summary: 'Transcripts are segmented and enriched with speaker context and temporal markers.',
          detail:
            'Context enrichment maps statements to speakers and time windows, preparing data for sentiment and topic interpretation.',
          tag: 'Processing',
          tone: 'processing',
          metric: 'Speaker-aware segmentation',
        },
        {
          id: 'inference',
          title: 'Risk and sentiment inference',
          summary: 'Models score sentiment trajectories and identify anomalous language patterns.',
          detail:
            'Inference highlights positive and negative shifts that may indicate performance risk, execution friction, or upside opportunities.',
          tag: 'Model Layer',
          tone: 'model',
          metric: 'Trend-sensitive scoring',
        },
        {
          id: 'prioritize',
          title: 'Portfolio prioritization',
          summary: 'Signals are ranked by urgency and materiality for investment teams.',
          detail:
            'A decision layer converts model output into ranked action queues so teams can review the highest-impact calls first.',
          tag: 'Decision Output',
          tone: 'decision',
          metric: 'Urgency-ranked insights',
        },
        {
          id: 'delivery',
          title: 'Analyst workflow delivery',
          summary: 'Findings are surfaced in ranked alerts and review views for daily monitoring.',
          detail:
            'The final system ties evidence to each alert so analysts can validate context quickly and act with confidence.',
          tag: 'Outcome',
          tone: 'outcome',
          metric: 'Faster analyst review',
        },
      ],
    },
    isPublished: true,
  },
];

const publishedOrder = [
  'ai-investor-matching-platform-capital-advisory',
  'earnings-dashboard-private-equity',
  'earnings-dashboard-finance-research',
  'price-optimization-saas',
  'ai-matching-engine-manufacturing',
] as const;

const publishedOrderIndex = new Map<string, number>(
  publishedOrder.map((slug, index) => [slug, index])
);

export const publishedCaseStudies = caseStudies
  .filter((caseStudy) => caseStudy.isPublished)
  .sort(
    (left, right) =>
      (publishedOrderIndex.get(left.slug) ?? Number.MAX_SAFE_INTEGER) -
      (publishedOrderIndex.get(right.slug) ?? Number.MAX_SAFE_INTEGER)
  );

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
