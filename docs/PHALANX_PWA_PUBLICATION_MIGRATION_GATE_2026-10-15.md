# PHALANX PWA / GitHub Pages migration gate

Date: 2026-10-15. Read-only review; production unchanged.

## Confirmed
- GitHub repository is public and Pages is enabled; publication configuration itself has not been independently verified.
- README references a public GitHub Pages preview at `/kingdom-1885/preview/kingdom-hub-menu-test.html`.
- `sw.js` uses cache `kingdom-1885-nexus-20261004-v54`, network-first fetch, offline fallback, skipWaiting and clients.claim.
- `pwa-update.js` checks deployed shell changes and service worker registration updates.
- `manifest.webmanifest` start_url points to `./preview/kingdom-hub-scouting-v6.html?view=map`; scope `./`; display fullscreen; orientation landscape.
- `sw.js` was last committed 2026-10-04 according to GitHub commits API.

## Risks if visibility/hosting changes prematurely
- Existing installed PWAs may keep cached shell but fail network refresh, auth or deep links.
- Pages preview URLs may break and offline fallbacks may point to removed paths.
- Different manifest/start_url versions may complicate migrations.
- Making repo private does not revoke copies or erase history.

## No-change migration checklist
1. Enumerate all active public URLs, Pages source branch and publication settings, manifest variants and service-worker scope.
2. Verify which URLs Android testers actually installed/bookmarked and their update behavior.
3. Prepare private development and a minimal public deploy without proprietary source files.
4. Preserve existing PWA URL or provide tested transition strategy; stage old and new app concurrently.
5. Test fresh install, offline launch, cache upgrade, login, Outpost, Alliance Top-40, back navigation and external module routing.
6. Verify backup and rollback, then request explicit approval for hosting/visibility changes.

## Status
No migration, no deployment, no permissions changes. This document is planning evidence, not release approval.
