# PHALANX Access Management V2 — production integration gate
Date: 2026-11-09. Status: BLOCKED / NOT RELEASED. Scope: existing NEXUS PHALANX app only. This document is a review gate, not approval or deployment proof.

## Verified source facts
- Production Supabase project: hcjrdofkdkasznywvcxo. Existing tables: public.nxs_memberships, public.nexus_access_requests, public.app_profiles; private invitations: app_private.phx_access_invites.
- Existing public.phx_access_management(text,uuid,text,text,text) delegates to app_private.phx_access_management. Its invitation branch accepts only 'kingdom' and 'member'. It validates live auth session, protected owner/delegate, membership eligibility and writes public.nxs_audit_log.
- Existing public.nxs_memberships has 2 rows, including 1 admin at last read-only check.
- Production does NOT have public.phx_app_roles or public.phx_set_app_role_v2 or public.phx_approve_registration_with_role_v2.
- Isolated Supabase project yuyvmbdybwpwpqsipfjt has V2 functions and separate accounts. Android logged-out display passed; login with the known test email failed ('Invalid login credentials'). No end-to-end admin acceptance.
- The isolated SQL in docs/staging/PHX-ACCESS-V2-ISOLATED-* is NOT approved for direct production execution.

## Mandatory integration design
1. Preserve legacy membership role values and CHECK constraints. Do not overwrite 'admin'/'r5'/'member'/'kingdom' or change existing access checks to trust new role labels.
2. Define an explicit, reviewed mapping for UI roles Observer / Operator / Administrator versus existing legacy capabilities; separate app-level privileges from kingdom/game hierarchy.
3. Extend the existing session-bound access management authority; no unauthenticated or service-role client writes. Protect GOD owner, delegate, actor and existing administrators. Do not derive authorization from user-editable metadata.
4. Unify invitations, approval, member edits, revocation, and audit with the current source of truth; do not run a parallel independently authoritative role table.
5. Plan a migration with before/after schema snapshots, backup verification, rollback SQL, restoration rehearsal in an isolated clone, and no existing-row overwrite.
6. Require explicit review of database grants/RLS, SECURITY DEFINER entrypoints, session revocation and stale JWT behavior.
7. Preserve all design FREEZEs, navigation, Transfer Scouting data, Outpost Map 2.0 and its 74 outposts.
8. Deploy behind disabled feature flag until tests and authorization review pass. Never promote a stand-alone mockup as the integrated app.

## Release acceptance — current evidence
- Read-only production inventory: PASSED.
- Source inspection of existing access function: PASSED.
- Production backup CREATED: NOT VERIFIED.
- Backup integrity: NOT VERIFIED.
- Restore rehearsal for current production state: NOT TESTED.
- Production migration: NOT APPLIED.
- Role invitation / approval / member edit / audit: NOT TESTED.
- Owner/delegate/self/admin protections: NOT TESTED IN PRODUCTION.
- Android login: FAILED IN ISOLATED TEST; NOT TESTED IN PRODUCTION V2.
- Regression of navigation, data, exports, mobile: NOT TESTED.
- Production release: NOT APPROVED / NOT DEPLOYED.

## Stop conditions
Do not apply isolated test migrations or enable V2 on production until mapping, backup/restore, migration diff and authorized end-to-end tests are evidenced. Preserve production data and rollback capability.
## Continuation · Transfer Scouting Access V2 · 2026-11-09

Version `phx-scouting-roles-20261109`. Implemented in the existing `transfer-pr42` pilot and its previously approved compact `transfer-access-v21` view. The working branch incorporates the approved staging baseline `bc1da8c64472f26841581b4522ac52acf6618373`. This continuation supersedes the earlier backup and implementation status above.

### Scope and compatibility

- One role vocabulary in invitations, registration approval, and member editing. A verified registrant must match the live invitation by email and Kingshot ID. Approval confirms the exact invited role. Old Member and Kingdom invitations still have their original approval path, and existing access managers can open the separate legacy invitation form.
- One authority for role grants, the existing `phx_access_management` RPC and the existing membership row. An additive nullable `scouting_role` stores the scoped role. Existing records receive no automatic grants or role mapping. New V2 applicants receive the existing Member baseline plus the selected scouting role.
- Observer can read scouting records. Operator can add and edit candidates and use the built-in CSV export. Administrator additionally manages Transfer Scouting access. Scoped roles never grant legacy R4/R5/admin or candidate deletion. The Observer interface hides the built-in export. The CSV contains the same rows as the permitted read view, so client-side download controls are a workflow distinction.
- The same live-session check, serialization lock and atomic audit apply to role management. Owner, delegate, self, privileged legacy accounts and existing scoped administrators are guarded. Scoped administrators cannot manage Kingdom-only access. Member role changes require a reason and record the actor, previous role and new role. The existing RPC signature is kept. Its `p_email` argument carries the reason only for `set_scouting_role`.
- The [candidate SQL](../../security/patches/PHX-ACCESS-V2-TRANSFER-SCOUTING-20261109.sql) verifies the reviewed function body and that membership and candidate RLS are enabled before applying. It defaults to disabled and adds only two candidate policies for scoped writes. It does not run automatically through the migration directory.
- The [backout SQL](../../security/patches/PHX-ACCESS-V2-TRANSFER-SCOUTING-DISABLE-20261109.sql) disables V2 access and new candidate write paths while retaining records and audit. Existing Member access remains available. Pending V2 invitations are retained and reserve their bindings until expiry or reactivation. Frontend rollback is independent. Individual access changes require an authorized, audited operation.

