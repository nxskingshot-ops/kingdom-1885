-- ISOLATED ONLY: fail closed for non-admin directory access instead of returning an empty list.
create or replace function public.phx_list_app_members_v2()
returns table(user_id uuid, app_role text, active boolean, assigned_at timestamptz)
language plpgsql security definer set search_path=''
as $$
begin
 if auth.uid() is null or not exists (
  select 1 from public.phx_app_roles caller
  where caller.user_id=auth.uid() and caller.active and caller.app_role='administrator'
 ) then
  raise exception 'PHALANX administrator required' using errcode='42501';
 end if;
 return query
 select r.user_id,r.app_role,r.active,r.assigned_at
 from public.phx_app_roles r
 order by r.assigned_at desc;
end;
$$;
revoke all on function public.phx_list_app_members_v2() from public,anon;
grant execute on function public.phx_list_app_members_v2() to authenticated;