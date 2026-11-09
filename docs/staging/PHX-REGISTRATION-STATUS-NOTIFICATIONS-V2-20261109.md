# PHALANX Registration Status & Notifications V2 — Implementation contract (DRAFT)
Date: 2026-11-09. Scope: existing Transfer Scouting registration + future Access Management. No production change; no approved FREEZE modified.

## User-approved product direction
Registration progress visible inside PHALANX **and** event-driven email. UI copy in English. Email only on actual transitions, not on page load/polling. The registered user should see current status without being granted module access.

## Verified current baseline
- Staging transfer-register.js calls db.auth.signUp(email,password,options.data.kingshot_player_id) and displays a generic confirmation/approval message. It does NOT create an approval request.
- On auth.users INSERT, app_private.nxs_create_profile() creates app_profiles row; app_private.phx_notify_new_auth_registration() queues a Discord security notice. Neither creates membership nor access request.
- nexus_access_requests has no requester auth UUID, no email and no per-user status visibility policy. Existing SELECT and UPDATE policies allow active r4/r5/admin, conflicting with separation of in-game ranks and app roles. Existing public INSERT permits pending submissions but is not proof of trusted account ownership.
- Historical legacy approval may create another technical-email Auth user. Do not connect that flow to modern signup without review.

## Desired user state machine
REGISTERED -> EMAIL_CONFIRMATION_REQUIRED (only when Auth requires it) -> PENDING_APPROVAL -> APPROVED | REJECTED. Optional NEEDS_INFORMATION with explicit reviewer action. APPROVED becomes ACCESS_ACTIVE only when server-side module grant exists. State derived server-side from authenticated auth.uid() + authoritative request/grant, never editable user_metadata or player ID alone.
- Registered: show “Account created”.
- Email pending: “Confirm your email to continue”; provide resend only with rate limiting.
- Pending: “Awaiting administrator approval”; show submission timestamp and safe help text.
- Approved: “Approved — access enabled” only after grant is verified; otherwise “Approved — access setup in progress”.
- Rejected: “Request not approved”; avoid disclosing private admin notes.
- Error: retry/recovery, no claim of approval.

## Email events
1. Signup: Supabase email confirmation only when required/configured. No unconditional promise of delivery.
2. Approval request accepted: optional receipt email (one per new request).
3. APPROVED: send once on committed status transition and verified grant.
4. REJECTED: send once on committed transition, neutral wording.
5. NEEDS_INFORMATION: send once if supported.
6. Later permission changes: separately governed per-module, notify only if explicitly approved.
Do not email on every page view, duplicate webhook, or polling. Use durable outbox/event IDs, idempotent sender, retry/backoff, delivery state and audit timestamps. Verify configured mail provider, sender domain, rate limits, unsubscribe rules where applicable; never send password or privileged secrets. A status page must work even if email delivery fails.

## Proposed data/interface contract — NOT DEPLOYED
- Server-owned request link: requester_user_id UUID referencing auth.users; UNIQUE for one active application per user (historical requests preserved). New requests created via authenticated server endpoint, not untrusted client-supplied UUID.
- Applicant read: only own request status and safe public reason; administrators see queue according to approved app-level permissions. No role escalation from self-supplied player_id.
- Review endpoint: verify current approved app Administrator, prevent self-approval, use existing Auth UUID, transactionally set status and membership/grants with audit, avoid legacy createUser technical-email path.
- Notification outbox: event key unique(request_id, transition_version, channel), queued/sent/failed timestamps, limited retries and no raw email secrets in public logs.
- UI: compact registration status screen in PHALANX WORLD; no redesign of frozen navigation/header. Pending users can see status but no Transfer Scouting data. Admin queue shows safe identity, request time, requested modules, explicit Approve/Reject; permissions reviewed per module/function.
- Existing owner/GOD and Queen An accounts untouched.

## Required gated implementation and tests
1. Confirm deployed frontend parity, Auth confirmation settings, SMTP/email provider, edge function inventory, and backup/rollback.
2. Isolated schema migration with safe historical request backfill; do not silently match by user-editable player ID.
3. Authenticated pending status endpoint and server-side approval endpoint; negative RLS/IDOR tests.
4. Email outbox sender with delivery mocks, deduplication, retry and no-secret logging.
5. Mobile English UI integration on existing staging branch; test signup/confirmation/pending/approval/rejection/email failure/duplicate event/role changes and regression for owner, An and working account.
6. Explicit release approval before production schema, roles, email costs or sends.

## Verification
Baseline registration source: PASS (read-only). Auth trigger inspection: PASS (read-only). RLS review: PASS (read-only). Implementation: NOT STARTED. Email delivery: NOT TESTED. End-to-end user flows: NOT TESTED. Production unchanged.
