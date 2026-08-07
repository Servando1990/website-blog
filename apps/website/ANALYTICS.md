# Website analytics

The website sends aggregate funnel events to GA4. It does not add visitor names,
emails, CRM identities, or other personal data to analytics events.

## Event contract

Every marked Cal.com CTA emits `founding_partner_cta_click` with:

- `cta_id` — the action that was offered
- `cta_location` — the page section that produced the click
- `offer_wedge` — PA-OS, services, or tools
- `page_path` — the page where the click happened
- `campaign_id` — `utm_campaign`
- `content_id` — `utm_content`

Incoming UTM values are kept for the browser session and forwarded to Cal.com.
Without `PUBLIC_GTM_ID`, the existing GA4 tag (`G-LLMXBYB3P8`) receives the CTA
event directly.

## Complete the booking loop

1. Create a GTM web container and add a Google tag for `PUBLIC_GA4_ID`.
2. Add a Custom Event trigger named `founding_partner_cta_click`.
3. Install the same GTM container in Cal.com.
4. In Cal.com, map `bookingSuccessfulV2` to the GA4 recommended event
   `generate_lead`.
5. Mark `generate_lead` as a GA4 key event.
6. Set `PUBLIC_GTM_ID` in Vercel only after the container is published.

Cal.com's setup reference:
<https://cal.com/help/bookings/analytics>
