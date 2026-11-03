# GOD MODE — Owner integration design, NOT DEPLOYED
Date: 2026-11-03 | Release status: BLOCKED
Target: existing Supabase PostgreSQL 17 / auth.users / public.nxs_memberships

## Confirmed live inventory (read only)
- Supabase project healthy, PostgreSQL 17.6, no development branches.
- public.nxs_memberships has 5 rows, RLS enabled, PK user_id, FK user_id -> auth.users.id.
- role CHECK allows kingdom/member/outpost_manager/r4/r5/admin; NO owner/god role.
- public.app_profiles: 5 rows, RLS enabled, user_id FK -> auth.users.id.
- public.nxs_audit_log exists, RLS enabled.
- Existing SQL migrations include security, membership and audit work; GOD MODE migration NOT identified in the migration list.
- Actual policy/trigger definitions and Auth management access have NOT been verified in this gate.

## Proposed implementation (requires review, backup, rollback and explicit approval)
1. Dedicated owner identity in a private restricted schema, single owner principal and separate verified auth binding; game IDs are optional display links only.
2. Secure server-side owner authorization with explicitly reviewed SECURITY DEFINER search_path, privileges, RLS, audit and no direct browser write access.
3. Preserve the existing nxs_memberships role CHECK and all five real memberships. An ordinary 'admin' never implies owner.
4. Server-side guard for membership changes targeting owner, with separately designed protection of owner principal/binding and privileged management API paths. Trigger alone cannot protect against project infrastructure administrators.
5. Protected MFA and recovery; no shared emergency password. Ownership transfer only by separately approved process.
6. Verify operational admin (An) matrix, R4 and ordinary members, expiration and inactive memberships.
7. Integrate owner identity display only after server-side verified gate; never derive VERIFIED from client-side role or UUID comparison.

## Mandatory integration tests
- Disposable clone of actual schema + RLS policies, with different authenticated roles.
- Owner suspension, demotion, deletion and impersonation negatives through all permitted APIs.
- Auth management API ban/delete/recovery; service_role bypass analysis.
- Game unlink, relink, duplicate claim, sync outage independence.
- Owner lock/unlock, MFA recovery, audit and controlled transfer.
- Backup integrity, full isolated restore, rollback and browser/mobile regression.

## Explicitly prohibited now
- No production SQL, no user or membership updates, no service_role secret exposure.
- No new paid Supabase branch or default-branch deployment.
- No GOD MODE VERIFIED badge and no public PHALANX release.

## Status
DESIGN DRAFT / NOT IMPLEMENTED / NOT INTEGRATION TESTED / NOT RELEASED.
Previous 13 green isolated fixture tests do not satisfy these gates.
