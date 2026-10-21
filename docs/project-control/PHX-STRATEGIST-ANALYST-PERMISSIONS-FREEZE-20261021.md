# PHALANX — Strategist / Analyst role FREEZE (2026-10-21)

## Approved intent
A designated PHALANX strategist/analyst must have broad access to all information and analysis capabilities needed to prepare battles and KvK effectively. This is an explicit PHALANX role/permission bundle, independent of Kingshot rank or alliance R5 status.

## Strategist access
- Rankings and historical player/alliance power trends, comparisons.
- Opponent Intelligence, threats, tactical alerts, strategic assessments.
- KvK preparation, matchmaking risk, command analytics, readiness dashboards.
- Battle readiness, combat reports, heroes, troops, formations, buffs, scenario analysis.
- Territory Control, Outpost map, reports, ownership history and tactical evaluations.
- PYLON IX may retrieve and reason across all data granted to the strategist, including cross-module synthesis, while respecting scope and provenance.
- Relevant exports/reports for battle/KvK preparation within explicitly granted scope.

## Boundaries
- Strategy role does NOT imply admin permissions: user approvals, permission grants, auth configuration, infrastructure, deployment, production writes and sensitive credentials remain separately protected.
- Separate read/analysis rights from write/edit rights. Editing Outpost records, publishing plans, changing shared intelligence and sending messages require distinct grants and appropriate confirmation.
- Restrict strategist access by authorized kingdom/alliance/operation where needed; do not assume global unrestricted access across tenants or private unrelated accounts.
- In-game rank (including R5) grants no rights by itself.
- Server-enforce permission checks for UI, API, exports and PYLON tools. Maintain audit trails for sensitive actions.

## Status
Product role/access FREEZE only; not implemented. No DB, RLS, production, deployment or main-branch changes authorized.
