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
