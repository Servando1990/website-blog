# Publer API Evaluation & Strategy

> **Purpose:** Evaluate Publer API for automating LinkedIn + X content generation from Amp threads, code sessions, and local files.

---

## Table of Contents

1. [API Overview](#api-overview)
2. [Capabilities Matrix](#capabilities-matrix)
3. [Platform-Specific Details](#platform-specific-details)
4. [Pricing Analysis](#pricing-analysis)
5. [API Workflow](#api-workflow)
6. [Post Callbacks (Replies & Threads)](#post-callbacks-replies--threads)
7. [Analytics Capabilities](#analytics-capabilities)
8. [Free Trial MVP Plan](#free-trial-mvp-plan)
9. [Full Automation Architecture](#full-automation-architecture)
10. [Decision Framework](#decision-framework)

---

## API Overview

### Specifications

| Property | Value |
|----------|-------|
| Base URL | `https://app.publer.com/api/v1` |
| Format | JSON |
| Auth Method | `Authorization: Bearer-API YOUR_API_TOKEN` |
| Rate Limits | 100 requests / 2 minutes per user |
| Availability | **Business & Enterprise plans only** |

### Supported Networks

Facebook, Instagram, Twitter/X, LinkedIn, Pinterest, YouTube, TikTok, Google Business Profile, WordPress, Telegram, Mastodon, Threads, Bluesky.

---

## Capabilities Matrix

### ✅ What You CAN Do Programmatically

| Capability | LinkedIn | X/Twitter | Notes |
|------------|:--------:|:---------:|-------|
| Schedule posts | ✅ | ✅ | Text, photos, videos, links, polls |
| Publish immediately | ✅ | ✅ | No `scheduled_at` = instant |
| Create threads | ❌ | ✅ | Up to 25 tweets per thread |
| First/follow-up comments | ✅ | ✅ (as thread replies) | Add links, hashtags after posting |
| Conditional comments | ✅ | ✅ | "Post comment if reach > 100 after 1hr" |
| Auto-share to other accounts | ✅ | ✅ | Cross-post with conditions |
| Upload media (direct) | ✅ | ✅ | Max 200MB per file |
| Upload media (from URL) | ✅ | ✅ | Async, poll for completion |
| PDF/document posts | ✅ | ❌ | LinkedIn carousels only |
| Polls | ✅ | ✅ | Native poll support |
| Auto-schedule (AI picks time) | ✅ | ✅ | Uses your posting schedule config |
| Recurring posts | ✅ | ✅ | Daily/weekly/monthly patterns |
| Recycling (evergreen) | ✅ | ✅ | Re-post content on cadence |
| Get post analytics | ✅ | ✅ | Reach, engagement, clicks, shares |
| Best times to post | ✅ | ✅ | Day/hour heatmap data |
| Hashtag analysis | ✅ | ✅ | Performance by hashtag |
| List/filter posts | ✅ | ✅ | Query by state, date, type |
| Auto-delete/hide posts | ✅ | ✅ | Based on time or performance |

### ❌ What You CANNOT Do

- Reply to others' posts (only your own via comments/threads)
- Read DMs or notifications
- Fetch your feed or timeline
- Auto-like, auto-follow, or engagement automation
- Edit already-published posts (platform limitation)
- Instagram auto-delete (API limitation)

---

## Platform-Specific Details

### LinkedIn

| Feature | Limit/Notes |
|---------|-------------|
| Character limit | 3,000 |
| Content types | `status`, `photo`, `video`, `link`, `document`, `poll`, `gif` |
| Photos per post | Up to 9 |
| Video max | 15 minutes, 5GB |
| Documents | PDF format, 100MB max |
| First comment | ✅ Supported (great for links!) |
| Formatting | Supports bold, italic, bullets |

**LinkedIn Best Practice:** Put links in the first comment, not the main post—better reach.

### X/Twitter

| Feature | Limit/Notes |
|---------|-------------|
| Character limit | 280 (standard) / 25,000 (premium) |
| Content types | `status`, `photo`, `video`, `link`, `gif`, `poll` |
| Photos per post | Up to 4 |
| Video max | 140 seconds (standard users) |
| Threads | ✅ Up to 25 tweets via follow-up comments |
| GIFs | 15MB max |

**X Thread Creation:** Use the `comments[]` array—each comment becomes a thread reply.

---

## Pricing Analysis

| Plan | API Access | Approx. Cost |
|------|:----------:|--------------|
| Free | ❌ | $0 |
| Professional | ❌ | ~$12/mo |
| **Business** | ✅ | ~$12-20/mo per social account |
| Enterprise | ✅ | Custom quote |

### Your Scenario: LinkedIn + X (2 accounts)

**Estimated cost: ~$24-40/month**

### ROI Comparison

| Alternative | Cost | Effort |
|-------------|------|--------|
| LinkedIn API direct | Free but complex | High (OAuth, approval process) |
| X API (Basic tier) | $100/month | Medium |
| Build both yourself | $100+ /mo + 2-3 weeks dev | High |
| **Publer Business** | ~$30/mo | Low (unified API) |

---

## API Workflow

### Authentication

```http
Authorization: Bearer-API YOUR_API_TOKEN
Publer-Workspace-Id: YOUR_WORKSPACE_ID
Content-Type: application/json
```

### Core Flow (Async Pattern)

```
1. POST /posts/schedule       → Returns { "job_id": "..." }
2. GET /job_status/{job_id}   → Poll until status: "complete"
3. GET /posts?state=scheduled → Verify post created
```

### Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/workspaces` | GET | List workspaces (get workspace ID) |
| `/accounts` | GET | List connected social accounts |
| `/posts/schedule` | POST | Schedule posts for future |
| `/posts/schedule/publish` | POST | Publish immediately |
| `/job_status/{job_id}` | GET | Check async job status |
| `/posts` | GET | List/filter posts |
| `/media` | POST | Upload media files |
| `/media/from-url` | POST | Import media from URL |
| `/analytics/{account_id}/post_insights` | GET | Get post performance |

---

## Post Callbacks (Replies & Threads)

This is the key feature for your use case—automating follow-up comments and threads.

### Callback Types

1. **Follow-up Comments** — Add comments to your own posts
2. **Auto-Share** — Cross-post to other accounts
3. **Auto-Delete/Hide** — Remove posts based on conditions

### Follow-up Comments (First Comment / Threads)

```json
{
  "bulk": {
    "state": "scheduled",
    "posts": [{
      "networks": {
        "linkedin": {
          "type": "status",
          "text": "Main post content here"
        }
      },
      "accounts": [{
        "id": "LINKEDIN_ACCOUNT_ID",
        "scheduled_at": "2025-01-15T10:00:00Z",
        "comments": [
          {
            "text": "🔗 Full article: https://servando.co/post-slug\n\n#DevEx #BuildInPublic",
            "conditions": {
              "relation": "AND",
              "clauses": {
                "age": { "duration": 1, "unit": "Minute" }
              }
            }
          }
        ]
      }]
    }]
  }
}
```

### X Thread Example (5 tweets)

```json
{
  "bulk": {
    "state": "scheduled",
    "posts": [{
      "networks": {
        "twitter": {
          "type": "status",
          "text": "🧵 Thread: What I learned building AI-powered dev tools this week..."
        }
      },
      "accounts": [{
        "id": "X_ACCOUNT_ID",
        "scheduled_at": "2025-01-15T14:00:00Z",
        "comments": [
          { "text": "1/ First insight goes here..." },
          { "text": "2/ Second point with more context..." },
          { "text": "3/ The surprising finding..." },
          { "text": "4/ What I'd do differently..." },
          { "text": "5/ TL;DR: Key takeaway.\n\nFollow for more dev insights 👋" }
        ]
      }]
    }]
  }
}
```

### Conditional Comments (Performance-Based)

Only post a comment if the post gets traction:

```json
"comments": [{
  "text": "This is resonating! Here's a deeper dive...",
  "conditions": {
    "relation": "AND",
    "clauses": {
      "age": { "duration": 2, "unit": "Hour" },
      "engagements": { "comparison": "gt", "value": 50 },
      "reach": { "comparison": "gt", "value": 500 }
    }
  }
}]
```

### Platform Support for Comments

| Platform | Comment Behavior |
|----------|------------------|
| LinkedIn | ✅ Adds as comment on post |
| X/Twitter | ✅ Adds as thread reply |
| Threads | ✅ Adds as thread reply |
| Bluesky | ✅ Adds as thread reply |
| Mastodon | ✅ Adds as thread reply |
| Facebook Pages | ✅ Adds as comment |
| Instagram | ❌ Not supported via API |
| TikTok | ❌ Not supported via API |

---

## Analytics Capabilities

### Post Insights Endpoint

```http
GET /analytics/{account_id}/post_insights?from=2025-01-01&to=2025-01-31
```

### Available Metrics

| Metric | Description |
|--------|-------------|
| `reach` | Number of unique viewers |
| `engagement` | Total interactions (likes + comments + shares + saves) |
| `engagement_rate` | `engagement / reach * 100` |
| `likes` | Reactions/likes count |
| `comments` | Comment count |
| `shares` | Share/repost count |
| `saves` | Bookmark/save count |
| `video_views` | Video view count |
| `link_clicks` | Clicks on links |
| `click_through_rate` | `link_clicks / reach * 100` |

### Best Times to Post

```http
GET /analytics/{account_id}/best_times?from=2025-01-01&to=2025-01-31
```

Returns a day/hour heatmap for optimal posting times.

### Hashtag Analysis

```http
GET /analytics/{account_id}/hashtags?from=2025-01-01&to=2025-01-31
```

Shows performance aggregated by hashtag.

---

## Free Trial MVP Plan

### Goal
Validate the full API workflow with real posts during the 14-day trial.

### Day-by-Day Plan

| Day | Task | What It Validates |
|-----|------|-------------------|
| 1 | Setup: Get API key, list workspaces/accounts | Auth works |
| 1 | Schedule a text post (LinkedIn) | Basic posting |
| 1 | Schedule a text post (X) | Basic posting |
| 2 | Post with first comment (LinkedIn) | Comment automation |
| 2 | Post X thread (3-5 tweets) | Thread creation |
| 3 | Upload media + post with image | Media workflow |
| 3 | Conditional comment (trigger after 1hr if reach > X) | Callback conditions |
| 5 | Use auto-schedule (let Publer pick time) | AI scheduling |
| 7 | Pull post analytics | Feedback loop works |
| 10 | Build minimal content → post pipeline | End-to-end automation |
| 14 | Evaluate: Is this worth $30/mo? | Decision time |

### MVP Directory Structure

```
~/Servando/social-engine-mvp/
├── pyproject.toml
├── .env                      # PUBLER_API_KEY, PUBLER_WORKSPACE_ID
├── config.yml                # Account IDs, preferences
├── scripts/
│   ├── 01_validate_auth.py   # Test API connection
│   ├── 02_list_accounts.py   # Get account IDs
│   ├── 03_schedule_post.py   # Basic scheduling
│   ├── 04_post_with_comment.py
│   ├── 05_post_thread.py     # X thread
│   ├── 06_upload_media.py
│   ├── 07_check_analytics.py
│   └── 08_full_pipeline.py   # End-to-end test
└── README.md
```

### Sample .env

```bash
PUBLER_API_KEY=your_api_key_here
PUBLER_WORKSPACE_ID=your_workspace_id
PUBLER_LINKEDIN_ACCOUNT_ID=account_id_here
PUBLER_X_ACCOUNT_ID=account_id_here
```

---

## Full Automation Architecture

### Vision: Multi-Source Content Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                     CONTENT SOURCES                          │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Amp Threads │  Blog Posts  │  Code Files  │  Notes/Docs    │
│  (find/read) │  (markdown)  │  (git diff)  │  (journals)    │
└──────┬───────┴──────┬───────┴──────┬───────┴───────┬────────┘
       │              │              │               │
       └──────────────┴──────┬───────┴───────────────┘
                             ▼
                 ┌───────────────────────┐
                 │    Content Engine     │
                 │  • Extract insights   │
                 │  • Generate drafts    │  ← Claude API
                 │  • Format per-platform│
                 └───────────┬───────────┘
                             ▼
              ┌─────────────────────────────┐
              │        Publer API           │
              │  • Schedule main post       │
              │  • Add follow-up comments   │
              │  • Create X threads         │
              │  • Track analytics          │
              └─────────────┬───────────────┘
                            ▼
                 ┌───────────────────────┐
                 │   Analytics Feedback  │
                 │  • Track performance  │
                 │  • Adjust topics      │
                 │  • Optimize timing    │
                 └───────────────────────┘
```

### Standalone Tool Location

```
~/Servando/social-engine/          # NOT in website-blog repo
├── pyproject.toml
├── config/
│   ├── sources.yml                # Paths to scan
│   ├── schedule.yml               # Posting cadence
│   └── .env
├── src/
│   ├── sources/                   # Content source adapters
│   │   ├── amp_threads.py
│   │   ├── markdown_files.py
│   │   ├── git_commits.py
│   │   └── code_changes.py
│   ├── engine/
│   │   ├── extractor.py           # Extract insights from content
│   │   ├── generator.py           # Generate social posts
│   │   └── formatter.py           # Platform-specific formatting
│   ├── publer/
│   │   ├── client.py              # Publer API wrapper
│   │   ├── scheduler.py           # Scheduling logic
│   │   └── analytics.py           # Pull metrics
│   └── cli.py                     # Main CLI entry point
├── cache/                         # Processed content cache
├── drafts/                        # Generated drafts for review
└── state/                         # Published post tracking
```

### Example sources.yml

```yaml
sources:
  # Amp threads from recent sessions
  - type: amp_threads
    filters: "author:me after:7d"
    
  # Blog posts from website-blog repo
  - type: markdown
    paths:
      - ~/Servando/controlthrive/website-blog/apps/blog/src/content/posts
    glob: "**/*.md"
    frontmatter_filter:
      social: true  # Only posts marked for social
    
  # Dev journal / notes
  - type: markdown
    paths:
      - ~/Servando/notes/dev-journal
    glob: "*.md"
    
  # Interesting git commits
  - type: git_commits
    repos:
      - ~/Servando/controlthrive/website-blog
      - ~/Servando/other-project
    since: "7 days ago"
    message_patterns:
      - "feat:"
      - "refactor:"
      - "[share]"
```

---

## Decision Framework

### ✅ Worth It If:

- [ ] You'll post 3+ times per week programmatically
- [ ] You want X threads created automatically
- [ ] You want LinkedIn first-comment strategy
- [ ] You value unified API over managing LinkedIn + X APIs separately
- [ ] You'll use analytics to improve content over time
- [ ] Time saved > $30/month

### ❌ Not Worth It If:

- [ ] You only post 1-2x per week manually
- [ ] You don't need programmatic control
- [ ] You want to engage with others' posts (not supported)
- [ ] You only need one platform

---

## Next Steps

1. **Start free trial** → Get API key from Settings → API Keys
2. **Run MVP scripts** → Validate all capabilities
3. **Test real posts** → LinkedIn + X with comments/threads
4. **Pull analytics after 7 days** → See if feedback loop works
5. **Decide by day 14** → Worth $30/mo?

---

## Resources

- [Publer API Docs](https://publer.com/docs)
- [API Reference](https://publer.com/docs/api-reference/introduction)
- [Post Callbacks (Comments/Threads)](https://publer.com/docs/posting/create-posts/content-types/post-callbacks)
- [Networks Reference](https://publer.com/docs/posting/create-posts/networks)
- [Analytics](https://publer.com/docs/analytics/post-insights)
- [Postman Collection](https://www.postman.com/aerospace-architect-98610700/publer/collection/dolndsh/publer-api)

---

*Document created: January 2026*
*Last updated: January 2026*
