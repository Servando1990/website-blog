# Evidence Map

Use this file to decide which projects and source files to inspect for a given job description.

## Primary CV Inputs

- technical baseline:
  [`cv-builder/servando-torres-ai-developer-cv.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/cv-builder/servando-torres-ai-developer-cv.md)
- technical baseline for Python or orchestration roles:
  [`cv-builder/servando-torres-python-fastapi-prefect-cv.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/cv-builder/servando-torres-python-fastapi-prefect-cv.md)
- business baseline:
  [`cv-builder/servando-torres-one-pager.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/cv-builder/servando-torres-one-pager.md)
- business CV baseline:
  [`cv-builder/servando-torres-one-pager-cv.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/cv-builder/servando-torres-one-pager-cv.md)

## Website Case Studies

Start here for pre-compressed narratives and supported outcomes:

- investor matching:
  [`apps/website/src/pages/case-studies/ai-investor-matching-platform-capital-advisory.astro`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/apps/website/src/pages/case-studies/ai-investor-matching-platform-capital-advisory.astro)
- pricing:
  [`apps/website/src/pages/case-studies/price-optimization-saas.astro`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/apps/website/src/pages/case-studies/price-optimization-saas.astro)
- earnings dashboard:
  [`apps/website/src/pages/case-studies/earnings-dashboard-finance-research.astro`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/apps/website/src/pages/case-studies/earnings-dashboard-finance-research.astro)
- account matching:
  [`apps/website/src/pages/case-studies/ai-matching-engine-manufacturing.astro`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/apps/website/src/pages/case-studies/ai-matching-engine-manufacturing.astro)
- case study metadata:
  [`apps/website/src/lib/caseStudies.ts`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/apps/website/src/lib/caseStudies.ts)

## Project Map

### 1. MVV Investor Matching Platform

- repo:
  [`agents-campaigns`](/Users/servandodavidtorresgarcia/Servando/controlthrive/agents-campaigns)
- strongest for:
  LLM systems, ranking pipelines, explainable AI, workflow orchestration, CRM intelligence, full-stack AI products, capital markets, Pydantic, FastAPI, Prefect, Vercel
- supported signals:
  serverless BFF deployment with Vercel plus Prefect Cloud plus S3
  four-stage ranking pipeline with hard exclusions, champion selection, deterministic scoring, and notes reasoning
  Pydantic contracts and PydanticAI agents
  HubSpot integration and operator-facing reasoning artifacts
  authenticated React frontend with saved runs and Clay handoff
- best source files:
  [`agents-campaigns/README.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/agents-campaigns/README.md)
  [`agents-campaigns/pyproject.toml`](/Users/servandodavidtorresgarcia/Servando/controlthrive/agents-campaigns/pyproject.toml)
  [`agents-campaigns/docs/architecture/TECHNICAL-ARCHITECTURE.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/agents-campaigns/docs/architecture/TECHNICAL-ARCHITECTURE.md)
  [`agents-campaigns/docs/business/SYSTEM-DESIGN-OVERVIEW.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/agents-campaigns/docs/business/SYSTEM-DESIGN-OVERVIEW.md)
  [`agents-campaigns/docs/public/README.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/agents-campaigns/docs/public/README.md)
- notable metrics or scale:
  internal docs mention reducing a database of roughly `12,500` contacts to shortlist outputs

### 2. Parallel Monitor CRM App

- repo:
  [`parallel_monitor_crm_app`](/Users/servandodavidtorresgarcia/Servando/controlthrive/parallel_monitor_crm_app)
- strongest for:
  CRM integrations, TypeScript, React, webhook systems, event ingestion, operational tooling, customer-facing workflows
- supported signals:
  Attio app with one-click monitor creation
  webhook ingestion for Parallel monitoring events
  idempotent monitor creation, deduplication, structured Markdown updates
  React plus Zod plus TS app architecture
