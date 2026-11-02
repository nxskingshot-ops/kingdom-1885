# PYLON IX — KvK Intelligence / learning register
Status: SPECIFICATION ONLY. No automatic collection, database migration or production deployment authorized.
Branch: phalanx-cloudflare-test-deploy

## Queen An's principle
"Ignore the Red Dots": an available upgrade is not an instruction to spend immediately. Saving for the next KvK Prep begins after the prior KvK. Protect battle-critical upgrades. Check live event rules; never double-count one upgrade.

## Lothlorien reference (user-reported, not independently verified)
Transferred to kingdom 1885 in first transfer period at TG4; heroes and equipment were already very strong. Intentionally saved upgrades, then progressed to TG5 5/5 during KvK Prep, achieving a major Prep contribution and ranking jump. The signal is unusually strong core development with relatively delayed castle/TG progression; not a proven intention for other players.

## Signals to monitor
1. Combat-development proxy: comparable hero, equipment, research, gear, charms, troop, castle and true-power metrics. Do not equate this with verified battle performance.
2. Prep contribution: use actual personal KvK Prep scores when available; otherwise label power/rank deltas as proxies, never Prep points.
3. Strategic timing: compare pre-Prep, during-Prep and post-Prep snapshots over multiple cycles; describe observations, not psychological intent.
4. Pet Power: absent or low ranking alongside strong core categories can be a hypothesis of delayed pet upgrades; missing ranking does not prove outside Top 100, poor pet buffs, or saved materials.

## Data model proposal (not implemented)
Append-only player_snapshot: player_id, kingdom_id, observed_at_utc, source, source_captured_at_utc, kvk_cycle_id, phase, metrics, ranks, castle_tg, data_quality, provenance.
Append-only prep_result: player_id, kvk_cycle_id, day, points, verified_source.
Derived insights must link to underlying snapshots, show coverage and uncertainty. Deduplicate by player/source/source timestamp; never replace original records.

## Analytical rules
Compute deltas only for matching player IDs and metric definitions. Do not infer a missing value as zero or a missing rank as >100. Compare against cohort/kingdom with matching snapshots. Do not estimate spending in euros/dollars from power. Separate observed, inferred and user-reported evidence. Do not score strategic discipline from one snapshot.
Castle/TG gap is an independent signal requiring castle-level input; do not substitute pet ranking for it.
Respect existing scoring FREEZEs: add advisory intelligence separately until approved.

## Implementation gates
Inspect actual provider terms, available history and current Supabase schema/RLS first. Define retention, data access, schedule, rate limits, cost ceiling, backfill and rollback before enabling collection. No production write, new cost or permission changes without approval. Validate capture, replay, idempotency, rankings, mobile view and regression. Record tests as passed/failed/not tested.
