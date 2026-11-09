-- PHALANX Access V2: STAGING-ONLY REVIEW SCRIPT. DO NOT RUN IN PRODUCTION.
-- No destructive operations. Requires explicit deployment approval and verified backup.
-- Existing nxs_memberships, auth.users and nexus_access_requests are untouched.
begin;
create table if not exists public.phx_app_roles_v2 (
 user_id uuid primary key references auth.users(id),
 app_role text not null check (app_role in ('observer','operator','administrator')),
 active boolean not null default true,
 assigned_by uuid references auth.users(id),
 assigned_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.phx_app_role_events_v2 (
 id bigint generated always as identity primary key,
 target_user_id uuid not null references auth.users(id),
 actor_user_id uuid not null references auth.users(id),
 previous_role text,
 next_role text not null check(next_role in ('observer','operator','administrator')),
 reason text not null check(char_length(btrim(reason)) between 3 and 500),
 created_at timestamptz not null default now()
);
alter table public.phx_app_roles_v2 enable row level security;
alter table public.phx_app_role_events_v2 enable row level security;
revoke all on public.phx_app_roles_v2 from public,anon,authenticated;
revoke all on public.phx_app_role_events_v2 from public,anon,authenticated;
-- No client-side write grants. A reviewed server-side endpoint will be required.
create or replace function public.phx_my_app_role_v2()
returns text language sql stable security definer set search_path=''
as $$
 select r.app_role from public.phx_app_roles_v2 r
 where r.user_id=(select auth.uid()) and r.active=true
 limit 1;
$$;
revoke all on function public.phx_my_app_role_v2() from public,anon,authenticated;
grant execute on function public.phx_my_app_role_v2() to authenticated;
commit;
