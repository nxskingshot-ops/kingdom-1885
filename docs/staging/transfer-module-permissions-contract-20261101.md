# PHALANX Transfer Scouting — scoped access implementation contract
Status: DRAFT FOR REVIEW ONLY. No SQL executed, no role granted.

## Protected baseline
Existing nxs_memberships roles and checks are global. Do not add transfer_admin to that table's role check or grant admin/r5 to Queen An. Existing transfer_candidates and other PHALANX tables are not to be modified before inspection of current RLS policies and grants.

## Separate module entitlement
Proposed new table phx_transfer_access with user_id uuid primary key referencing auth.users(id), role text CHECK (role IN ('transfer_admin','transfer_recruiter','transfer_viewer')), active boolean NOT NULL DEFAULT false, granted_by uuid, granted_at timestamptz, revoked_at timestamptz, expires_at timestamptz. RLS enabled. No anonymous or public write grants. Self-service registration creates no row. Never authorize using user_metadata or client-controlled flags.

Read permissions should be limited to the current verified user and an independently verified project owner; administrative grants/revocations require a trusted server operation with explicit owner verification, audited actor and target, and no self-elevation. Define the owner verification against existing GOD-mode controls only after reviewing the actual current implementation; do not invent an owner identifier.

## Server enforcement
- Transfer candidate reads and writes require module entitlement (or explicitly preserved existing authorized membership paths), checked server-side with RLS and/or server endpoints.
- Rule edit, confirm, rollback and publish require active, unexpired transfer_admin, validated at request time.
- Revoke access immediately for sensitive writes by consulting database entitlement, not stale JWT role claims. Expired, disabled, or unverified accounts fail closed.
- Audit each grant, revoke, rule revision, and rule approval. Keep immutable rule history; rollback creates a new revision.
- Never expose service_role or secret key in frontend.

## Required pre-implementation verification
1. Inspect live nxs_memberships, transfer_candidates, app_profiles, and nxs_audit_log RLS policies, indexes, grants, dependencies, auth settings, and existing owner authorization.
2. Identify current migration conventions and a reliable backup/rollback procedure. Preserve the last known working deployment.
3. Stage a reversible migration in an isolated environment, test privilege escalation, role revocation, direct REST calls, cross-module access, and authorized writes.
4. Test self-registration, verified email, recovery and reset (including invalid/reused link), mobile flows and session expiry before any production enablement.
5. Obtain explicit authorization before applying a production migration, granting Queen An a role, or changing deployment configuration.

## Current evidence
GitHub stage/transfer-intelligence-20261101 contains self-registration and recovery pages and static tests. Supabase kingdom-1885-app was reported ACTIVE_HEALTHY on 2026-11-01. No module entitlement table has been created by this work. Tests have not been executed and the recovery code safety gate is unresolved.
