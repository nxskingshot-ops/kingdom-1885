# PHALANX Identity Registry — Access Management function review V2
Date: 2026-11-09
Status: INSPECTION / DESIGN GATES; NOT DEPLOYED

## Binding governance
Kingshot game rank independent from PHALANX app role. App role names Observer, Operator, Administrator; GOD separate protected owner. Each module/function reviewed when edited; no automatic all-module grant.

## Verified read-only findings
- Supabase project hcjrdofkdkasznywvcxo, live RLS inspected 2026-11-09.
- nexus_access_requests SELECT and UPDATE policies officers_read_access_requests and officers_review_access_requests grant r4/r5/admin, conflicting with proposed Administrator-only approval.
- transfer_candidates DELETE policy nxs_r4_delete_transfer grants app_private.nxs_role_at_least('r4'); candidate deletion must be independently approved per module.
- nxs_memberships has self SELECT policy. app_profiles has self SELECT.
- Live Edge Function nexus-access-review v8 (inspected prior): r4/r5/admin reviewer gate; createUser technical @example.com account on approval; elevated grants and reset restricted to admin. Existing identities and protected owner must be preserved.
- Legacy preview/kingdom-hub-menu-test.html uses r4/r5/admin gate and legacy grant dropdown. It is not proven to be current PHALANX access management surface.

## Function-level decisions for review (NOT implementation)
1. Registration submission: public request intake, no self-assigned app role; validate rate limits, account matching, and duplicate requests.
2. Review queue: only authorized Administrator; protected personal data; avoid exposing requests to Operator/Observer.
3. Approve/reject: Administrator-only, atomic, auditable, reconcile existing auth account instead of blindly creating another.
4. Role assignment/change: Observer/Operator/Administrator; Administrator grants only by verified Administrator; never GOD via ordinary workflow. Explicitly separate game rank field.
5. Account lifecycle: deactivate/reactivate, not deletion, with self-lockout and GOD protection.
6. Credential reset: preserve protected owner guard; prefer secure recovery over displaying passwords.
7. Audit: immutable actor/target/action/time/old/new values with controlled visibility.
8. Candidate deletion: defer to Transfer Scouting module-specific review; not assumed as general Administrator permission.

## Implementation gates
Inspect actual deployed Access Management frontend and all linked endpoints; map legacy membership values; reconcile existing accounts; check schema and RLS dependencies; produce verified backup and rollback; implement in isolated branch; run authorization negative tests, data integrity, mobile and regression; explicit release approval. No production changes, backup, restore or runtime tests performed in this review.

## 2026-11-09 follow-up: actual Transfer Scouting staging source located
Read GitHub branch stage/transfer-live-rankings-20261103:
- deploy/phalanx-kvk-test/pylon-ix/transfer-scouting-id-stage-20261030.html (blob 10835d72a9f72a1de3232de156199b4521f9d79d): login panel has Sign in, Register -> ./transfer-register.html, Forgot password -> ./password-recovery.html. It does not itself contain the registration review queue.
- deploy/phalanx-kvk-test/pylon-ix/transfer-scouting-id-stage-20261030.js (blob 010d145fc9ab43d72184038e873c3451364775fe): check() reads nxs_memberships.role and accepts member/r4/r5/admin; canEdit is r4/r5/admin. UI shows raw membership role as identity label. Candidate delete button is also gated by canEdit, meaning R4/R5 may delete, matching the existing broad RLS DELETE policy. The same script directly calls transfer_candidates CRUD.
- This proves current staging still couples game-like legacy membership labels to authorization. Do NOT simply rename role values in DB: doing so would break current staging access and potentially other modules. Implement compatibility and capability migration with tests.
- Need to inspect ./transfer-register.html, ./password-recovery.html and current Access Management surface and their actual deployment mapping. These files were not yet inspected in this pass.
- Current staging source verified; deployed asset parity and runtime behavior NOT TESTED. No production changes.

## Registration source inspection (2026-11-09)
- stage/transfer-live-rankings-20261103 deploy/phalanx-kvk-test/pylon-ix/transfer-register.html blob b37f05e10376ebd390eeffc3c71aa296a5f57c9f contains email, numeric Kingshot Player ID, password/confirm; script ./transfer-register.js.
- transfer-register.js blob 67de3cd636191807fb188ecf3183c05f375af491 calls Supabase auth.signUp({email,password,options:{data:{kingshot_player_id:playerId}}}); no direct nexus_access_requests insert or approval API call. Player ID stored as user-supplied metadata, NOT verified authorization evidence.
- The legacy nexus-access-review v8 approves nexus_access_requests and creates a new technical-email auth user. Thus the reviewed signUp path and legacy approval path are NOT proven connected. This is a concrete integration gap requiring investigation of triggers/functions and current Access Management UI before any role migration or duplicate-user fix.
- The HTML states approval is required; whether a signup creates a reviewable queue item is NOT VERIFIED. Do not claim registration approval works end-to-end.

## 2026-11-09 confirmed auth trigger audit (read-only)
On auth.users INSERT exactly two non-internal triggers were observed: on_auth_user_created_kingdom1885 -> app_private.nxs_create_profile() and phx_discord_new_auth_registration -> app_private.phx_notify_new_auth_registration(). The first creates only public.app_profiles(user_id, display_name=null); the second queues a Discord notification with no automatic R5 assignment. Neither creates nxs_memberships nor nexus_access_requests. The existing transfer-register.js signUp() similarly does not submit a request. Therefore automatic linkage from new Auth signup to legacy approval queue is NOT established by inspected paths; no other external workflow ruled out.

Schema gap: public.nexus_access_requests has gamer_tag, player_id, alliance, status, granted_user_id, granted_role, reviewed_by etc but NO explicit requester_auth_user_id or signup_email field. A new registration therefore cannot be safely correlated by simply trusting user-provided player_id metadata. Need a server-authoritative account-link and a review workflow that assigns existing auth user ID instead of creating a second technical-email Auth user.

Recommended scoped implementation (NOT APPROVED/DEPLOYED): define immutable Auth user UUID association on a pending request; require verified login and authenticated request ownership; implement server-side review with distinct app role mapping and module/function-specific grants; preserve legacy Kingshot ranks and protected GOD; migrate existing workflows only after data/rollback assessment. Never use editable user_metadata for authorization.

Status: Auth trigger/schema review BESTANDEN; complete signup->approval E2E NICHT GETESTET; permissions changes NICHT AUSGEFÜHRT; production unchanged.
