# PHALANX MightPulse data inventory — 2026-10-14
Status: READ-ONLY verified database inventory; no UI or production changes.

## Current Supabase tables (estimated counts from metadata)
- public.phalanx_mightpulse_poll_runs: 17
- public.phalanx_mightpulse_rank_snapshots: 256
- public.phalanx_alliance_players: 395
- public.phalanx_alliance_snapshots: 4
Counts from metadata are approximate and can change.

## Latest board snapshot audit (SQL verified)
- 16 boards, 100 entries each, 1,600 total ranking entries.
- Source captured_at for all latest boards: 2026-10-14 00:37:52.362 UTC.
- 14 player ranking boards: 1,400 entries, **242 distinct UIDs**, zero missing UID.
- 2 alliance ranking boards: 200 entries; no player UID/governor ID expected.
- Across all 16 boards, 241 distinct governor IDs; 201 entries without governor ID: 200 alliance ranking entries and 1 kills entry (that kills entry does have UID).
- All latest entries examined are for one kingdom: #1885. Cross-kingdom automatic comparisons are NOT yet proven available.
- Repeated rankings of the same player are not distinct players.
- All observations are source-capture snapshots; poll freshness is not source freshness.

## Boards
alliance_kills, alliance_power, building_power, gov_charm, gov_gear, hero_equip, hero_no_equip, hero_total, kills, master_power, mystic_trial, personal_power, pet_power, research_power, town_center, troop_power.

## Observed JSON keys (examples)
Player records: aid, kid, uid, rank, score, nick_name, avatar_url, governor_id, alliance_abbr. Town center records also contain town_center_level.
Avoid treating score as the same metric across boards. For user identity prefer uid (with kingdom context); do not infer equivalence between UID and governor_id.

## Safe follow-up work
1. Define board-specific metric units, meanings, and sorting semantics.
2. Create read-only per-player cross-board join keyed on (kid,uid) for 14 player boards.
3. Separate alliance ranking data by alliance identity; do not join to player IDs.
4. Audit latest source freshness and whether successive snapshots actually changed.
5. Validate rank-depth and concentration summaries against source data before connecting existing frozen cards.
6. For Head-to-Head, acquire same-metric, same-depth, comparable-timestamp data for opponent kingdom; otherwise mark opponent as unavailable.
7. Respect existing private roster RLS and frozen KvK layout. No production writes, no secrets, no new UI until explicit approval.
