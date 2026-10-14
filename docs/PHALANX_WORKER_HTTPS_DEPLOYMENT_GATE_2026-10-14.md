# PHALANX Worker HTTPS deployment gate — 2026-10-14

## Verified
- Browser smoke test exists only on isolated audit branch: `preview/phalanx-monte-carlo-worker-browser-test-20261014.html`.
- Worker prototype exists on the same branch: `preview/phalanx-monte-carlo-worker-prototype-20261014.js`.
- Both use the unchanged main-branch Monte Carlo engine via relative `../src/phalanx-monte-carlo-v2.js` (this must be available at same served revision).
- Conventional main-branch paths `.github/workflows/pages.yml`, `.github/workflows/deploy.yml`, `.nojekyll`, `CNAME` were not found; this does **not** establish GitHub Pages configuration.
- GitHub Pages normally serves the configured publication source; files on an arbitrary audit branch are not automatically available via the production Pages domain.

## Gate
1. Confirm Pages publication source and deployment configuration using repository settings or trusted deployment logs.
2. Choose an isolated HTTPS preview that serves the audit revision **without changing** the production Pages source, DNS, or production branch.
3. Confirm worker script and `../src` module return JS with appropriate content type; check CSP/worker-src.
4. Run smoke page on mobile/Chromium; require exact result equality and heartbeat responsiveness.
5. Do not merge, deploy, or alter the FREEZE without explicit approval.

## Status
Deployment configuration not confirmed. No public preview URL asserted. No production modifications.
