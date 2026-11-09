# PHALANX legacy Auth cleanup — preflight 2026-11-09
Status: STOPPED BEFORE DELETION — backup/restore gate NOT MET.

## Explicit user authorization
Delete ONLY the four old @example.com test accounts; retain main owner and Queen An accounts, and retain matze4428+phxarbeitsapp1109@gmail.com. Do not touch unrelated data or accounts.

## Exact authorized targets (read-only confirmed)
- 6c3b9240-82cb-4991-ac21-d04cff964f94 (nxs-guest-fae9d62d79a7490a9d54@example.com), inactive/expired.
- 59261d33-b850-4b26-acaa-3e45bdec36ef (nxs-guest-28146e95853b49658fb1@example.com), inactive/expired.
- 60ed398e-1672-4ed9-a832-f8213b0fc50b (nexus-0815-055e3e90@example.com), inactive.
- 88f34868-0274-4147-8d60-dfa7c782992c (nexus-081522-ab539c45@example.com), inactive.

## Protected accounts
- d4da222e-8aac-4950-a6df-46c88972458c (main owner).
- 2ec1f371-0ef4-41ea-928f-6253e02009ac (Queen An).
- 1f71d27f-b264-4634-9ab3-b9eb7e34dd33 (working account; retain).

## Dependency counts for four targets (read-only SQL)
auth.users 4; public.app_profiles 4; public.nxs_memberships 4; auth.sessions 9; auth.identities 4; nxs_guest_access_config.created_by 0. FK ON DELETE CASCADE affects app_profiles, memberships, sessions and identities; other auth dependencies exist. Need check all indirect and non-FK references before deletion.

## Backup assessment
Existing docs/SUPABASE_BACKUP_RESTORE.md describes a 2026-10-04 snapshot of public application tables, not auth.users/auth.sessions/auth.identities. Current nexus_backup schema has no auth-named backup table found in this inspection. A verified current backup covering Auth identity data and a nonproduction restore test were NOT established. Existing October snapshots are not sufficient for deletion recovery. No deletion was executed. Do not put password hashes or auth tokens in public GitHub.

## Next gates
1. Verify provider-level backup/PITR or secure full auth export and current dependent public rows; confirm recoverability.
2. Test restoration of these records on isolated nonproduction environment, without changing production accounts.
3. Inspect remaining references, including non-FK references and grants.
4. Recheck IDs and protected accounts, execute scoped deletion using supported Auth Admin API (not direct SQL auth.users delete) only after recovery gates.
5. Recount users, memberships, protected logins, and check role/access regressions.

## Follow-up read-only dependency audit 2026-11-09
Inspected UUID reference columns across public and app_private, beyond FK constraints. Four target accounts appear in nexus_access_requests.granted_user_id (2 historical requests) and nxs_guest_access_config.guest_user_id (1 config row, id=1, enabled=true). No target matches in phx_access_invites.approved_user_id, phx_access_rejections.user_id, phx_access_settings.delegate_user_id/protected_user_id, nexus_access_requests.reviewed_by, nxs_memberships.granted_by, nxs_guest_access_config.created_by. This guest config must be reviewed before account deletion, including consequences of enabled=true even though membership expired. These historical request references must be preserved/audited, not silently deleted.
Available Supabase connector does not expose a provider backup/export/restore-test action; prior Oct 4 database snapshot excludes auth identities. No current recoverable Auth backup and no restore test have been verified. **STOP: do not delete any of the four accounts yet.** Next: obtain verified provider-level backup/PITR or a secure supported Auth Admin export plus tested isolated restore, and a plan for the active guest configuration and historical request references. Do not copy credential hashes or tokens to GitHub.
