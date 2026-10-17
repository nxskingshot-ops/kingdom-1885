# PHALANX — cross-alliance read-access decision (2026-10-17)

## Approved in principle
Product owner authorizes eligible PHALANX members to read cross-alliance comparison information for NXS, FRA, OoO and MYM, CONDITIONAL on a separate review of fields, roles and security before production.
This is NOT approval for deployment, private player/account disclosure, or database policy changes.

## Data-category review matrix (proposals, NOT yet released)
| Data category | Proposed visibility | Status |
| --- | --- | --- |
| Alliance aggregates: power, member counts, castle and Truegold distributions, trends | Eligible members across the four alliances | Field-level review pending |
| Public in-game Top40 rankings, player display names and in-game statistics | Consider limited access after source and scope validation | Separate explicit review pending |
| Outpost tactical reports, opponent scouting, activity intelligence, transfer evaluations | Module-specific authorized roles only | NOT approved |
| Private account snapshots, personal progress, internal notes, invitations | Account owner only by default | NOT approved |
| Emails, auth IDs, tokens, sessions, payment and real-world personal data | Exclude entirely from alliance reports | NOT approved |

## Mandatory controls before any live integration
- Define eligible roles and active/unexpired membership semantics, including revocation.
- Inspect exact columns and sources in phalanx_alliance_latest and phalanx_alliance_top40.
- Current phalanx_can_read_alliances() is a global NXS membership gate, not per-alliance row isolation; validate this against intended access.
- PYLON IX must inherit the signed-in user's permissions; never use service-role credentials or privileged bypass.
- Review Discord/chat exports, cache, local storage and historical reports for data leakage.
- Run independent positive and negative RLS probes with two dedicated, authorized test identities and known visible fixture rows.
- Obtain explicit owner approval of concrete fields and roles before activating live data.

## Hard boundaries
No production deployment, database mutation, RLS policy edit, data migration, live-data approval, or FREEZE change under this decision.
Only documentation, offline fixtures and non-production checks are authorized until gates are satisfied.
Source: explicit product-owner decision on 2026-10-17.