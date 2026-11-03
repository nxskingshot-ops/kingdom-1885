# PHX Transfer Assessment – Integration Gate 2026-11-03

Status: DEVELOPMENT ONLY. No merge, deployment or live data writes.

## Verified source
- Working Android preview: existing Vercel transfer deployment (user-confirmed link and authenticated ID lookup).
- Existing UI entrypoint: preview/transfer-scouting-id-stage-20261030.{html,js}; keep intact.
- Existing read-only #1885 index and per-player lookup already exist in that JS. Do not replace with simplified demo.
- Historical internal index: 274 entries on 2026-11-01, explicitly not a complete kingdom census. No proof of full NXS roster completeness or synchronized current snapshot.
- Ranking scores are provider metrics, not independently validated combat capability. Cross-kingdom rank numbers cannot be compared directly.

## Assessment module
- preview/transfer-assessment-20261103.js (new, isolated)
- tests/transfer-assessment-20261103.test.mjs (seven test cases, not yet executed)
- Strongest/weakest measured ranks and tentative role signals; no combat-role certainty.
- Closest power comparator only among measured available entries; label capture freshness and incompleteness.
- Exact alliance placement is withheld without explicit completeness attestation, expected member count, unique IDs, one alliance and common capture stamp.
- A supplied completeness flag alone is NOT independent evidence of a complete roster; verify the upstream roster source before enabling exact ranks.

## Mandatory next integration gate
1. Obtain verified authoritative complete alliance roster and snapshot metadata. Current partial index must never be labeled complete.
2. Run Node tests, then additional tests for unknown/mixed source times, ties, duplicates, missing values and provider failures.
3. Add the module into the existing dossier using a scoped UI section; preserve all four dossier tabs, candidate persistence, search, individual #1885 comparison, CSV, login and permissions.
4. Regression-check on mobile and desktop, including logout, session expiry and refresh.
5. Publish only isolated preview after tests and permissions checks. Never change main or existing working deployment.
6. Record deployment URL, exact commit and verified live checks.

## Evidence status
GitHub source files and test definitions: PRESENT.
Node test execution: NOT TESTED.
UI integration: NOT IMPLEMENTED.
Live alliance placement: NOT TESTED.
Backup integrity / restore: NOT TESTED.
Production change: NONE.
