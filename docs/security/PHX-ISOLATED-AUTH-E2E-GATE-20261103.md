# PHALANX isolated authenticated E2E gate (2026-11-03)

Status: PREPARED / NOT EXECUTED. This is not a production release gate.

## Boundaries
- Test Supabase project only: `yuyvmbdybwpwpqsipfjt`.
- Production Supabase project `hcjrdofkdkasznywvcxo` must never be used.
- Never use real players, production JWTs, owner UUIDs, or existing GOD accounts.
- Do not log passwords, bearer tokens, service keys, or user metadata.
- No new paid resources, production writes, merge, or role changes.
- Existing successful unauthenticated GitHub smoke workflow must remain intact.

## Required secure setup (not yet available)
1. Create synthetic Auth users via supported Supabase Auth Admin API in the isolated project only: one officer and one ordinary member.
2. Seed only the isolated `nxs_memberships` with the officer role; ensure ordinary member cannot review.
3. Store isolated project test credentials in GitHub Actions secrets, never in source, artifacts or logs.
4. Explicitly bind and verify test project ID before each mutation; refuse execution if absent or different.
5. Add teardown for synthetic users and test requests with independent verification, after confirming no real data can match.

## Mandatory authenticated cases
- Valid officer JWT: approve pending synthetic request, create account, profile, membership and immutable binding.
- Valid officer JWT: reject pending synthetic request, no Auth account created.
- Valid officer JWT: reset password only for exactly matching immutable binding, Auth app metadata and request.
- Ordinary member JWT: approve/reject/reset denied.
- Invalid/expired JWT: approve/reject/reset denied.
- Spoofed `granted_user_id` or `player_id`: reset denied.
- GOD/owner account: no accidental mutation or privilege escalation; use synthetic protected-owner simulation only.
- Failure injection: registration conflict and cleanup failure must not silently leave approved-but-unbound requests.
- CORS preflight and non-allowed origin checks separately from authorization.
- Verify data integrity, idempotency, and rollback/compensation under partial failures.

## Known blocker
The approval code creates Auth users and memberships before the database transaction.
The atomic RPC only covers request status plus immutable binding. Its cleanup is best-effort.
Full compensation and retry behavior must be proven before production consideration.

## Exit criteria
All cases above must have traceable CI logs (redacted), explicit pass/fail outcomes, and zero unexpected persisted synthetic records. Reviewers must independently confirm production is untouched. Until then: NOT RELEASED.
