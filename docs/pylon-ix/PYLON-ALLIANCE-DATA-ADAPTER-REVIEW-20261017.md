# PYLON IX — Alliance data adapter review (isolated, read-only)

Date: 2026-10-17
Status: Architecture review only — no live connection authorized or deployed

## Existing verified code contracts

- `integration/alliance-overview-reader-test.mjs` exports `loadAllianceOverview(client)`. It requires `client.auth.getUser()` to return a user, then selects `snapshot_date,kingdom,alliance,members,total_power,tg5,tg4` from `phalanx_alliance_latest`, filtered to kingdom 1885. It forwards query errors. It does not itself assert data freshness, completeness or user scope beyond authenticated Supabase access; database RLS must be independently validated.
- `integration/alliance-top40-reader-test.mjs` exports `loadAllianceTop40(client, alliance, date='2026-10-13')`. Allowed alliances: NXS, OoO, MYM, FRA. Requires sign-in, queries `phalanx_alliance_top40` with kingdom/alliance/snapshot date and orders by position. The default date is fixed and MUST NOT be interpreted as current.
- `integration/alliance-adapter-contract-test.mjs` uses mocked Supabase responses. Passing mocks is not proof of real auth, RLS, freshness, or browser integration.
- `deploy/phalanx-kvk-test/pylon-ix-standalone-offline.html` already has `pylon.module-context.v0` validator with `not-connected`, `verified`, `stale` states. Currently all four contexts are explicitly `not-connected` and no network calls are made.

## Proposed safe boundary — not implemented

1. Explicit user-approved integration in a *new isolated test*, never production, and no changes to existing frozen Alpha35 alliance screen.
2. Reuse the signed-in PHALANX Supabase client; no service-role key, API secret, privileged proxy, or anonymous browser access.
3. Verify RLS against an actual test account, including unauthorized and missing-auth cases, before any data reaches PYLON.
4. Convert returned rows into a narrowly scoped `pylon.module-context.v0` payload, keeping source, snapshot date, verified_at and provenance distinct. Do not mark records `verified` merely because the query succeeded; validate source and snapshot freshness. `stale` and `not-connected` carry zero facts.
5. Avoid player names, private roster details, or account-level data in any publicly accessible offline preview. Do not log or persist returned rows.
6. Keep descriptive summaries distinct from strategic recommendations, label uncertainty, and never invent game metrics.
7. Add mock-only mapping/negative tests first. Real-data testing requires an explicit access and RLS gate. No additional paid infrastructure.

## Release gates

- [x] Source adapters located and inspected.
- [x] Existing mock contract inspected.
- [x] PYLON context schema and disconnected state inspected.
- [ ] New mapping and security negative tests.
- [ ] Authorized Supabase browser integration and RLS validation.
- [ ] User-approved isolated live-data preview.
- [ ] Separate review before any production integration.

No production merge, deployment, schema change, or cost-bearing action is part of this review.
