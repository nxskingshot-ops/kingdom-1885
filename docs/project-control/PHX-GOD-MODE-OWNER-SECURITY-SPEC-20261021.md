# PHALANX GOD MODE — Owner Protection Security Specification V1 (2026-10-21)

**Status: Binding design FREEZE; NOT IMPLEMENTED, NOT SECURITY CERTIFIED.**
Supersedes any ambiguous statement that operational administrators have authority over the owner. Only the verified creator's designated owner identity may hold owner authority. No other account, including An's operational-admin account, may suspend, ban, disable, delete, demote, revoke, reassign or lock out the owner through PHALANX administration.

## Threat model and controls
1. **Immutable ownership invariant:** a dedicated owner principal mapped to a verified Supabase Auth UUID, provisioned by an independently authenticated bootstrap; no automatic owner based on nickname, player ID, email text, alliance or R5. The normal application roles table cannot grant owner. Never expose owner designation to untrusted client writes.
2. **Centralized enforcement:** backend authorization for every admin RPC, RLS policy, Edge Function, bulk operation, scheduled job and PYLON tool. Explicit deny for any non-owner mutation of owner account or owner-controlled security state. No frontend-only guards.
3. **Distinct capabilities:** An gets operational-admin grants, but not owner-control, owner transfer, security configuration, emergency unlock, credential rotation or infrastructure access. Any admin approval authority must be an explicit capability, not inferred from r4/r5.
4. **Emergency lock:** owner-only lock/unlock; server-side deny of non-owner protected API/PYLON accesses while locked. Preserve a hardened owner-only recovery route. Define offline/PWA cache behavior: no promise to revoke already-downloaded information, and expire sensitive cached content.
5. **Session security:** MFA (prefer phishing-resistant where available), reauthentication for critical actions, session revocation where supported, minimal token TTL, rate limits, device/session review, recovery codes held separately. Never store passwords or master bypass secrets in app.
6. **Owner transfer/recovery:** owner-initiated explicit confirmation plus strong reauthentication, two-phase confirmation and immutable audit. No transfer via ordinary admin or user approval path. Plan recovery for lost MFA/device without handing unilateral ownership to operational admins.
7. **Audit:** record actor, operation, timestamp, target and reason for owner-protected denials, role changes, locks/unlocks, and critical settings. Prevent ordinary admins from erasing the audit trail. Protect logs against sensitive credential exposure.
8. **Least privilege and service credentials:** keep Supabase service-role keys off clients; review CI, GitHub, Cloudflare and Supabase infrastructure privileges separately. Database superusers/project owners and external service providers can still affect availability; the PHALANX in-app invariant cannot override platform operators.
9. **Transactional safeguards:** prevent owner removal via cascades, bulk updates, conflicting admin flows or race conditions; verify owner existence and unique identity in DB constraints/privileged transactional procedures. Avoid a blanket bypass that would also defeat security incident response.
10. **Release gate:** no production deployment until migration reviewed, isolated negative tests run (An/admin tries to ban, demote, delete, change email/credentials, grant owner, lock/unlock, direct REST/RPC, PYLON), plus recovery and global-lock tests; rollback and backups confirmed.

## Read-only live database inspection on 2026-10-21
- `public.nexus_access_requests`: SELECT and UPDATE RLS currently authorize active membership roles `r4,r5,admin`; INSERT allows `anon,authenticated` pending requests with no ownership binding. This is incompatible with the new explicit-capability model.
- `public.nxs_memberships`: membership role enum-like check `kingdom,member,outpost_manager,r4,r5,admin`, active flag. No separate owner role observed.
- `public.app_profiles`: self-read only.
- Search for public functions named like owner/admin/grant/access/member found no matching functions.
- Search for user-defined triggers on these three tables found no matching triggers.
- These limited catalog queries do NOT prove the absence of other privilege escalation paths. A complete audit must include all schemas, grants, auth hooks, Edge Functions, Cloudflare, GitHub, secrets, CI and Supabase project access.

## Delivery and authorization boundary
This document preserves the requirement and threat model only. No production migration, RLS update, auth configuration change, deploy or main merge was authorized. Owner account cannot be asserted as technically protected until implemented and adversarially tested.
