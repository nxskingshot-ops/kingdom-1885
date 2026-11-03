# PHALANX GOD MODE — Access review privileged-path finding
2026-11-03 | PRODUCTION READ-ONLY | RELEASE BLOCKER | NOT EXPLOIT-TESTED

## Confirmed code
- ACTIVE Edge Function nexus-access-review v6, verify_jwt=true.
- Authenticated active admin can invoke action=reset against an approved access request; it reads granted_user_id from nexus_access_requests and calls service-role auth.admin.updateUserById(granted_user_id,{password:nextPassword}).
- No explicit owner-exclusion guard in reset branch.
- nxs-guest-setup v5 uses service role to create guest auth users and insert memberships; cleanup uses auth.admin.deleteUser(guest).
- outpost-editor v6 references memberships; verify_jwt=false, requires separate code-path authorization review.
- phalanx-ranking-auditor-26 v2 uses service role for read membership check, no auth.admin actions found in scan.

## Confirmed database grants/policies
- nexus_access_requests: authenticated UPDATE policy officers_review_access_requests allows active unexpired r4/r5/admin with USING and WITH CHECK based on officer membership, not immutable request fields.
- authenticated has UPDATE column privileges including granted_user_id, status, granted_role. anon also has column UPDATE privileges, but no anon UPDATE policy was observed.
- Therefore a permitted officer can potentially alter sensitive request linkage through direct Data API before an admin invokes reset. This is a plausible escalation chain; NO exploit was attempted and full prerequisites are not proven.

## Required containment design (NOT DEPLOYED)
1. Review dependencies and perform verified backup + isolated restore before any production policy/privilege change.
2. Make approved request identity binding immutable to ordinary officers; deny direct client UPDATE of granted_user_id and status except controlled server workflow, preserving legitimate review.
3. Add explicit owner-target denial in ALL auth.admin password reset, ban, delete and recovery routes; never rely only on a mutable access request reference.
4. Separate owner principal and MFA/recovery from admin membership; privileged server API must check protected owner identity.
5. Test admin reset of ordinary user succeeds; owner reset fails; R4 cannot reset; attempts to modify approved granted_user_id fail; no regression to approval/guest setup.
6. Verify service_role key handling and audit every sensitive operation.

## Status
Production policy/source inspection: PASS.
Exploitation: NOT TESTED.
Patch: NOT IMPLEMENTED.
Backup/restore: NOT VERIFIED.
PUBLIC RELEASE: BLOCKED.
