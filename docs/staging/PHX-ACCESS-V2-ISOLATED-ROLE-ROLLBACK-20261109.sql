-- Original isolated function definition captured before V2 guard change.
CREATE OR REPLACE FUNCTION public.phx_set_app_role_v2(p_target_user_id uuid, p_new_role text, p_reason text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 v_actor uuid := auth.uid();
 v_previous text;
 v_existing boolean;
begin
 if v_actor is null then raise exception 'Authentication required' using errcode='28000'; end if;
 if not exists (
  select 1 from public.phx_app_roles
  where user_id=v_actor and app_role='administrator' and active
 ) then raise exception 'PHALANX administrator required' using errcode='42501'; end if;
 if p_new_role is null or p_new_role not in ('observer','operator','administrator') then
  raise exception 'Invalid PHALANX role' using errcode='22023'; end if;
 if p_reason is null or char_length(btrim(p_reason)) not between 3 and 500 then
  raise exception 'Reason required (3–500 characters)' using errcode='22023'; end if;
 if p_target_user_id is null or not exists(select 1 from auth.users where id=p_target_user_id) then
  raise exception 'Verified target auth user required' using errcode='22023'; end if;
 if p_target_user_id=v_actor then
  raise exception 'Administrator cannot change own role' using errcode='42501'; end if;
 -- Serialize role edits. Protect existing admins from unilateral demotion.
 perform pg_advisory_xact_lock(hashtextextended(p_target_user_id::text, 0));
 select app_role into v_previous from public.phx_app_roles
 where user_id=p_target_user_id and active for update;
 v_existing := found;
 if v_existing and v_previous='administrator' and p_new_role<>'administrator' then
  raise exception 'Protected administrator role cannot be demoted here' using errcode='42501'; end if;
 if v_existing and v_previous=p_new_role then
  return jsonb_build_object('changed',false,'role',p_new_role); end if;
 insert into public.phx_app_roles(user_id,app_role,active,assigned_by,source)
 values(p_target_user_id,p_new_role,true,v_actor,'admin_change')
 on conflict (user_id) do update set
 app_role=excluded.app_role,active=true,assigned_by=v_actor,
 updated_at=now(),source='admin_change';
 insert into public.phx_app_role_events(target_user_id,actor_user_id,previous_role,next_role,reason)
 values(p_target_user_id,v_actor,v_previous,p_new_role,btrim(p_reason));
 return jsonb_build_object('changed',true,'role',p_new_role);
end;
$function$

