# PHALANX — Access scope correction: Outposts public to approved users, rankings restricted (2026-10-21)

## Supersedes
This decision **supersedes** the ranking-related grant in `PHX-PUBLIC-READONLY-PERMISSIONS-FREEZE-20261021.md`. The prior general-read permission for rankings is withdrawn.

## Approved default access after manual account approval
- User's own player profile and game facts: read-only.
- Outpost map: read-only for every approved PHALANX user.
- Outpost reports **limited to public location / ownership facts**: read-only for every approved user; confidential notes, assessments, history or derived strategic intelligence require explicit permission.
- Rankings (player, alliance, aggregated, historical, comparisons): **not** part of the default read-only tier. Explicit grant required.
- Tactical/strategic intelligence, opponent analysis, transfer planning: explicit grant required.
- Outpost edits, imports, administration, role and permission management: explicit grant required.
- Kingshot rank including R5 confers no PHALANX rights.
- Pending or unapproved accounts get no protected app access.

## Security/implementation
Backend access control must enforce least privilege, including direct API access. Distinguish public Outpost facts from confidential annotations/analyses in the data model; never expose full raw internal reports under a generic public-read endpoint. Existing policies and UI not changed by this decision.

## Status
Product FREEZE only. No deployment, migration, permission changes, or merge.
