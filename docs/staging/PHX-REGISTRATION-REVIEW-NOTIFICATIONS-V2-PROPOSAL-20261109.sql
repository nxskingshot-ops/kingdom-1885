-- PHALANX V2 / REVIEW + EMAIL OUTBOX DRAFT — NOT DEPLOYED.
-- Prerequisite: reviewed application schema, verified backups and role mapping.
-- Avoid modifying legacy access requests and existing membership permissions.
begin;
create table if not exists public.phx_registration_events (
 id bigint generated always as identity primary key,
 application_id uuid not null references public.phx_registration_applications(id) on delete restrict,
 event_version bigint not null check(event_version>0),
 event_type text not null check(event_type in ('submitted','approved','rejected')),
 actor_user_id uuid references auth.users(id) on delete set null,
 occurred_at timestamptz not null default now(),
 unique(application_id,event_version)
);
create table if not exists public.phx_registration_notification_outbox (
 id bigint generated always as identity primary key,
 event_id bigint not null references public.phx_registration_events(id) on delete restrict,
 channel text not null check(channel in ('email')),
 state text not null default 'queued' check(state in ('queued','sending','sent','failed')),
 attempts int not null default 0 check(attempts>=0 and attempts<=10),
 next_attempt_at timestamptz not null default now(),
 sent_at timestamptz,
 last_error_code text,
 created_at timestamptz not null default now(),
 unique(event_id,channel)
);
create index if not exists phx_registration_outbox_due on public.phx_registration_notification_outbox(state,next_attempt_at);
alter table public.phx_registration_events enable row level security;
alter table public.phx_registration_notification_outbox enable row level security;
revoke all on public.phx_registration_events from anon,authenticated;
revoke all on public.phx_registration_notification_outbox from anon,authenticated;
comment on table public.phx_registration_notification_outbox is 'Server-only durable email dispatch; no public read or write grants.';
commit;
-- REVIEW CONTRACT, NOT SQL-IMPLEMENTED:
-- Authenticated app Administrator with explicit module permission only.
-- Lock application row; reject self-review; check status=pending;
-- verify grant target is original requester_user_id; atomic status + grant + event + outbox.
-- Return 409 for already-reviewed; no emails before committed decision.
-- Sender retrieves email from Auth server-side, never user_metadata, uses
-- event_id+channel idempotency, bounded retry/backoff, avoids sensitive notes.
-- Never grant GOD or elevate legacy Kingshot R5 from game ID.
