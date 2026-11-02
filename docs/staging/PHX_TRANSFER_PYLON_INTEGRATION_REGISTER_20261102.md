# PHX Transfer Scouting / PYLON IX integration register — 2026-11-02

Status: DEVELOPMENT IN PROGRESS; RUNTIME NOT VERIFIED. No production deployment or data migration authorized.

## Protected baseline
- Development branch: stage/pylon-ix-livebase-20261102
- Isolated preview branch: phalanx-cloudflare-test-deploy
- Existing transfer scouting, candidate data, role authorization, PYLON IX emblem and PHALANX design FREEZEs remain unchanged.
- Prior GitHub code backups do not constitute a current Supabase database backup or restore test.

## Agreed implementation scope
1. Tools begins with Transfer Planning: event start/end dates, transfer group, destination kingdom, verified event cap.
2. After choosing a group, display its kingdom range with explicit source and confirmation status. Group 7 / 1690–1935 is PROVISIONAL and must not be represented as an official current mapping. Other group boundaries remain unknown until verified.
3. Reuse event context for transfer-power scenario, recruiting needs, Kingdom #1885 comparison, export and kingdom notes. Do not replace existing features.
4. Allow player-ID comparison without requiring permanent candidate storage, preserving the existing read-only lookup and authorization constraints.
5. PYLON IX preparation: shared event-context contract, source timestamps, evidence classification (confirmed/provisional/unknown), role-gated actions, reusable rankings and account assessments. No unverified AI or production integration claims.

## Implementation status
- preview/phx-tools-planning-20261102.js is referenced by the development HTML but NOT deployed or runtime-tested.
- Local device storage is not server sync. Saved cap is wired to the existing power calculator at source level, runtime NOT TESTED.
- Candidate deletion permission was separately granted under NXS R4+ RLS and user reported successful Android test.
- Direct ID comparison, central event persistence, full functional/regression tests and Android acceptance remain OPEN.

## Safe next sequence
1. Read actual code and existing PYLON IX interfaces and FREEZEs.
2. Preserve backups and compare both branches.
3. Integrate the existing helper in isolated preview, then implement shared event context without overwriting database records.
4. Verify event ranges from an authoritative current source before making any group official.
5. Run navigation, role, save/load, calculation, export, comparison and Android regression tests; document evidence.
6. No production merge or additional costs without explicit approval.

## Verified development progress — 2026-11-02
- Development HTML now references the existing planning helper (commit 879b3335).
- Local transfer cap and user confirmation checkbox added; no authoritative event verification (commit 8927ef34).
- Saved-setting scope bug fixed (commit 1bd7c5ef).
- Existing power calculator reads saved cap on load and on planning-save notification (commits d441c101, 405f845f).
- Clearing the planned cap now clears a stale calculator cap/checkbox (commit 63e80741).
- All changes confined to development branch; no deployment, production merge, database migration, or privilege change.
- Source-level presence confirmed through GitHub re-fetch. Browser behavior, calculations, permissions, Android, exports, and regression tests: NOT TESTED.
- The Cloudflare test branch diverged from development (627 commits ahead, 82 behind at comparison); do not merge branches wholesale.
- Local checkbox reflects a user's assertion, NOT independent verification of official transfer rules. Official ranges and caps remain unknown until sourced.
- OPEN: isolated Cloudflare deployment of only required files, runtime verification, shared authorized PYLON IX context, official-source verification, and complete regression evidence.
