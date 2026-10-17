# PHALANX — kingdom alliance coverage and data classification audit

Date: 2026-10-17. Scope: read-only schema/aggregate inspection; no member/player rows inspected.

## Verified current coverage (kingdom 1885)
- phalanx_alliance_latest: 4 rows / 4 distinct alliances: FRA, MYM, NXS, OoO (one row each).
- phalanx_alliance_top40: 160 rows / 4 distinct alliances.
- These views do not currently provide kingdom-wide coverage. Do not infer that only four alliances exist.
- Additional alliance support in isolated readers/mappers requires explicit approvedAlliances allowlists; no wildcard or automatic blanket access.

## Existing view columns and classification
| View | Columns | Handling |
| --- | --- | --- |
| phalanx_alliance_latest | snapshot_date, kingdom, alliance, members, total_power, tg5, tg4 | Aggregate candidate for reviewed member-wide access |
| phalanx_alliance_latest | source_label | Provenance; review source confidentiality before displaying |
| phalanx_alliance_top40 | snapshot_date, kingdom, alliance, power, tg_level, alliance_rank, position | Player-level game statistics; separate owner field review required |
| phalanx_alliance_top40 | player_id, player_name | Player identifiers; separate privacy/access approval required |

## Verified engineering status
- Isolated mapper and bridge accept reviewed additional alliance scope, default Top 4.
- Isolated Top40 reader accepts reviewed additional alliance scope, default Top 4.
- Top40 offline mock test file and CI job entry added; CI success is NOT yet independently verified.
- RLS real two-role signed-in test remains BLOCKED until dedicated sessions and known positive fixtures exist.

## Release gates
1. Define trusted kingdom-wide alliance data ingestion and snapshot freshness/coverage semantics; do not invent missing alliances or statistics.
2. Approve exact player-level Top40 fields separately from aggregate access.
3. Verify signed-in RLS with dedicated authorized/unauthorized test accounts and confirmed fixture visibility.
4. Verify PYLON IX uses caller's effective permissions and exports cannot leak restricted fields.
5. Explicit production approval, preserving all existing FREEZEs. No migrations, writes, or policy changes under this audit.