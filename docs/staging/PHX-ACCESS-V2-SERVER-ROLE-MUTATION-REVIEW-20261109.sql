-- PHALANX Access V2 server-side role mutation, REVIEW ONLY.
-- Requires the schema in PHX-ACCESS-V2-SCHEMA-STAGING-REVIEW-20261109.sql.
-- Do not execute in production without backup, security review, and approval.
begin;
create or replace function public.phx_set_app_role_v2_safe(
 p_target_user_id uuid, p_new_role text, p_reason text
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare
 v_actor uuid := (select auth.uid());
 v_old text;
 v_target_exists boolean;
begin
 if v_actor is null then
  raise exception 'Authentication required' using errcode='28000';
 end if;
 if not exists (
  select 1 from public.phx_app_roles_v2 r
  where r.user_id=v_actor and r.app_role='administrator' and r.active=true
 ) then
  raise exception 'PHALANX administrator required' using errcode='42501';
 end if;
 if p_new_role is null or p_new_role not in ('observer','operator','administrator') then
  raise exception 'Invalid app role' using errcode='22023';
 end if;
 if p_reason is null or char_length(btrim(p_reason)) not between 3 and 500 then
  raise exception 'Reason required (3-500 characters)' using errcode='22023';
 end if;
 if p_target_user_id is null or p_target_user_id=v_actor then
  raise exception 'Cannot change own role or unspecified member' using errcode='42501';
 end if;
 select exists(select 1 from auth.users u where u.id=p_target_user_id) into v_target_exists;
 if not v_target_exists then
  raise exception 'Target auth account not found' using errcode='22023';
 end if;
 -- GOD owner must be independently identified, not inferred from app role.
 -- This function fails closed until a separately approved owner registry exists.
 if to_regclass('public.phx_owner_registry_v2') is null then
  raise exception 'Owner protection not initialized' using errcode='42501';
 end if;
 if exists (select 1 from public.phx_owner_registry_v2 o where o.user_id=p_target_user_id) then
  raise exception 'GOD owner is protected' using errcode='42501';
 end if;
 -- Existing administrators remain protected independently.
 perform pg_advisory_xact_lock(pg_catalog.hashtextextended(p_target_user_id::text,0));
 select r.app_role into v_old from public.phx_app_roles_v2 r
 where r.user_id=p_target_user_id and r.active=true for update;
 if v_old='administrator' then
  raise exception 'Existing administrator is protected' using errcode='42501';
 end if;
 if v_old is not distinct from p_new_role then
  return jsonb_build_object('changed',false,'role',p_new_role);
 end if;
 insert into public.phx_app_roles_v2(user_id,app_role,active,assigned_by)
 values(p_target_user_id,p_new_role,true,v_actor)
 on conflict (user_id) do update set
  app_role=excluded.app_role,active=true,assigned_by=v_actor,updated_at=now();
 insert into public.phx_app_role_events_v2(target_user_id,actor_user_id,previous_role,next_role,reason)
 values(p_target_user_id,v_actor,v_old,p_new_role,btrim(p_reason));
 return jsonb_build_object('changed',true,'role',p_new_role);
end;
$fn$;
revoke all on function public.phx_set_app_role_v2_safe(uuid,text,text) from public,anon,authenticated;
grant execute on function public.phx_set_app_role_v2_safe(uuid,text,text) to authenticated;
commit;
