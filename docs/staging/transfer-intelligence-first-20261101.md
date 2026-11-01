# PHX Transfer Scouting — Intelligence-first dossier (01.11.2026)

Status: DESIGN APPROVED; IMPLEMENTATION NOT YET VERIFIED. Isolated branch only.

## User decision
Replace the initial six-number dashboard with a decision-oriented player dossier. Above the fold: identity, kingdom/alliance, Castle/Truegold, Total Power, True Power, an evidence-based account assessment, target-alliance placement, likely combat role, and confidence/coverage. Master, Hero, Pet power and detailed rankings remain accessible as expandable evidence, never deleted.

## Evidence and calculation guardrails
- Preserve source timestamps, raw exact numbers, UID identity and unknown/null states. No invented values, synthetic combat winner, official Mystic formula or inferred role from power alone.
- Assess relative strengths and weaknesses only against comparable recorded peers with the same metric definitions. Label sample size, coverage, snapshot date and target alliance.
- Top-15 position requires a complete and verified target-alliance roster (or explicitly label as 'within observed sample', never an exact alliance rank). Current 274-player #1885 Top-100 union is not a full kingdom census.
- Role suitability: Rally Leader, Rally Joiner, Garrison Holder, Support. Only assign confident role when relevant validated attributes exist; otherwise 'insufficient evidence'. Explain positive/negative evidence and confidence.
- Display compact narrative first, with transparent expandable supporting metrics. If comparison is not ready, show 'Assessment pending comparison' rather than fabricate a verdict.
- Default comparison should select an appropriate strong reference player only when the target alliance and comparable data are known; show the selected comparator and allow changing it.

## Protection
No changes to UNIFIED HEADER V2, HOME, Epic Navigation, PYLON IX, Atlas, candidate records, auth, roles, quotas, Supabase schema, Edge functions or Vercel production. No costs. This branch is a protected starting point; no deployment or production merge authorized.

## Acceptance gates
1. Mobile first-view density and readability on actual Android.
2. Correct no-comparison and partial-data states.
3. Real peer comparison, same-metric timestamps and confidence.
4. Roster incompleteness cannot produce fabricated Top-15 rank.
5. No data writes from read-only lookups; candidate saves/loads unchanged.
6. Full regression suite including identity, auth, export, navigation, desktop/mobile, and protected design.
7. Preview-only deployment and user acceptance before merge.

## Evidence status
Baseline source: stage/transfer-id-lookup-20261030; c40fc53 and follow-up documentation commit. Earlier 64 automated tests are historical, not tests of this new design. No new UI tests, Android acceptance, backup restore or deployment has been performed for this change.

## Mandatory transfer-rule engine (user requirement, 01.11.2026)
Keep account strength and transfer eligibility as separate assessments. First-view eligibility must display: Kingdom #1885 transfer group (verified group and season), current official Power limit and which Power definition applies, ordinary vs special invitations and remaining quotas if authoritative, candidate eligibility, transfer window, and rule source with timestamp. Existing 170 M threshold is PROVISIONAL ONLY and must never be labeled official. Do not assume Total Power or True Power is the official invitation metric. Include group compatibility, kingdom age/state, cooldowns, restrictions and any event-specific rules only where verified. Unavailable inputs => UNKNOWN / NEEDS VERIFICATION, not eligible or ineligible. No invitation allocation, transfer action or permissions change without explicit authorization. Transfer-rule source verification and scenario tests are mandatory before release.

