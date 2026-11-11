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

## Header source recovery – 2026-11-11
- Found pinned header in existing GitHub checkpoint at preview/phalanx-home-r13/home-header.jpg, blob SHA-1 59874f2812748e42e419a70bb114b48847693ca2; GitHub file fetch returned base64 payload (597,231 characters including line breaks). This proves source existence, not the required SHA-256 or local file integrity.
- Local runtime direct raw.githubusercontent.com request failed with network ConnectionError. Browser/source fetch fallback did not yield a local binary. Did not create or substitute a different image.
- Read exact original build.cjs, build-hybrid.cjs and hybrid.contract.test.cjs from checkpoint. Build requires original header SHA-256 9b8eef3df70587956fb58ce4028a7de01b183d2f2ff2d58352ab6d298ee0f016 and original R12 SHA-256; hybrid refuses overwriting output and runs original builder. These guards remain intact.
- Important: hybrid.js links Transfer card to existing Cloudflare staging URL in a new window; this is not authenticated same-origin integration. The test checks URL presence, not end-to-end auth.
- Build, header SHA-256 and browser tests remain BLOCKED/NOT TESTED. Do not claim completed HOME integration or release.

## GitHub-hosted source-integrity CI evidence (2026-11-11)
- Created isolated workflow .github/workflows/phx-home-r15-source-integrity-isolated.yml at commit 2758852b926d2410e54378d5011fed0177672281; branch work/phx-home-r15-auth-session-audit-20261111 only; contents read permission; no deploy or database writes.
- GitHub Actions run 43042333046, job 130597123356: completed SUCCESS. Log proves original preview/phalanx-home-r13/home-header.jpg: OK against pinned SHA-256 9b8eef3df70587956fb58ce4028a7de01b183d2f2ff2d58352ab6d298ee0f016.
- Same job ran node --test preview/phalanx-home-r13/hybrid.contract.test.cjs: 8 passed, 0 failed, 0 skipped. These are source contract tests, NOT R15 build or browser E2E.
- Evidence URL: https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/43042333046
- Remaining: R12 source not versioned in repository, so hosted runner cannot execute complete R15 build without a safe, approved source handoff; authenticated same-origin integration and UI E2E NOT TESTED.

## Local original R15 replacement-anchor validation (2026-11-11)
- Used the locally materialized, SHA-256-verified original PHALANX_HOME_R12_TEST.html; verified all 24 literal/regex replacement anchors taken from unchanged preview/phalanx-home-r13/build.cjs.
- Result: 24 PASS, 0 FAIL, every anchor appears exactly once. This establishes deterministic source compatibility for the original builder, not successful build output or UI behavior.
- A local read-only Python script and JSON report were generated under /mnt/data/phx-r15-audit/ (not committed, no application modifications).
- Hosted original header SHA-256 verification and 8 Hybrid C contracts remain PASS from GitHub Actions run 43042333046.
- Remaining full build requires making verified R12 bytes available to an environment that also has the pinned header. No production changes authorized or made.

## Executed original-builder negative-path checks (2026-11-11)
- Workflow commit e6d18f25c095634e7351042ebb24e6805bce3e76; GitHub Actions run 43042914090, completed SUCCESS, all steps passed.
- Executed build-hybrid.cjs with existing output dir: correctly rejected overwrite, PASS.
- Executed build-hybrid.cjs with deliberately invalid R12 source and new output dir: correctly rejected SHA mismatch and did not create output, PASS.
- Pinned header SHA-256 PASS; 8/8 Hybrid C contract tests PASS in same run.
- Attempted local Chromium R12 browser baseline (file URL and loopback HTTP): both returned net::ERR_BLOCKED_BY_ADMINISTRATOR. Browser baseline NOT TESTED; no screenshot or UI result claimed.
- Full positive R15 build and authenticated UI E2E remain NOT TESTED. The verified R12 original remains in local materialized Library copy, not in GitHub runner. No production changes, no DB writes.
