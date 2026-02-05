---
title: 'Deal Structure Is a Positioning Strategy, Not a Classification Problem'
date: '2025-01-25'
description: 'Why the same deal can be co-investment for family offices and direct for VCs—and how AI agents handle multi-structure matching.'
categories: ['Capital Advisory', 'Deal Flow', 'AI Applications']
published: True
---

Through my work building investor-matching systems for capital advisory firms, I discovered that forcing deals into a single classification (co-investment OR direct) leaves money on the table. The same Series B company raising $25M can be a co-investment opportunity for family offices taking $250K passive positions AND a direct deal for growth funds deploying $5M+ with board seats.

## The Industry Problem

Capital advisors face a painful trade-off: send a direct deal to co-investment-only investors (RIAs, family offices, fund-of-funds) and you get immediate rejection. "Not a fit structurally" or "We only look at co-investments with sponsors" signals you didn't understand their mandate. That damages trust for future opportunities.

But classify every deal with rolling closes or partial allocations as "co-investment only" and you miss legitimate direct investors who could anchor larger positions.

The relationship cost of false positives is high. RIAs and fund-of-funds principals remember when you waste their time with structurally wrong deals. It's not just a pass—it's a credibility hit.

## Why Traditional Classification Fails

I initially built the system as a deterministic classifier: extract deal characteristics, label as co-investment or direct, match to corresponding investors. Clean, testable, algorithmic.

Then I learned the reality: the same Series B deal can be structured both ways:

**As co-investment:** Family offices participate with smaller checks, passive involvement, through a rolling close structure.

**As direct:** Growth VCs take larger positions with board representation and pro-rata rights.

Same company. Same round. Different structures for different investor types.

## How Agents Handle Multi-Structure Matching

The system I built now works in two phases:

**Phase 1: Identify optionality.** The extraction agent analyzes the deal PDF and flags structural characteristics:
- Can this be co-investment? (signals: rolling close, allocation language, check size flexibility)
- Can this be direct? (signals: round size, stage, revenue scale)
- What's the supporting evidence?

**Phase 2: Strategy selection.** The advisor chooses which investor segment to target for this matching run:
- "Show me co-investment-only investors" → filters to RIAs, family offices, FoF
- "Show me direct investors" → filters to growth VCs, strategics
- "Show me both" → runs twice with different messaging strategies

This isn't AI making classification decisions—it's AI identifying what's possible, then the advisor controls the positioning strategy. The system also learns from investor responses: when an RIA replies "Is this a co-investment? We only participate with sponsors," that signal automatically updates their CRM record with `deal_types: [CO_INVESTMENT]` for future matching.

## Takeaway

Rigid classification works for objective characteristics (industry, stage, revenue). But when the characteristic is flexible—when the same asset can be positioned multiple ways—the system needs to show optionality and let the human control strategy.

AI agents excel at "optionality identification": scanning for signals, flagging what's possible, providing evidence. Then capital advisory expertise determines which story to tell to which audience.

---

If these approaches resonate with your challenges or if you're interested in working together, I'd love to help.
