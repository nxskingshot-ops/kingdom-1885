# Transfer Scouting — standalone access inbox V1 (staging contract)
Status: READY FOR IMPLEMENTATION REVIEW, NOT DEPLOYED. 2026-11-01.

## Protected source of truth
04_SECURITY_GOD_MODE.md requires email, password, Kingshot player ID, email verification, then PENDING_APPROVAL; do not request manually entered name/alliance/power/TC. Kingshot rank never grants PHALANX admin. Queen An may have module admin but never GOD mode. Owner protection remains separate and is not yet implemented end-to-end.

## Self-service request
1. Registration: email, password twice, show/hide, Kingshot player ID; verify email. Do not send email/password to project owner. No module rights from registration.
2. After verification, an authenticated user explicitly requests Transfer Scouting access. Store request keyed to auth user ID, requested module role, player ID and status PENDING_APPROVAL. User can see their own status. Never trust submitted player ID as proof of identity without verification.
3. Protected owner inbox lists requests by display name or player ID and role, not email by default. Status: PENDING_APPROVAL, APPROVED, REJECTED, REVOKED. No public pending list.
4. Approve/reject actions require server-verified, independently protected project-owner identity. Approval writes module-only entitlement and audit trail in one transaction. No admin controls for ordinary users or Queen An.
5. All module reads/writes require server-enforced authorization. Requesting TRANSFER ADMIN cannot self-approve or grant other roles.
6. Revoke, expiry, repeated requests, audit, duplicate requests and concurrent approvals must be handled without privilege escalation.

## First release UI
Separate Transfer Access Requests section available to the owner inside the protected Transfer Scouting app; no GOD dashboard dependency. Pending count and list, Approve / Reject with confirmation, and current grants with Revoke. Queen An sees a pending approval message after verified registration.

## Critical gates
- Inspect existing owner guard, current RLS and audit schema; do not infer owner from Kingshot rank, public email, user metadata or editable display name.
- Implement registration Kingshot ID requirement in the staging UI and server; current staging form does not yet collect it.
- Build isolated reversible migration and authenticated server endpoints, run tests for forged approval, wrong user, unverified email, revoked role, concurrent approval, reset flow, and Android navigation.
- No production migration, owner privilege grant, email delivery change, deployment, or cost without explicit approval.

Evidence: this document only. Current functional implementation: NOT DONE. Testing: NOT TESTED.
