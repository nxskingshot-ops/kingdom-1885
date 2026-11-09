# PHALANX Access Management V2 — isolated implementation gate
Date: 2026-11-09
Branch: work/phx-access-v2-safe-plan-20261109
Status: DESIGN AND VERIFICATION ONLY — NO DEPLOYMENT, NO DATABASE WRITES

## Verified live baseline
Production Supabase hcjrdofkdkasznywvcxo: 3 auth users, 3 app_profiles, 2 active nxs_memberships (one admin, one r5), 2 legacy access requests. No orphan profile or membership rows. Four service-role auth user_deleted events at 2026-11-09 05:56:39 UTC refer to technical example.com accounts; initiating human not identified. Current backup integrity and restore untested.
Existing RLS: nexus_access_requests SELECT/UPDATE allows legacy r4/r5/admin; transfer_candidates DELETE allows legacy r4+. Both conflict with target authorization and MUST NOT be silently changed before compatibility review.
Isolated test Supabase yuyvmbdybwpwpqsipfjt has registration V2 endpoint. Existing isolated review action records decision only (access_granted:false), does not grant membership. Existing browser review UI has no role selector. Production and isolated auth.users identities are not interchangeable without verified linkage.

## Binding decisions
Kingshot rank R1–R5 is independent of PHALANX app access.
Target app roles: Observer (read), Operator (scouting create/edit/export), Administrator (scouting + review/roles/account operations), GOD (protected owner, outside standard workflow).
Invitation role, approval role and existing-member role must use one canonical role list. Ordinary applicant cannot choose role. Server must verify admin authorization; cannot infer from Kingshot rank or client metadata.
Explicitly resolve whether administrators may delegate Administrator to another administrator under protected governance, and whether all three roles or four roles appear in invitation. Preserve approved decisions and clarify only actual conflicts.

## Proposed additive migration, not executable without gates
1. Add app_access_roles mapping keyed by auth user UUID, separate from legacy nxs_memberships. Store canonical role and source, grant actor/time; no automatic legacy role rewrites. Keep Kingshot rank separate.
2. Add immutable role-change audit and invitation/approval linkage. Restrict direct client writes; server-side authorized transaction for approval + role assignment + invitation consumption + audit. Rejected applications never grant membership. Repeated/concurrent decisions idempotent or conflict with no partial write.
3. Preserve legacy membership behavior until all transfer endpoints and RLS policies are migrated and tested. Guard owner/admin accounts against self-demotion, escalation and accidental deletion.
4. Existing member role updates must check actor permissions and target protection, write audit and return effective role. Deactivation is reversible; never delete auth user.
5. UI: same canonical role options at invitation and member editor; approval must show intended role and require explicit confirmation; display game rank separately. Match existing PHALANX FREEZEs and compact mobile layout.

## Required tests before release
- Server: anonymous/nonmember/Observer/Operator/Administrator/GOD access; no game-rank escalation; cross-user read/write; self-approval; duplicate invitation; concurrent approval; revoked/expired sessions.
- Registration: email confirmation, invitation, approval, rejection, atomic grant, login/logout, status, notification outbox and delivery.
- Scouting: candidate CRUD and delete restriction, notes, analysis, rankings, exports, navigation, existing live data.
- Account: list, edit roles, deactivate/reactivate, audit, existing admin and R5 protected, migration mapping and rollback.
- Browser: authorized SSO, physical Android, desktop and mobile regressions.
- Backup: current export CREATED; integrity CHECKED; isolated RESTORE TESTED. None proven in this work.

## Current evidence / limits
GitHub isolated branch created; this document committed only. No migration, function deployment, role change, merge, or production publish. No end-to-end test. This is NOT release-ready.
