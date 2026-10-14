# PHALANX Top-40 authorization diagnostic review — 2026-10-14

Read-only source review. No live user-session test or production change.

## Cross-check
- `preview/phalanx-readonly-access-check-20261014.html` checks authenticated `HEAD SELECT count` against `phalanx_alliance_players` and `phalanx_alliance_snapshots`, but **not** `phalanx_alliance_top40` or `phalanx_alliance_latest`. A green result there cannot establish access to the two views used by Top-40 UI.
- The diagnostic uses `head:true,count:'exact'`; success only establishes that the request was accepted. Zero visible rows can still mean an RLS filter; it does not establish visibility of a complete snapshot.
- `integration/alliance-adapter-contract-test.mjs` is explicitly mocked and checks one sample row, not 40 rows or current date; it cannot establish live authorization or snapshot completeness.
- `integration/phalanx-alliance-intelligence-2026-10-13.md` states authenticated/anon SELECT was not granted at the documented checkpoint. Current grants were not retrievable, so this is a historical checkpoint, not a current proof of denial.
- Supabase table inventory confirms base tables exist and RLS is enabled, but does not include view grants.

## Recommended isolated diagnostics
1. Reuse an existing authenticated session; request `head:true,count:'exact'` for both `phalanx_alliance_latest` and `phalanx_alliance_top40`; report only error code and counts, no names or IDs.
2. Check current membership validity, and separately test unauthenticated access to ensure no private data leaks.
3. Require four distinct alliances and exactly 40 unique ranked positions each on one complete snapshot date.
4. Compare the date used by overview cards and Top-40; reject mixed dates.
5. Preserve existing UI and do not grant SELECT broadly just to make the test pass.

## Result
Source inspection complete; live effective authorization **NOT VERIFIED**. No change to production or to the freeze.
