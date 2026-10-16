# PHALANX Header V2 — route discovery (isolated, no production mapping)

Source examined: `deploy/phalanx-kvk-test/epic-navigation-v2-kvk-test.html` on `fix/battle-readiness-navigation-isolated-20261015`.

## Existing top-level sections
1. Command Center
2. KvK Operations
3. Kingdom Intelligence
4. Territory Control
5. Transfer Command
6. PHALANX Lab
7. Reports & Data
8. Settings & About

## Existing observed internal test links
- `kvk-prep-v13-epic-v2-test.html`
- `kvk-prep-v13-offline-ui-smoke.html`
- `battle-readiness-isolated.html`
- `player-intelligence-isolated.html`
- `alliance-trends-isolated.html`
- `phalanx-ranking-integration-rc-20261015.html`
- `outpost-audit-isolated.html`
- `hero-intelligence-v15-isolated.html`
- `team-optimizer-alpha11-isolated.html`

## Mapping gate
The newly added seven HOME buttons (HOME, KRIEG, ALLIANZ, WERKZEUGE, GUIDES, STATISTIKEN, INFO) do **not** correspond one-to-one with the eight existing Epic Navigation groups. Do not infer their routes or silently replace existing navigation. Any link or route used for a button must be explicitly grounded in the actual application router and checked for access permissions.

The standalone header preview deliberately reports callbacks rather than performing navigation. This is not a release-ready integration.

## Further checks
- Confirm which navigation scheme is authoritative for the HOME FREEZE.
- Reconcile HOME buttons with actual router paths and authenticated permissions.
- Test mobile viewport, safe-area and pixel-parity before approval.
- Keep all existing production and FREEZE surfaces untouched.
