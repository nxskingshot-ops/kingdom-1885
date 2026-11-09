# PHALANX Access V2 — production integration gate (review only)

Status: NOT DEPLOYED. No production schema or role mutation authorized by this document.

## Verified production contracts (read-only, 2026-11-09)
- Existing `app_private.phx_access_settings` already defines `protected_user_id` and `delegate_user_id`. Reuse; do not introduce `phx_owner_registry_v2`.
- `public.nxs_memberships.role` CHECK permits only `kingdom, member, outpost_manager, r4, r5, admin`.
- `app_private.phx_access_invites.role` CHECK permits only `kingdom, member`.
- Existing `app_private.phx_access_management` supports `check, list, invite, approve, reject, suspend, reactivate` and protects actor, owner, delegate and privileged legacy memberships. It checks verified auth session, membership and records audit events.
- Existing Access V2 role table absent in production; `observer/operator/administrator` cannot be written to legacy role fields.

## Integration contract
1. Preserve legacy role columns and existing function behavior. Add an independent app-role assignment keyed by auth user UUID, restricted to `observer,operator,administrator`. No default silent observer on UI submission.
2. Add a separate app-role request associated with each invitation, rather than changing the existing `phx_access_invites.role` constraint. Invitation and role must be transactionally linked, and approval must verify the exact current invite and requested app role before assignment.
3. Use existing `app_private.phx_access_settings` for immutable owner/delegate protection. Never infer GOD status from client state or editable metadata. Require current verified session and privileged server authorization for every mutation.
4. Only eligible, confirmed, non-protected accounts may be assigned app roles. Prevent self-escalation, protected-account edits and unverified invitation role upgrades. Preserve all existing memberships.
5. All role changes must have audit entries with actor, target, before/after, timestamp; no browser-only role enforcement.
6. UI must show same three app roles in invitations and member editing. Until server contract is deployed and tested, disable both workflows; do not present legacy kingdom/member as V2 roles.
7. Do not modify HOME, Unified Header, Epic Navigation, PYLON IX, PHALANX WORLD, Outpost Map 2.0 or production deployment.

## Mandatory gates before production
- [ ] Capture verified schema/function backups and rollback SQL; demonstrate restoration in isolated environment.
- [ ] Review grants, RLS, indexes, constraints and auth session authorization.
- [ ] Test invitation -> registration -> approval -> app role, role change, rejection, suspension and reactivation in isolated environment.
- [ ] Negative tests: unauthenticated, observer/operator escalation, stale session, self-edit, owner/delegate edits, duplicate player ID, expired invite, mismatched email/ID, concurrent actions.
- [ ] Test legacy role compatibility, audit trail, existing admin access and Android UI.
- [ ] Obtain explicit authorization for production permission/schema migration after tests.
- [ ] Verify deployment URL and functional regression results before announcing completion.

## Current verified status
Production database unchanged by this review. Role V2 integration NOT READY. Cloudflare preview is not a production role release.
