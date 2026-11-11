# PHX HOME HYBRID C / R15 – Isolated Integration Register
Date: 2026-11-11
Branch: work/phx-home-hybrid-c-r15-isolated-20261111
Pinned baseline: e95031a3fda9c34d78c73c23acfcfe46f5148c2b
Target: existing Vercel preview project phalanx-r11-atlas-preview (preview only).

## Protected
- UNIFIED HEADER V2, HOME FREEZE, Epic Navigation V2 RC5, original PYLON IX emblem.
- HOME > Territory Control > Outpost Map 2.0 / Reports > Back.
- 74 outposts, filters, zoom, fullscreen, JSON/CSV export, existing module scripts.
- Auth, roles, Supabase data and production deployment: do not alter.

## Current evidence
- Original R12 HTML SHA-256: ace5c9dd54e685e378b350b9d462ec756ce05abd231fae3b66ed35df6eaa0c42.
- R15 builder at preview/phalanx-home-r13/build.cjs, pinned to R12 and original header JPEG SHA-256 9b8eef3df70587956fb58ce4028a7de01b183d2f2ff2d58352ab6d298ee0f016.
- Existing Vercel R15 preview READY at deployment dpl_MvPkuftPpCDaJLFhZaAcumBHAYdA (not Hybrid C).
- Local Hybrid C R12 navigation correction and static/browser partial tests exist only in the conversation workspace; not yet copied into this branch.
- Browser navigation end-to-end, real Android, R15+Hybrid C build and HTTPS deployment: NOT TESTED.

## Next actions
1. Reproduce genuine R15 build from pinned R12 and original JPEG using repository build infrastructure, without substituting assets.
2. Integrate PYLON IX and strategic War Room panels additively; retain R15 dynamic header and settings behavior.
3. Build and deploy preview only, then test PYLON, Territory, return, 74 outposts, exports, desktop/mobile.
4. Record exact build/deployment checksums, rollback deployment and test outcomes. No production merge.

## Status
ISOLATED BRANCH CREATED; NO HYBRID C INTEGRATION OR RELEASE CLAIMED.

## Verification update – 2026-11-11
- Vercel deployment dpl_3LL3ehDs1aiaCy7T9VDqFC3VB4B3: READY, commit fbe66a5, preview only.
- Build events: generic Vercel CLI 65.14.0, completed in 531ms; NO execution of build-hybrid.cjs evidenced. READY is not a functional HOME acceptance.
- Repository original header asset at preview/phalanx-home-r13/home-header.jpg: EXISTS (GitHub connector cannot UTF-8 decode JPEG; earlier local absence does not mean repository absence).
- Repository preview/phalanx-home-r13/r12-source.html: NOT FOUND.
- Repository preview/phalanx-home-r13/public/index.html: NOT FOUND.
- Root package.json and vercel.json: NOT FOUND.
- The verified R12 HTML exists only in the isolated conversation workspace; no authorization to expose its 11MB contents to a public repository was inferred.
- BLOCKER: arrange a controlled input artifact for the pinned R12 source and explicitly invoke the R15/Hybrid C builder in an isolated preview build. Do not point the shared Vercel project at an unverified build output.
- Integration files currently present in branch, but no complete output generated or browser regression proven.

## Source contract verification – 2026-11-11
- Source: all five current files fetched back from GitHub branch (build.cjs, build-hybrid.cjs, hybrid.css, hybrid.js, hybrid.contract.test.cjs).
- Independent V8/JavaScript source assertions: 5 of 5 PASS (SHA pins, wrapper guard, CSS scoping, no new JS persistence, syntax parse). This was not the GitHub Actions runner; do not represent as CI success.
- GitHub Actions run listing for commit 0fc74e0 returned zero runs (endpoint is limited to PR-triggered runs). CI execution remains NOT CONFIRMED.
- Vercel deployment dpl_6gPQTgbbTva7gNNyFj3h9oHeb5pk, commit 0fc74e0, READY preview. This does not prove build-hybrid.cjs ran.
- Missing verified R12 input at expected repository path remains the blocking dependency for full R15 output.
- Pending: actual builder execution, served HTML validation, full module navigation, Android and data regressions.
