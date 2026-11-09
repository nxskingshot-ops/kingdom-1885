-- PHALANX V2: server-only atomic mail claiming; DRAFT, NOT DEPLOYED.
-- Requires outbox/events/applications draft tables.
begin;
alter table public.phx_registration_notification_outbox
 add column if not exists claimed_at timestamptz,
 add column if not exists claim_token uuid;
create or replace function public.phx_claim_registration_email(p_limit int default 5)
returns table(outbox_id bigint, claim_token uuid, event_id bigint, event_type text,
                requester_user_id uuid, event_version bigint)
language plpgsql security definer set search_path=''
as $$
begin
 if current_setting('request.jwt.claim.role',true) is distinct from 'service_role' then
  raise exception 'Service role only' using errcode='42501';
 end if;
 return query
 with candidates as (
  select o.id from public.phx_registration_notification_outbox o
  where o.channel='email' and o.attempts<10 and (
    (o.state in ('queued','failed') and o.next_attempt_at<=now())
    or (o.state='sending' and o.claimed_at<now()-interval '10 minutes')
  )
  order by o.id for update skip locked limit greatest(0,least(p_limit,20))
 ), claimed as (
  update public.phx_registration_notification_outbox o
  set state='sending', attempts=o.attempts+1, claimed_at=now(), claim_token=gen_random_uuid()
  from candidates c where o.id=c.id
  returning o.id,o.claim_token,o.event_id
 )
 select c.id,c.claim_token,c.event_id,e.event_type,a.requester_user_id,e.event_version
 from claimed c join public.phx_registration_events e on e.id=c.event_id
 join public.phx_registration_applications a on a.id=e.application_id;
end;
$$;
revoke all on function public.phx_claim_registration_email(int) from public,anon,authenticated;
grant execute on function public.phx_claim_registration_email(int) to service_role;
create or replace function public.phx_complete_registration_email(
 p_outbox_id bigint,p_token uuid,p_success boolean,p_error text default null
) returns boolean language plpgsql security definer set search_path=''
as $$
begin
 if current_setting('request.jwt.claim.role',true) is distinct from 'service_role' then
  raise exception 'Service role only' using errcode='42501';
 end if;
 update public.phx_registration_notification_outbox
 set state=case when p_success then 'sent' else 'failed' end,
 sent_at=case when p_success then now() else null end,
 next_attempt_at=case when p_success then now() else now()+make_interval(mins=>least(1440,(2^least(attempts,10))::int)) end,
 last_error_code=case when p_success then null else left(coalesce(p_error,'delivery_failed'),80) end,
 claimed_at=null,claim_token=null
 where id=p_outbox_id and claim_token=p_token and state='sending';
 return found;
end;
$$;
revoke all on function public.phx_complete_registration_email(bigint,uuid,boolean,text) from public,anon,authenticated;
grant execute on function public.phx_complete_registration_email(bigint,uuid,boolean,text) to service_role;
commit;
