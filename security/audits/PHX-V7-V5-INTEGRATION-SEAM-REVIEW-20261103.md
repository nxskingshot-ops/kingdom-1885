# PHALANX V7-to-V5 integration seam review — 2026-11-03

Read-only inspection of active Supabase Edge Function nexus-access-review version 7, 142 source lines. No deployment or production database changes.

Verified source boundaries:
- line 35: admin.auth.getUser(bearer) validates the supplied bearer token.
- lines 39-42: current nxs_memberships row is read and checked for active R4/R5/admin role and expiry.
- lines 54-64: reset requires approved request, admin membership, and server-held protected owner UUID, then calls updateUserById using the mutable request.granted_user_id.
- lines 96-128: approval creates Auth user, writes membership, and updates request in separate operations, with best-effort cleanup.
- No independent protected request-to-Auth binding lookup is present.

Offline V5 re-run: 18/18 passed; ZIP integrity check passed. These tests do not establish integration safety.

Integration design gate:
1. Define independent binding in private non-exposed schema with restricted service-only write permissions and explicit immutable mapping rules.
2. Do not trust nexus_access_requests granted_user_id/player_id as the sole source of reset target. Read protected binding by request ID, compare request and Auth app_metadata, deny on any mismatch.
3. Ensure the binding is written as part of the approved server workflow, with idempotent retries and compensating recovery for failures between Auth creation, membership insert, request update, and binding insert.
4. Preserve existing server-verified R4/R5/admin grants, admin reset, owner guard and approved credential handoff. Verify GOD-specific behavior separately; it is not implemented solely by the owner UUID guard.
5. Validate concurrency: two approvals of the same pending request, retries after partial failure, duplicate Auth account and interrupted cleanup.
6. Do not run production DDL, change grants, create paid resources, or deploy until isolated backend, current backup, restoration test and administrator regression evidence are available and release is explicitly approved.

Current status: review complete; implementation NOT started in backend; production unchanged.
