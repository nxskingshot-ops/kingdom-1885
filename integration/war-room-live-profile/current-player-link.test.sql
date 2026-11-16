-- Run in the same transaction as current-player-link.sql on phalanx-security-isolated-test.
-- Replace the migration's final COMMIT with this file, which rolls the entire transaction back.
insert into auth.users (id, email, email_confirmed_at, raw_user_meta_data)
values
 ('27a00000-0000-4000-8000-000000000001', 'warroom-qa1@example.invalid', now(), '{"player_id":"789000999"}'),
 ('27a00000-0000-4000-8000-000000000002', 'warroom-qa2@example.invalid', now(), '{}'),
 ('27a00000-0000-4000-8000-000000000003', 'warroom-qa3@example.invalid', now(), '{}'),
 ('27a00000-0000-4000-8000-000000000004', 'warroom-qa4@example.invalid', now(), '{"player_id":"789000001"}'),
 ('27a00000-0000-4000-8000-000000000005', 'warroom-qa5@example.invalid', now(), '{}'),
 ('27a00000-0000-4000-8000-000000000006', 'warroom-qa6@example.invalid', null, '{}');

insert into public.nxs_memberships (user_id, role, active, expires_at)
values
 ('27a00000-0000-4000-8000-000000000001', 'member', true, null),
 ('27a00000-0000-4000-8000-000000000002', 'member', true, now() - interval '1 second'),
 ('27a00000-0000-4000-8000-000000000003', 'member', false, null),
 ('27a00000-0000-4000-8000-000000000004', 'member', true, null),
 ('27a00000-0000-4000-8000-000000000005', 'member', true, null),
 ('27a00000-0000-4000-8000-000000000006', 'member', true, null);

insert into app_private.phx_access_invites (email, player_id, role, closed_at, approved_user_id)
values
 ('warroom-qa1@example.invalid', '789000001', 'member', now(), '27a00000-0000-4000-8000-000000000001'),
 ('warroom-qa2@example.invalid', '789000002', 'member', now(), '27a00000-0000-4000-8000-000000000002'),
 ('warroom-qa3@example.invalid', '789000003', 'member', now(), '27a00000-0000-4000-8000-000000000003'),
 ('warroom-qa4@example.invalid', '789000004', 'member', null, null),
 ('warroom-qa5@example.invalid', '789000005', 'member', now(), '27a00000-0000-4000-8000-000000000005'),
 ('warroom-qa5-alt@example.invalid', '789000007', 'member', now(), '27a00000-0000-4000-8000-000000000005'),
 ('warroom-qa6@example.invalid', '789000006', 'member', now(), '27a00000-0000-4000-8000-000000000006');

do $$
begin
  if has_function_privilege('anon', 'public.phx_war_room_current_player_id()', 'EXECUTE') then
    raise exception 'anon can execute the current player function';
  end if;
  if has_function_privilege('service_role', 'public.phx_war_room_current_player_id()', 'EXECUTE') then
    raise exception 'service role can execute the current player function';
  end if;
end;
$$;

set local role authenticated;
do $$
declare
  fixture record;
begin
  for fixture in
    select * from (values
      ('27a00000-0000-4000-8000-000000000001', '789000001', 'approved link overrides editable metadata'),
      ('27a00000-0000-4000-8000-000000000002', null, 'expired membership denied'),
      ('27a00000-0000-4000-8000-000000000003', null, 'inactive membership denied'),
      ('27a00000-0000-4000-8000-000000000004', null, 'unapproved link and metadata claim denied'),
      ('27a00000-0000-4000-8000-000000000005', null, 'ambiguous player links denied'),
      ('27a00000-0000-4000-8000-000000000006', null, 'unconfirmed account denied')
    ) as samples(uid, expected, label)
  loop
    perform set_config('request.jwt.claim.sub', fixture.uid, true);
    if public.phx_war_room_current_player_id() is distinct from fixture.expected then
      raise exception 'War Room link test failed: %', fixture.label;
    end if;
  end loop;
end;
$$;

rollback;

select 'passed: six identity cases and anon / service_role grants' as result,
       to_regprocedure('public.phx_war_room_current_player_id()') is null as function_rolled_back,
       not exists (select 1 from auth.users where id = '27a00000-0000-4000-8000-000000000001') as fixture_rolled_back;
