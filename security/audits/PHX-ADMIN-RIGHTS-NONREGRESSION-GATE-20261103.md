# PHALANX – ADMINISTRATOR RIGHTS NON-REGRESSION GATE

Status: BINDING REQUIREMENT, NOT IMPLEMENTED. User clarification: security hardening MUST NOT restrict any existing administrator rights anywhere in PHALANX.

- Preserve current functional authority and workflows for GOD, admin, R5 and R4 according to the existing role matrix. Do not expand or silently narrow privileges.
- Separate functional permission from direct SQL access. A protected server-side path may replace direct table UPDATE only if all authorized actions, results, error paths, and availability are verified equivalent.
- Previous blanket UPDATE-revoke draft is NOT APPROVED for execution. Do not apply it without full inventory, backup/restore evidence, staging tests and explicit production authorization.
- Inventory all admin workflows and dependencies across HOME, modules, user management, approvals, resets, role assignment, reports, exports, and related Edge Functions/RPC/triggers.
- Acceptance: each authorized role's existing actions remain available; ordinary users cannot elevate privileges or redirect target accounts; owner cannot be reset by ordinary administrators; no credential secrets exposed; GOD authorized identity visibility retained.
- Test on isolated environment with real role sessions and positive/negative cases. Stop and roll back if any preexisting authorized admin workflow fails.

Status: requirements REGISTERED; role matrix inventory INCOMPLETE; staging test NOT TESTED; production changes NONE.
