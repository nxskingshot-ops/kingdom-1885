# PHX-TRANSFER — Mobile compact correction, 01.11.2026

Status: IMPLEMENTIERT; browser verification follows. No complete release claim.

## Source and protection
Baseline Stage a7c124aa3791ba205c1aa421ec831a777efc34f9; existing preview dpl_Ck8ctYpcH1QyBViQRr8u2u8htGHU confirmed READY at the stable test alias. Existing compact workspace reused in a separate worktree. No new app/shell/endpoint. Canonical governance/header/TC constraints previously read in this session still apply. Auth, backend, quotas, RLS, candidate writes, V5/V6/V7 and protected HOME/Atlas/Reports unchanged. Approved header markup and reference stylesheet remain byte-identical under regression tests.

User screenshots 47994–47997 establish that identity/values, native player selector and comparison with Indy Tao rendered on real Android, but density/usability remained unsatisfactory. This is physical-device evidence for the old runtime, not device acceptance of the correction.

## Changes
- Name/ID search and alliance filter over the already-loaded #1885 roster. No new queries for filtering. Exact UID selections retained, including duplicate names, empty search results and a selected player outside the current filter (explicitly labeled).
- Direct internal-ID form moved into a closed native disclosure; functionality and authenticated data path preserved.
- Comparison is a three-column table at all widths: metric / candidate / selected player. Names appear once in its header. Compact numbers remain visible; each cell's closed info disclosure retains exact number, kingdom-specific rank, source and capture time. Missing remains unknown.
- Source/coverage explanation grouped once. Short evidence summary gives shared-value coverage, recorded Total Power percentage difference, and categories with higher/lower raw values. No rank subtraction across kingdoms, combat winner, official trial formula or invented eligibility.
- Reduced workspace navigation, dossier padding and control spacing outside the frozen original header. Mobile-specific card/grid comparison rules explicitly overridden with table layout. Touch controls retained.

## Verification
64 automated regression tests pass: existing auth, identity, data mapping, saves/loads in memory, duplicates, CSV, source time, True Power and navigation; new search/alliance/zero-match/same-name UID tests, exact compact-value disclosures, evidence-only comparison summary, collapsed direct-ID form, no writes. Syntax and whitespace checks passed.
New responsive appearance on physical Android: NICHT GETESTET. Browser has no advertised viewport-resize capability; keyboard zoom attempt did not change CSS viewport and is not counted as mobile verification. Desktop/live verification and deployment evidence to follow.

## Backup / return path
BACKUP ERSTELLT: phalanx-before-mobile-compact.bundle at a7c124a, complete fetched Stage history. INTEGRITÄT GEPRÜFT: git bundle verify. WIEDERHERSTELLUNG GETESTET: separate repository fetch/checkout to exact a7c124a, full git fsck passed. This is source recovery only; live Vercel/Edge/DB restore NICHT GETESTET. Previous preview and immutable code commits retained. No database migration or data reset.

## Open gates
Actual Android acceptance of new density; complete live role matrix; intentional real candidate save/reload; forced slow-source recovery; truly unlisted-player live lookup; full-app HOME/Atlas regression and live restore. Existing Top-100 union is not a complete kingdom census.

## Final preview / live verification
Runtime commit c40fc5334f8c1eb7d98467e9966c9970c263e755; deployment dpl_354ShABLtJ75E8uf7csc19Acibbn READY, target=null (Preview), aliasError=null. Existing project prj_XRX2lvA6YQ4YtT9GG53vy5dt2Kt5 only. All eleven deployed source file identifiers match submitted local SHA1 values. Stable test URL https://phalanx-r11-atlas-preview.vercel.app/ ; immutable preview https://phalanx-r11-atlas-preview-m8na3d0yz-matze4428-6040.vercel.app/ (protected, app CORS uses stable alias). Prior preview retained as return path.

BESTANDEN authenticated live:
- Session hydrated after reload; original one-candidate shortlist loaded. Existing external candidate 227802999 refreshed to 411700234, Castle TG5 5/5 and all summary fields; no save/update performed.
- #1885 index loaded 274 entries. Name search 'Indy Tao' yielded one match; selected FaQu was explicitly retained outside filter. Selecting Indy Tao and alliance OoO yielded exactly one match and correct UID counterparty.
- Zero-match query retained selected Indy Tao and clearly stated zero matches/selected outside filter. Clearing/restoring search recovered the expected match without a new load.
- Comparison displays 24 metric rows in a real three-column table. Live DOM measured first row approx 32.55 CSS pixels at desktop width; no mobile-card layout at this desktop viewport. Header names once, per-cell compact values and closed info controls.
- First candidate Total Power disclosure opened to exact 411700234, rank 5, Provider data, capture 2026-11-01 04:16:30 UTC, then closed. Exact values are preserved despite compact display.
- Evidence brief updated for selected Indy Tao: recorded Total Power difference approx +4.6% after his individual source refresh, with higher/lower categories and explicit no-combat-conclusion wording. Kingdom ranks never treated as a common ranking.
- Back to Candidates -> Tools preserved search, alliance and selected Indy Tao. Reopen candidate -> Compare #1885 restored the same comparison and controls.
- Visual viewport screenshot inspected: flat readable table with many rows visible. Full-page screenshot attempt timed out; ordinary viewport inspection succeeded. No claim of a saved/delivered screenshot or resized mobile viewport.

64/64 automated tests, syntax and whitespace checks BESTANDEN. Android density/device acceptance remains NICHT GETESTET on this new runtime. The supplied Android screenshots remain the failure evidence that triggered this correction.

Integrity: current protected candidate table remains one row; fingerprint fac74063041a32834ba0f185c6f8ef0d matches prior baseline. No candidate changes or schema/auth/RLS/backend changes.

Runtime backup: phalanx-mobile-compact-runtime.bundle, SHA256 f92fda8d92ca448fb258a5577e215c5bab885831b7f8dff7465443fbd8083d0c. BACKUP ERSTELLT; INTEGRITÄT GEPRÜFT (bundle verify); WIEDERHERSTELLUNG GETESTET (separate repository fetch, exact c40fc533 checkout and full fsck). Local source bundle plus durable GitHub history; no new independent external DB backup or live deployment restore claim. Earlier open gates remain listed above.
