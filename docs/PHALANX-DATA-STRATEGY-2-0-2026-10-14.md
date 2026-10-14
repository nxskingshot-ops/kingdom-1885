# PHALANX Data Strategy 2.0 — 2026-10-14
Status: analysis / planning only. No production or frozen UI changes.

## Grounded starting point
- Isolated MightPulse status/menu/refresh tests passed on Android, including return navigation; see PHALANX-MIGHTPULSE-INTEGRATION-TEST-FREEZE-20261014.md.
- Polling covers 16 ranking boards and up to 100 entries per board; this does NOT imply 1600 unique players or 1600 independently verified game profiles.
- Historical Supabase poll snapshots support future comparisons, but polling timestamps and source capture timestamps are different; repeated identical source timestamps are not fresh game observations.
- Existing verified snapshots and source contract: data/kvk-opponent-intelligence-current.json (2026-10-04).
- Frozen KvK layout: docs/KVK_INTELLIGENCE_LAYOUT_FREEZE_2026-10-03.md.
- Command Center release audit: data/phalanx-command-center-integration-audit-2026-10-12.json, NOT_RELEASE_READY.
- Computational Intelligence milestone: docs/NEXUS-PHALANX-COMPUTATIONAL-INTELLIGENCE-MILESTONE-2026-10-12.md; hero combat predictions remain uncalibrated.

## Priority mapping — preserve existing cards
1. Kingdom Head-to-Head: same-metric comparisons at matching rank depths (1/3/5/10/20/40/100 only where available); show source, capture timestamp, completeness, coverage.
2. Mega-Whale: profile top players across available independent ranking dimensions; no false conversion from public Power to in-game Personal Power.
3. Depth Comparison: rank-distribution and top-N concentration; no extrapolation beyond available ranks.
4. Players to Watch: historical change only after source timestamp or verified underlying data changes; identity resolution required.
5. Alliance Structure: reconcile roster identities/tags and rank memberships, handle renames/transfers, avoid double counting.
6. Matchmaking Risk: exploratory composite score with documented weights, uncertainty and missingness; never present as proven official matching formula.
7. Battle Readiness: internal planning data only; rankings are contextual, not evidence of current troop readiness.
8. Hero Intelligence: separate data/model validation stream; MightPulse rankings do not prove hero skills or battle mechanics.

## Data quality gates
- Canonical ranking metric definitions and units per board; prevent cross-metric substitution.
- Stable player identity matching via verified IDs when possible; names alone can collide/change.
- Distinguish captured_at, fetched_at, inserted_at and observation dates; retain provenance and source age.
- Record board coverage, missing entries, ties and confidence; avoid fake precision.
- Snapshot deduplication and trend alerts only for genuinely changed observations.
- Test authorization, rate limits, fetch failures and mobile layout in staging.
- No secrets in client code; no changes to frozen master without explicit release approval.

## Next isolated deliverable
A read-only data inventory/metric mapping and sample Head-to-Head/Depth Comparison calculations from actual stored records; compare to the existing contract before proposing a UI change. Production remains untouched.
