-- PHALANX independent GOD owner registry — REVIEW ONLY / NOT DEPLOYED.
-- Does not select or assign an owner. Manual, separately authorized bootstrap required.
-- Do not execute against production before verified backup, restore path and approval.
begin;
create table if not exists public.phx_owner_registry_v2 (
 singleton boolean primary key default true check(singleton=true),
 user_id uuid not null unique references auth.users(id),
 created_at timestamptz not null default now()
);
alter table public.phx_owner_registry_v2 enable row level security;
revoke all on public.phx_owner_registry_v2 from public,anon,authenticated;
-- Protect against ordinary DML, including a compromised app admin RPC.
-- Bootstrap and owner transfer are intentionally NOT provided by this script.
create or replace function public.phx_guard_owner_registry_v2()
returns trigger language plpgsql security invoker set search_path=''
as $$
begin
 raise exception 'GOD owner registry is immutable through ordinary DML' using errcode='42501';
end;
$$;
revoke all on function public.phx_guard_owner_registry_v2() from public,anon,authenticated;
drop trigger if exists phx_guard_owner_registry_v2 on public.phx_owner_registry_v2;
create trigger phx_guard_owner_registry_v2
 before update or delete on public.phx_owner_registry_v2
 for each row execute function public.phx_guard_owner_registry_v2();
commit;
-- RELEASE BLOCKER: zero rows is fail-closed; do not activate role mutation until
-- exactly one owner has been verified and separately bootstrapped by authorized procedure.
