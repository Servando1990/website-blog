# Price Optimization for SaaS Product

## Challenge

The founding team wanted a first fully-scalable product from what they had envisioned from day 1. They wanted a product that would fetch different data sources, apply several machine learning models to them, optimize prices across different goals and constraints, and push prices back to the e-commerce platform.

## Design

Built an end-to-end MLOps pipeline for dynamic pricing optimization using quantile regression as baseline and Lagrangian methods. The system processes e-commerce data through automated workflows, trains demand curve models, and applies multi-objective optimization strategies (profit maximization, sales growth, constraint-based) to generate optimal pricing.

## Implementation Highlights

- Quantile regression models predict demand curves instead of single-point forecasts, which makes pricing more robust to uncertainty.
- Lagrangian optimization balances GMV growth and profit protection with a tunable parameter.
- Constraints and repricing rules keep outputs within business guardrails.

```python
return demand * (price + lambda_value * (price - cost))
```

## Result

The system was able to generate optimal pricing for the e-commerce platform, with a 35% increase in revenue and a 25% increase in sales.

## Takeaway

Taking the founding team's vision and early design to a fully data-intensive product and iterating over customer feedback unlocked new revenue streams for the company.

# AI Matching Engine for Manufacturing Company

## Challenge

Technical and C-level stakeholders were dealing with the consequences of 200,000 duplicate and incomplete records across several key units of the company, making this a critical issue that had to be dealt with from the ground up.

## Design

A Spark-based matching engine combined with human-in-the-loop review. The system normalizes messy fields, uses blocking keys to avoid brute-force comparisons, applies weighted scoring across name, address, phone, and geo signals, and then buckets outcomes into “Correct,” “Manual Review,” or “Incorrect” for operational follow-through.

## Implementation Highlights

- Blocking keys reduce comparisons by grouping records on shared phone/ZIP fragments.
- Weighted scoring and validation rules surface high-confidence matches and isolate ambiguous ones.
- Configuration files allow field mappings to evolve without code changes.

```python
F.when(F.length('phone') >= 4, F.substring('phone', -4, 4)).alias('phone_block')
```

## Result

The system was able to restore CRM single source of truth, reducing duplicate and incomplete records by 70% and saving +1 FTE worth of manual effort.

## Takeaway

Workshops with key stakeholders who understood the business context were crucial to building this solution. Knowing where to separate AI tasks from human tasks was critical to success.

# Earnings Call Dashboard for Private Equity Firm

## Challenge

Financial research firm needed a dashboard to process earnings calls from 500+ portfolio companies, extracting key insights and predicting sentiment with vocal tone AI models.

## Design

We built a FastAPI backend to ingest transcripts and audio, plus a React dashboard to visualize sentiment, playback, and transcripts together. Audio is segmented for vocal-tone inference, results are cached for fast reuse, and the UI synchronizes sentiment timelines with transcript highlights so analysts can jump to moments that matter.

## Implementation Highlights

- Audio sentiment runs on short overlapping windows to capture tone shifts.
- Sentiment is returned as a time series and rendered directly on the chart.
- The UI links playback time to transcript segments for quick scanning.

```ts
const response = await fetch(`/api/earnings-calls?analyze_sentiment=true`);
```

## Result

The dashboard is now serving as key alert tooling for portfolio managers, enhancing their decision making on the fly.

## Takeaway

Being able to visually display negative and positive alerts across multiple companies was a key differentiator for the firm.
