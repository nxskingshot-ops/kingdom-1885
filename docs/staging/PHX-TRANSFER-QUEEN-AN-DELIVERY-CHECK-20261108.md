# PHALANX Transfer Scouting — Queen An delivery gate (2026-11-08)

## Scope and protection
Repository nxskingshot-ops/kingdom-1885; isolated feature branch work/truepower-pylon-verdict-20261108. Do not merge to stage/transfer-live-rankings-20261103 or change protected design FREEZEs without release approval. No data writes or schema changes were performed in this audit.

## Verified (2026-11-08)
- Vercel isolated preview READY, runtime commit bb21ac76c4f0f71841c7b85f6c554462f7a18797.
- Preview HTML, JS, account-assessment JS, display JS, CSS all returned HTTP 200.
- Android screenshots from the project conversation demonstrate ID lookups and distinct PYLON assessments for KomaR (290591005) and KingoftheHill (293285312), including True Power color matching Average for KingoftheHill. These are limited manual observations, not comprehensive regressions.
- Supabase Edge Function phalanx-transfer-intelligence-stage-20261031 version 8 ACTIVE with JWT and membership check; player ID fallback previously verified v19. No new Edge Function deployment.
- Supabase read-only query: latest stored capture for all inspected ranking boards = 2026-11-08 01:14:33.348+00. Latest row creation = 2026-11-08 10:00:08.986985+00. Ingestion time is not measurement time.
- Frontend playerSummaryMetrics selects newer Total Power for headline, but calculates True Power only from a Total Power / Troop Power pair with exactly matching capture time and source; never substitute a mismatched headline value.
- Kingdom intelligence backend first requests MightPulse provider and falls back to most recently created saved snapshots. It does not guarantee the fallback is the newest capture timestamp in all possible ingestion orders. This remains a freshness audit item.

## Not verified / delivery blockers
- Queen An's own authenticated access and authorization to the protected rankings and player lookup APIs: NOT TESTED. Do not advertise public/no-login access.
- Current live provider freshness versus stored snapshots: NOT TESTED with an authenticated user session. The API can fall back to saved capture.
- End-to-end save/reload of candidate data, roles, export/backup, alliance tiles, and cross-kingdom lookup: NOT TESTED in this audit.
- Navigation, mobile regression across devices, security and access roles, and all color categories: NOT TESTED in this audit.
- No evidence of production readiness or a complete release. No staging merge.

## Minimum release decision
Use isolated preview only as an explicitly labeled TEST / operational preview, subject to verified Queen An login and at least one end-to-end candidate lookup and saved-record reload. Show source capture timestamps. If access fails, STOP and repair authorized access without relaxing JWT or membership controls. Merge to staging only after recorded acceptance and regression evidence.

## Isolated preview
https://phalanx-r11-atlas-preview-git-work-truepo-13a8b9-matze4428-6040.vercel.app/deploy/phalanx-kvk-test/pylon-ix/transfer-scouting-id-stage-20261030.html

## Additional static functional audit (2026-11-08, pre-release)
- Frontend module JS syntax: PASS using AsyncFunction after stripping ES imports/exports for parsing only. Assessment and display helper JS syntax: PASS.
- DOM contract: PASS for 68 unique `$('id')` references; all resolve to one of 87 HTML IDs in the deployed HTML source. This does not prove runtime handler success.
- Forms identified: authForm, phxIdForm, internalIdForm, candidateForm; all four have registered submit handlers in source: PASS static wiring.
- Candidate save path: source calls Supabase `transfer_candidates` insert/update and then `load()`; actual authorization, RLS, persistence and reload: NOT TESTED.
- CSV export: source constructs Blob and browser download; actual Android download and file contents: NOT TESTED.
- Protected #1885 rankings: source fetches Edge Function with session bearer token, no-store; access for Queen An: NOT TESTED.
- Latest saved rankings: all inspected boards have source capture 2026-11-08T01:14:33.348Z, while database `created_at` was 2026-11-08T10:00:08.986985Z. The latter must never be represented as the capture time.
- Freshness risk: intelligence Edge Function uses `created_at desc` to choose saved fallback, rather than `source_captured_at desc`; later reingestion of older captures could supersede newer measurements. This is a concrete LIVE DATA FIRST release risk; no production function change performed.
- Deployment check: READY commit bb21ac76c4f0f71841c7b85f6c554462f7a18797; five directly fetched preview assets HTTP 200.
- This is source/static and read-only integration auditing, NOT a complete user-journey test. Release gate remains CLOSED.
