-- PHALANX Access V2 – ISOLATED-ONLY REVIEW DRAFT, NOT APPLIED.
-- Requires canonical owner auth principal verification and approved migration gate.
-- Do NOT deploy to production or run without owner registry bootstrap and backup.
--
-- Key invariant: owner identity is immutable and independent of game ID / R5.
-- The owner registry is intentionally NOT seeded by email, game ID, or first admin.
BEGIN;
CREATE TABLE IF NOT EXISTS public.phx_god_owner_principal (
 singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
 auth_user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE RESTRICT,
 established_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.phx_god_owner_principal ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.phx_god_owner_principal FROM PUBLIC, anon, authenticated;
-- No policies: no client reads or writes. Owner establishment is a separate
-- reviewed infrastructure action, never an application RPC.

-- Proposed change to phx_set_app_role_v2 (not installed here):
-- 1. Require exactly one verified owner principal before allowing mutations.
-- 2. Reject p_target_user_id equal to protected owner regardless of active status.
-- 3. Query existing target app_role WITHOUT filtering by active:
--      SELECT app_role INTO v_previous
--      FROM public.phx_app_roles
--      WHERE user_id=p_target_user_id FOR UPDATE;
-- 4. Deny any existing administrator target modification unless through a
--    separately authorized, audited owner-governed recovery flow.
-- 5. Preserve authenticated active administrator requirement, reason, audit,
--    advisory lock, and atomic transaction.
-- 6. Apply equivalent protection to invitations, approval and revocation flows.
--
-- This file deliberately does not CREATE OR REPLACE the existing function:
-- installing an incomplete guard would create false security.
ROLLBACK;
