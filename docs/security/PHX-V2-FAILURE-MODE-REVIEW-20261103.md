# PHALANX isolated V2 failure-mode review — 2026-11-03

Source: isolated Supabase project `yuyvmbdybwpwpqsipfjt`, Edge Function `nexus-access-review` v2, retrieved after deployment. Production untouched.

## Verified source behavior
- Auth user is created first, then app_profiles upsert, then nxs_memberships insert.
- `phx_finalize_approval` RPC atomically binds the request to the user and marks the request approved.
- On RPC failure, the handler attempts membership and profile deletion, and deletes the Auth user **only if both deletions reported no error**.
- `cleanup()` catches thrown errors from Auth user deletion, but does not check the returned `error` property from `admin.auth.admin.deleteUser(uid)`.
- In profile and membership error branches, cleanup outcomes are not independently verified.
- The function returns a newly generated password in the approval response. Treat response body and CI logs as secret-bearing.

## Consequences
- A failed Auth deletion can leave an orphan Auth user while the API reports a generic 503.
- A failed profile/membership deletion can leave partial state; the handler currently has no persistent reconciliation record.
- If the finalize RPC commits but its HTTP response is lost, compensating deletes may conflict with an approved binding. A timeout is not proof of rollback.
- A green unauthenticated smoke workflow cannot validate any of these scenarios.

## Required corrective design before production
1. Introduce a test-only durable operation/reconciliation record with explicit lifecycle states and no credentials.
2. Make cleanup check both thrown errors and returned error objects; verify absence of test Auth user, profile, membership and binding before marking recovered.
3. On ambiguous finalize RPC outcome, read authoritative request/binding state before compensating. Never blindly delete a possibly approved account.
4. Add idempotency and concurrency tests for simultaneous approvals and retry after timeout.
5. Run authenticated E2E tests with synthetic users and redacted CI logs, then inspect for orphan records.
6. Keep all test secrets in encrypted CI secrets, never repository content.

## Status
Code review: COMPLETED.
End-to-end remediation: NOT IMPLEMENTED.
Authenticated tests: NOT EXECUTED.
Release: BLOCKED.
