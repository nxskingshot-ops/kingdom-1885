# PHALANX admin workflow code review – 2026-11-03

Read-only review of repository default-branch `preview/kingdom-hub-menu-test.html` (GitHub fetch), plus live database grants/RLS checked separately.

## Observed authorized UI actions
- `checkNexusAccessAdmin`: active non-expired membership role in `r4`, `r5`, `admin` shows access administration UI.
- `loadNexusAccessRequests`: direct authenticated SELECT for pending and approved access requests.
- Public application: direct INSERT with gamer tag, player ID, alliance, pending status.
- `renderNexusAccessRequests`: pending request approve/reject and selectable grant `kingdom/member/outpost/officer/r5/admin`; approved request reset login.
- `reviewNexusAccessRequest`: POST to `nexus-access-review` with current bearer session, action and grant. No direct UPDATE was observed in this inspected UI flow.
- Existing workflow displays newly generated email and one-time new password after approval or reset, with copy actions. This is not a read of stored passwords, but is a sensitive credential handoff requiring security review; do not remove it without a compatible, authorized alternative.

## Explicit acceptance gates
- GOD, admin, R5 and R4 retain all their *currently authorized* actions; backend role-specific restrictions remain, not every UI-visible action is automatically authorized.
- Preserve application INSERT, admin SELECT, and server-side approve/reject/reset; verify every selectable grant against server authorization.
- No blanket UPDATE privilege revoke without proving that every consumer in every relevant branch/module is migrated and regression tested.
- Protect owner account and target binding; no leakage of stored credentials; secure temporary credential handoff.
- Validate actual role sessions, session expiry, error handling, desktop/mobile, API and database direct-update negative tests.

Status: CODE INSPECTION PASS for this frontend; COMPLETE CONSUMER INVENTORY OPEN; STAGING TEST NOT TESTED; CURRENT BACKUP/RESTORE NOT VERIFIED; PRODUCTION UNCHANGED.
