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