### Evidence

| Check | Status | Evidence and scope |
|---|---|---|
| GitHub handoff and committed production preflight | BESTANDEN | Work baseline `9bc2c55192e57def8680c60b14a6eeb5902bfb6c` contains the requested preflight. Read-only production review confirmed two membership rows with legacy roles Admin and R5, zero open invitations, zero pending legacy requests and existing RLS. |
| Existing Cloudflare pages | BESTANDEN | Test branch `21568a93fd62f7585253f937ce426db768703ef1`, successful [workflow](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/42697076766). Isolated HTML returned HTTP 200 and matched its Git blob. Both active Scouting pilot HTML files returned HTTP 200 and matched staging `bc1da8c`. This verifies the prior deployment. |
| All three invitations, approvals and persisted roles | BESTANDEN | Local PostgreSQL 17.5 via PGlite. Exact invitation match, confirmed email, role readback, and legacy compatibility. |
| Negative authority and RLS paths | BESTANDEN | Local SQL fixture. Anonymous and ordinary R5 denied. Observer and Operator cannot administer. Scoped Administrator can manage eligible members and cannot grant Kingdom access, alter protected accounts or delete candidates. Revoked-session and disabled-flag checks passed. |
| Audit and transactional consistency | BESTANDEN | SQL fixture. Duplicate invitation and repeat grant handling, reason and before/after readback, failed audit rolls back the role write. |
| Sign-in, registration, role editing, account lifecycle and Tools navigation | BESTANDEN | Chromium 390 and 1280 CSS pixels on the existing app. Simulated GoTrue sign-in and email confirmation, connected to the local PostgreSQL fixture. V2 and legacy fallback checked separately. |
| Transfer decision and deploy assets | BESTANDEN | Existing Transfer Decision test suite 12/12 and Cloudflare asset preflight. New code scoped to the two Scouting views. |
| Production backup created | BESTANDEN | [GitHub Actions run 42596466758](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/42596466758), 09 Nov 10:50 CET, successful encrypted dump and upload steps. |
| Production backup integrity | BESTANDEN | Same job succeeded at archive parsing, encryption/decryption comparison and remote-copy byte comparison. The private backup was not retrieved by this work. |
| Synthetic backup and separate restore | BESTANDEN | A fresh PostgreSQL fixture loaded the compressed backup and returned identical membership, candidate, invitation, audit and flag data. |
| Actual production backup restored in isolation | NICHT GETESTET | The available [archive-validation workflow](https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/38539296575) only parsed an older archive. A current restore must use an authorized disposable target and verify owners, grants and policies separately because the scheduled dump excludes owner and ACL metadata. |
| Previous hosted login with the known isolated account | FEHLGESCHLAGEN | Historical invalid credentials. The current read-only check found a confirmed account and no active administrator V2 role for that identity. No password was retried. Use isolated-project Auth recovery with the account holder or dedicated authorized test identities. |
| Hosted Auth, PostgREST, physical Android and Queen An | NICHT GETESTET | The hosted isolated project lacks `public.transfer_candidates` and intentionally does not grant authenticated execution of the legacy Access RPC. Prepare a compatible isolated restore before migration and use approved test identities. The currently deployed pages still serve the prior versions. |
| Production integration, full PHALANX regression and release | NICHT GETESTET | No production migration or role change. Real sign-in, candidate operations, HOME/Territory Control/Outpost Map 2.0 and 74-outpost export regressions, Queen An's actual account and a specifically authorized rollout remain gated. |

Reproduce from the work branch with `@electric-sql/pglite@0.3.14`, Playwright and Chromium. Run `node security/tests/phx-access-v2-transfer-scouting-20261109.mjs`, then `PHX_TEST_ACCESS_V2=1 node security/tests/phx-access-management-browser-20261109.mjs` and repeat the browser test without the environment flag to exercise fallback.

