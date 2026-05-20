MVV Project — Complete History & Evolution
MVV Project — Complete History & Evolution

This document captures the full evolution of the MVV Capital Partners investor-matching and outreach automation project, from its inception in November 2025 through April 2026.

Core Team

@Misha Vasilchikov Misha Vasilchikov — Client / MVV Capital Partners
@Servando Servando — Atlas system architect & engineer
@kellencasebeer Kellen Casebeer — CRM operations, Clay, campaign infrastructure
@max deleon Max De Leon — Target list research & investor sourcing
@Sue Melone Sue Melone — Operations & campaign oversight
@Ryan F Ryan — Campaign execution & reply management
@Ali Ali Rehman Bhutta — Email infrastructure & signatures

Phase 1: Project Kickoff & Email Infrastructure (November 2025)

The earliest messages in the channel date to November 21, 2025, when Misha purchased two new domains — mvvcm.com and mvvcapitalmanagement.com — and asked Kellen to include them in the existing email warm-up rotation. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1763745459544379
Around the same time, Servando shared an early milestone: the check-size filter logic for the matching algorithm, using a ratio-window approach (deal amount ÷ investor's typical check) with configurable global thresholds (0.1×–10×). https://controlthrive.slack.com/archives/C09L8TFBJNP/p1764025906213049
On November 24, Misha celebrated a significant win (a new deal closing), with the team expressing enthusiasm:

"Pavel's gonna love what's coming next" — Kellen https://controlthrive.slack.com/archives/C09L8TFBJNP/p1764022471031469

On November 26, during a pre-Thanksgiving call, Misha made minor edits to the "Deal Types Interested In" property on Contacts and Companies — adding Series E, F, and G as distinct deal type options. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1764174588816939

Phase 2: Algorithm Architecture & First Matching Outputs (November–December 2025)

On November 28, Servando published a detailed technical breakdown of the check-size and notes signal scoring system, asking Misha key product questions: how should conflicting check-size signals in notes be handled? How should pass reasons influence scoring? https://controlthrive.slack.com/archives/C09L8TFBJNP/p1764358523346289
On December 3, Servando posted the first System Design Overview — the architectural source of truth for the project — covering component status and roadmap. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1764724775637679
Servando's December availability was also posted: off Dec 18 – Jan 12 for the holidays.
On December 4, the team held a call. Servando also surfaced Vapi.ai as a potential tool for voice agent follow-ups. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1764869573980489
On December 8, Kellen asked Servando to evaluate FINTRX as a data source for investor enrichment. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1765222271298089
On December 9, Servando delivered the first formal top-20 matching output — scored using check size (60%), industry (20%), and geography (20%). Misha provided detailed feedback on each name, surfacing key product gaps:

* No behavioral scoring (unresponsive investors still ranked highly)
* Champion contact logic missing (wrong person being surfaced at firms)
* One contact per firm not enforced https://controlthrive.slack.com/archives/C09L8TFBJNP/p1765309324651609

On December 11, Servando responded with a 3-part roadmap: Responsiveness Logic, Notes/Pass Reasons Logic, and Champion/Interaction Selection. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1765423217168439
Misha also shared large external investor databases from FINTRX (Foods & Restaurants, Fund-of-Funds, Insurance, Global SFOs/MFOs, Canada) with ~30K names, raising questions about deduplication and safe upload logic. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1765433469105589
On December 12, the team discussed whether PitchBook (PB) API access would be needed for portfolio-level targeting. Kellen offered to try sourcing the data without PB. Servando offered to build a web agent solution. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1765555797840989
On December 19, Servando posted a top-50 matching output with full LLM-enriched fields: positive signals, constraints, pass reasons, conflict detection, evidence quotes, and a match_summary for email copy. A notes-fetching bug was flagged (positions 21–50 missing LLM output). https://controlthrive.slack.com/archives/C09L8TFBJNP/p1766179577267099
On December 22, Misha shared Raisi.ai as a competitive reference. On December 23, Misha reviewed the top-50 output and gave strongly positive feedback:

"Very good in terms of the rationale provided, score given, deal types outlined, check size fit, industry, etc. Generally very happy with the latest iteration." https://controlthrive.slack.com/archives/C09L8TFBJNP/p1766444957173849

A Crunchbase demo was scheduled for December 24 with Servando and Misha attending. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1766445042985569
On December 31, Sue sent a New Year's message celebrating the partnership and 2025 milestones. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1767218089594159

Phase 3: Post-Holiday Ramp & System V1 Closure (January 2026)

On January 5, Misha sent a detailed recap of outstanding Kellen deliverables from the first engagement phase:

1. Deduplication of records
2. Data enrichment
3. Industry tagging for Deals
4. Active Investor → Investor Lead reclassification
5. Strategy for external Excel spreadsheets
6. Dark web check for PB/CB/FINTRX data https://controlthrive.slack.com/archives/C09L8TFBJNP/p1767645030492119

Kellen confirmed work would resume January 15 and outlined the logic for safe CRM uploads using Clay if/then conditionals. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1767650287568259
On January 12, Misha and Servando aligned live and Misha pushed hard for movement:

"I am now at 80% there with Servando's engine so I need to start putting things together and testing." https://controlthrive.slack.com/archives/C09L8TFBJNP/p1768236609893919

Servando also shared a Crunchbase analysis note, outlining how CB fields like num_investments, last_funding_at, and money_invested could enhance check-size accuracy, freshness detection, and nightly enrichment pipelines. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1768256571430499
From January 13–14, Servando ran multiple matching batches:

* Sol-ti (Active Investors) — top 100 https://controlthrive.slack.com/archives/C09L8TFBJNP/p1768257031611869
* Sol-ti (Investor Leads) — top 100 https://controlthrive.slack.com/archives/C09L8TFBJNP/p1768278256980369
* Arkview Parking Fund I — top 100 https://controlthrive.slack.com/archives/C09L8TFBJNP/p1768331869728399
* LLM bug fixed (January 14): batch 3 showed 0 LLM failures and confirmed NO_NOTES_FOUND flags were accurate https://controlthrive.slack.com/archives/C09L8TFBJNP/p1768353769078429

The team confirmed Sol-ti as the priority deal (time-sensitive, end of March deadline).
On January 13, Servando published the first User Manual for the system. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1768328500462719
On January 19, Servando posted a major System Update with a 12-item feature checklist including EBITDA/Revenue filtering, co-invest subtypes, opportunistic investors from notes, and investor analysis. He also published User Manual V2 and System Design Overview V2, and outlined the Clay webhook integration requirements. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1768852597565969
On January 24, Servando shipped firm-level notes aggregation — notes are now pulled from all contacts at a firm (not just the champion), so constraints from any team member feed the LLM analysis. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1769211784763209
On January 30, Servando posted a full 12-item feature backlog with priorities, and proposed A/B weight testing (Check Size dominant vs. Industry-forward scoring profiles). https://controlthrive.slack.com/archives/C09L8TFBJNP/p1769792223744749

Phase 4: CRM Deep Work, Campaigns Groundwork & UI Mockups (February 2026)

On February 5, Kellen shared an alignment doc framing a key fork: Campaign-led (Kellen as QB, biweekly launches) vs. System-led (Servando as QB, completeness first). https://controlthrive.slack.com/archives/C09L8TFBJNP/p1770265759171109
Misha pushed back, frustrated that the doc was read-only and that several outstanding CRM topics hadn't been addressed. He flagged numerous open items including enrichment strategy, LinkedIn integration, Parallel.io evaluation, and compliance considerations around broker-dealer email language. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1770305627614209
On February 9, Kellen shared campaign briefs for Sol-ti, Rimac, and Project Denali, including the first email copy drafts and a qualified cold lead list for review. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1770615720219579
On February 10–11, Servando shared UI mockups for the Atlas interface — the first visual preview of what would become the Atlas UI. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1770766475692249
Kellen also shared two data transformation pipelines in progress:

* Contact deduplication: email validation → LinkedIn enrichment → found/valid/needs-review tagging https://controlthrive.slack.com/archives/C09L8TFBJNP/p1770796983292319
* Deal industry classification: AI-based taxonomy tagging for all deal records, with code-name flagging https://controlthrive.slack.com/archives/C09L8TFBJNP/p1770801275267829

Misha requested deal-type exclusions as a new CRM property, in addition to existing industry exclusions. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1770870272407979
Misha also requested Source of Wealth enrichment for family office contacts via Clay. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1770870712579199
On February 19, Misha introduced two new system-level ideas: re-engagement sequences for unresponsive contacts and escalation to a different contact at the same firm if the primary goes dark. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1771511938334209
On February 20, Kellen shared a multi-tab Google Doc with cold lead list concepts for Sol-ti, Rimac, and Project Denali, along with a sample email copy draft for investor leads — the first full campaign brief. Misha confirmed Sol-ti as top priority and requested SoCal-targeted contacts. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1771545895895509
On February 24, Servando shipped behavioral scoring (interaction strength labels) and a new Atlas Docs site. He also began an experimental Parallel.io web integration for investor lead enrichment. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1771899484983439
Misha reacted:

"Ok, I didn't realize you built a whole book on Atlas! Awesome." https://controlthrive.slack.com/archives/C09L8TFBJNP/p1771904072066919

Servando and Kellen also aligned on a human-in-the-loop review workflow: Atlas outputs → client approves shortlist → approved names pushed to Clay. Two UI scenarios were mapped. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1771976358676449
On February 25, Kellen shared the first cold investor lead CSV for Sol-ti (institutional leads sourced via LinkedIn and Clay). Misha gave detailed feedback: no VCs, focus on family offices/RIAs/fund-of-funds/HNWIs, and add portfolio stage data. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1771988204785899
Servando published a Parallel.io integration analysis showing that ~38% of investor leads were low-context enrichment candidates and ~11% had no notes at all — confirming web signals as a strong use case. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1772033911308769
On February 26, Kellen proposed using Notion as a project management tool for tracking tasks and tickets. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1772121796754549

Phase 5: Alpha Releases & Shield AI (March 2026)

On March 3, Servando shipped Atlas v0.1.0-alpha.2 — hardened authentication, interaction strength labels, UI scoring controls, behavioral interaction tracking, and pipeline status removal. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1772562286094809
On March 4, Kellen shared investor lead campaign copy for multiple deals. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1772595018918979
On March 5, Servando shipped Atlas v0.1.0-alpha.3 — separate relationship volume/quality tracking, freshness multiplier, better handling of empty deal types, improved missing-data ranking, and firm name now shown before investor name in PDF results. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1772668420531729
On March 6, Servando shared screenshots of a new Atlas UI build, with Clay push functionality. Misha reacted:

"Ok that looks dope" https://controlthrive.slack.com/archives/C09L8TFBJNP/p1772753867587339

The same night, Misha announced he had landed the Shield AI deal:

"I just got another deal — ShieldAI... they power Anduril... This will be a hot issue!" https://controlthrive.slack.com/archives/C09L8TFBJNP/p1772836743310959

Kellen committed to having a Shield AI investor list ready by Monday.
Kellen also shared a contact deduplication approval list and an active investor / no-reply review list for Misha's sign-off. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1772771444519079
Misha approved duplicates but noted a data integrity issue: some active investors flagged as "no reply" actually had replies, just not logged correctly in HubSpot. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1772836207986089
On March 9, Misha reviewed Kellen's campaign copywriting and requested deduplication and enrichment be completed before his Miami trip (Wednesday). https://controlthrive.slack.com/archives/C09L8TFBJNP/p1773089711221489

Phase 6: CRM Cleanup, Atlas Improvements & Campaign Prep (March 10–26, 2026)

By March 10, the team was deep in HubSpot CRM data cleanup. Misha flagged active investors like Jim Kaplan, James Parker, Tony Ryerson, and Chris Cosmides as being misclassified as "Investor Leads." https://controlthrive.slack.com/archives/C09L8TFBJNP/p1773161863079169
Kellen traced the issue to HubSpot API permission limitations and Clay cell-size constraints, and committed to running a custom script to produce a corrected Active Investor list. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1773199131347839
On March 11, you (Servando) shipped Atlas v0.1.0-alpha.4 — UI v2 update with scroll fixes, improved notes/reasoning performance, and the Clay send button temporarily hidden pending confirmation. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1773201215797769
On March 16, you pushed two additional Atlas fixes: contact owner now displayed in search results, and Investor Lead searches no longer surfaced contacts from firms already having an Active Investor. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1773656593245729
On March 17, Kellen shared a ranked list of contacts for Active Investor conversion review and proposed using company-level attributes for institutional deal matching. Work began on a Clay description/enrichment agent. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1773766477283959
On March 19, you shipped Atlas v0.1.0-alpha.5 — better notes reasoning, investor lead suppression from firms with active investors, prompt optimization, and a model upgrade to gpt 5.4. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1773949983756759
On March 20–21, Kellen and Max built a fit-scoring system (yes/no/maybe) for institutional deals including WNBA, Atalanta, and X Games, sharing a first CSV sample for Misha's review. Misha clarified:

"They need to be asset managers, family offices (single and multi), HNWI… they can also be fund of funds. Not VCs." https://controlthrive.slack.com/archives/C09L8TFBJNP/p1774051304751549

On March 22–23, Misha conducted a deep manual audit of Atlas results, providing detailed product feedback: portfolio visibility, deal stage data, investor thesis enrichment, scalability to 200+ searches, and UI improvements (search history, owner filtering). Kellen set up a Notion workspace for campaign and task tracking. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1774208324037319
Misha also shared a pivotal commercial moment:

"I spoke today with a potential client… was able to say 'I am finalizing a proprietary system that will pursue high-volume targeted outreach'… and the guy didn't flinch." https://controlthrive.slack.com/archives/C09L8TFBJNP/p1774367844930199

On March 26, you shipped Atlas v0.1.0-alpha.6 — the biggest search improvement yet: better query understanding, support for more search scenarios, feedback capture, and reliability for large searches. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1774550840612759

Phase 7: Email Copy, Compliance & First Campaign Launches (March 31–April 7, 2026)

On March 31, Kellen dropped a major batch of email copy drafts for SailGP, Together AI, Shield AI, BZZR, Gilgamesh, and MidOcean, along with a shared email logging sheet. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1774938063644479
That same day, a critical compliance issue surfaced. Misha raised concerns that emails were being sent from a fake persona ("Jeff Stanton"), which would violate FINRA Rule 2210. He firmly required all broker-dealer outreach to be sent under real, licensed names. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1774983107212679
On April 1, you began end-to-end testing of the Atlas → Clay pipeline, sending 3 test investor records to Clay. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1775043638216469
On April 2, a key sync confirmed: compliance/archiving infrastructure in-progress, WNBA as priority campaign, and first launch target set for Monday April 6. You shipped Atlas v0.1.0-alpha.7 — major UI redesign, contact owner filtering, simplified co-investment categories, redesigned history panel with "Clear" option, and one-at-a-time Clay delivery for reliability. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1775149933301119
On April 3, Max shared the WNBA target contact list. Late that Friday, Misha introduced a new time-sensitive deal: AiOla — an enterprise AI voice infrastructure company backed by Blackstone CEO, Apollo Global CEO, Hamilton Lane, and other top-tier investors. The target window was 7–10 days. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1775252779073489
On April 6, you shipped Atlas v0.1.0-alpha.8 — HubSpot data ingestion fixes, industry taxonomy expansion, and more robust enum parsing. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1775480478016689
April 6–7 saw extensive back-and-forth on AiOla email copy. Misha pushed for emails that properly introduced MVV Capital and didn't lead with a deal pitch to cold contacts:

"Family offices get hundreds of unsolicited emails daily. They RARELY if ever take anyone seriously who is trying to hit it on a first date." https://controlthrive.slack.com/archives/C09L8TFBJNP/p1775527539154759


Phase 8: AiOla Campaign Execution & CRM Issues (April 8–13, 2026)

On April 8, Max shared a V1 target list for the Orreco deal. You shipped Atlas v0.1.0-alpha.9 — improved deal-type keyword detection, HubSpot rate-limit throttling, and redistributed scoring weights for missing deal data. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1775652720653299
A serious CRM integrity issue was discovered: someone had bulk-deleted contacts via HubSpot UI at 10:26am ET. Misha also flagged contacts still being incorrectly auto-promoted to "Active Investor" and incomplete industry data on Deal records. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1775682782347009
On April 9, Kellen confirmed the AiOla campaign was live and loading through Smartlead at limited rates (Microsoft: ~2–3/day, Google: ~10/day). https://controlthrive.slack.com/archives/C09L8TFBJNP/p1775701194843019
A significant back-and-forth occurred around email attachments and spam risk. Misha insisted attachments should have been included; Kellen and Ali explained the deliverability trade-offs and the "plain text first, attachments on reply" best practice. Misha clarified the AiOla list was existing relationships, not cold names. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1775769035522659
On April 10, you shipped Atlas v0.1.0-alpha.10 — full UI redesign, simplified intake/review flow, and firm description added to PDF exports. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1775826162465389
On April 13, Max shared target contact lists for 12 deals: WNBA, Orreco, Arkview, Atalanta, BZZR, Early Light, MidOcean, Rimac, SailGP, Shield AI, Together AI, and X Games. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776100326044109
Misha flagged the AiOla campaign had been "butchered": deals in the wrong pipeline, instructions not followed, no attachments, and VC contacts (like Softbank) still appearing in Together AI and Shield AI lists. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776106790588459

Phase 9: Positive Responses & Pipeline Refinement (April 14–17, 2026)

On April 14, Kellen reported the first positive response from AiOla :tada: and outlined the full reply workflow: positive replies flagged in Slack → Misha decides next steps → CRM deal moves forward → non-respondents eventually marked closed/lost. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776121491209449
Sue sent the WNBA contact list for Misha's final green light, and Kellen shared Relevance AI copy for review. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776198296157059
From April 15–17, Ryan posted a stream of +1 positive replies from the AiOla campaign:

* Konrad von Moltke (WISE Ventures) https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776281116096939
* Daniel Gay (KSV Global) https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776281420197569
* Teddy Schiff (Northwood Ventures) https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776282549567129
* Tom Uebel https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776282668613419
* Paul Lueb & Jay Gokhale (Maslow Wealth Advisors) https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776346269266809
* Trey Gill (Wasson Enterprise) https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776445893877519

On April 16, Ryan surfaced an inbound with detailed investor questions, asking Misha how to handle the reply. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776360743513459
On April 17, you shipped Atlas v0.1.0-alpha.11 — Excel shortlist export, hardened runtime secret loading, and upgraded notes model to gpt5.4 mini. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776438424879129

Phase 10: CRM Governance, Compliance & Automation (April 17–21, 2026)

Misha issued several important operational directives on April 17:

* Deal naming should be "Firm Name – Deal Name" not "First Name Last Name x Deal Name" https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776378045408349
* 14 stale contacts (people who left their firms) submitted for cleanup https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776378233161989
* Primaries pipeline to be used going forward https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776380868453789
* Clay sample search requested for public equity fund seed investors for a potential new client ($250M public equities fund) https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776452613789449

Kellen committed to completing all of the above before Monday: deal names fixed, pipelines merged into one view with tags, stale contacts adjusted.
A HubSpot workflow bug was discovered: a contact was being auto-promoted to "Active Investor" based solely on 5 outbound interactions with no actual reply. Kellen acknowledged the bug while noting he was in the ER after a seizure, but committed to a fix. The team showed grace. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776459230352849
On April 18, you raised a Clay webhook rate-limit issue causing errors. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776463529249559
Misha wrapped up the week with comments on all remaining deals, requesting the final WNBA copy and setting expectations for Monday. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776478650921599
On April 19, Misha shared strategic thinking about sports deal targeting — specifically how to approach family offices with no prior sports exposure, using source of wealth, background, and esoteric asset appetite as filters. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776611706956959
On April 20, Kellen shared a Clay sample CSV of US public equity seeders for Misha's new potential client review. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776653647434549
Also on April 20, Misha issued a 7-point operational directive to Ryan covering: disclaimer language in all outbound emails, HubSpot BCC email logging, deal pipeline and stage management, removal of stale contacts, and ensuring Misha's personal email is always CC'd on replies. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776691853703759
On April 21, Kellen surfaced a contact with an invalid email (Ron Geffner) and proposed a "dated email" re-engagement copy template for contacts whose emails have bounced. https://controlthrive.slack.com/archives/C09L8TFBJNP/p1776746087776879

Atlas Release Timeline

Version
	Date
	Key Highlights

v0.1.0-alpha.2
	2026-03-03
	Hardened auth, interaction strength labels, behavioral tracking, UI scoring controls

v0.1.0-alpha.3
	2026-03-04
	Freshness multiplier, empty deal-type handling, missing-data ranking, firm name in PDF

v0.1.0-alpha.4
	2026-03-11
	UI v2, scroll fixes, notes/reasoning performance, Clay button hidden pending confirmation

v0.1.0-alpha.5
	2026-03-19
	Better notes reasoning, investor lead suppression, prompt optimization, gpt 5.4 model

v0.1.0-alpha.6
	2026-03-26
	Better query understanding, more search scenarios, feedback capture, large-search reliability

v0.1.0-alpha.7
	2026-04-02
	Full UI redesign, owner filtering, co-invest categories simplified, one-at-a-time Clay delivery

v0.1.0-alpha.8
	2026-04-06
	HubSpot ingestion fixes, industry taxonomy expansion, robust enum parsing

v0.1.0-alpha.9
	2026-04-08
	Deal-type keyword detection, HubSpot rate-limit throttling, scoring weight redistribution

v0.1.0-alpha.10
	2026-04-10
	Full UI redesign, simplified intake/review flow, firm description in PDF

v0.1.0-alpha.11
	2026-04-17
	Excel shortlist export, hardened runtime secrets, gpt5.4 mini for notes