- best source files:
  [`parallel_monitor_crm_app/README.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/parallel_monitor_crm_app/README.md)
  [`parallel_monitor_crm_app/package.json`](/Users/servandodavidtorresgarcia/Servando/controlthrive/parallel_monitor_crm_app/package.json)

### 3. Account Matching System

- repo:
  [`account-matching`](/Users/servandodavidtorresgarcia/Servando/databris/account-matching)
- strongest for:
  entity resolution, fuzzy matching, PySpark, data quality, deduplication, operational decision support, human-in-the-loop pipelines
- supported signals:
  matching across CRM, transactional data, and deduplication flows
  normalization, blocking keys, weighted scoring, manual-review routing
  Databricks and PySpark environment
- best source files:
  [`account-matching/README.md`](/Users/servandodavidtorresgarcia/Servando/databris/account-matching/README.md)
  [`apps/website/src/pages/case-studies/ai-matching-engine-manufacturing.astro`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/apps/website/src/pages/case-studies/ai-matching-engine-manufacturing.astro)
- notable metrics or scale:
  website case study supports `200,000` problematic records, `70%` duplicate reduction, and `+1 FTE` manual-effort savings

### 4. Menlo Data Platform

- repo:
  [`data-platform`](/Users/servandodavidtorresgarcia/Servando/menlo/data-platform)
- strongest for:
  AWS systems, batch processing, data platforms, autonomous vehicle analytics, metrics pipelines, infrastructure-aware engineering
- supported signals:
  drive-data and metrics platform for autonomous vehicle workflows
  AWS Batch job runner, ECR images, Redis broker, RDS persistence
  ingestion, preprocessing, road-graph extraction, differential evaluation, database-backed metrics
- best source files:
  [`data-platform/CLAUDE.md`](/Users/servandodavidtorresgarcia/Servando/menlo/data-platform/CLAUDE.md)
  [`data-platform/job_runner/README.md`](/Users/servandodavidtorresgarcia/Servando/menlo/data-platform/job_runner/README.md)
- use carefully:
  this repo is strong for technical depth and infrastructure, but weaker for clean end-user business storytelling unless the JD values platform or data infra work

### 5. Solaria Dashboard

- repo:
  [`solaria`](/Users/servandodavidtorresgarcia/Servando/menlo/solaria/solaria)
- strongest for:
  FastAPI, React, dashboard work, transcript plus audio pipelines, sentiment analysis, analyst tooling, financial workflows
- supported signals:
  full-stack dashboard with FastAPI backend and Vite React frontend
  Quartr transcript and audio ingestion
  synchronized transcript, playback, and sentiment timelines
  sentiment cache and analyst-facing UX
- best source files:
  [`solaria/call-pulse-insight/README.md`](/Users/servandodavidtorresgarcia/Servando/menlo/solaria/solaria/call-pulse-insight/README.md)
  [`solaria/call-pulse-insight/package.json`](/Users/servandodavidtorresgarcia/Servando/menlo/solaria/solaria/call-pulse-insight/package.json)
  [`solaria/CLAUDE.md`](/Users/servandodavidtorresgarcia/Servando/menlo/solaria/solaria/CLAUDE.md)

### 6. Relu Pricing System

- repo:
  [`relu`](/Users/servandodavidtorresgarcia/Servando/relu/relu)
- strongest for:
  ML systems, pricing optimization, Metaflow, quantile regression, optimization, decision systems
- supported signals:
  demand curve modeling
  quantile regression training
  constraint handlers and repricing rules
  Lagrangian optimization for price recommendations
- best source files:
  [`relu/README.md`](/Users/servandodavidtorresgarcia/Servando/relu/relu/README.md)
  [`apps/website/src/pages/case-studies/price-optimization-saas.astro`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/apps/website/src/pages/case-studies/price-optimization-saas.astro)
- notable metrics:
  website case study supports `35%` revenue growth and `25%` sales growth

### 7. RecSys Metaflow

- repo:
  [`recsys-metaflow`](/Users/servandodavidtorresgarcia/Servando/controlthrive/recsys-metaflow)
- strongest for:
  recommendation systems, Metaflow, experimentation, embeddings, Word2Vec, matrix factorization, PyTorch
- supported signals:
  graph-based recommendation framing
  random walks for training sequences
  Word2Vec and matrix factorization implementations
  production-style workflow orchestration with Metaflow
- best source files:
  [`recsys-metaflow/README.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/recsys-metaflow/README.md)
  [`recsys-metaflow/setup.py`](/Users/servandodavidtorresgarcia/Servando/controlthrive/recsys-metaflow/setup.py)

## Consulting And Customer-Facing Proof

Use these when the role is business-facing or hybrid:

- testimonials and positioning:
  [`apps/website/instructions.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/apps/website/instructions.md)
- brand and company credibility:
  [`apps/website/src/components/TrustedBy.astro`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/apps/website/src/components/TrustedBy.astro)

These support themes like:

- client-facing consulting
- strong communication and stakeholder management
- business intelligence and analytics depth
- founder-led AI consultancy credibility
- work with firms including PwC, KPMG, Fintonic, Orange, BBVA, and Minsait

## Quick Keyword Routing

When a JD mentions these terms, inspect these projects first:

- `FastAPI`, `Pydantic`, `Prefect`, `HubSpot`, `Vercel`, `LLM`, `ranking`, `capital markets`:
  `agents-campaigns`
- `React`, `TypeScript`, `webhooks`, `CRM`, `Attio`, `event ingestion`:
  `parallel_monitor_crm_app`
- `PySpark`, `Databricks`, `fuzzy matching`, `entity resolution`, `deduplication`:
  `account-matching`
- `AWS Batch`, `Redis`, `RDS`, `ECR`, `data platform`, `autonomous vehicles`:
  `data-platform`
- `audio`, `transcripts`, `sentiment`, `dashboard`, `financial research`:
  `solaria`
- `Metaflow`, `pricing`, `quantile regression`, `optimization`, `Lagrangian`:
  `relu`
- `recommendation systems`, `Word2Vec`, `matrix factorization`, `PyTorch`:
  `recsys-metaflow`

## Output Strategy

Pick the smallest set of projects that makes the candidate feel inevitable for the role.

- technical CVs usually need `2-3` deep project stories plus a compact earlier-experience block
- business CVs usually need `2` strong client stories plus founder and consulting framing
- do not dump every project into the one-pager
