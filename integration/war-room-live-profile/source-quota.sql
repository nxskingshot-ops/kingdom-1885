begin;
create table app_private.phx_war_room_source_quota (
    user_id uuid primary key references auth.users(id) on delete cascade,
    window_start timestamptz not null,
    used integer not null check (used between 1 and 20)
);
revoke all on app_private.phx_war_room_source_quota from public, anon, authenticated;

create function public.phx_take_war_room_source_quota()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
    caller uuid := auth.uid();
    hour_start timestamptz := date_trunc('hour', statement_timestamp(), 'UTC');
    accepted integer;
begin
    if caller is null or public.phx_war_room_current_player_id() is null then
        return false;
    end if;
    insert into app_private.phx_war_room_source_quota as q (user_id, window_start, used)
    values (caller, hour_start, 1)
    on conflict (user_id) do update
       set window_start = excluded.window_start,
           used = case when q.window_start = excluded.window_start then q.used + 1 else 1 end
     where q.window_start < excluded.window_start
        or (q.window_start = excluded.window_start and q.used < 20)
    returning used into accepted;
    return accepted is not null;
end;
$$;

revoke all on function public.phx_take_war_room_source_quota() from public, anon, service_role;
grant execute on function public.phx_take_war_room_source_quota() to authenticated;
commit;
