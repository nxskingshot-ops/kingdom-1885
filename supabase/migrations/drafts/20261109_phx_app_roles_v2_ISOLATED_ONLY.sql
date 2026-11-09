-- PHALANX Access V2: additive isolated migration DRAFT.
-- NOT applied to production. Execute only on isolated Supabase after snapshot/rollback review.
begin;
create table if not exists public.phx_app_roles (
 user_id uuid primary key references auth.users(id) on delete restrict,
 app_role text not null check (app_role in ('observer','operator','administrator')),
 active boolean not null default true,
 assigned_by uuid references auth.users(id) on delete restrict,
 assigned_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 source text not null check (source in ('invitation','registration','admin_change','verified_migration'))
);
create table if not exists public.phx_app_role_events (
 id bigint generated always as identity primary key,
 target_user_id uuid not null references auth.users(id) on delete restrict,
 actor_user_id uuid not null references auth.users(id) on delete restrict,
 previous_role text check (previous_role is null or previous_role in ('observer','operator','administrator')),
 next_role text not null check (next_role in ('observer','operator','administrator')),
 reason text not null check (char_length(reason) between 3 and 500),
 recorded_at timestamptz not null default now()
);
create index if not exists phx_app_role_events_target_time_idx
 on public.phx_app_role_events(target_user_id,recorded_at desc);
alter table public.phx_app_roles enable row level security;
alter table public.phx_app_role_events enable row level security;
revoke all on public.phx_app_roles from public,anon,authenticated;
revoke all on public.phx_app_role_events from public,anon,authenticated;
-- Authenticated users can read ONLY their own app role, never assign one.
grant select (user_id,app_role,active,assigned_at) on public.phx_app_roles to authenticated;
create policy phx_app_role_read_self on public.phx_app_roles
 for select to authenticated using (user_id = (select auth.uid()));
-- No direct INSERT/UPDATE/DELETE policies and no public RPC. Server grant
-- transaction to be designed separately with protected owner/GOD handling.
-- No legacy nxs_memberships changes, no auto-seeding, no role inference from R5.
commit;
