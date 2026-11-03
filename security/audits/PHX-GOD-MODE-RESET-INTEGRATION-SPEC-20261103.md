# PHALANX — GOD Mode integration change specification (not deployed)
Date: 2026-11-03
Source reviewed: deployed nexus-access-review v6.

## Exact change target
The reset action reads an approved access request, then invokes privileged Supabase Auth password update against its granted_user_id. No separate owner-target authorization check is present.

## Safe integration sequence
1. Preserve current deployed function source and hash and create verified Auth/database backup and restore evidence.
2. Define a private, independently managed owner principal. Do not derive ownership from Kingshot ID, frontend state, membership role or a client-editable request.
3. For reset, validate the approved request target against an immutable server-managed binding, then deny owner-target operations before privileged Auth calls.
4. Restrict direct changes to access request identity-binding columns while preserving officer approval and rejection through the existing server workflow.
5. Use explicit owner checks on every administrative password, ban, delete and recovery operation. Avoid returning generated passwords to unauthorized clients.
6. Test: owner reset denied; normal approved member reset allowed; R4 reset denied; forged request linkage denied; guest setup and approval continue working.
7. Deploy only after explicit approval, backups, rollback rehearsal and staging integration tests.

## Evidence limits
Production source and RLS/grants inspected read-only. No exploit or production change performed. Prior 17 isolated tests are conceptual and do not validate this integration. GOD MODE NOT VERIFIED; public release blocked.
