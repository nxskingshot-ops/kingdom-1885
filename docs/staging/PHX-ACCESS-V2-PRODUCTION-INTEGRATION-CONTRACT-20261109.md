# PHALANX Access V2 — production integration contract (staging proposal)
Status: DESIGN ONLY / NOT DEPLOYED. Date: 2026-11-09.
Scope: Existing Supabase project hcjrdofkdkasznywvcxo. This document authorizes no database changes.

## Verified current state
- Existing identity is Supabase auth.users; production sign-in on Android confirmed by user.
- Existing nxs_memberships: user_id UUID, role TEXT, active BOOLEAN, granted_at TIMESTAMPTZ, granted_by UUID, expires_at TIMESTAMPTZ.
- Existing nexus_access_requests: id BIGINT, gamer_tag, player_id, alliance, status, requested_at, reviewed_at, reviewed_by, note, granted_user_id, granted_role.
- Existing app_profiles: user_id, display_name, created_at.
- Existing nexus-access-review v8 checks a validated bearer token and active r4/r5/admin membership; only admin may grant elevated legacy rights.
- Isolated Access V2 uses separate project yuyvmbdybwpwpqsipfjt, tables phx_app_roles / phx_app_role_events, and RPC phx_set_app_role_v2. Its user IDs cannot be copied across projects.

## Required integration, not yet implemented
1. Create a *new* production-side PHALANX app-role table, independent of nxs_memberships, only after schema, RLS, grants, constraints, backup and rollback review. Do not modify existing role values.
2. Server-authorized listing and mutation endpoints: verify the bearer identity, check a current administrator grant server-side, protect owner and self changes, require a reason, and write an audit event atomically.
3. No automatic Observer assignment, no email-based GOD bootstrap, no cross-project UUID copy.
4. Existing registration flow must explicitly choose Observer, Operator or Administrator; game ranks are distinct. Avoid automatically creating throwaway credentials.
5. Integrate with the existing PHALANX login and UI without replacing HOME, navigation, Transfer Scouting, Outpost Map or other frozen modules.
6. Require a real recovery procedure and rollback proof before production deployment.

## Release gates
- SQL constraints and RLS: NOT TESTED
- Auth and denial paths (no session, wrong role, expired, owner, self): NOT TESTED in integrated environment
- Member list, grant, update, audit, registration approval: NOT TESTED
- Android and navigation regressions: NOT TESTED
- Backup created / integrity checked / restore tested: NOT VERIFIED for this release
- Production deployment: NOT AUTHORIZED / NOT PERFORMED

## Rollback
For staging, revert the branch commits. Production rollback must be planned against actual schema and verified backup before migration; do not drop any table or erase roles.