## Continuation · native Auth and restore rehearsal · 2026-11-09

Application source `5207ccaaf1b956a965519862dbaea493c79c2ea0`. This pass added test evidence only. The existing application was served locally with its Supabase URL and client key pointed at an isolated loopback stack. External browser requests were blocked. GoTrue 2.197.0, PostgREST 16.5, PostgreSQL 17.9, supabase-js 2.119.0 and Chromium used synthetic data and an in-memory SMTP inbox.

| Check | Status | Evidence |
|---|---|---|
| Browser registration and real Auth confirmation | BESTANDEN | Registered three accounts through the existing form, verified password sign-in was denied before confirmation, followed three actual test mail links, verified sign-in succeeded and the app still gated access until approval. |
| Delegate role grants and access readback | BESTANDEN | The synthetic delegated R5 used the existing browser screens to invite and approve Observer, Operator and Administrator. Each approved identity signed in and loaded its assigned role after reload. |
| Candidate data and authority | BESTANDEN | Real authenticated PostgREST. Observer read the two test candidates and could neither write nor list access records. Operator and Administrator created and edited candidates; candidate deletion returned no rows. Scoped admin role mutations on protected owner/delegate and self suspension were denied. |
| Member edit and audit | BESTANDEN | Changed Observer to Operator and back in the browser. Actual RPC readback and audit reasons matched. The fixture recorded three invites, three approvals, two role changes, two candidate inserts and two candidate updates. |
| Password recovery and logout | BESTANDEN | Received a GoTrue recovery message in the local inbox, set a new password through a real recovery session, confirmed old-password denial and new-password sign-in. After global logout the previous token could no longer establish the scoped role. |
| Native backup created | BESTANDEN | PostgreSQL client 18.6 produced a custom-format, encrypted synthetic archive with the same relevant dump and encryption options as the scheduled workflow. |
| Native backup integrity | BESTANDEN | Parsed the archive, verified the encrypted SHA-256 and byte-compared the decrypted archive with the original. |
| Native restore | BESTANDEN | Used `pg_restore --exit-on-error --single-transaction --no-owner --no-acl` against a second PostgreSQL instance. Fingerprints and counts matched for 5 Auth accounts, 5 memberships, 3 invitations, 2 candidates, 12 audit events, settings and candidate policies. Reapplied and verified the scoped ACLs separately. |
| Current production archive restored | NICHT GETESTET | The successful scheduled backup was verified from its workflow. It publishes no downloadable artifact. The encrypted copy remains in private backup storage. The existing hosted test project already contains test accounts and lacks the candidate schema. It was not overwritten. |
| Hosted Auth, physical Android and Queen An | NICHT GETESTET | Native browser test used a 390 CSS-pixel viewport. The historical hosted login failure was not retried. |
| Production deploy and whole-app regression | NICHT GETESTET | Production and both existing test deployments were untouched. |

### Access grants after restore

The production backup workflow uses `--no-owner --no-acl`. In the synthetic restore, the access RPC inherited default PUBLIC execute privileges until the reviewed grants were replayed. The normal application guard still applied. Before attaching any restored target to the Data API, restore the required database roles and object ownership, replay reviewed schema, table and function grants, and compare policies and direct access from both authorized and unauthorized roles. A successful archive parse and matching rows cannot verify this step.

### Reproducing the native smoke test

- Run a fresh, disposable PostgreSQL 17 cluster bound to loopback port 53911 with the database `phx_access_fixture`. The fixture creates roles, so use a dedicated cluster. The smoke test rejects a populated database.
- In an isolated working directory place the GoTrue 2.197.0 executable as `auth` with its `migrations/` directory and PostgREST 16.5 as `postgrest`. Install Node dependencies `pg@8.23.1`, `smtp-server@3.19.0`, `mailparser@3.9.4`, `esbuild@0.27.2` and `@supabase/supabase-js@2.119.0`. Set `PHX_PLAYWRIGHT` to the installed Playwright ESM entry and `PHX_CHROMIUM` to the Chromium executable.
- Copy the [smoke test](../../security/tests/phx-access-v2-native-smoke-20261109.mjs) and [schema fixture](../../security/tests/phx-access-v2-native-baseline-20261109.sql) into that working directory. Run `node phx-access-v2-native-smoke-20261109.mjs /absolute/path/to/repo`.

The next release gate is a real restore of the current private production archive into an authorized disposable target. Use the existing private backup access and keep the target isolated until ownership, grants and RLS have been checked. Then connect the existing app to that target and run hosted Auth, Android, Queen An and the protected navigation regressions before requesting production authorization.
