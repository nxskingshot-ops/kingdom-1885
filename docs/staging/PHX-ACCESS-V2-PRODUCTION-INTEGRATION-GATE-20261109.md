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