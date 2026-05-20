---
name: cv-builder
description: Build or tailor a one-page CV or resume from a job description by first clarifying whether the role should be framed as technical or business-facing, then mining grounded evidence from Servando Torres's portfolio projects, website case studies, and existing CV drafts. Use when adapting a CV, founder one-pager, consultant profile, or technical resume for roles such as software engineer, ML engineer, AI engineer, solutions engineer, AI consultant, or other customer-facing AI delivery roles.
---

# CV Builder

Tailor one-page CVs around real project evidence, not generic résumé filler. Start by choosing the framing, then pull the strongest supported claims from the right projects, case studies, and prior CV drafts.

## Workflow

### 1. Ask The Framing Question First

Ask this before drafting when the role framing is not completely obvious from the job description:

`Should I frame this for a technical role or a business/client-facing role?`

Use these buckets:

- `technical`: Software Engineer, ML Engineer, AI Engineer, platform-heavy or model-heavy roles
- `business`: Solutions Engineer, AI Consultant, founder/operator, client-facing AI delivery roles

If the job description is explicit, infer the bucket and ask for confirmation only when the consequence is meaningful.

Then read [`references/framing-playbook.md`](./references/framing-playbook.md).

### 2. Read The Job Description Like A Filter

Extract and rank:

- target title and seniority
- role bucket: technical or business
- required technologies, tools, or frameworks
- domain: finance, capital markets, SaaS, manufacturing, autonomous systems, etc.
- delivery style: builder, IC, product-minded, consulting, client-facing, founder energy, stakeholder management
- keywords that deserve exact evidence from projects
- metrics or business outcomes the employer seems to care about

Do not start drafting until you know what should be emphasized and what should be omitted.

### 3. Load The Right Base Materials

Read [`references/evidence-map.md`](./references/evidence-map.md) first.

Use the existing CV drafts as starting points, not as fixed templates:

- technical baseline:
  [`cv-builder/servando-torres-ai-developer-cv.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/cv-builder/servando-torres-ai-developer-cv.md)
- technical baseline when Python, FastAPI, or orchestration matters:
  [`cv-builder/servando-torres-python-fastapi-prefect-cv.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/cv-builder/servando-torres-python-fastapi-prefect-cv.md)
- business baseline:
  [`cv-builder/servando-torres-one-pager.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/cv-builder/servando-torres-one-pager.md)
- business CV baseline:
  [`cv-builder/servando-torres-one-pager-cv.md`](/Users/servandodavidtorresgarcia/Servando/controlthrive/website-blog/cv-builder/servando-torres-one-pager-cv.md)

When a specific technology appears in the job description, inspect the matching project paths from the evidence map and verify the claim with code, manifests, READMEs, or case study copy.

### 4. Pick Evidence By Bucket

For `technical` framing:

- emphasize architecture, backend/API design, orchestration, ML or LLM pipelines, infra, workflow design, data contracts, evaluation, and implementation depth
- present Servando as a senior hands-on builder across multiple industries
- prioritize stack matches from project code over generic summary bullets
- use business outcomes only after the technical work is credible

For `business` framing:

- emphasize founder-led execution, scoping, AI advisory, client discovery, solution design, selling, delivery ownership, and customer obsession
- present Servando as someone who wears many hats, runs an AI consultancy, and can move from ambiguous stakeholder need to shipped product
- lean on consulting background at PwC and KPMG plus founder experience at controlthrive
- keep enough technical fluency to sound credible, but let commercial and delivery leadership lead

### 5. Draft A One-Pager

Default output should fit on one page in Markdown. Prefer a tight structure:

1. name and headline
2. short summary
3. compact capabilities section
4. experience section led by controlthrive and the 2-3 most relevant project stories
5. compressed earlier experience block

Keep it tight:

- target roughly `450-700` words
- use only the strongest 2-4 project stories
- prefer 1-line bullets with dense signal
- remove generic tools or skills that do not help this role
- keep repeated ideas out

### 6. Keep Claims Grounded

Do not invent technologies, metrics, clients, or years of experience.

Use these guardrails:

- support every important claim with a file, repo, case study, or prior CV draft
- if the user wants a stronger tenure framing than the source material supports, prefer `nearly a decade`, `senior`, or `experienced across multiple industries` instead of making up `10+ years`
- do not overstate ownership when the files only support contribution or partnership
- do not list a technology just because it is adjacent to a project; verify it
- when in doubt, inspect the repo instead of guessing

### 7. Final Checks

Before returning the CV:

- make sure the framing matches the chosen bucket
- make sure the headline, summary, and top bullets all pull in the same direction
- make sure the strongest JD keywords appear naturally in truthful places
- make sure the result still reads like a one-pager, not a project dump
- make sure the narrative is specific enough to feel real

## Evidence Priorities

Use these source types in this order:

1. curated case studies and existing CV drafts
2. project READMEs, manifests, and architecture docs
3. source files for technology verification
4. testimonial or website content for business-facing proof

The evidence map already points to the best sources for each project and role style. Start there instead of rediscovering the workspace from scratch.

## Resources

### references/

- [`references/framing-playbook.md`](./references/framing-playbook.md): choose the correct overall narrative and tone
- [`references/evidence-map.md`](./references/evidence-map.md): project-by-project evidence, case studies, metrics, and source paths

No scripts or assets are required yet. The work is mostly about judgment, evidence selection, and strong trimming.
