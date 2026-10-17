# PYLON IX — Supabase read-only RLS audit

Date: 2026-10-17
Scope: Existing project kingdom-1885-app, public alliance views; inspection only
Result: Static configuration review passed, user-role behavior NOT yet tested

## Verified through read-only system catalog queries

- `public.phalanx_alliance_latest`: VIEW, `security_invoker=true`, SELECT granted to `authenticated`, no `anon` grant in relation ACL. Reads `public.phalanx_alliance_snapshots`.
- `public.phalanx_alliance_top40`: VIEW, `security_invoker=true`, SELECT granted to `authenticated`, no `anon` grant in relation ACL. Reads `public.phalanx_alliance_players`.
- Both source tables: `relrowsecurity=true`; authenticated SELECT grants; policy `phalanx_member_read` uses `phalanx_can_read_alliances()`.
- `public.phalanx_can_read_alliances()`: STABLE SECURITY DEFINER, empty search_path, checks `public.nxs_memberships` for `user_id=auth.uid()`, `active=true`, unexpired membership and role in `member,outpost_manager,r4,r5,admin`.
- All findings are configuration inspection, NOT a successful user-session access test.

## Required negative/positive tests before enabling PYLON live data

1. Anonymous client: both views denied or no rows.
2. Authenticated user without active membership: both views return no rows.
3. Authenticated user with expired or disabled membership: both views return no rows.
4. Authorized test member: reads only intended columns and records.
5. Revalidate date freshness, source provenance, and the intended scope of allowed alliances. Current RLS is a *global membership gate* and not a per-alliance filter; this is important for any future private player-level data display.
6. Test direct table access and verify the views do not expose additional fields unexpectedly.
7. Never store user tokens, passwords, service-role keys, or full live rows in test logs, screenshots or public Cloudflare previews.

## Release decision

**BLOCKED** until real-role tests are completed and user approves isolated live-data preview. Do not change production schema, policies, permissions, or data as part of this audit. No Supabase branch or paid resources created.
