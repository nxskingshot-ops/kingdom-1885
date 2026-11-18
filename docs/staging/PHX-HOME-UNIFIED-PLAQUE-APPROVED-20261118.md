# PHALANX HOME — Unified Profile Plaque · 18.11.2026

Status: USER DESIGN APPROVED; INITIAL HOME-ONLY CODE INTEGRATION PRESENT ON ISOLATED BRANCH. NOT DEPLOYED OR ACCEPTED.

## Approved visual reference
User-approved generated mockup from the conversation dated 2026-11-18: a single full-width black/bronze/gold ornate plaque ABOVE the existing PHALANX artwork. Two-line responsive arrangement:
- Left: gold-framed circular Spartan helmet/avatar, tappable to open the EXISTING War Room.
- Main upper row: prominent centered dynamic player name (long names must fit).
- Lower row: dynamic kingdom and alliance with their original iconography, separated elegantly.
- No level line, no baked-in profile data, no new authentication.
- Move the EXISTING Queen-An/PHALANX artwork down in the layout; do not regenerate or alter original image bytes, crop the logo, or replace the frozen visual.
- Keep existing HOME navigation, four command-center banners, session/reload, profile source, routes and other modules intact.
- No backend, roles, Supabase or production changes.

## Verified starting point
Branch: work/phx-home-compact-layout-20261118
Commit: d11dc158efcadd9d527e45ca14887ab43a0224d0
Source inventory: android-stage/www/index.html (large monolithic HTML), android-stage/www/PHX_HOME_QUEEN_AN_APPROVED.png, existing phx-war-room-live.css/js and HOME plaque styles.
Previous backup ref: backup/phx-home-before-compact-20261118 (exists; not newly created or restored).
Existing completion/test record: docs/staging/PHX-HOME-COMPACT-DESIGN-20261118.md. Do not rerun unrelated prior successful checks.

## Implementation boundary
Only HOME header/plaque CSS and minimal markup/event integration. Preserve dynamic player identity source, DOM routing and existing login. No changes to War Room, Territory, Reports, PYLON, transfers or exports.

## Acceptance
- User-approved plaque visually matches reference on Android.
- Original HOME artwork preserved and shifted below plaque.
- Avatar enters existing War Room.
- Player name, kingdom and alliance remain bound to authorized player ID.
- No level row.
- No regressions in affected HOME interactions.
- Existing completed tests are reused as evidence, not repeated without impact.

## Current evidence
Design approval: YES.
Code change: INITIAL IMPLEMENTATION committed (JS DOM relocation and HOME CSS); runtime initialization defect corrected in commit 728d0235. Current avatar is a chess-rook glyph placeholder and DOES NOT match the approved Spartan helmet.
Build/deployment: NOT TESTED. Existing fixed Cloudflare preview workflow targets a different branch and has NOT deployed these changes.
New Android visual acceptance: NOT TESTED.
Production: UNCHANGED.

## Review / unresolved before release
- Initial code commits: 778cc6c, cf94f522. Found and corrected temporal-dead-zone bug (`home` referenced before declaration): 728d0235.
- Draft PR #50: https://github.com/nxskingshot-ops/kingdom-1885/pull/50
- Critical visual difference: placeholder rook is NOT approved Spartan helmet. Must reuse actual existing approved avatar source; do not invent new asset.
- Validate runtime DOM relocation of existing identity and affiliation nodes, artwork position, long names, avatar click, Android widths. No verified live preview yet.
- No production merge, no Supabase change, no new backup claim. Prior backup ref still exists.

## Autopilot continuation · 18 Nov 2026

Verified PR #50 open/draft/unmerged, head 28aed0ae8763f287213e1972214d7712f1a8dc01, base d11dc158efcadd9d527e45ca14887ab43a0224d0. Existing backup ref resolves to 4a762ee43d2f15eb3af78eed672662726c5007b9. Latest previous isolated preview and its limitations reviewed against PHX-HOME-COMPACT-DESIGN-20261118.md.

Backup: local complete git bundle created and `git bundle verify` passed; fresh clone from bundle plus `git fsck --full` passed. Restored baseline index and Queen-An PNG compared byte-for-byte. This is a LOCAL SOURCE RESTORE test; hosted rollback, databases and sessions were not restored. New remote backup branch backup/phx-home-before-avatar-fix-20261118 preserves 28aed0ae before the correction.

Correction: reuse and move the original #phx-r8-war-entry button, preserving its listener, localized accessible name and #phx-r10-photo upload node. Default avatar references the actual existing approved portrait in PHX_HOME_QUEEN_AN_APPROVED.png through SVG viewBox 25 0 160 160; no image created or changed. Original file remains SHA-256 44af7b03d8fc1e68ac950b663aef8605bb1c9406e471eec4d10634b2083a9ada. Baseline index remains 7765193e9753c4709b925ca9402c36c425ed2ec7e3c5e26890ae559af7238c97. Old invisible duplicate War Room tab removed from keyboard navigation by display:none. Identity nodes remain unique and moved, not cloned. Unified plaque wraps long names and affiliations; legacy artwork name fitter is bypassed only inside the new plaque.

BESTANDEN locally: frozen checksums, JS syntax, diff whitespace, 10 session unit tests and 14 own-profile handler tests. These unit tests use fixtures, not real authenticated live traffic.

Local Chromium execution BLOCKED: sandbox denies socket() during browser startup. Therefore actual mobile browser tests run in the existing GitHub Actions environment before Cloudflare publish. The workflow retains the existing isolated HOME preview alias so it requires no new backend Origin permission. No main merge, database, roles, permissions, War Academy or production changes.

Pending evidence: CI browser results and deployment, actual screenshot inspection, real authenticated live identity/reload, physical Android user acceptance. New cloud browser currently shows Sign in, so no existing authenticated session is available there. Fixture browser tests explicitly identify simulated HTTP. Full transfer/role matrix, native exports and full unfinished War Room remain outside this HOME correction; do not label them passed.
