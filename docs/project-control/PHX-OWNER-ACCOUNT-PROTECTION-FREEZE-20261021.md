# PHALANX — Owner account non-suspendability FREEZE (2026-10-21)

## Binding product rule
The verified sole PHALANX owner account is immune to all ordinary in-app administrative suspension, ban, deactivation, deletion, demotion, ownership reassignment, or permission revocation operations, including actions by operational admins such as An. No administrator can override the owner's decisions.

## Enforcement design
- Maintain one explicitly designated owner principal, linked to a verified auth identity; owner status is NOT inferred from player ID, nickname, alliance or game rank.
- Enforce owner protection in trusted server-side authorization and transactional constraints for every relevant operation (including direct API calls, bulk actions and background jobs). Do not rely on UI-disabled controls.
- Admin operations against the owner must be denied and audited. Only an owner-initiated, strongly authenticated, confirmed owner transfer or voluntary account closure may alter ownership.
- Owner-controlled emergency lock must preserve a secure owner-only recovery and unlock path, while ordinary users and admins remain blocked.
- Owner should use MFA and secure recovery credentials; no hardcoded master password, secret backdoor or universal bypass token.
- Operational immunity cannot prevent outages, account enforcement by third-party infrastructure providers, or loss of access caused by lost credentials. Build an independent, documented recovery path and backups.

## Scope
Product FREEZE / architecture requirement, not yet implemented. No production auth/RLS change, deployment or main merge.
