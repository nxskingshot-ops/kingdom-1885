-- PHALANX SECURITY DRAFT - DO NOT APPLY TO PRODUCTION
-- Reviewed 2026-11-03. Requires full dependency audit, current backup, restore rehearsal, approval.
-- Existing nexus-access-review v6 performs approve/reject via service_role.
-- Existing preview/kingdom-hub-menu-test.html reads access requests and invokes Edge Function.
-- Goal: remove direct client UPDATE of identity-binding and status columns.
BEGIN;
REVOKE UPDATE ON TABLE public.nexus_access_requests FROM anon, authenticated;
-- IMPORTANT: verify no inherited PUBLIC UPDATE grant remains.
-- IMPORTANT: RLS UPDATE policy alone is insufficient; keep policy until all dependencies reviewed.
-- Server-only review endpoint must continue to perform authorized changes.
COMMIT;
-- Rollback ONLY if explicitly approved and previous grants verified:
-- GRANT UPDATE ON TABLE public.nexus_access_requests TO authenticated;
-- Do NOT grant anon UPDATE unless verified to have been necessary.
