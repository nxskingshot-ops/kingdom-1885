-- PHALANX Account Management V2 / DRAFT ONLY. NOT EXECUTED.
-- Do not run on production without backup verification, owner approval, and migration review.
-- Separate from legacy nexus_access_requests: preserve history and legacy approvals.
-- Avoid guessing identity from user-supplied Kingshot player IDs.
begin;

create table if not exists public.phx_registration_applications (
  id uuid primary key default gen_random_uuid(),
  requester_user_id uuid not null references auth.users(id) on delete restrict,
  player_id text not null check (player_id ~ '^[0-9]{1,20}$'),
  gamer_tag text check (gamer_tag is null or char_length(gamer_tag) between 2 and 40),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  public_message text,
  internal_note text,
  constraint phx_application_review_consistency check (
    (status='pending' and reviewed_at is null and reviewed_by is null)
    or (status in ('approved','rejected') and reviewed_at is not null and reviewed_by is not null)
  )
);
create unique index if not exists phx_registration_one_active_per_user
  on public.phx_registration_applications(requester_user_id) where status='pending';
create index if not exists phx_registration_status_submitted
  on public.phx_registration_applications(status,submitted_at);

alter table public.phx_registration_applications enable row level security;
-- Explicit grants required when Data API exposure is enabled.
revoke all on public.phx_registration_applications from anon, authenticated;
grant select on public.phx_registration_applications to authenticated;
-- Only own records; internal_note is protected by separate view, not raw table SELECT.
-- CAUTION: raw SELECT would expose internal_note for own row. Do not add a raw SELECT policy!
revoke select on public.phx_registration_applications from authenticated;

-- Safe applicant-facing projection (security_invoker=true; controlled via policy below).
-- Deployment must instead use an authenticated Edge Function returning a whitelisted
-- projection. No direct public SELECT until that endpoint is implemented and tested.
-- All writes and admin reads go through service-role Edge Functions with verified
-- user identity and app-level permission checks. Never expose service-role key in browser.

comment on table public.phx_registration_applications is
 'DRAFT: PHALANX registration review; do not authorize based on editable player ID.';

commit;
