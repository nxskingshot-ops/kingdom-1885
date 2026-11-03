# PHALANX GOD MODE — RELEASE BLOCKER / SECURITY GATE
Stand: 2026-11-03
Status: BLOCKED — NO PUBLIC RELEASE APPROVAL
Scope: NEXUS PHALANX; does not authorize production changes.

## Binding release decision
Public release MUST remain blocked until GOD MODE is implemented and demonstrated end-to-end. The visual label "VERIFIED" MUST be driven by trusted server-side owner authorization and a recorded completed security gate, never by frontend membership/admin role alone.

## Owner invariants
- Dedicated immutable PHALANX owner principal, distinct from auth user binding and mutable Kingshot/game IDs.
- Ordinary admins (including An) cannot deactivate, demote, delete, transfer or impersonate the owner.
- Game ID unlink/relink/deletion and game data outage do not revoke owner control.
- No unprotected service_role, management API, SQL function or UI path bypasses the intended owner authorization.
- Recovery is owner-authenticated with MFA and audited; no shared master password or backdoor.
- Owner transfer only through separately approved sale-transfer procedure.

## Mandatory evidence before release
| ID | Test / evidence | Status |
|---|---|---|
| GM-01 | Disposable PostgreSQL fixture, stdout + PostgreSQL version | NOT TESTED |
| GM-02 | Real-schema clone: RLS, triggers, functions, membership mutation negatives | NOT TESTED |
| GM-03 | Auth and management API: ban, delete, disable, recovery negatives | NOT TESTED |
| GM-04 | Independent owner principal and game identity negative tests | NOT TESTED |
| GM-05 | Admin role matrix, including An, least privilege | NOT TESTED |
| GM-06 | Owner emergency lock/unlock, MFA, recovery | NOT TESTED |
| GM-07 | Audit logs, owner transfer workflow, security review | NOT TESTED |
| GM-08 | Current backup integrity AND isolated restore execution | NOT TESTED |
| GM-09 | Browser/mobile end-to-end, regression, role boundaries | NOT TESTED |
| GM-10 | Explicit production authorization and signed release gate | NOT APPROVED |

## Existing work (not sufficient for release)
- Fixture: security/tests/phx-god-mode-disposable-gate-20261103.sql (five isolated checks).
- Manual GitHub Actions workflow: .github/workflows/phx-god-mode-isolated-gate-20261103.yml.
- IMPORTANT: workflow_dispatch normally requires workflow file on default branch for UI/API dispatch. Workflow committed on isolated test branch is NOT evidence that it can run. Do not merge into default solely to run it without authorization.
- Model/policy tests documented in security/audits/PHX-GOD-MODE-INTEGRATION-GATE-V2-20261021.md; not production Auth/RLS proof.
- No release, production migration, permissions change, or paid infrastructure authorized.

## Execution order
1. Verify cost-free runner/test environment and workflow availability; obtain approval for any default-branch workflow addition or costs.
2. Execute fixture and collect logs.
3. Build disposable clone of actual schema; test owner protection and auth/management paths.
4. Design and review migrations, identity bootstrap, backups and rollback.
5. With explicit approval only, deploy to isolated staging and test full role matrix and recovery.
6. Only after all evidence passes, request separate public-release authorization.

## Change protection
No changes to HOME, PYLON IX, Atlas, 74 outposts, data exports, production memberships, Supabase Auth, or design FREEZEs.
