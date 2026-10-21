# PHALANX registration integration audit — 2026-10-21 (read-only)

## Existing database assets
- `public.nexus_access_requests` (RLS enabled; metadata showed 2 records): `id`, `gamer_tag`, `player_id`, `alliance`, `status` (pending/approved/rejected), `requested_at`, `reviewed_at`, `reviewed_by`, `note`, `granted_user_id`, `granted_role`.
- `public.nxs_memberships` (RLS enabled): `user_id`, `role`, `active` (default false), `granted_at`, `granted_by`, `expires_at`.
- `public.app_profiles` (RLS enabled): `user_id`, `display_name`, `created_at`.
- `public.nxs_audit_log` exists.

## Gaps before a safe implementation
1. Existing access request has no required `auth.users` ownership link for pending requests; `granted_user_id` is nullable and apparently assigned on approval. Verify actual RLS and auth flow, and ensure an authenticated applicant can see **only their own** request.
2. Current access request requires manual `gamer_tag` and `alliance`; new product FREEZE requires **email/password/player ID only**. Avoid making users fill those fields; source-populate only if verified or design a compatible isolated migration.
3. Need enforce player-ID uniqueness for approved identity mappings, conflict review, audit trail, and admin-only approval. Do not infer player ownership from ID alone.
4. Pending users must be blocked by backend policies from private app data; UI-only hiding is insufficient.
5. Verify email confirmation behavior and app redirect. Avoid password storage outside Supabase Auth.
6. Design current source mapping with (kingdom,uid) and a way to discover kingdom if only player ID is provided; do not assume all users are in #1885.
7. Verify all existing policies, triggers, grants, and functions before modifying schema.

## Scope
Read-only inventory, no migrations, no auth setting changes, no production writes, no deployment, no merge. Existing HOME design FREEZE untouched.
