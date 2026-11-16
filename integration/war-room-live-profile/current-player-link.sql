-- Apply review and verify on an isolated project before deployment.
begin;

create function public.phx_war_room_current_player_id()
returns text
language sql
stable
security definer
set search_path = ''
as $$
    select case
        when count(distinct invite.player_id) = 1 and min(invite.player_id) ~ '^[1-9][0-9]{0,15}$'
        then min(invite.player_id)
    end
    from app_private.phx_access_invites as invite
    join public.nxs_memberships as membership
      on membership.user_id = invite.approved_user_id
    join auth.users as account
      on account.id = membership.user_id
    where account.id = (select auth.uid())
      and account.email_confirmed_at is not null
      and account.deleted_at is null
      and membership.active is true
      and (membership.expires_at is null or membership.expires_at > statement_timestamp())
      and invite.closed_at is not null;
$$;

revoke all on function public.phx_war_room_current_player_id() from public, anon, service_role;
grant execute on function public.phx_war_room_current_player_id() to authenticated;

commit;
