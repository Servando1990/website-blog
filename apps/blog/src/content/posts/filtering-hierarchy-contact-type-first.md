---
title: "Why Contact Type and Deal Type Must Come First"
date: 2025-11-14
description: "The filtering hierarchy in investor matching systems: why basic layers prevent random results before sophisticated matching begins"
categories: ["capital-advisory"]
published: True
---

The core insight: Third-party data doesn't solve bad filtering architecture—it multiplies the problem.

This is part of the Capital Advisory Series. I'm focusing on filtering hierarchy because it's where ambitious AI implementations fail against basic data infrastructure.

## The Forgotten Investor Problem

Investment professionals face a specific retrieval challenge: finding investors they've spoken to once, four months ago, whose name they don't remember, but whose conversation notes contain deal-specific exclusions.

The current approach sorts by interaction count. High-frequency contacts surface first. The hard part starts at page two—investors 101 through 200—where memory fades but notes remain.

These notes contain critical intelligence:
- "Not interested in baseball, focused on NBA"
- "Pass on early-stage, only Series C+"
- "Sports deals only if Formula One or Sail GP"

This intelligence lives in loss reasons, comment fields, and scattered interaction logs. Without proper filtering, it becomes noise.

## The Filtering Hierarchy

Investment matching requires layered filtering, executed in sequence:

**Layer 1: Contact Type and Deal Type**
- Contact type: investor, family office, credit fund, client
- Deal type: venture early-stage (seed through Series B), venture late-stage (Series C+), opportunistic
- Investment stage matching

**Layer 2: Specific Exclusions**
- Sector preferences within broader categories
- Stage boundaries within catchall terms
- Geographic or regulatory constraints

Layer 1 prevents random results. Layer 2 prevents relevant-but-wrong results.

The tension emerges when teams want to add third-party data (Crunchbase, PitchBook, Harmonic) before Layer 1 functions reliably. The impulse makes sense—external data promises completeness. But incomplete proprietary filtering means you can't validate whether external data improves match quality or introduces garbage.

## Why This Order Matters

Bad context is cheap but toxic. API calls to third-party vendors cost pennies. But if your system can't reliably filter "investors interested in sports" from "investors interested in NBA teams specifically," adding 10,000 external investor profiles just creates 10,000 new ways to waste time.

Working across capital advisory implementations, I've learned the most sophisticated matching algorithms fail when basic taxonomies aren't enforced at the pipeline entry point.

Consider the sports deal scenario:
- Query: "Find investors for NBA team acquisition"
- Without Layer 1: Returns clients, credit funds, private equity investors, family offices
- With Layer 1, without Layer 2: Returns sports investors including those who explicitly passed on basketball
- With both layers: Returns NBA-focused investors with clean interaction history

Each layer removes an order of magnitude of noise. Layer 1 might cut 10,000 contacts to 1,000. Layer 2 cuts 1,000 to 100 qualified matches.

## Implementation Strategy

The correct sequence for investor matching systems:

1. **Define contact type taxonomy**
   - Map existing records to standardized types
   - Create validation rules for new entries
   - Flag records with missing or conflicting types

2. **Standardize deal classification**
   - Establish catchall terms (opportunistic, venture early/late-stage)
   - Map deal stages to categories (seed/A/B = early, C+ = late)
   - Add missing stages (pre-seed often absent from legacy systems)

3. **Enforce Layer 1 filtering**
   - Block queries that don't specify contact type and deal type
   - Make these filters required, not optional
   - Test with known-good matches before expanding

4. **Build Layer 2 exclusions**
   - Parse loss reasons for sector-specific passes
   - Extract preference signals from notes
   - Create negative filters ("interested in sports BUT NOT baseball")

5. **Only then consider third-party data**
   - Use free trials to test incremental value
   - Compare match quality against proprietary-only baseline
   - Calculate cost per qualified introduction

Most teams want to skip to step 5. The economics don't work. A two-day free trial of external data doesn't prove value if your internal filtering generates false positives.

## What Changes After

Once Layer 1 filtering works reliably, the system behavior shifts:

- Searches return 100 results instead of 10,000
- Each result has verified contact type and deal alignment
- Loss reasons become machine-readable exclusions
- Third-party data can be evaluated against clean baseline

The investor you spoke to four months ago surfaces because the system knows:
- They're tagged as "family office" not "client"
- Their deal interest includes "venture late-stage"
- Their notes don't contain exclusionary loss reasons
- They haven't been contacted in 120+ days

This is operational intelligence. It only works when basic filters eliminate noise before sophisticated matching begins.

## Next Steps

If you're building investor matching systems:

1. **Audit contact type coverage**: What percentage of records have validated contact types?
2. **Map deal taxonomy**: Can your system translate "venture early-stage" to "seed, Series A, Series B"?
3. **Test Layer 1**: Run a query requiring contact type and deal type. Do results make sense before reading notes?
4. **Defer third-party data**: Don't evaluate external vendors until proprietary filtering works

The economics of agent-assisted investment processes depend on this foundation. Bad context multiplies through every API call, every prompt, every generated recommendation.

Get contact type and deal type right first. Everything else follows.

---

*If you're building investor matching systems and wrestling with filtering architecture, I'd be interested in discussing your specific challenges.*
