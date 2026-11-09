# PHALANX Access V2 — dual-authorization negative test (2026-11-09)

Environment: isolated Supabase yuyvmbdybwpwpqsipfjt. Production unchanged.

Executed in BEGIN/ROLLBACK:
- Inserted temporary active app administrator role for existing isolated auth user.
- Inserted temporary pending application for different isolated auth user.
- Deliberately did not enable a registration reviewer for the administrator.
- Called phx_approve_registration_with_role_v2 as authenticated administrator.
- The SQL test trapped SQLSTATE 42501 insufficient_privilege, confirming the independent reviewer permission gate.
- ROLLBACK.

Verified after test: 0 app roles, 0 role events, 0 matching temporary application rows.

Read-only inspection of existing phx_review_registration shows it returns access_granted:false and does not grant membership. The new approval function calls it within a transaction before inserting role and audit.

PASSED: dual authorization negative path; rollback integrity.
NOT TESTED: real HTTP/JWT authenticated workflow, browser/Android, actual module access, production regression.
RELEASE BLOCKERS: no verified persistent bootstrap administrator/reviewer; no isolated web preview and browser tests; protected GOD identity binding and app module authorization still need verification.
