---
categories:
- Software Engineering
-  Claude Code seshs
date: '2025-01-04'
description: Explore why infrastructure automation fails due to mental model gaps,
  and learn strategies for successful tool adoption.
published: False
tags:
- Infrastructure Automation
- Mental Models
- DevOps
- Automation Tools
- Software Engineering
title: 'Why Infrastructure Automation Fails: The Mental Model Gap'
---

Infrastructure automation tools don't eliminate complexity—they redistribute it into new mental models. Your ability to map what you already know to what the tool does determines whether adoption succeeds or creates confusion.

Through my [consulting work](https://www.controlthrive.com), I help companies navigate the transition from traditional deployment approaches to modern automation platforms. The pattern I see repeatedly: teams get stuck not because the tools are bad, but because the mental model gap never gets bridged.

This is part of the Agent Deployment Decisions series. I'm focusing on mental models because it's where architectural decisions meet practical implementation.

## Three Components Become Six

Here's what happened with a recent investment banking client deploying an deal-matching pipeline. Traditional deployment stack I knew:

```
FastAPI + Docker + AWS Lightsail = 3 things
```

Then I evaluated ZenML and saw this in their stack configuration:

```
6 components:
- IMAGE_BUILDER
- CONTAINER_REGISTRY
- DEPLOYER
- ARTIFACT_STORE
- ORCHESTRATOR
- STEP_OPERATOR
```

The task became understanding these concepts and mapping them against the project diagram I had in mind. There are trade-offs and factors to consider like time involvement in infrastructure setup, and the potential for increased complexity in maintenance. As a solo entreprenuer, I have to be mindful of time-effort matrix. Also, I love tools that can help me do the heavy lifting.

This is the mental model gap. The tool isn't adding complexity arbitrarily—it's making explicit what was implicit in the traditional approach. But without understanding the mapping, it feels like bloat.

## Infrastructure Automation Concepts (Zenml)

**IMAGE_BUILDER**: Component that builds Docker images. In traditional workflows, you run `docker build` manually. Automation platforms make this a configurable component (local Docker, AWS CodeBuild, cloud build services).

**CONTAINER_REGISTRY**: Storage for Docker images. Your traditional workflow pushed to ECR manually. Automation platforms configure this as a stack component.

**DEPLOYER**: Component that provisions the running service (App Runner). Replaces manual AWS console configuration or CLI commands.

**ARTIFACT_STORE**: Storage for pipeline outputs and intermediate results. This is genuinely new—most traditional FastAPI deployments don't systematically version outputs.

**ORCHESTRATOR**: Coordinates multi-step workflows. Simple APIs don't need this. Complex pipelines with dependencies between steps do.

**STEP_OPERATOR**: Optional component for running individual steps on separate compute. 

## The Direct Translation

The breakthrough moment came when we created this mapping table:

| Traditional Component | What It Does | Automation Equivalent |
|----------------------|--------------|----------------------|
| **FastAPI code** | Application logic with HTTP endpoints | **@pipeline/@step decorators** (ZenML) or **@app.function()** (Modal) |
| **Dockerfile** | Instructions to build container | **IMAGE_BUILDER** auto-generates or **modal.Image** defines in Python |
| **`docker build`** | Builds the image | **IMAGE_BUILDER** executes |
| **`docker push` to ECR** | Stores image in registry | **CONTAINER_REGISTRY** handles |
| **App Runner** | Runs container as HTTP service | **DEPLOYER** provisions |
| **Manual S3 (if needed)** | Store outputs | **ARTIFACT_STORE** automates |
| **None** | Coordinate steps | **ORCHESTRATOR** manages (new capability) |

TODO: I cannot leave None in the table. I need to find a way to represent it.

The "3 components vs 6 components" question dissolved. The tool split Docker into two explicit pieces (build vs storage) and added two genuinely new capabilities (artifact versioning and orchestration).

## Why "Docker in the Cloud" Matters

Another insight came from comparing AWS CodeBuild and Modal's image builder. The client asked: "Aren't these essentially the same thing?"

Yes. Both are "Docker build on cloud servers instead of your laptop."

**CodeBuild:** AWS runs `docker build` on their infrastructure. You pay per build minute. Subject to AWS service quotas.

**modal.Image:** Modal runs image builds on their infrastructure (likely using AWS/GCP underneath). Included in platform pricing. No quotas to manage.

Recognizing this equivalence cuts through marketing abstractions. The choice isn't about fundamentally different technologies—it's about pricing models, quota management, and integration preferences.

## When Automation Adds Real Value

Not all abstraction is overhead. The client's traditional workflow had gaps:

**Artifact versioning:** No systematic way to trace which investor list came from which scoring run. The ARTIFACT_STORE component solves this automatically.

**Audit trail:** Manual S3 uploads with inconsistent naming. ZenML's artifact store creates lineage graphs showing exactly how each output was produced.

**Deployment consistency:** Manual docker builds meant "works on my machine" issues. Automated image builders guarantee reproducibility.

These are genuine capabilities the traditional approach lacked. The value proposition isn't "fewer components"—it's systematic solutions to real operational gaps.

## The Hidden Cost of Local Image Builders

One technical detail revealed broader infrastructure tradeoffs. When AWS CodeBuild hit quota limits, we considered switching to local image building (using Docker on the developer's laptop).

The catch: The laptop had 8GB RAM. Python dependencies for the pipeline (Pydantic AI, FastAPI, PDF parsing libraries) might exceed available memory during Docker builds.

This illustrates why "just build locally" isn't always simpler:
- Cloud builders have abundant RAM
- Local builds compete with your development environment
- Resource limits surface at inconvenient times

The "simple" local option has hidden constraints. The "complex" cloud option (with quota management) provides predictable resources.

## Implementation Strategy

Here's how we resolved the mental model gap:

**Step 1: Map existing workflow to new components**
Create a side-by-side table showing exactly which automation component replaces which manual step. Don't skip this—without the mapping, team members build incorrect mental models.

**Step 2: Identify genuinely new capabilities**
Distinguish between "this automates what I already do" versus "this does something I couldn't do before." Artifact versioning and orchestration are new. Image building and registry management are automation.

**Step 3: Evaluate minimal viable stack**
Start with only the components that map to your current workflow plus one new capability you need. Resist the temptation to use all available components because they're there.

For this client:
```
Minimal stack:
- IMAGE_BUILDER (local or cloud)
- CONTAINER_REGISTRY (existing ECR)
- DEPLOYER (existing App Runner setup)
- ARTIFACT_STORE (new capability: audit trail)
- ORCHESTRATOR (local, not SageMaker)

Remove:
- STEP_OPERATOR (not needed for their pipeline)
```

**Step 4: Clarify cost model**
Local builders use developer machine resources. Cloud builders (CodeBuild, Modal) use provider resources but may have quotas or per-minute charges. SageMaker orchestrators cost $0.23/hour per instance. Make costs explicit.

## When to Choose Each Approach

**Traditional FastAPI + Docker + App Runner when:**
- You have 1-3 endpoints with straightforward logic
- No need for systematic artifact versioning
- Team comfortable with Docker workflows
- Full control over infrastructure preferred

**ZenML when:**
- Multi-step pipelines with dependencies
- Audit trail and run lineage required
- Already using AWS infrastructure
- Willing to manage stack components

**Modal when:**
- Want one-command deployment
- Prefer Python configuration over YAML/stack management
- Don't want to manage AWS quotas
- Serverless pricing model fits usage pattern

**The real decision:** How much control do you need versus how much automation do you want? There's no universal right answer—it depends on team capabilities and operational requirements.

## Why This Matters Now

The infrastructure automation landscape is fragmenting. Teams evaluate ZenML, Modal, Airflow, Prefect, Dagster, and custom solutions. Each tool has different mental models.

The companies that succeed aren't necessarily choosing the "best" tool. They're the ones who:
1. Explicitly map existing workflows to new abstractions
2. Distinguish genuine new capabilities from automated existing tasks
3. Start with minimal viable stacks
4. Make infrastructure costs visible

Bad mental models are cheap to form but expensive to unlearn. A week spent understanding the mapping saves months of confused implementation.

## Next Steps

If you're evaluating infrastructure automation platforms:

1. **Document your current workflow explicitly** - Write down every step from code to deployment. You can't map what you haven't articulated.

2. **Create comparison tables** - For each tool, map traditional components to platform components. Use the tables in this post as templates.

3. **Test with minimal stack** - Resist using all available features. Start with what you need today.

4. **Measure actual costs** - Local builds, cloud builds, and managed services have different cost structures. Get real numbers before committing.

5. **Plan for the mental model gap** - Budget time for team members to understand mappings. This isn't optional documentation—it's the difference between adoption and abandonment.

If these approaches resonate with your infrastructure challenges, or if you're evaluating deployment platforms and want help navigating the mental model gap, I'd love to work together. Reach out through the contact page or connect on LinkedIn.

---

*Part of the Infrastructure Decisions series exploring practical tradeoffs in deploying AI/ML applications. Next post: When serverless pricing actually saves money (and when it doesn't).*