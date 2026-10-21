# PHALANX Access Control V1 — Implementation Plan / Security Finding 2026-10-21

## Confirmed live policies (read-only inspection)
`public.nexus_access_requests`:
- `officers_read_access_requests`: SELECT allowed to authenticated users with active, unexpired `nxs_memberships.role` in `r4,r5,admin`.
- `officers_review_access_requests`: UPDATE allowed to same role set. Existing policy does **not** require a distinct explicit approval permission.
- `public_submit_access_request`: INSERT for anon/authenticated, only requires `status='pending'` and `reviewed_at/reviewed_by IS NULL`. This is not linked to an authenticated applicant and is not sufficient for the new account flow.
`public.nxs_memberships`: self-read policy only.
`public.app_profiles`: self-read policy only.
All these tables have RLS enabled.

## Priority security gap
Existing officer approval authorization by `r4`/`r5` conflicts with approved product FREEZE: **in-game rank never grants PHALANX approval privileges**. Even if these database roles were previously internal PHALANX roles, the new explicit permission model requires a separate `access_requests.approve` grant. Treat as migration blocker; do not simply add a new permissive RLS policy because PostgreSQL policies may OR together, leaving old broad approval access intact.

## Target architecture (not deployed)
1. Registration uses Supabase Auth for email/password + email verification, plus game player ID stored in an authenticated, user-owned pending request. No nickname/alliance manual entry. Server checks input and rate limits.
2. Pending/rejected users can read only their own request status and necessary account settings. No default access to restricted app data or PYLON.
3. Admin reviews source-linked player identity, approves or rejects with reason. An approval transaction must atomically set status, immutable audit data, player-ID ownership mapping and active membership with least privilege. Prevent duplicate active player-ID claims. No self-approval.
4. Roles are convenience presets; **capabilities** and scope (kingdom/alliance/resource) determine effective access. Grant `access_requests.approve` explicitly only to authorized administrators; no inherited grants from game rank.
5. Approved-user default: own profile, Outpost map and public Outpost location/ownership facts, PYLON for those. Rankings restricted.
6. Strategist/Analyst preset: full relevant battle/KvK intelligence, rankings, opponent analytics, reports and PYLON synthesis within approved scope; no user administration, security configuration or arbitrary writes.
7. Enforce capabilities in server-side RLS / secure RPC / tools. Re-check for PYLON and exports. Never expose privileged service keys in frontend.
8. Before migration: inventory triggers/functions/grants, evaluate current users and roles, prepare isolated migration with rollback and tests for pending, member, analyst, admin, revoked, other alliance and malicious direct API calls.

## Status
Read-only security inspection and documented target architecture. No production policy/DB changes, no deploy, no main merge. The user has approved the product design but **not** a production authorization migration.
