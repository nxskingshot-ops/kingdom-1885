# PHALANX Identity Registry V1 — verified authorization gap and safe migration plan
Date: 2026-11-09
Status: NOT DEPLOYED — NO PRODUCTION DB CHANGES

## Live RLS findings (read-only Supabase inspection)
- public.nexus_access_requests policy officers_read_access_requests currently permits r4/r5/admin SELECT.
- public.nexus_access_requests policy officers_review_access_requests currently permits r4/r5/admin UPDATE.
- public.transfer_candidates policy nxs_r4_delete_transfer currently permits nxs_role_at_least('r4') DELETE.
These conflict with approved matrix: only Admin may review/approve registration requests and delete candidates.
- Existing public.nxs_memberships only allows self SELECT. Existing auth/app_profiles data must be preserved.

## Safe target design
- Identity registry is additive; user_id references auth.users; unique Kingshot player ID for verified assignments; verification state and audit.
- No applicant role self-selection; admin approval selects member/r4/r5/admin. Admin selection is only permitted to a verified active Admin. GOD excluded.
- RLS restrict request SELECT/UPDATE and candidate DELETE to verified active Admin; protect registration approval transaction with server-side authorization and audit.
- Existing R4/R5 scouting create/update/export remains intact.
- Do not rely on user-editable metadata, UI hiding, or a raw client write to nxs_memberships.

## Mandatory before deployment
1. Inspect registration/account management frontend and any Edge Functions for reliance on current policies.
2. Obtain recoverable DB backup, integrity verification and isolated restore test.
3. Prepare additive migration plus rollback, review grants and security definer usage.
4. Test Admin, R5, R4, Member, unauthenticated and inactive users; direct REST attempts; spoofed IDs; duplicate registrations; admin-to-admin delegation; GOD protection.
5. Regression: Android, account management, candidate edit/delete, existing registrations, navigation.
6. Explicit release approval. No existing accounts, roles or production policies have been changed by this document.

## Evidence
Supabase public pg_policies read-only query, 2026-11-09.
Database authorization gap discovery: PASS.
Backup / restore / migration / deployed authorization / UI integration / regression: NOT TESTED.

## Additional source inspection — 2026-11-09
Inspected existing preview/kingdom-hub-menu-test.html on work branch and live Supabase Edge Function nexus-access-review version 8 (ACTIVE, sha256 c02a84df38389f0bc37529f1388ea6256dca3e26da0420d15a5a04be080e1e16).
- Legacy frontend checkNexusAccessAdmin accepts r4/r5/admin, and role dropdown includes kingdom, member, outpost, officer, r5, admin; default is member for NXS, kingdom otherwise. This is NOT the approved explicit role selection policy.
- Live Edge Function accepts r4/r5/admin for review; non-admin R4/R5 can approve member/kingdom and reject requests, contradicting new Admin-only approval rule. Admin-only restriction already exists for granting elevated roles and credential reset, but is insufficient.
- Live Edge Function creates a fresh technical @example.com auth account and random password for each approval, instead of linking an existing registered identity. Identity Registry must avoid duplicates and must not delete existing users during failure cleanup.
- Live function has a protected owner ID for password reset; preserve this guard and verify independently before changes.
- The preview file is a legacy surface; current PHALANX Access Management frontend and other deployed Edge Functions still need discovery before any fix. Do not assume this file is the current user-facing screen.
- No source or deployment modified; this is read-only evidence.
