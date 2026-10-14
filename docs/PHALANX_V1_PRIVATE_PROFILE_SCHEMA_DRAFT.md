# PHALANX V1 – private Account-/Profil-/Upload-Schema (DRAFT ONLY)
**2026-10-14.** Read-only Supabase audit: `public.app_profiles` and `public.nxs_memberships` exist and have RLS enabled, both with self-read SELECT policies. No private hero/troop/march tables; storage.buckets returned **zero buckets**. No migration applied. This is a proposed migration for security review and isolated staging, **not approved for production**.

## Proposed structure
- `phalanx_user_accounts`: `user_id uuid PK references auth.users on delete cascade`, `tier text check (tier in ('basic','full'))`, `created_at`, `updated_at`. First-login selection; both tiers work without third-party import.
- `phalanx_player_profiles`: `user_id uuid PK references auth.users on delete cascade`, `kingshot_player_id text null`, `player_name text null`, `kingdom integer null`, `identity_confirmed_at timestamptz null`, `source text`, `updated_at`. A Kingshot ID is a lookup hint, never authentication.
- `phalanx_user_heroes`: `id uuid PK`, `user_id uuid FK auth.users`, `hero_key text`, `stars numeric`, `skills jsonb`, `equipment jsonb`, `verified_at timestamptz`, `source`, unique(user_id,hero_key).
- `phalanx_user_troops`: `id uuid PK`, `user_id uuid FK`, `troop_type text`, `tier text`, `quantity bigint check(quantity >= 0)`, `verified_at`, unique(user_id,troop_type,tier).
- `phalanx_user_marches`: `id uuid PK`, `user_id uuid FK`, `label text`, `capacity integer check(capacity >= 0)`, `ratio jsonb`, `hero_locks jsonb`, `updated_at`.
- `phalanx_user_uploads`: `id uuid PK`, `user_id uuid FK`, `object_path text`, `kind text check(kind in ('screenshot','battle-report'))`, `sha256 text`, `extraction_status text`, `reviewed_at timestamptz`, `created_at`; uniqueness on (user_id,sha256,kind) for dedupe; no raw image bytes in DB.
- `phalanx_upload_extractions`: `upload_id uuid FK`, `user_id uuid FK`, `proposed_data jsonb`, `confidence jsonb`, `review_status text`, `corrected_data jsonb`, `reviewed_at`; never update confirmed profile from unreviewed extraction.

## Required controls before deployment
1. All tables **RLS enabled**, SELECT/INSERT/UPDATE/DELETE policies scoped to `(select auth.uid()) = user_id` with UPDATE USING **and WITH CHECK**, no anonymous access; test cross-user access. Ensure referenced upload/extraction rows have matching owner via composite FK or server-side ownership enforcement.
2. Storage bucket `phalanx-user-uploads` **private**, strict MIME/size limits, path `<auth.uid()>/<uuid>`, per-user storage.objects RLS for select/insert/delete, no public URLs; no upsert by default.
3. Explicit data retention, deletion, screenshot metadata handling, extraction audit, consent, external MightPulse terms and permission check.
4. User data never written into public repo, build logs, error messages or prompt templates; AI receives minimal verified fields.
5. Separate user consent and confirmation before any Mighty import; manual fallback and Basic remain functional.
6. Verify schema migration in isolated environment, authenticated real-client RLS, storage, deletion, mobile and E2E before any production change.

## Existing verified dependencies
- `app_profiles(user_id,display_name,created_at)`; existing SELECT self-policy.
- `nxs_memberships(user_id,role,active,granted_at,granted_by,expires_at)`; existing SELECT self-policy.
- `phalanx_alliance_players` contains snapshots and cannot be treated as an authenticated user's owned hero/troop profile.

**Decision gate:** Any actual production DDL, new storage bucket, user-data upload, third-party transfer or release requires explicit authorization.
