# NEXUS PHALANX — Access-request write hardening (PROPOSAL ONLY)

Status: NOT APPLIED. Isolated test-branch documentation; requires owner approval, staging validation and rollback before production execution.

## Verified frontend contract
`preview/kingdom-hub-menu-test.html` submits directly to `public.nexus_access_requests` via the Supabase publishable key, with precisely:
`{gamer_tag, player_id, alliance, status: 'pending'}`.
The authenticated review UI calls the `nexus-access-review` Edge Function. That function checks the caller's active R4/R5/admin membership and uses a service-role client to perform approval/rejection and account provisioning.

## Confirmed gap
The `anon` and `authenticated` database roles currently have table-level INSERT/UPDATE grants, hence effective INSERT permission for all request columns, including `granted_role`, `granted_user_id`, `note` and `requested_at`. Existing INSERT RLS restricts `status='pending'`, `reviewed_at IS NULL`, `reviewed_by IS NULL`, but not grant metadata. **This is an input-integrity exposure, not evidence of unauthorized membership creation.**

## Proposed staged SQL (DO NOT EXECUTE ON PRODUCTION)
Review existing grants and dependent clients before applying. Service-role writes must remain functional. Use a dedicated staging clone or rollback-capable transaction first.

```sql
BEGIN;
REVOKE INSERT ON TABLE public.nexus_access_requests FROM anon, authenticated;
GRANT INSERT (gamer_tag, player_id, alliance, status)
  ON TABLE public.nexus_access_requests TO anon, authenticated;

-- Optional defense-in-depth: block user-provided grant metadata in any pending row.
-- Review pre-existing pending records before adding/validating this constraint.
-- ALTER TABLE public.nexus_access_requests
--   ADD CONSTRAINT nexus_pending_no_grants
--   CHECK (status <> 'pending' OR
--          (granted_user_id IS NULL AND granted_role IS NULL))
--   NOT VALID;

-- Keep UPDATE grants/policies unchanged until the officer review flow is
-- regression-tested; reducing them requires a separate privilege review.
COMMIT;
```

**Important:** A table-level grant from `PUBLIC` or inherited roles can override intended column restrictions. Verify effective privileges with `has_column_privilege` under actual anon/authenticated sessions; `information_schema.column_privileges` alone is insufficient. Confirm sequence permissions for ID defaults and RLS insert check. The public form sends `status` explicitly, so include it.

## Staging acceptance checks
1. Anonymous legitimate request with gamer_tag/player_id/alliance/status=pending succeeds.
2. Anonymous INSERT with granted_role or granted_user_id explicitly set fails due to permissions.
3. Anonymous SELECT, UPDATE, DELETE of another user's request fails.
4. R4/R5 reviewer can list requests and approve/reject through the deployed Edge Function; administrator can reset credentials.
5. The approval function still creates the correct membership and updates granted_user_id/granted_role (service role bypass/privileges).
6. Repeated submissions, duplicate IDs, rate limiting, and abuse controls are tested independently.
7. Verify effective grants after change, capture rollback script, then request explicit production approval.

## Rollback proposal (ONLY if staged change deployed and rollback approved)
```sql
BEGIN;
REVOKE INSERT (gamer_tag, player_id, alliance, status)
  ON TABLE public.nexus_access_requests FROM anon, authenticated;
GRANT INSERT ON TABLE public.nexus_access_requests TO anon, authenticated;
COMMIT;
```
This restores the previously observed broad INSERT grant, **not** a desirable permanent configuration.

Production, main, Supabase data, RLS and FREEZE designs remain unchanged by this document.
