CREATE SCHEMA app_private;
GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
CREATE TABLE public.nxs_memberships (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('kingdom','member','outpost_manager','r4','r5','admin')),
  active boolean NOT NULL DEFAULT false, granted_at timestamptz NOT NULL DEFAULT now(),
  granted_by uuid REFERENCES auth.users(id), expires_at timestamptz
);
ALTER TABLE public.nxs_memberships ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.nxs_memberships TO authenticated;
CREATE POLICY nxs_membership_read_self ON public.nxs_memberships FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
CREATE TABLE public.nxs_audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, table_name text NOT NULL,
  record_key text NOT NULL, operation text NOT NULL, actor_id uuid,
  before_data jsonb, after_data jsonb, recorded_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.nxs_audit_log ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.transfer_candidates (
  candidate_id text PRIMARY KEY, player_name text NOT NULL, kingdom text, alliance text,
  power_m numeric, castle_level text, contact_status text, transfer_eligibility text,
  recruiter text, notes text, metadata jsonb NOT NULL DEFAULT '{}', updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.transfer_candidates ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transfer_candidates TO authenticated;

CREATE FUNCTION app_private.nxs_role_at_least(min_role text) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $function$
  SELECT EXISTS (SELECT 1 FROM public.nxs_memberships m
    WHERE m.user_id = (SELECT auth.uid()) AND m.active AND (m.expires_at IS NULL OR m.expires_at > now())
      AND CASE min_role
        WHEN 'member' THEN m.role IN ('member','r4','r5','admin')
        WHEN 'r4' THEN m.role IN ('r4','r5','admin')
        ELSE false
      END);
$function$;
REVOKE ALL ON FUNCTION app_private.nxs_role_at_least(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_private.nxs_role_at_least(text) TO authenticated;
CREATE POLICY nxs_read_transfer_candidates ON public.transfer_candidates FOR SELECT TO authenticated
  USING ((SELECT app_private.nxs_role_at_least('member')));
CREATE POLICY nxs_r4_insert_transfer ON public.transfer_candidates FOR INSERT TO authenticated
  WITH CHECK ((SELECT app_private.nxs_role_at_least('r4')));
CREATE POLICY nxs_r4_update_transfer ON public.transfer_candidates FOR UPDATE TO authenticated
  USING ((SELECT app_private.nxs_role_at_least('r4'))) WITH CHECK ((SELECT app_private.nxs_role_at_least('r4')));
CREATE POLICY nxs_r4_delete_transfer ON public.transfer_candidates FOR DELETE TO authenticated
  USING ((SELECT app_private.nxs_role_at_least('r4')));
CREATE FUNCTION app_private.nxs_audit_change() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
  INSERT INTO public.nxs_audit_log(table_name,record_key,operation,actor_id,before_data,after_data)
    VALUES (TG_TABLE_NAME,coalesce(NEW.candidate_id,OLD.candidate_id),TG_OP,auth.uid(),
            CASE WHEN TG_OP='INSERT' THEN NULL ELSE to_jsonb(OLD) END,
            CASE WHEN TG_OP='DELETE' THEN NULL ELSE to_jsonb(NEW) END);
  RETURN coalesce(NEW,OLD);
END;
$function$;
REVOKE ALL ON FUNCTION app_private.nxs_audit_change() FROM PUBLIC;
CREATE TRIGGER transfer_candidates_audit AFTER INSERT OR DELETE OR UPDATE ON public.transfer_candidates
  FOR EACH ROW EXECUTE FUNCTION app_private.nxs_audit_change();
