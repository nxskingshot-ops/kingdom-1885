# PHALANX 14-dimensional player profile audit — 2026-10-14

Read-only analysis of source-captured MightPulse boards from 2026-10-14 00:37:52.362 UTC. Kingdom #1885 only. No changes to production app or frozen layouts.

14 player boards (top 100 each) contain 1,400 entries, mapping to 242 UIDs. 15 players appear in all 14 rankings. Missing from top 100 is NOT equivalent to zero strength. Rank comparisons are descriptive only, not combat predictions.

## FaQu (NXS), complete 14/14
| Board | Rank | Raw score |
|---|---:|---:|
| personal_power | 21 | 177040034 |
| troop_power | 19 | 110396792 |
| pet_power | 8 | 9202680 |
| gov_gear | 40 | 7543920 |
| gov_charm | 43 | 7686000 |
| hero_equip | 47 | 8303815 |
| hero_no_equip | 60 | 14796430 |
| hero_total | 48 | 23100245 |
| research_power | 36 | 4449004 |
| master_power | 43 | 7850200 |
| mystic_trial | 32 | 1141 |
| kills | 31 | 17208585 |
| building_power | 34 | 6811193 |
| town_center | 31 | 52 |

## Interpretation
FaQu's pet power is top 10 while hero equipment and hero without equipment rank substantially lower. These are separate dimensions with different score units; do not sum or average raw scores or assume rank gaps equal combat power gaps.

## Proposed isolated profile UI
- Select player (search by display name, resolve internally by kingdom+UID).
- Display 14 per-board ranks and raw values, labeled units.
- Coverage indicator (e.g. 14/14), source capture timestamp and stale warning.
- 'Not in Top 100' for missing entries, never display zero.
- Five descriptive groups: overall/troops, durable growth, heroes, activity, progress; categories stay individually visible.
- No invented composite score, match prediction, or production integration.
- Mobile portrait and frozen Command Center UI must remain unchanged until separately authorized.

## Validation next
Run the same audit for remaining 227 players, check metric semantics and source freshness, then implement a separate mobile preview only.
