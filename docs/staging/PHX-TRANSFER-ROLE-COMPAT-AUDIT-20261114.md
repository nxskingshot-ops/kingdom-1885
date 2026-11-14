# PHX Transfer role compatibility — isolated audit (2026-11-14)

Status: DIAGNOSED / NOT FIXED / NO PRODUCTION CHANGES.
Branch: fix/transfer-role-audit-isolated-20261114, based on review/phx-transfer-access-v2-20261110.

## Evidence (read-only)
- Frontend deploy/phalanx-kvk-test/pylon-ix/transfer-scouting-id-stage-20261030.js: check() selects nxs_memberships(role,active,expires_at), permits member/r4/r5/admin; canEdit permits r4/r5/admin. Does not read scouting_role.
- Supabase public.nxs_memberships contains scouting_role, with live distribution: one active admin/null, one active r5/null, one inactive member/observer. No identities are recorded here.
- app_private.phx_access_settings.scouting_roles_enabled = true.
- app_private.phx_current_scouting_role() requires m.role='member', active membership, verified email, valid non-OAuth session, and returns m.scouting_role.
- transfer_candidates policies combine legacy nxs_r4_insert/update/delete_transfer and nxs_read_transfer_candidates with phx_scouting_v2_insert/update and phx_transfer_admin_delete. PostgreSQL OR-combines permissive policies, so legacy access may bypass intended Transfer-specific roles. Confirm policy permissive flags and all grants before migration.
- Cron job 1 (every 2 hours) has successful executions; observed pg_net HTTP 200. PostgREST Warp timeouts exist but have not been attributed to the app.

## Safety gates before implementation
1. Identify exact URL/commit Queen An uses and compare deployed assets to this branch.
2. Obtain a verified, restorable snapshot of membership, policies, functions, candidates and auth configuration; DO NOT copy real credentials or candidate PII into test data.
3. Reconcile legacy admin/r5 memberships with transfer-specific permissions through explicit approved mapping; never auto-promote a Kingshot rank to PHALANX administrator.
4. Implement server-side authorization as source of truth and frontend read-only/edit controls from the same verified effective role. Avoid changing active accounts before migration and tests.
5. Test anonymous, inactive, observer, operator, administrator, legacy admin/r5, expired membership, invalid session, and all candidate SELECT/INSERT/UPDATE/DELETE operations in an isolated environment.
6. Test registration/invitation/member-management role consistency, candidate persistence, mobile UI and end-to-end sign-in, then obtain explicit production approval.

## Verification status
- Repository and database inspection: PASS.
- Isolated branch created: PASS.
- Backup created: NOT TESTED.
- Backup integrity / restore: NOT TESTED.
- Auth/RLS end-to-end: NOT TESTED.
- Android: NOT TESTED.
- Production changes: NONE.
- Fix deployed: NO.
