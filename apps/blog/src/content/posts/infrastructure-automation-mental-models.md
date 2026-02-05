---
categories:
- Software Engineering
-  Claude Code seshs
date: '2025-01-04'
description: Explore why infrastructure automation fails due to mental model gaps,
  and learn strategies for successful tool adoption.
published: True
tags:
- Infrastructure Automation
- Mental Models
- DevOps
- Automation Tools
- Software Engineering
title: 'Deployment Patterns for Custom Agentic Software'
---

Agent deployment tech stacks don't remove complexity—they force you to name it. Adoption succeeds only when you translate what already works into the platform's abstractions.

Through my [consulting work](https://www.controlthrive.com), I help companies build that translation layer so deployment platforms become leverage instead of overhead. This is part of the Agent Deployment Decisions series, and I focus on mental models because it's where architecture meets execution.

## How Six Components Appear from Three

When I deployed an investor intelligence workflow for an investment bank, my baseline stack looked like this: *FastAPI + Docker + AWS Lightsail = 3 moving pieces.*

ZenML surfaced the same system as six explicit components:

- **IMAGE_BUILDER** – defines how containers are built (local Docker, CodeBuild, Modal)
- **CONTAINER_REGISTRY** – stores built images (ECR, GCR, Docker Hub)
- **DEPLOYER** – provisions the runtime (App Runner, ECS, Kubernetes)
- **ARTIFACT_STORE** – versions pipeline outputs (S3, GCS, local disk)
- **ORCHESTRATOR** – coordinates multi-step runs (local, Kubeflow, Airflow)
- **STEP_OPERATOR** – optional compute for heavyweight steps (SageMaker, Vertex)

The platform didn't invent complexity; it exposed relationships I had been tracking informally. Bridging that gap is the whole game.

## Mapping Traditional Workflow to Automation Components

| Traditional workflow | Purpose | Automation component |
|----------------------|---------|----------------------|
| FastAPI routes + business logic | Serve requests | `@pipeline` / `@step` (ZenML) or `@app.function()` (Modal) |
| Dockerfile | Define container | `IMAGE_BUILDER` or `modal.Image` |
| `docker build` | Produce image | `IMAGE_BUILDER` execution |
| `docker push` to ECR | Store image | `CONTAINER_REGISTRY` |
| AWS App Runner deployment | Run container | `DEPLOYER` |
| Manual S3 folders + naming | Persist outputs | `ARTIFACT_STORE` |
| Python scripts + cron | Coordinate jobs | `ORCHESTRATOR` |
| Dedicated EC2 for heavy steps | Burst compute | `STEP_OPERATOR` (optional) |

Once the mapping was explicit, the question shifted from "Why six components?" to "Which pieces do I need today and which add net-new capability?"

## Where Automation Adds Real Value

- **Artifact lineage** becomes automatic. Each run records which inputs produced which outputs without bespoke logging.
- **Reproducibility** improves because image builds move off individual laptops and into defined builders.
- **Operational clarity** increases: every component has an owner (even if that's you) and a clear cost center.
- **Selective adoption** is possible. You can run ZenML locally with just an image builder and registry while postponing step operators or managed orchestrators.

## Interpreting Image Builders

AWS CodeBuild and `modal.Image` both execute `docker build` on remote hardware. The difference is how you pay and what you manage:

- **CodeBuild** bills per build minute and inherits AWS quota management.
- **modal.Image** bundles build minutes into Modal's pricing and hides quota work.

Switching back to local builds is rarely "simpler." Laptops with 8 GB RAM choke on dependency-heavy builds, and background jobs fight for the same resources you're coding with. Remote builders provide predictable RAM/CPU at the cost of either AWS quotas or vendor pricing.

## Implementation Strategy

1. **Map first.** Write the table above for your own stack so everyone sees the translation.
2. **Tag new capabilities.** Label which components automate existing tasks (image builder, registry) and which add net-new value (artifact store, orchestrator).
3. **Assemble a minimal stack.** Start with the automated equivalents plus one new capability that solves a pain point. Leave STEP_OPERATOR disabled until you need burst compute.
4. **Price the options.** Local builders cost laptop time; CodeBuild charges per-minute; Modal bundles usage; SageMaker orchestrators bill hourly per instance. Put current numbers next to each choice.

"""
Minimal stack I shipped:
- IMAGE_BUILDER (CodeBuild for predictability)
- CONTAINER_REGISTRY (existing ECR)
- DEPLOYER (existing App Runner)
- ARTIFACT_STORE (S3 for lineage)
- ORCHESTRATOR (local to start)
"""

## Decision Guide

- **Stay with FastAPI + Docker + App Runner** when the workload is a few deterministic endpoints and artifact lineage is optional.
- **Adopt ZenML** when you manage multi-step pipelines, need audit trails, or want stack components you can swap (local today, SageMaker tomorrow).
- **Reach for Modal** when you prefer Python-native configuration, want one-command deployment, and do not want to juggle AWS quotas.

The real decision is about control versus leverage. Automation platforms earn their keep when you can describe exactly what they automate and what they add that you cannot feasibly maintain by hand.

## Why This Matters Now

Infra tooling is fragmenting across ZenML, Modal, Airflow, Prefect, Dagster, and custom scripts. Teams that win are not picking a perfect tool—they are the ones who:

1. Translate existing workflows into each platform's primitives.
2. Separate automation from new capability.
3. Ship only the components they need today.
4. Track costs before flipping new switches.

Bad mental models are cheap to form and expensive to unwind. A few hours of translation work saves months of tool thrash.

## Next Steps

1. Document your current pipeline end-to-end.
2. Build your own translation table.
3. Pilot the minimal stack and measure actual build plus runtime costs.
4. Expand only when the metrics justify more automation.

If these approaches resonate with your infrastructure challenges or you're weighing ZenML and Modal for the first time, I'd love to help. Reach out via the contact page or LinkedIn, and after publishing remember to run the blog-crosslink-optimizer agent to layer in relevant internal links.

---

*Part of the Infrastructure Decisions series exploring practical tradeoffs in deploying AI/ML applications. Next post: When serverless pricing actually saves money (and when it doesn't).*
