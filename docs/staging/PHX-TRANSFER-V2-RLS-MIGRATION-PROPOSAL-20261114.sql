-- PHX TRANSFER SCOUTING V2: ISOLATED DATABASE MIGRATION PROPOSAL
-- DO NOT EXECUTE AGAINST PRODUCTION. Requires approved role mapping,
-- verified backup and successful restore rehearsal in isolated DB.
-- No user rows, candidate records or sessions are modified.
BEGIN;
-- Fail if the expected legacy policies are absent/renamed.
DO $$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM pg_policies
 WHERE schemaname='public' AND tablename='transfer_candidates'
 AND policyname IN ('nxs_r4_delete_transfer','nxs_r4_insert_transfer','nxs_r4_update_transfer','nxs_read_transfer_candidates','phx_scouting_v2_insert','phx_scouting_v2_update','phx_transfer_admin_delete');
 IF n <> 7 THEN RAISE EXCEPTION 'Expected seven existing policies, found %; stop and re-audit',n; END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace ns ON ns.oid=c.relnamespace WHERE ns.nspname='public' AND c.relname='transfer_candidates' AND c.relrowsecurity) THEN
 RAISE EXCEPTION 'transfer_candidates RLS not enabled'; END IF;
END $$;
-- Remove legacy OR-bypass rules. Existing V2 insert/update and admin-delete remain.
DROP POLICY "nxs_r4_delete_transfer" ON public.transfer_candidates;
DROP POLICY "nxs_r4_insert_transfer" ON public.transfer_candidates;
DROP POLICY "nxs_r4_update_transfer" ON public.transfer_candidates;
DROP POLICY "nxs_read_transfer_candidates" ON public.transfer_candidates;
-- Observers, operators and administrators require explicit valid Transfer membership.
CREATE POLICY "phx_scouting_v2_select" ON public.transfer_candidates
 AS PERMISSIVE FOR SELECT TO authenticated
 USING ((SELECT app_private.phx_current_scouting_role()) IN ('observer','operator','administrator'));
COMMIT;
-- Postmigration: check policy inventory, grants, and test actual authenticated
-- SELECT/INSERT/UPDATE/DELETE with isolated synthetic identities.
-- Rollback: restore exact prior policy DDL from independently verified backup.
