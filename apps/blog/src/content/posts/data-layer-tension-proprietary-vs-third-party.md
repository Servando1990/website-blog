---
title: "The Data Layer Tension: When Proprietary and Third-Party Systems Collide"
description: "Speed versus control in data architecture - why the debate between using existing data layers and normalizing everything reveals fundamental tensions in how we build matching systems."
date: 2025-01-12
categories: ["Data Architecture", "System Design"]
published: true
---

The core insight: The tension between leveraging existing data layers and normalizing everything to a custom taxonomy isn't just a technical debate—it's a fundamental question about where complexity should live in your system.

Through my consulting work building matching and scoring systems, I've seen this same pattern emerge repeatedly: one stakeholder wants to move fast with what exists, another wants to normalize everything upfront, and the engineers are caught in the middle trying to build against a moving target. The conversation I had recently with a client (let me call them "the LP firm") crystallized this perfectly.

## The Two-Layer Data Problem

The LP firm's CTO wanted a straightforward approach: use two data layers without forcing them to speak the same language. Layer one is proprietary data already in their CRM—contact type, industry, geography, deal type. Basic fields, already populated, already trusted by the deal team. Layer two is FinTrax, a third-party data provider with a native HubSpot integration that pushes updates weekly.

His reasoning was pragmatic: "FinTrax updates automatically. We're signing a two-year contract. Why would we spend weeks normalizing their taxonomy to ours when the data just flows in?"

The technical consultant saw it differently: "You can't have `industry_proprietary` and `industry_fintrax` competing for the same conceptual space. Your matching algorithm won't know which to trust, and you'll end up with fragile logic trying to reconcile them constantly."

Both perspectives have merit. And both miss something critical.

## What Actually Breaks Without Normalization

Here's what the "just use both layers" approach overlooks:

**Matching algorithms need consistent inputs.** When your scoring logic encounters a proprietary record tagged "Food & Beverage" and a FinTrax record tagged "Food Services," it can't automatically know these are the same concept. You'll write conditional logic. Then more conditional logic. Then you'll have a mess.

**Fill rates matter more than freshness.** FinTrax might update weekly, but if 60% of your proprietary records lack industry tags entirely, your "two-layer" system is really a "one layer plus aspirational data" system. The empty fields silently break your matches.

**Third-party taxonomies optimize for breadth, not your use case.** FinTrax categorizes companies to serve thousands of clients. Your matching logic needs to distinguish between types of alcohol distribution versus types of food service because that's what your LPs actually care about when they make investment decisions.

## What Actually Breaks With Over-Normalization

But the "normalize everything upfront" approach has its own failure modes:

**Perfect is the enemy of shipped.** I've watched teams spend three months defining a data dictionary that becomes obsolete the moment they test it against real matching scenarios. You discover what matters by building, not by theorizing.

**Normalization has ongoing costs.** Every time FinTrax updates their taxonomy or adds a new field, someone needs to map it back to your custom definitions. That's not a one-time tax—it's a recurring operational burden.

**You can't normalize what you don't understand yet.** If you're building a matching system for the first time, you literally don't know which nuances matter. Does "seed stage" need to be distinct from "pre-seed"? Depends on your LP's investment thesis, which you only understand after seeing which matches they engage with.

## The Practical Middle Path

Through building several of these systems, here's what actually works:

**Start with contact-level core fields only.** Industry, geography, deal stage, contact type. These are universal, rarely change definition, and have obvious business value. If these aren't filled and trustworthy, nothing else matters.

**Create a single source of truth per concept, with documented fallbacks.** Don't have two industry fields. Have one industry field with clear rules: "Use proprietary if filled and updated within 12 months, otherwise use FinTrax, otherwise flag for enrichment."

**Build enrichment as a separate pipeline, not inline logic.** When your matching algorithm runs, it should only see clean, normalized data. The messy work of reconciling proprietary and third-party sources happens upstream in a dedicated enrichment process that you can monitor and improve separately.

**Instrument everything so you know what's actually being used.** Add logging to see which data points your matching algorithm actually relies on versus which ones never influence scores. This tells you what's worth normalizing versus what's premature optimization.

## Why This Matters Now

Bad context is cheap but toxic. You can pull in dozens of FinTrax fields with one API call. But if half of them don't align with how your deal team actually thinks about industries or stages, your matching scores become untrustworthy. Then your team stops using the system. Then you've built expensive shelfware.

The right approach isn't "speed versus control." It's "speed on core fields with instrumentation that tells you what to normalize next."

## Implementation Strategy

If you're building a matching system against mixed proprietary and third-party data:

1. **Define 5-7 core matching fields.** Not dozens. The minimum set that distinguishes good matches from bad ones.
2. **Document your current fill rates.** Don't architect for perfect data. Architect for the messy reality of 40% fill rates and stale updates.
3. **Build enrichment pipelines before matching logic.** Separate the "how do we get clean data" problem from the "how do we match" problem.
4. **Create a single field per concept with explicit precedence rules.** No `industry_a` and `industry_b`. One `industry` field, clear logic about which source wins.
5. **Ship a constrained V1, then instrument it.** You'll learn more from one week of real usage than from one month of design documents.

The firms that move fastest aren't the ones that avoid normalization or the ones that normalize everything upfront. They're the ones that normalize the minimum viable set, ship it, measure it, and iterate based on what actually drives matching quality.

Through my consulting work, I help companies navigate exactly this tension—determining which data points need normalization versus which can live with pragmatic approximations, and building the instrumentation to know the difference. If these approaches resonate with your challenges or if you're wrestling with similar proprietary versus third-party data decisions, I'd be interested in helping.
