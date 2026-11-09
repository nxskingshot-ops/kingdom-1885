-- PHALANX isolated role guard, review-only. DO NOT execute in production.
-- Applies only to the isolated Supabase project after verified backup and rollback rehearsal.
-- Preserves existing role table and role event history.
CREATE OR REPLACE FUNCTION public.phx_set_app_role_v2(p_target_user_id uuid,p_new_role text,p_reason text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $function$
DECLARE
  v_actor uuid := auth.uid();
  v_previous text;
  v_existing boolean;
  v_owner uuid;
  v_delegate uuid;
BEGIN
  IF v_actor IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='28000'; END IF;
  SELECT protected_user_id,delegate_user_id INTO v_owner,v_delegate
    FROM app_private.phx_access_settings WHERE singleton = true FOR SHARE;
  IF v_owner IS NULL THEN RAISE EXCEPTION 'Owner protection is not configured' USING ERRCODE='42501'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.phx_app_roles r
    WHERE r.user_id=v_actor AND r.app_role='administrator' AND r.active)
  THEN RAISE EXCEPTION 'PHALANX administrator required' USING ERRCODE='42501'; END IF;
  IF p_new_role IS NULL OR p_new_role NOT IN ('observer','operator','administrator')
  THEN RAISE EXCEPTION 'Invalid PHALANX role' USING ERRCODE='22023'; END IF;
  IF p_reason IS NULL OR char_length(btrim(p_reason)) NOT BETWEEN 3 AND 500
  THEN RAISE EXCEPTION 'Reason required (3-500 characters)' USING ERRCODE='22023'; END IF;
  IF p_target_user_id IS NULL OR p_target_user_id=v_actor
    OR p_target_user_id=v_owner OR p_target_user_id IS NOT DISTINCT FROM v_delegate
  THEN RAISE EXCEPTION 'This account is protected' USING ERRCODE='42501'; END IF;
  IF NOT EXISTS(SELECT 1 FROM auth.users u WHERE u.id=p_target_user_id
    AND u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL AND NOT u.is_anonymous
    AND (u.banned_until IS NULL OR u.banned_until<=clock_timestamp()))
  THEN RAISE EXCEPTION 'Verified active target auth user required' USING ERRCODE='22023'; END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(p_target_user_id::text,0));
  SELECT r.app_role INTO v_previous FROM public.phx_app_roles r
    WHERE r.user_id=p_target_user_id AND r.active FOR UPDATE;
  v_existing:=FOUND;
  IF v_existing AND v_previous='administrator' AND p_new_role<>'administrator'
  THEN RAISE EXCEPTION 'Protected administrator role cannot be demoted here' USING ERRCODE='42501'; END IF;
  IF v_existing AND v_previous=p_new_role
  THEN RETURN jsonb_build_object('changed',false,'role',p_new_role); END IF;
  INSERT INTO public.phx_app_roles(user_id,app_role,active,assigned_by,source)
  VALUES(p_target_user_id,p_new_role,true,v_actor,'admin_change')
  ON CONFLICT(user_id) DO UPDATE SET app_role=excluded.app_role,active=true,
    assigned_by=v_actor,updated_at=now(),source='admin_change';
  INSERT INTO public.phx_app_role_events(target_user_id,actor_user_id,previous_role,next_role,reason)
  VALUES(p_target_user_id,v_actor,v_previous,p_new_role,btrim(p_reason));
  RETURN jsonb_build_object('changed',true,'role',p_new_role);
END;
$function$;
-- Preserve preexisting EXECUTE grants: CREATE OR REPLACE retains privileges.
