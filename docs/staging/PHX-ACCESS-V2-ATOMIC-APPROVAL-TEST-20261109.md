# PHALANX Access V2 — atomic approval test evidence, 2026-11-09

Environment: isolated Supabase yuyvmbdybwpwpqsipfjt; branch work/phx-access-v2-safe-plan-20261109. Production untouched.

## Executed positive test
In a PostgreSQL BEGIN/ROLLBACK transaction:
1. Temporarily inserted one active PHALANX administrator role for an existing isolated auth user.
2. Temporarily inserted an enabled registration reviewer for the same auth user.
3. Temporarily inserted a pending registration for a different existing isolated auth user.
4. SET LOCAL ROLE authenticated and set request.jwt.claim.sub to the temporary administrator.
5. Invoked public.phx_approve_registration_with_role_v2 with role observer.
6. Returned status approved, app_role observer, access_granted true.
7. ROLLBACK.

## Post-test integrity
Read-only verification:
- public.phx_app_roles: 0 rows
- public.phx_app_role_events: 0 rows
- temporary application ID: 0 rows
- temporary reviewer ID: 0 rows

## Scope and limitations
PASSED: atomic approval and role-grant RPC success path in isolated database transaction.
PASSED: rollback integrity of temporary test records.
PASSED earlier: unprivileged caller rejected SQLSTATE 42501.
NOT TESTED: live JWT HTTP request to deployed Edge Function V3.
NOT TESTED: persistent real login, membership/feature authorization, UI/browser/Android, production regression.
OPEN: explicit administrator bootstrap, integration of new role checks with protected legacy module access.
No production release or backup/restore test.
