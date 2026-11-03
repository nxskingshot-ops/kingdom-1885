# PHALANX GOD MODE — VERIFIED PRIVILEGE GAP
Date: 2026-11-03. Read-only production inventory; NO DDL or data writes.

## Observed, not inferred
- public.nxs_memberships: authenticated has SELECT only; no INSERT/UPDATE/DELETE grant.
- postgres and service_role have SELECT, INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER and other privileges on public.nxs_memberships.
- RLS membership policy: nxs_membership_read_self SELECT to authenticated, user_id = auth.uid().
- No noninternal trigger on nxs_memberships in read-only catalog inspection.
- public.phalanx_can_read_alliances() is STABLE SECURITY DEFINER with empty search_path and checks auth.uid(), active, expiry and membership role; EXECUTE granted to anon/authenticated/service_role/postgres.
- The anon EXECUTE grant is a security advisor warning; function source suggests unauthenticated call returns false, but that has not been dynamically verified.
- Auth password leak protection disabled per advisor.
- 17 isolated fixture assertions passed in GitHub Actions run #5, commit b365cc1. These are not production authorization tests.

## Implications
1. RLS is not sufficient to protect an owner against privileged service_role / SQL administration.
2. A database trigger on memberships alone would not protect auth.users ban/delete, ownership principal, project control or privileged bypass paths.
3. No 'god' value is permitted by current role CHECK; keep admin as operational role, add separately protected owner principal.
4. Design privileged changes through a narrow server-only API with audit; remove unnecessary direct mutation paths only after dependency inventory.
5. Never claim immunity from infrastructure/project administrators with full database/management control.

## Required before production migration
- Inventory all Edge Functions, management endpoints, and service_role holders that mutate memberships/auth users.
- Confirm owner identity and MFA/recovery path, and ensure no frontend hardcoded UUID is used for authorization.
- Current database and Auth backups with integrity verification, restore rehearsal, and tested rollback.
- Isolated clone of real policies, functions, grants, triggers and auth flows; negative tests for owner ban/demotion/deletion and positive tests for authorized admin actions.
- Separate explicit approval for deployment, role/permission changes and release.
- Maintain PUBLIC RELEASE BLOCKED and GOD MODE NOT VERIFIED.

## Execution status
Read-only catalog check: PASS. Privileged-path audit: INCOMPLETE. Real auth/restore tests: NOT TESTED. Production change: NONE.
