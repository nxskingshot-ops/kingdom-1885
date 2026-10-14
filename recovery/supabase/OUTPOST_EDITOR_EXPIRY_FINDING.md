# Outpost editor – membership expiry review

Date: 2026-10-14. **Read-only static finding; no production change.**

## Observed
- `public.nxs_memberships` has `role`, `active`, and `expires_at` columns; RLS is enabled.
- The deployed `outpost-editor` client reads only `role,active` when checking officer access.
- The client permits `outpost_manager`, `r4`, `r5`, or `admin` when `active=true`.
- The client does **not** read or check `expires_at`.

## Impact and uncertainty
An expired membership with `active=true` could still pass the **browser-side** role check. This does not establish a database authorization bypass: the RLS policy might independently check expiration. Policy definitions have not been verified.

## Recommended verification
1. Read the applicable `pg_policies` for `nxs_memberships` and `public_outposts_verified_20261002` via an approved administrative read-only path.
2. Confirm expired and inactive officers are rejected by the database regardless of browser UI.
3. In an isolated test project, test an expired-but-active officer and an active unexpired officer.
4. If expiry is intended to be enforced, align the client UX and database policies; prioritize the database as the enforcement boundary.
5. Do not change production without approval, staging tests, and rollback preparation.
