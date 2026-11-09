# PHX Identity Registry V1 — implementation gate
Date: 2026-11-09
Status: ISOLATED DESIGN / NOT DEPLOYED

## Verified baseline
Supabase project hcjrdofkdkasznywvcxo; auth.users (7), app_profiles (7), nxs_memberships (6), nexus_access_requests (2). Existing membership roles are authoritative. No auth, role, or user records may be overwritten by identity enrollment.

## Identity model
Add a dedicated private identity table in a reviewed migration, with user_id UUID UNIQUE referencing auth.users, kingshot_player_id TEXT UNIQUE when verified, display_name, kingdom, alliance, verification_status (unverified / pending / verified / disputed), verified_by, verified_at, source, created_at, updated_at. Keep historical identity claims in an append-only audit table with access restricted to authorized administrators. Do not copy email into this table: join to auth.users only in trusted server-side code.

## Registration
Email + password + Kingshot player ID mandatory. Verify email. Resolve available name/kingdom/alliance from approved lookup, otherwise mark pending; never treat lookup as proof of ownership. New user has no privileged membership until explicit approval. Prevent duplicate verified player IDs and implement a dispute/recovery flow. Existing accounts must not be reset.

## Access control
Identity and authorization separate. Never infer r5/admin/GOD from player ID, alliance, user_metadata or client claims. Preserve existing nxs_memberships role and GOD owner guard. Read own identity only; admin listing and verification through authenticated server-side authorization, audit every change. Never expose auth.users directly to browser.

## Migration and release gate
1. Review latest deployed account-management code and canonical branch.
2. Export and verify recoverable database backup; test restore in isolated environment.
3. Implement additive migration with RLS, unique constraints and ownership-safe policies.
4. Backfill only user-confirmed identity (An Morrigan player 291688449 for existing R5 account) after verifying account linkage; leave other unknown IDs pending.
5. Implement registration and account-management UI in current PHALANX layout, no FREEZE changes.
6. Test duplicate IDs, spoofing, role escalation, user self-read, admin read, migration rollback, Android and regressions.
7. Obtain separate release approval for production.

## 2026-11-09 evidence
matze4428@gmail.com has active admin membership. gemmafinnegan@gmail.com has active r5 membership; user confirmed that this is An Morrigan. An's Kingshot ID 291688449 is user-provided, not API-verified. The +phxarbeitsapp1109 account has no membership. Two expired guest accounts are inactive. Current account-management UI showing only two accounts requires code-level investigation.

## Tests
Database read-only baseline: PASS.
Branch creation: PASS.
Migration, RLS, registration, integration, Android, backup, restore: NOT TESTED.
No production changes performed.
