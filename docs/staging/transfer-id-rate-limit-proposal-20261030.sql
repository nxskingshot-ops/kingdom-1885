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
-- Function runs as invoker (service_role). No SECURITY DEFINER.
create or replace function phx_internal.take_transfer_id_quota(p_user uuid)
returns boolean language plpgsql security invoker set search_path = pg_catalog, phx_internal as $$
declare v_start timestamptz := date_trunc('hour', now()); v_used integer;
begin
  insert into phx_internal.transfer_id_quota(user_id,window_start,used)
  values (p_user,v_start,1)
  on conflict (user_id,window_start) do update
    set used = phx_internal.transfer_id_quota.used + 1
    where phx_internal.transfer_id_quota.used < 20
  returning used into v_used;
  return v_used is not null;
end; $$;
revoke all on function phx_internal.take_transfer_id_quota(uuid) from public, anon, authenticated;
grant usage on schema phx_internal to service_role;
grant select,insert,update on phx_internal.transfer_id_quota to service_role;
grant execute on function phx_internal.take_transfer_id_quota(uuid) to service_role;
-- TODO: retention cleanup and explicit rollback plan before any deployment.
