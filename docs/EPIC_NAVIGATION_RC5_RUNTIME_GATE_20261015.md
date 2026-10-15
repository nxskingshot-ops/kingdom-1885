# RC5 runtime gate — authentication and offline constraints (2026-10-15)

This is a read-only source-level security/functional gate, not a completed browser test of the 12 target modules.

## Confirmed from source
- Kingdom Scout test page imports Supabase JS from jsdelivr, creates a client for hcjrdofkdkasznywvcxo.supabase.co, invokes auth.signInWithPassword, auth.signOut, auth.getSession, and a bearer-authorized GET to /functions/v1/phalanx-kingdom-scout-report-test with kingdom and boards parameters.
- Ranking RC page imports Supabase JS from esm.sh, uses a session access token and GET to /functions/v1/phalanx-native-ranking-rc-test with board and limit.
- Outpost Report V11 embeds ../index.html?kingdom-preview=an-viewer-v1&single-header=3 and dynamically injects ./outpost-viewer-an-v1.js into the nested document.
- These flows require origin/network availability and, for authenticated reports, an authorized test account. No credentials used and no API requests sent.

## Environment gate
- Container cannot resolve nxskingshot-ops.github.io (DNS resolution failed); thus actual hosted target navigation cannot be verified from this runtime.
- Earlier Chromium smoke test only exercised isolated navigation DOM with external network blocked, not target modules.

## Required before declaring functional
1. Obtain authorized test environment with reachable GitHub Pages and Supabase, or a full local mirror with dependency stubs.
2. Validate guest/authenticated flows, route and return navigation, CORS, data access boundaries, and errors without changing production data.
3. Confirm shared URLs select correct submenu function (especially 3 outpost entries).
4. Record actual runtime outcomes separately from source evidence.

No change to main, FREEZE or production.
