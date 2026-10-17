# PYLON IX — real signed-in RLS test runbook (no production deployment)

Status: **BLOCKED / not executed**. This is a controlled read-only authorization test plan, not evidence of an RLS pass.

## Read-only inventory

On 2026-10-17, an aggregate-only metadata query found 5 Supabase Auth users and 3 active, unexpired NXS membership rows. This does **not** identify which users are suitable test accounts; a user without a membership is not necessarily an intentionally provisioned test account. No passwords, tokens, names, or private alliance rows were inspected.

## Required preconditions

1. Confirm two **existing dedicated test identities**, one active permitted NXS member and one non-member/expired/unauthorized identity. Do not use ordinary members' accounts without their consent. Do not create accounts or change permissions as part of this test.
2. Confirm that the two views `phalanx_alliance_latest` and `phalanx_alliance_top40` contain at least one known test-visible row for the authorized identity. Verify this separately through an approved fixture procedure; absence of rows is not proof of RLS denial.
3. Run in an isolated harness using the existing publishable/anon client key, not a service-role key, with each test account independently signed in. Never paste tokens, passwords or user identifiers into chat, CI logs or the repository.
4. Use `probeAllianceReadAccess(client)` from `integration/pylon-alliance-rls-role-check.mjs` for each signed-in session. It issues HEAD-only exact-count queries, returning view name, request status and coarse visibility only. Counts and row contents are not included in its output.
5. Supply the two resulting sanitized probe objects to `evaluatePylonRlsRoles(authorized, unauthorized, { seededRowsConfirmed: true })` **only after** fixture confirmation. Do not conflate a 200 HTTP response with data visibility: RLS can return 200 with zero visible rows.

## Interpretation

- `role-check-passed`: authorized sees rows in both views, unauthorized sees zero in both; only evidence for these two identities and this fixture, **not** production approval.
- `failed`: unauthorized sees rows. Stop and escalate for policy review.
- `inconclusive`: missing fixture, missing auth, query error, zero authorized rows, missing/invalid count or incomplete results. Never infer success.

## Mandatory policy decision before live feature rollout

Current `phalanx_can_read_alliances()` is a **global NXS membership gate**, not per-alliance row isolation. An authorized NXS member may see all four alliances (including Top40 player-level data). Product owner must explicitly approve intended cross-alliance visibility; role tests alone do not resolve that decision.

## Security boundaries

No deployment, database mutation, role impersonation, service-role access, storage of credentials, production integration or change to FREEZEs. A SQL editor session cannot substitute for genuine user-JWT tests. Only run after confirming authorized test identities and explicit operator access to their sign-in sessions.
