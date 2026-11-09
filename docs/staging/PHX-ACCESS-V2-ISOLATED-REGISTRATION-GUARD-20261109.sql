-- Isolated-only migration; original definition in REGISTRATION-ROLLBACK file.
CREATE OR REPLACE FUNCTION public.phx_approve_registration_with_role_v2(p_application_id uuid, p_app_role text, p_public_message text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 v_actor uuid := auth.uid();
 v_target uuid;
 v_status text;
 v_result jsonb;
 v_owner uuid;
 v_delegate uuid;
begin
 if v_actor is null then raise exception 'Authentication required' using errcode='28000'; end if;
 if not exists(select 1 from public.phx_app_roles where user_id=v_actor and app_role='administrator' and active)
 then raise exception 'PHALANX administrator required' using errcode='42501'; end if;
 if not exists(select 1 from public.phx_registration_reviewers where user_id=v_actor and enabled)
 then raise exception 'Registration reviewer required' using errcode='42501'; end if;
 if p_app_role is null or p_app_role not in ('observer','operator','administrator')
 then raise exception 'Invalid PHALANX role' using errcode='22023'; end if;
 if length(coalesce(p_public_message,''))>500 then raise exception 'Message too long' using errcode='22023'; end if;
 select requester_user_id,status into v_target,v_status
 from public.phx_registration_applications where id=p_application_id for update;
 if not found then raise exception 'Application not found' using errcode='P0002'; end if;
 if v_status<>'pending' then raise exception 'Application already reviewed' using errcode='23505'; end if;
 select protected_user_id,delegate_user_id into v_owner,v_delegate
 from app_private.phx_access_settings where singleton=true for share;
 if v_owner is null then raise exception 'Owner protection not configured' using errcode='42501'; end if;
 if v_target is null or v_target=v_actor or v_target=v_owner or v_target is not distinct from v_delegate
 then raise exception 'Protected account cannot be approved here' using errcode='42501'; end if;
 if not exists(select 1 from auth.users u where u.id=v_target and u.email_confirmed_at is not null
 and u.deleted_at is null and not u.is_anonymous and (u.banned_until is null or u.banned_until<=clock_timestamp()))
 then raise exception 'Verified active auth user required' using errcode='22023'; end if;
 if exists(select 1 from public.phx_app_roles where user_id=v_target)
 then raise exception 'Account already has PHALANX role' using errcode='23505'; end if;
 -- The existing function creates decision/event/outbox; this entire call
 -- is one PostgreSQL transaction and rolls back if the role grant fails.
 v_result := public.phx_review_registration(p_application_id,'approved',p_public_message);
 insert into public.phx_app_roles(user_id,app_role,active,assigned_by,source)
 values(v_target,p_app_role,true,v_actor,'registration');
 insert into public.phx_app_role_events(target_user_id,actor_user_id,previous_role,next_role,reason)
 values(v_target,v_actor,null,p_app_role,'Approved registration '||p_application_id::text);
 return jsonb_build_object('id',p_application_id,'status','approved',
  'access_granted',true,'app_role',p_app_role);
end;
$function$

