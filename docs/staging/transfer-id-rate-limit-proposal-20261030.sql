-- PHALANX TRANSFER ID: staging proposal only. DO NOT apply without approval.
-- A persistent per-user limiter, shared across Edge Function instances.
create schema if not exists phx_internal;
create table if not exists phx_internal.transfer_id_quota (
  user_id uuid not null,
  window_start timestamptz not null,
  used integer not null default 0 check (used between 0 and 20),
  primary key (user_id, window_start)
);
revoke all on schema phx_internal from public, anon, authenticated;
revoke all on phx_internal.transfer_id_quota from public, anon, authenticated;
-- RPC in exposed public schema, but EXECUTE only for service_role. Invoker security, no privilege escalation.
create or replace function public.phx_take_transfer_id_quota(p_user uuid)
returns boolean language plpgsql security invoker set search_path = pg_catalog, phx_internal as $$
declare v_start timestamptz := date_trunc('hour', now()); v_used integer;
begin
  if p_user is null then return false; end if;
  insert into phx_internal.transfer_id_quota(user_id,window_start,used)
  values (p_user,v_start,1)
  on conflict (user_id,window_start) do update
    set used = phx_internal.transfer_id_quota.used + 1
    where phx_internal.transfer_id_quota.used < 20
  returning used into v_used;
  return v_used is not null;
end; $$;
revoke all on function public.phx_take_transfer_id_quota(uuid) from PUBLIC, anon, authenticated;
grant usage on schema phx_internal to service_role;
grant select,insert,update on phx_internal.transfer_id_quota to service_role;
grant execute on function public.phx_take_transfer_id_quota(uuid) to service_role;
-- PostgreSQL PUBLIC is the implicit grant role: revoke must target PUBLIC.
-- Important: public schema RPC is still privileged; verify actual grants before deployment.
-- Retention: old windows may be deleted after 48h via separately approved maintenance.
-- Rollback: disable bridge first; preserve quota data; only after explicit approval
-- drop function public.phx_take_transfer_id_quota(uuid) and then private objects.
-- Preflight: verify public schema is exposed to PostgREST and service_role can invoke RPC.
