# PHX HOME R15 – Auth Session Routing Audit (2026-11-11)

Status: SOURCE AUDIT ONLY; no auth wiring, production change or browser E2E test.

## Baseline
- Immutable source reference: 77f535db98aa382e3ad046c86dca817ff8603ce4.
- Backup branch: backup/phx-home-r15-chat-handoff-20261111 (not modified).
- Isolated audit branch: work/phx-home-r15-auth-session-audit-20261111.
- Original R12 HTML SHA-256 required: ace5c9dd54e685e378b350b9d462ec756ce05abd231fae3b66ed35df6eaa0c42; not reverified in this audit.
- Original JPEG SHA-256 required: 9b8eef3df70587956fb58ce4028a7de01b183d2f2ff2d58352ab6d298ee0f016; not reverified in this audit.

## Observed source
1. deploy/phalanx-kvk-test/pylon-ix/transfer-access-v21/transfer-scouting-id-stage-20261030.js uses the existing Supabase project and publishable key, createClient(...,{auth:{persistSession:true,autoRefreshToken:true}}), db.auth.signInWithPassword, db.auth.getUser, and nxs_memberships checks. It is a real existing login implementation for Transfer Scouting, NOT proof that this is the canonical global PHALANX login entry.
2. preview/phalanx-home-auth-rc9-20261014.html is a legacy frozen-HOME wrapper, creates its own Supabase client and checks getUser/membership. It is not HOME R15 or evidence of a shared global router.
3. preview/phalanx-home-r13/build.cjs constructs R15 from the external pinned R12 HTML and pinned JPEG; build-hybrid.cjs builds additively. preview/phalanx-home-r13/home-profile-auth-stage.js is a read-only, non-wired adapter requiring an existing client and authorized player ID resolver.
4. Current Supabase information_schema read-only confirms app_profiles, nxs_memberships, phalanx_alliance_players, nexus_access_requests. pg_policies read-only confirms RLS enabled on all four. app_profiles and nxs_memberships SELECT restrict to auth.uid(); phalanx_alliance_players SELECT depends on phalanx_can_read_alliances().
5. Existing app_profiles has no player_id. No secure auth-user-to-player-id mapping has been demonstrated. A Kingshot player ID must not be treated as an authorization claim. The historical snapshot dated 2026-10-13 must not be displayed as live, and TG 4 is not a verified player level.

## Blocking architectural constraint
Supabase JS persisted session storage is scoped to the browser origin. A login on a Cloudflare Pages origin does NOT automatically establish an authenticated session on a separate Vercel preview origin. Never copy JWTs via query strings, fragments, postMessage without strict trust verification, or embed privileged credentials. Do not assume two separately instantiated clients share sessions across origins.

## Required next evidence
1. Establish actual canonical entry origin, routing and authenticated session owner from currently deployed application, not just old source.
2. Decide an approved same-origin authenticated HOME route or a carefully reviewed server-mediated handoff; prefer same-origin reuse of the existing session and client.
3. Verify R12/JPEG bytes and reproducible R15 build before injection. Preserve HOME, War Room, PYLON IX, Territory, 74 OP, exports and frozen designs.
4. Design server-authorized account→player_id mapping with ownership, RLS and administrative proof; no client hardcoding. A migration requires its own backup/restore evidence and explicit approval.
5. Test unauthenticated redirect, approved/expired membership, observer/operator/admin/GOD, login→HOME→avatar→War Room→back, settings, Android and regressions. No success claims before execution.

## Results
- BESTANDEN: source-level identification of Transfer login implementation; R15 builder/adapter review; read-only schema and RLS inspection.
- NICHT GETESTET: live canonical routing, same-origin session reuse, actual R15 build, browser E2E, Android, PYLON knowledge sync, exports and roles in a browser.
- NICHT DURCHGEFÜHRT: DB backup/restore, migration, deployment, production merge, user/role/data writes.

## PYLON IX knowledge delta
Function links: Transfer login signInWithPassword → getUser → nxs_memberships authorization (existing in Transfer code); proposed authenticated session → HOME R15 adapter → server-authorized player ID → historical player snapshot → HOME DOM (not implemented). Distinguish app role from Kingshot rank. No PYLON IX live ingestion verified.

## Additional verified evidence (2026-11-11)
- Library original PHALANX_HOME_R12_TEST.html materialized locally (11,669,534 bytes); SHA-256 recomputed with sha256sum = ace5c9dd54e685e378b350b9d462ec756ce05abd231fae3b66ed35df6eaa0c42. PASS: exact original R12 source bytes, not a reconstruction.
- Git tree at checkpoint 77f535db98aa382e3ad046c86dca817ff8603ce4 retrieved, 699 entries, not truncated. Existing login implementation in deploy/phalanx-kvk-test/pylon-ix/transfer-access-v21/transfer-scouting-id-stage-20261030.js verified; legacy HOME RC9 separate wrapper verified.
- Vercel project phalanx-r11-atlas-preview inspected. Latest READY preview dpl_9gYqVQFYJFAmStnzucx2ymuNNVXt is associated with audit-only commit 18cad06ba2cf1ff20777fe6e3554775d93a9f1ff, not a verified HOME build. Project has SSO deployment protection. READY is NOT proof of working HOME/auth.
- Vercel deployment file tree lookup returned 404 (not_found); no deployment content or browser functionality could be verified. Stop rather than assuming build artifacts exist.
- Original header JPEG SHA-256, full R15 build, canonical production entry, same-origin routing and end-to-end authentication remain NOT TESTED.

## Local R12 source contract run (2026-11-11)
- Materialized original R12: 11,669,534 bytes, SHA-256 ace5c9dd54e685e378b350b9d462ec756ce05abd231fae3b66ed35df6eaa0c42, verified with local sha256sum and Python hashlib.
- Ran a local static source-contract script against original HTML. PASS (12): checksum, R12 version marker, HOME root, hero, navigation, War Room, PYLON IX modal, War Room route, HOME initialization, PYLON action, name ID, kingdom ID; each required marker occurred exactly once.
- BLOCKED (1 prerequisite): exact pinned home-header.jpg is not available in local working directory; required SHA-256 9b8eef3df70587956fb58ce4028a7de01b183d2f2ff2d58352ab6d298ee0f016 not independently verified. GitHub versioned blob exists, but local fetch was unavailable. Do not bypass the hash check.
- Original build.cjs and build-hybrid.cjs source inspected via GitHub; actual node build and browser E2E NOT RUN. Do not mislabel static marker checks as full build or UI tests.
