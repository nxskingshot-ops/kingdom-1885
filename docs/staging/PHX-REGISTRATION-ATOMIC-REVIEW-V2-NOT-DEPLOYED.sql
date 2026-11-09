-- DRAFT ONLY — DO NOT APPLY TO PRODUCTION WITHOUT BACKUP, RESTORE TEST AND APPROVAL.
-- Requires PHX-REGISTRATION-APPROVAL-SCHEMA-V2-PROPOSAL-20261109.sql first.
begin;
create table if not exists public.phx_registration_reviewers(
 user_id uuid primary key references auth.users(id) on delete restrict,
 enabled boolean not null default false,
 granted_at timestamptz not null default now(),
 granted_by uuid references auth.users(id) on delete set null
);
alter table public.phx_registration_reviewers enable row level security;
revoke all on public.phx_registration_reviewers from public,anon,authenticated;
-- Explicitly provision reviewers after verified owner approval; no auto-seeding R5/admin.

create or replace function public.phx_review_registration(
 p_application_id uuid, p_decision text, p_public_message text default null
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare v_actor uuid := auth.uid(); v_request public.phx_registration_applications%rowtype;
declare v_event bigint; v_version bigint;
begin
 if v_actor is null then raise exception 'Authentication required' using errcode='28000'; end if;
 if not exists(select 1 from public.phx_registration_reviewers where user_id=v_actor and enabled) then
  raise exception 'Registration review permission denied' using errcode='42501';
 end if;
 if p_decision not in ('approved','rejected') or p_decision is null then
  raise exception 'Invalid decision' using errcode='22023';
 end if;
 if length(coalesce(p_public_message,''))>500 then
  raise exception 'Message too long' using errcode='22023';
 end if;
 select * into v_request from public.phx_registration_applications
  where id=p_application_id for update;
 if not found then raise exception 'Request not found' using errcode='P0002'; end if;
 if v_request.requester_user_id=v_actor then
  raise exception 'Self review prohibited' using errcode='42501';
 end if;
 if v_request.status<>'pending' then
  raise exception 'Already reviewed' using errcode='23505';
 end if;
 -- Approval is only a review decision. It NEVER creates membership or grants module access.
 -- This prevents partially approved legacy permissions from being mistaken for app-level grants.
 update public.phx_registration_applications
 set status=p_decision,reviewed_at=now(),reviewed_by=v_actor,public_message=p_public_message
 where id=p_application_id;
 select coalesce(max(event_version),0)+1 into v_version
 from public.phx_registration_events where application_id=p_application_id;
 insert into public.phx_registration_events(application_id,event_version,event_type,actor_user_id)
 values(p_application_id,v_version,p_decision,v_actor) returning id into v_event;
 insert into public.phx_registration_notification_outbox(event_id,channel)
 values(v_event,'email');
 return jsonb_build_object('id',p_application_id,'status',p_decision,'access_granted',false);
end;
$$;
revoke all on function public.phx_review_registration(uuid,text,text) from public,anon;
grant execute on function public.phx_review_registration(uuid,text,text) to authenticated;
commit;
