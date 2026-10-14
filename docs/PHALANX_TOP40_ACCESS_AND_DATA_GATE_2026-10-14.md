# Top-40 release gate: data vs authorization — 2026-10-14

Read-only verification. No production changes.

## Source cross-check
- `preview/phalanx-top40-v5.html` binds a click listener before async initialization, but requires exactly 40 rows for a hard-coded 2026-10-13 date.
- `integration/alliance-top40-reader-test.mjs` also defaults to 2026-10-13 and checks sign-in only, not role authorization.
- `integration/phalanx-access-diagnostic.mjs` expects 160 records for that date; its status is a diagnostic, not proof of server-side grants.
- `integration/phalanx-alliance-intelligence-2026-10-13.md` documents 395 players and 160 Top-40 records for 2026-10-13, **but explicitly says the new tables/views have no SELECT grants for anon or authenticated** at that integration checkpoint.
- Live `list_tables` confirms `phalanx_alliance_snapshots` (4) and `phalanx_alliance_players` (395), both with RLS enabled; it does not list views or effective grants. Therefore no present-day read permission conclusion can be drawn.

## Critical sequencing
1. Verify current **effective** permissions and intended membership-gated read interface (read-only checks; avoid exposing roster publicly).
2. Determine latest complete snapshot across all four alliances; validate 40 unique positions each, matching snapshot dates, no mixed dates. Prefer metadata query or restricted RPC that returns only a verified date, rather than downloading entire private roster.
3. Build isolated candidate with explicit signed-out, denied, incomplete, and network-failure states.
4. Android click and table layout tests.
5. Only after validation seek production integration approval.

## Status
Top-40 runtime read is NOT VERIFIED. The previous attempted GitHub candidate write was blocked by connection safety checks and did not produce a file. Do not assume a new candidate exists.
