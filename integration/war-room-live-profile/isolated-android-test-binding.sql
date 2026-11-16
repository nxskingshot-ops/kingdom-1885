-- Apply only to phalanx-security-isolated-test. Enrollment is a separate, time-limited test action.
begin;

create table app_private.phx_war_room_android_test_bindings (
    user_id uuid primary key references auth.users(id) on delete cascade,
    player_id text not null unique check (player_id ~ '^[1-9][0-9]{0,15}$'),
    expires_at timestamptz not null
);
revoke all on app_private.phx_war_room_android_test_bindings from public, anon, authenticated;

create or replace function public.phx_war_room_current_player_id()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select binding.player_id
       from app_private.phx_war_room_android_test_bindings as binding
      where binding.user_id = account.id and binding.expires_at > statement_timestamp()),
    (select case when count(distinct invite.player_id) = 1
                       and min(invite.player_id) ~ '^[1-9][0-9]{0,15}$'
                 then min(invite.player_id) end
       from app_private.phx_access_invites as invite
       join public.nxs_memberships as membership on membership.user_id = invite.approved_user_id
      where membership.user_id = account.id and membership.active is true
        and (membership.expires_at is null or membership.expires_at > statement_timestamp())
        and invite.closed_at is not null)
  )
  from auth.users as account
  where account.id = (select auth.uid())
    and account.email_confirmed_at is not null and account.deleted_at is null;
$$;
revoke all on function public.phx_war_room_current_player_id() from public, anon, service_role;
grant execute on function public.phx_war_room_current_player_id() to authenticated;

commit;
