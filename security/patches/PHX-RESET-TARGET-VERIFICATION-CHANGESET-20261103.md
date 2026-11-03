# Target binding for nexus-access-review v7

Scope: password-reset branch only. Proposed change, not deployed.

Before calling the privileged password update, retrieve the target Auth user by the approved request's granted_user_id. Reject the operation unless the Auth user's server-controlled app_metadata has nexus_access === true and player_id matches the request's player_id. Continue to enforce the existing owner UUID deny rule. Reject on missing target, missing metadata, mismatch, or lookup failure; never fall back to request-provided identity. Do not change approve/reject branches.

Important: this guards against swapping granted_user_id to an unrelated Auth user, but does not fully protect against an officer changing both player_id and granted_user_id to match another workflow-created account. Therefore revoke direct authenticated UPDATE on server-controlled request fields and route review through the existing server function after dependency checks, backup, and approval.

Required tests: owner reset denied, mismatched target denied, missing target denied, matching normal workflow account allowed, R4/R5 denied, pending denied, tampered dual-field request denied by database privilege boundary, regression for approve/reject. No production changes.
