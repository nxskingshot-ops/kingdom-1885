-- PHALANX Access V2 – REVIEW ONLY, NOT APPLIED, NO OWNER SEED.
-- Preconditions: canonical GOD auth principal independently verified;
-- backup/rollback reviewed; explicit approval to install isolated migration.
-- Must never derive GOD identity from Kingshot rank, player ID or first admin.
BEGIN;
CREATE TABLE IF NOT EXISTS public.phx_god_owner_principal (
 singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
 auth_user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE RESTRICT,
 established_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.phx_god_owner_principal ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.phx_god_owner_principal FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.phx_set_app_role_v2(
 p_target_user_id uuid,p_new_role text,p_reason text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $function$
DECLARE
 v_actor uuid := auth.uid();
 v_previous text;
 v_owner uuid;
 v_existing boolean;
BEGIN
 IF v_actor IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
 IF NOT EXISTS(SELECT 1 FROM public.phx_app_roles WHERE user_id=v_actor AND app_role='administrator' AND active)
 THEN RAISE EXCEPTION 'PHALANX administrator required' USING ERRCODE='42501'; END IF;
 IF p_new_role IS NULL OR p_new_role NOT IN ('observer','operator','administrator')
 THEN RAISE EXCEPTION 'Invalid PHALANX role' USING ERRCODE='22023'; END IF;
 IF p_reason IS NULL OR char_length(btrim(p_reason)) NOT BETWEEN 3 AND 500
 THEN RAISE EXCEPTION 'Reason required (3–500 characters)' USING ERRCODE='22023'; END IF;
 IF p_target_user_id IS NULL OR NOT EXISTS(SELECT 1 FROM auth.users WHERE id=p_target_user_id)
 THEN RAISE EXCEPTION 'Verified target auth user required' USING ERRCODE='22023'; END IF;
 IF p_target_user_id=v_actor THEN RAISE EXCEPTION 'Administrator cannot change own role' USING ERRCODE='42501'; END IF;
 -- Fail closed if owner registry is absent, empty, or malformed.
 SELECT auth_user_id INTO STRICT v_owner FROM public.phx_god_owner_principal WHERE singleton=true;
 IF p_target_user_id=v_owner THEN RAISE EXCEPTION 'Protected GOD owner role cannot be changed' USING ERRCODE='42501'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_target_user_id::text,0));
 -- Protect administrator accounts regardless of active flag.
 SELECT app_role INTO v_previous FROM public.phx_app_roles WHERE user_id=p_target_user_id FOR UPDATE;
 v_existing:=FOUND;
 IF v_existing AND v_previous='administrator'
 THEN RAISE EXCEPTION 'Protected administrator role cannot be modified here' USING ERRCODE='42501'; END IF;
 IF v_existing AND v_previous=p_new_role
 THEN RETURN jsonb_build_object('changed',false,'role',p_new_role); END IF;
 INSERT INTO public.phx_app_roles(user_id,app_role,active,assigned_by,source)
 VALUES(p_target_user_id,p_new_role,true,v_actor,'admin_change')
 ON CONFLICT(user_id) DO UPDATE SET
 app_role=excluded.app_role,active=true,assigned_by=v_actor,updated_at=now(),source='admin_change';
 INSERT INTO public.phx_app_role_events(target_user_id,actor_user_id,previous_role,next_role,reason)
 VALUES(p_target_user_id,v_actor,v_previous,p_new_role,btrim(p_reason));
 RETURN jsonb_build_object('changed',true,'role',p_new_role);
EXCEPTION WHEN no_data_found OR too_many_rows THEN
 RAISE EXCEPTION 'GOD owner registry not initialized safely' USING ERRCODE='42501';
END;
$function$;
-- Explicitly rollback: this file is a complete reviewable patch, not deployment.
ROLLBACK;
