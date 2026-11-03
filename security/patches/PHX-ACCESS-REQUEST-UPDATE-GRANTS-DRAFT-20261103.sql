-- PHALANX SECURITY DRAFT — DO NOT APPLY TO PRODUCTION
-- Change intent: prohibit direct client UPDATE to access-request identity bindings.
-- Preconditions: current database+Auth backup, verified integrity, restore test,
-- dependency inventory, explicit approval, and tested rollback.
-- IMPORTANT: save exact original grants before changing them. A blanket GRANT UPDATE
-- is NOT a safe rollback if original privileges were column-specific.
-- Read-only preflight (run separately before any migration):
-- SELECT grantee, privilege_type, column_name FROM information_schema.column_privileges
-- WHERE table_schema='public' AND table_name='nexus_access_requests'
-- AND grantee IN ('PUBLIC','anon','authenticated') AND privilege_type='UPDATE';
-- SELECT policyname, cmd, roles, qual, with_check FROM pg_policies
-- WHERE schemaname='public' AND tablename='nexus_access_requests';
-- Check role inheritance and PUBLIC grants; do not assume REVOKE on direct grants
-- eliminates rights inherited from other roles.
BEGIN;
REVOKE UPDATE ON TABLE public.nexus_access_requests FROM PUBLIC, anon, authenticated;
-- For column-specific grants, explicitly revoke per-column UPDATE as well,
-- based on preflight inventory; do not execute until verified.
-- Confirm with has_table_privilege/has_column_privilege for anon/authenticated,
-- and test a direct UPDATE as both roles on a disposable copy.
COMMIT;
-- Rollback: restore ONLY the precise previously captured table/column grants,
-- not blanket GRANT UPDATE. Execute on a clone and verify before production.
-- service_role review workflow must be tested independently.
