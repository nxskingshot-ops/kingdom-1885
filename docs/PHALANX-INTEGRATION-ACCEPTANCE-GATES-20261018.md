# PHALANX — Integration acceptance gates (2026-10-18)

Status: OPEN. No production approval.

## Verified repository artifacts (read-only fetch on alpha branch)
- `preview/PHALANX_RC5_ALPHA_DERIVED_20261017.html` — exists, Git blob `491a89a2a1ea5aa13ec6150d8f78fa8e93b6fb14`.
- `preview/PHX-OUT-024-MAP2-FROZEN-20261018.html` — exists, Git blob `80cb3565ac8d12ea82a425e106096091e85878e8`.
- `data/outpost-map-alpha24-canonical-lock-20261018.json` — exists, Git blob `67d78e63a9aca194193c3703c150a68639f83eb5`.

## Mandatory acceptance gates
1. Exact canonical OUT-024 SHA-256 must match the Library original. Git blob SHA is NOT SHA-256 of file contents.
2. HOME original and current 2026-10-16 HOME/Header decisions must be reconciled without silently replacing either.
3. All 74 historical feature IDs must be mapped to current source location, integration route, test case, and explicit status. `UNKNOWN` is permitted, silent assumptions are not.
4. RC5 navigation must have a click-and-return test for every intended route. A page merely loading is insufficient.
5. All 26 live Edge Function sources require independently stored, access-controlled, secret-reviewed backups and an isolated restore drill.
6. CI must fail closed on missing canonical files, hash mismatch, broken routes and unauthorized FREEZE changes.
7. No merge to main or production deployment without explicit user authorization.

## Current limitations
Repository artifact existence and historical Android screenshots are not live end-to-end test evidence. Historical 422-entry GitHub inventory is a 2026-10-14 snapshot only. This document is an acceptance contract, not an assertion that the gates are implemented.
