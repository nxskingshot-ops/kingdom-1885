-- Scoped ACL snapshot taken read-only from the production project on 2026-11-09.
-- Replay exclusively inside the network-disabled restore rehearsal.
BEGIN;

ALTER SCHEMA app_private OWNER TO postgres;
ALTER TABLE app_private.phx_access_invites OWNER TO postgres;
ALTER TABLE app_private.phx_access_rejections OWNER TO postgres;
ALTER TABLE app_private.phx_access_settings OWNER TO postgres;
ALTER TABLE public.nxs_audit_log OWNER TO postgres;
ALTER TABLE public.nxs_memberships OWNER TO postgres;
ALTER TABLE public.transfer_candidates OWNER TO postgres;
ALTER FUNCTION app_private.nxs_audit_change() OWNER TO postgres;
ALTER FUNCTION app_private.nxs_role_at_least(text) OWNER TO postgres;
ALTER FUNCTION app_private.phx_access_management(text,uuid,text,text,text) OWNER TO postgres;
ALTER FUNCTION app_private.phx_registration_player_id(jsonb) OWNER TO postgres;
ALTER FUNCTION public.phx_access_management(text,uuid,text,text,text) OWNER TO postgres;

REVOKE ALL ON SCHEMA app_private FROM PUBLIC, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA app_private TO authenticated;
-- Minimum session lookup and row-lock rights used by the postgres-owned access function.
GRANT USAGE ON SCHEMA auth TO postgres, authenticated;
GRANT SELECT, UPDATE ON TABLE auth.users, auth.sessions TO postgres;
REVOKE ALL ON TABLE app_private.phx_access_invites, app_private.phx_access_rejections,
  app_private.phx_access_settings, public.nxs_audit_log, public.nxs_memberships,
  public.transfer_candidates FROM PUBLIC, anon, authenticated, service_role;
GRANT ALL ON TABLE public.nxs_audit_log, public.nxs_memberships, public.transfer_candidates TO service_role;
GRANT SELECT ON TABLE public.nxs_memberships TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.transfer_candidates TO authenticated;

REVOKE ALL ON FUNCTION app_private.nxs_audit_change(), app_private.nxs_role_at_least(text),
  app_private.phx_access_management(text,uuid,text,text,text), app_private.phx_registration_player_id(jsonb),
  public.phx_access_management(text,uuid,text,text,text) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.nxs_audit_change(), app_private.nxs_role_at_least(text),
  public.phx_access_management(text,uuid,text,text,text) TO service_role;
GRANT EXECUTE ON FUNCTION app_private.nxs_role_at_least(text),
  app_private.phx_access_management(text,uuid,text,text,text),
  public.phx_access_management(text,uuid,text,text,text) TO authenticated;

DO $check$
BEGIN
  IF (SELECT count(*) FROM pg_class WHERE relrowsecurity AND oid IN (
      'public.nxs_audit_log'::regclass, 'public.nxs_memberships'::regclass, 'public.transfer_candidates'::regclass,
      'app_private.phx_access_invites'::regclass, 'app_private.phx_access_rejections'::regclass,
      'app_private.phx_access_settings'::regclass)) <> 6
    OR has_function_privilege('anon', 'public.phx_access_management(text,uuid,text,text,text)', 'execute')
    OR NOT has_function_privilege('authenticated', 'public.phx_access_management(text,uuid,text,text,text)', 'execute')
    OR has_table_privilege('authenticated', 'public.nxs_memberships', 'update')
    OR has_table_privilege('authenticated', 'app_private.phx_access_settings', 'select')
    OR NOT has_table_privilege('authenticated', 'public.transfer_candidates', 'update') THEN
    RAISE EXCEPTION 'Restored Access V2 ACL or RLS mismatch';
  END IF;
END;
$check$;

COMMIT;
