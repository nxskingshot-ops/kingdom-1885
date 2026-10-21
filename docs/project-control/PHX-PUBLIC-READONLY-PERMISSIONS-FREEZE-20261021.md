# PHALANX — Public read-only access vs restricted intelligence (2026-10-21)

## Approved product rule
All approved PHALANX accounts can **read** ordinary Kingshot game facts already publicly visible in the game, including public player power, castle/TG level, public rankings and public alliance statistics, where legitimately available. No per-module special grant is needed for these public read-only facts.

## Restricted separately
- Internal PHALANX analysis, tactical assessments, opponent intelligence, transfer planning, private reports and private alliance data: require explicit fine-grained permissions.
- Editing, imports, user approval, role assignment and administration: require explicit permissions.
- In-game alliance rank (including R5) never implies any PHALANX privilege.
- Public source facts and internally derived confidential insights must be tagged separately, including when displayed in the same module.
- The approval gate remains: account stays pending until an authorized PHALANX admin approves identity and selects permissions. “Read-only for everyone” means **every approved user**, not anonymous public access or unapproved registrants.
- Enforce the distinction at the backend with least-privilege RLS/RPC, not merely UI visibility. Keep source provenance and freshness. Confirm third-party source usage terms before distribution.

## Scope
Product/access-control decision only. No schema changes, policy changes, deploy, merge or production access changes authorized.
