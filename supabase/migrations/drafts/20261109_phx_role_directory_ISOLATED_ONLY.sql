-- Isolated-only member directory. Does not reveal email or game rank.
begin;
create or replace function public.phx_list_app_members_v2()
returns table(user_id uuid, app_role text, active boolean, assigned_at timestamptz)
language sql security definer set search_path=''
as $$
 select r.user_id,r.app_role,r.active,r.assigned_at
 from public.phx_app_roles r
 where exists (
   select 1 from public.phx_app_roles caller
   where caller.user_id=auth.uid() and caller.active
   and caller.app_role='administrator'
 )
 order by r.assigned_at desc;
$$;
revoke all on function public.phx_list_app_members_v2() from public,anon;
grant execute on function public.phx_list_app_members_v2() to authenticated;
commit;