# PHALANX — Owner sovereignty and operational admin FREEZE (2026-10-21)

## Approved intent
- An (alliance R5) receives comprehensive **operational PHALANX admin** capabilities: manage users and grants, access modules, PYLON and strategy workflows, within defined product operations.
- The PHALANX creator/owner retains final authority, including the exclusive right to invoke and lift an emergency app-wide access lock, revoke An's operational privileges, and manage owner succession/recovery.
- In-game R5 rank by itself conveys no PHALANX permissions. An's admin grant is an explicit assignment to a verified PHALANX account.

## Security design, not a hidden backdoor
- Distinct immutable-to-ordinary-admin `owner` authority vs `operational_admin` capability bundle; enforce at backend, not UI only.
- Operational admins cannot assign owner rights, demote/delete the last owner, disable audit, lift an owner-imposed lock, change security-critical keys or deploy code by default.
- Owner can suspend individual users, revoke privileges, set global maintenance/emergency lock, and lift it. During lock, normal app data/API and PYLON are denied to all non-owner accounts; keep only minimal secure recovery/status flow.
- Prefer short-lived sessions and server-side rechecks for lock/revocation; do not claim instantaneous revocation if token caching or offline access remains.
- Protect owner access with MFA, recovery codes and a documented recovery path; prevent a single account lockout or leaked password from becoming catastrophic.
- Audit lock/unlock, grants, revocations and sensitive operations with actor/time/reason; no plaintext secrets.
- For destructive changes or deployments, require explicit confirmation and independent backups. An's operational access is not blanket infrastructure access.
- Do not create secret bypass endpoints, hard-coded master passwords, universal API keys, or hidden owner impersonation.
- Existing RLS currently grants request review to r4/r5/admin; must be reconciled with explicit capability grants in an isolated, tested migration.

## Status
Design requirement recorded only; no auth settings, database policy, production data, deploy or main-branch changes.
