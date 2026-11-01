# SEA WORLD V2 — Top-200 calibration audit (2026-11-01)

Status: REFERENCE AUDIT ONLY — NO FINAL CALIBRATION / NO FREEZE

## Scope and provenance
- Kingdom: #1885.
- Reference selection: 100 players from latest personal_power Top 100 snapshot (2026-11-01 00:31:29.925 UTC), plus 100 highest available power values from historical alliance snapshots (latest alliance date 2026-10-13), excluding IDs already in current Top 100.
- Result: 200 unique player IDs. Minimum selected power 99,172,887 (mixed-date selection; **not** a verified current Kingdom rank #200).
- The database has 395 unique alliance players with power values and 100 historical KvK roster players with power values.
- Rankings are Top 100 per board, not all-player coverage. Missing from Top 100 is **not** zero power or necessarily a known exact rank.

## Latest ranking coverage among selected 200
| Board | Players with ranking |
|---|---:|
| mystic_trial | 89 |
| hero_total | 86 |
| hero_equip | 85 |
| gov_gear | 80 |
| gov_charm | 87 |
| master_power | 77 |
| pet_power | 65 |
| research_power | 84 |
| personal_power | 100 |
| troop_power | 99 |

Eight weighted rank-board coverage distribution (excluding True Power):
| Number of rank boards | Players |
|---:|---:|
| 0 | 47 |
| 1 | 26 |
| 2 | 22 |
| 3 | 20 |
| 4 | 16 |
| 5 | 13 |
| 6 | 19 |
| 7 | 16 |
| 8 | 21 |

56 of 200 have 6–8 of the eight ranking boards. 73 have 0–1.
True Power requires same-capture Total Power and Troop Power; this audit has not yet verified that pairing for the selected population.

## Current V2 weights (unchanged)
Mystic Trial 20; Hero Total 10; Hero Equipment 10; Governor Gear 10; Governor Charms 10; Master Power 15; Pet Power 7.5; Research Power 7.5; True Power 10. Total 100.

## Safety rules and unresolved work
1. Keep ranking-missingness as unknown; do not substitute rank 101, zero score, or a weak tier.
2. Distinguish dated historical selection from current leaderboard ranks.
3. Verify comparable True Power snapshots and baseline from the actual selected cohort.
4. Evaluate lower/upper score intervals, tier stability and coverage by player; report tier distribution only for sufficiently evidenced profiles.
5. Compare known reference accounts and inspect outliers before proposing changed tier boundaries.
6. No production deployment, database write, FREEZE, or approved final stars from this audit.

Read-only SQL evidence collected during this session; no database rows modified.