## Transfer-rule evidence correction — 01.11.2026
Public source https://kingshot.net/transfer-history (checked 01.11.2026) shows LAST LISTED September 13–19, 2026 event: #1885 falls in Group 10, kingdom range 1884–1993, displayed power-cap pair 130M / 84.5M, TG5 Gen3. The page explicitly warns projected ranges can shift. These are historical/community figures, NOT confirmed November 2026 settings. Previously discussed 'November Group 7 / 1690–1935 / 200M / 130M' is NOT substantiated by this source and must NOT be presented as verified. Do not assign meaning to the two cap figures without evidence.
Official https://centurygames.helpshift.com/hc/en/140-kingshot/section/1548-kingdom-transfer/ confirms King-selected cap, special vs ordinary invitations, maximum three special invites, 25-day cooldown, 1–50 transfer passes and current schedule via in-game announcements. Target kingdom group, Leading/Ordinary status, active cap, invitations and available slots for #1885 are UNVERIFIED for November. Implement versioned event rule records with source URL, observation timestamp, event dates, verification state and explicit unknowns. Do not infer eligibility from Total/True Power. Any transfer assessment must fail closed to 'needs verification' for unknown active limits, source kingdom compatibility or invitation quotas. No production DB migration, endpoint or UI modification performed in this documentation commit.

## Approved forecast wording — 01.11.2026
User approved planning display of November 2026 community forecast, clearly marked **PROGNOSE / VORAUSSICHTLICH**, never official. Forecast: Group 7; kingdoms 1690–1935; reference caps 200M ordinary and 130M leading; expected event 8–14 November 2026. Display source, observation date and caveat that actual #1885 classification, effective cap, invite inventory and final group remain unconfirmed. Do not issue definitive eligibility verdicts from forecast values. When verified in-game event data arrives, update the versioned event record, preserving forecast history. Approval here is for forecast labeling/requirements, not for production deployment or data migration.

## Language requirement — 01 Nov 2026
User explicitly requests **English-only for all PHALANX Transfer Scouting user-facing UI, labels, assessment narratives, forecast notices, status messages and exports for now**. Preserve existing DE/FR localization capabilities; do not delete translations or change frozen shared header. Default new transfer intelligence UI to English. Approved forecast display text: 'EXPECTED TRANSFER RULES · NOVEMBER 2026', badge 'FORECAST — NOT CONFIRMED', 'Expected Group 7', 'Kingdoms 1690–1935', 'Ordinary reference 200M', 'Leading reference 130M', 'Expected window 8–14 Nov 2026'. Disclaimer: 'Community forecast only. Kingdom #1885 classification, active entry power cap, invitation inventory and final event rules are not yet confirmed in-game.' Candidate verdicts: 'Likely within ordinary cap', 'Special invitation may be required', 'Insufficient information'. Never present forecast as definitive eligibility.

## PYLON IX integration requirement — 01 Nov 2026
User clarified: PYLON IX must be integrated INTO the Transfer Scouting module, not merely preserved on HOME. Implement as the PHALANX Intelligence Assistant within the existing player dossier/comparison workflow, with English-language UI. Intended duties: concise grounded candidate assessment, strengths/weaknesses, estimated alliance placement (top 15 or beyond), proposed rally leader/joiner/garrison role, and forecast-vs-confirmed transfer eligibility explanation. Always explain evidence and unknowns; no invented metrics or definitive transfer verdict from forecasts. Preserve approved PYLON IX emblem (red round shield, gold lambda, laurel and IX) and its design FREEZE; reuse verified existing assets, no replacement artwork. Do not modify frozen HOME or navigation. Integration, accessibility/mobile presentation, data source linkage and regression tests remain required before marking done. This entry documents user intent only; no UI implementation claimed.

## Wiring-first integration rule — 01 Nov 2026
User reiterates agreed architecture: **lay all cables now**, not a decorative PYLON IX placeholder with missing backend integration later. Transfer Scouting must plan and implement its PYLON IX integration end-to-end as one coherent, freeze-safe work package: real player ID lookup and ranking provider, comparison player and alliance top-15 cohort, evidence/provenance timestamps, account scoring with confidence and missing-data handling, projected rally leader/joiner/garrison roles, versioned transfer forecast and confirmed rules, permission-safe access, English UI, and PYLON IX assistant input/output contract. Keep source adapters modular and do not invent data or create unapproved costs. Verify existing APIs, assets, auth and repository state before code changes. Protect frozen emblem and other modules. Acceptance requires tests for data flow, error/unknown cases, mobile and regressions, not just visual UI. Document status honestly; this note is not proof of completed integration.
