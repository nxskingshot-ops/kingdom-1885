# PHALANX GOD MODE — Execution readiness and grant audit 2026-10-21

## What was actually checked
Read-only `information_schema.role_table_grants` inspection of three production tables:
- `nxs_memberships`: `authenticated` has SELECT only; `service_role` has full DML.
- `app_profiles`: `authenticated` has SELECT only; `service_role` has full DML.
- `nexus_access_requests`: `anon` and `authenticated` have SELECT, INSERT, UPDATE, DELETE and TRIGGER grants; `service_role` has full DML. RLS still controls effective row operations. Current RLS allows anonymous/authenticated INSERT of pending requests and officer UPDATE/SELECT for roles r4/r5/admin.
- This does not prove anonymous DELETE/UPDATE is possible; absent applicable RLS policies such operations should be denied. It **does** increase the importance of explicit RLS regression tests and least-privilege grant review.

## Test execution status
The SQL fixture at `security/tests/PHX-GOD-MODE-ISOLATED-OWNER-GUARD-TEST.sql` is committed but **has not been executed**. No disposable PostgreSQL environment was available in the working container (psql/postgres/docker absent). Do not run DDL on production merely to simulate an isolated test, even if wrapped in ROLLBACK.

## Test acceptance criteria before owner activation
1. Run the fixture in a dedicated disposable Postgres/Supabase test instance, capture actual PASS/FAIL and environment version.
2. Validate production schema migrations in a separately isolated clone; inspect auth schema and all functions/Edge Functions/roles, not just the three tables.
3. Exercise RLS with actual anon, pending, approved member, analyst, operational admin and owner JWT contexts.
4. Verify no route from anonymous request INSERT to privileged grant, owner designation or cross-user status.
5. Add protection to Auth user suspension/deletion and backend management API; the existing fixture tests only membership mutations.
6. Review privileged `service_role`, dashboard, GitHub/CI and Cloudflare access, which can bypass ordinary RLS.
7. Test loss/change of Kingshot identity without any effect on PHALANX ownership.
8. Test owner-only emergency lock, revocation, owner MFA recovery, backup restore and sale-only ownership transfer.
9. Do not deploy until owner identity securely verified, rollback rehearsed and explicit production authorization obtained.

## Status
Audit documentation only; no DB writes, migrations, permission changes or deployments.
