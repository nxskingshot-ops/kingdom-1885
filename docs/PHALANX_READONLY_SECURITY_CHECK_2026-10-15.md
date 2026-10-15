# PHALANX read-only security spot check — 2026-10-15

Scope: public main branch, selected files. No secrets printed; no settings, app, data or workflow changes.

## Observed
- `sw.js` (1,727 chars) and `pwa-update.js` (3,637 chars) were readable; no obvious long quoted hardcoded key in simple pattern check.
- `.github/workflows/phalanx-db-backup.yml` (5,024 chars) and `.github/workflows/phalanx-edge-functions-backup.yml` (1,625 chars) contain secret references; simple check found no obvious long quoted hardcoded key.
- `integrations/outpost-sheet-sync.gs` (1,856 chars) uses Script Properties references and an Edge Function endpoint. Public endpoint existence is not evidence of unauthorized access.
- `index.html` returned empty content through the GitHub connector; **not inspected**.
- Checks were heuristic, only six paths, not a complete repository, history, deployed artifact, token, or dependency audit. Do not interpret as certification or absence of secrets.

## Open gates
1. Inspect actual deployed HTML/JS and PWA caching/deployment chain with a capable read path.
2. Audit complete repo contents and git history for secret patterns without disclosing matches' values; rotate if exposure confirmed.
3. Verify backend auth, RLS, Edge Function access and permissions via authorized read-only checks.
4. Check Pages publication configuration and continuity before any visibility changes.
5. Produce verified backup and restore rehearsal; then seek explicit migration approval.

## Safety
No modifications to production or repository visibility. Do not publish more proprietary development details to public main.
