-- ISOLATED REVIEW DRAFT ONLY. DO NOT RUN WITHOUT BACKUP, DEPENDENCY REVIEW AND RELEASE APPROVAL.
-- Access requests are reviewed by the privileged Edge Function using service_role.
-- Remove authenticated direct write permission on the request table only after
-- verifying the current frontend and all RPC/Edge Function consumers.
BEGIN;
REVOKE UPDATE ON TABLE public.nexus_access_requests FROM authenticated;
-- PostgreSQL column grants can remain separately effective; revoke them explicitly.
REVOKE UPDATE (id, gamer_tag, player_id, alliance, status, requested_at,
  reviewed_at, reviewed_by, note, granted_user_id, granted_role)
ON TABLE public.nexus_access_requests FROM authenticated;
COMMIT;
-- ROLLBACK PLAN: restore exactly the pre-change table/column grants captured
-- from pg_catalog, not an assumed GRANT UPDATE to all columns.
-- REQUIRED GATES: production backup + restore proof, review UI regression,
-- service_role review approve/reject/reset, owner protection and negative RLS tests.
