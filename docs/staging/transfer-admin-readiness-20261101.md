# Transfer Admin onboarding readiness

Status: preparation only. Queen An does not have an account yet. No invitation has been sent.

The current scouting sign-in uses Supabase email/password and a general NXS membership. Its current write roles are r4/r5/admin; these must not be granted solely to enable Transfer Scouting.

Before inviting An: create an isolated module entitlement tied to a verified account, protect all transfer writes on the server, implement auditable versioned rules, validate revoked and unauthorized access, and test login on mobile. Preserve GOD mode and other module permissions.

When An is online, request her preferred invitation email, verify the resulting account identity, and bind only the Transfer Admin entitlement with explicit authorization.

No production permissions, database records, or invitations changed. Editor remains read-only pending verified module authorization.
