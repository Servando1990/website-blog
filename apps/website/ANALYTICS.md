# PA-OS website tracking

The website measures one business path:

`source proof → offer page → founding-partner CTA → booked screen share`

## What the code sends

- `page_view` — the Google tag sends this automatically.
- `founding_partner_cta_click` — every Cal.com CTA sends `cta_id`,
  `cta_location`, `offer_wedge`, `page_path`, `campaign_id`, and `content_id`.
- Incoming UTM attribution is retained for the browser session and passed to
  Cal.com. No name, email, CRM data, or other visitor-level PII is added.

The current GA4 measurement id remains the fallback, so CTA tracking works
immediately. To move tag administration into Google Tag Manager, set:

```bash
PUBLIC_GA4_ID=G-LLMXBYB3P8
PUBLIC_GTM_ID=GTM-XXXXXXX
```

Before setting `PUBLIC_GTM_ID`, put a Google tag for `PUBLIC_GA4_ID` in that
container and publish it. Then add:

1. A **Custom Event** trigger named `founding_partner_cta_click`.
2. A GA4 event tag that sends the same event name and its data-layer fields.
3. The same GTM container in Cal.com.
4. A Cal.com custom-event trigger for `bookingSuccessfulV2` that sends the GA4
   recommended event `generate_lead`.
5. Mark `generate_lead` as a GA4 key event.

Use GA4 DebugView and GTM Preview to verify both events before publishing the
container. Founding Growth reads these aggregate events; Slack is optional and
should notify only on a confirmed booking, never on ordinary visits or clicks.
