# PHALANX – Binding staging implementation gate (2026-11-03)

## Read-only findings
- Two approved access requests match their current Auth metadata and membership roles (2/2 across five fields).
- No dedicated binding relation was found in the inspected live catalog. Historical in-project snapshot is not a current independent backup.
- The active Edge Function is v7 and does not verify an independent binding on reset.
- Existing frontend routes approvals, rejection and reset through the Edge Function; role-specific behavior must be retained.

## Proposed isolated staging sequence (NOT a production migration)
1. Provision a separate, nonproduction Supabase project or equivalent isolated database with no live customer data. Confirm no additional costs before creating it.
2. Create a server-only mapping keyed by access request ID with immutable Auth user ID, player ID and recorded creation provenance. Do not grant SELECT/INSERT/UPDATE/DELETE to anon or authenticated. Ensure even authenticated admins use authorized Edge Function workflows, never direct mapping writes.
3. For legacy records, import only independently verified mappings from an approved, protected source; current matching fields alone do not prove tamper-proof provenance. Do not automatically trust user-editable rows.
4. Extend the existing reset flow to reject mismatched mapping, Auth user ID and Auth metadata; preserve the existing admin-only reset and owner protection.
5. At approval, persist the binding atomically or use a compensating transaction with explicit rollback; test failures between Auth creation, membership creation, request update and binding creation.
6. Verify all existing R4/R5/admin/GOD workflows, role grants, reads, request submissions, resets, errors, mobile UI and regression scenarios. Do not narrow any existing authorized administrator function.
7. Before production: independently verify backup integrity and restoration; capture current ACL/RLS/DDL; obtain explicit production release approval. Stage and production remain unchanged until gates pass.

## Current status
DESIGN DOCUMENTED. Staging environment not verified, migration not executed, integration not tested, production unchanged.
