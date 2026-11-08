# PHALANX Access Management

Status 09.11.2026 · implemented and isolated tests passed. Shared Staging and production deployment are pending.

## Scope

- The existing Transfer Scouting workspace gets **Tools → Access Management**. The server confirms permission before displaying the tool or returning data. An active admin or the explicitly configured R5 delegate can manage Kingdom and Member memberships.
- An invitation binds an email, self-reported Kingshot Player ID and one regular role for seven days. The operator shares the existing registration link. The app prompts for confirmed email and explicit approval. A player ID is a claim, never an administrative credential.
- Confirmed registrations can be approved after a matching invitation, and pending requests can be rejected. Existing regular memberships can be suspended or reactivated. Expired memberships require a separate renewal. The interface can filter by email or player ID.
- The feature is disabled by default. After isolated deployment, a privileged operator configures the single settings row with the protected owner Auth UUID and the approved delegate Auth UUID. Verify both against the project owner record and actual confirmed memberships. Verify the delegate has active R5. The operator enters these values through the protected backend, never through the browser or by matching mutable player metadata. No role, owner label or service credential is introduced by this feature.
- The server blocks actions on the actor, owner binding, delegate and privileged roles. Active membership and a valid Auth session are checked for each operation. Invitations, rejection records and configuration are private. Audit events use the existing NXS audit log. Membership and audit writes occur in the same database transaction.
- The signup page currently submits `player_id`. The older page used `kingshot_player_id`. The new server code accepts either field and excludes conflicting values. The previous access-request and password-reset workflows stay outside this feature.

## Test evidence

- **PASSED · PostgreSQL 17.5 via PGlite 0.3.14.** Schema fixture for the verified live tables and tested Auth claims. Default deny, role and target matrix, revoked and expired sessions, OAuth client session exclusion, matching verified signup and invitation, conflicting legacy metadata, duplicate and expired invitations, reject and reinvite, role escalation attempts, suspension and reactivation, private table access, audit rollback on write failure, and disabling both RPC entry points without erasing access records.
- **PASSED · Chromium at 390 and 1280 CSS pixels.** Existing registration screen and its actual metadata payload, simulated email confirmation, new tool using the local database, approve, sign in, suspend, denial, reactivate, sign in, search filter, administrator and delegated R5 display, ordinary R5 exclusion, and audit verification.
- **NOT TESTED ·** hosted Supabase Auth mail delivery, PostgREST gateway, full live-schema restore, authenticated live browser, physical Android, and An's personal session. No shared database writes or actual invitations were made.

Reproduce with `@electric-sql/pglite@0.3.14` and the repository's Staging assets. Run `node security/tests/phx-access-management-isolated-20261109.mjs`. For the browser run `node security/tests/phx-access-management-browser-20261109.mjs` with Playwright and Chromium installed. Optional environment values are `PHX_PLAYWRIGHT` for an explicit module path, `PHX_CHROMIUM` for an executable and `PHX_STAGE_TEST_ASSETS` for a separate copy of the verified Staging assets.

## Deployment gate and backout

The existing Supabase project serves real memberships and has no development branch. Verify the scope of the existing owner and legacy review security gate before exposing another access administration UI. The active legacy reset function v8 excludes the protected owner UUID, while authenticated update privileges on its legacy request target remain present. No reset or exploitation was attempted. See [the repository release gate](../project-control/PHX-GOD-MODE-RELEASE-BLOCKER-20261103.md).

Before applying the reviewed SQL, prepare and verify a current backup and isolated restore. Apply to an authorized isolated backend first. Verify the `app_private` schema is outside the exposed Data API schemas, confirm intended authenticated RPC privileges and run the complete live email and session tests. Update the existing Staging entry point only after the hosted gate and required release approval.

If access management must be disabled, remove `EXECUTE` from `authenticated` on both `public.phx_access_management(text, uuid, text, text, text)` and `app_private.phx_access_management(text, uuid, text, text, text)`. Revert the frontend commit independently. Preserve the private invitation data, membership decisions and audit trail. Any individual access correction is a separate audited operation.
