# PHALANX Access V2 – owner Android and role RPC evidence (2026-11-09)

## Scope
Isolated Supabase project `yuyvmbdybwpwpqsipfjt` and isolated Vercel test project only. No production changes. Branch `work/phx-access-v2-safe-plan-20261109`.

## User-confirmed Android browser checks
- Sign in and sign out completed by user: PASS (user report).
- Signed out member page showed `Sign in required`: PASS (screenshot).
- Signed in before bootstrap showed `PHALANX administrator required`: PASS (screenshot).
- After explicit user authorization, verified owner test account received active `administrator` app role and enabled reviewer membership; SQL readback confirmed one matching role, one enabled reviewer, one audit entry: PASS.
- Member directory after bootstrap showed `1 app member(s) available to administer` and Administrator role: PASS (screenshot).
- Registration review showed `0 pending request(s)`: PASS (screenshot).
- Actual mobile approve and role edit: NOT TESTED; no second dedicated test identity/request.

## Isolated SQL transaction tests
- As authenticated bootstrap admin, `phx_approve_registration_with_role_v2` on transaction-only pending request returned `approved`, `operator`, `access_granted:true`: PASS.
- As authenticated bootstrap admin, `phx_set_app_role_v2` for separate existing auth identity returned `{role:observer,changed:true}`: PASS.
- Both tests explicitly `ROLLBACK`. Readback verified zero temporary request/role/audit rows, owner admin remained active: PASS.
- These are DB RPC tests with simulated authenticated request context, **not** real HTTP/JWT or browser action tests.

## Limitations and release gate
- Existing PHALANX module authorization is NOT VERIFIED against `phx_app_roles`.
- GOD-mode/owner protections must be audited server-side before any production merge.
- No production deployment, data migration, restore test, or end-to-end Android approval was performed.
- Existing Vercel test preview is isolated and protected. Do not describe as production-ready.
