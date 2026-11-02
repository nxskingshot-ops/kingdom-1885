# PHALANX PYLON IX — RECOVERY REGISTER — 2026-11-02

## Purpose
Immutable reference for the Queen An Transfer Scouting functional-release phase. Preserve existing preview and code. The illustrated fortress redesign is deferred until the later PHALANX release. No merge or production change authorized.

## Verified GitHub snapshot refs
- Development: `backup/pylon-ix-dev-20261102-freeze`, source `stage/pylon-ix-livebase-20261102`.
- Cloudflare test deployment source: `backup/pylon-ix-preview-20261102-freeze`, source `phalanx-cloudflare-test-deploy`.
- Development JS: `preview/transfer-scouting-id-stage-20261030.js`, blob SHA `c06481c67ea514507c0fa6135a76b909cd82f49c`.
- Deployment JS: `deploy/phalanx-kvk-test/pylon-ix/transfer-scouting-id-stage-20261030.js`, same blob SHA.
- Integrity check: source and saved JS SHA match for both branches (2026-11-02).
- Isolated preview: https://phalanx-cloudflare-test-depl.nexus-phalanx-kvk-test.pages.dev/pylon-ix/transfer-scouting-id-stage-20261030.html
- Prior successful GitHub Actions run #35: https://github.com/nxskingshot-ops/kingdom-1885/actions/runs/41415881115

## Required retained functionality
Player ID lookup; PYLON IX account dossier and provisional rating scale; strengths, weaknesses and tactical recommendations; Kingdom ranking bars and detailed rankings; alliance placement/top-15 historical comparison; player-to-player comparison where supported; Arena Squad; evidence and data freshness. The legacy duplicate role intelligence display was suppressed, not deleted. Keep protected PHALANX design FREEZEs, authentic rankings, auth and permissions.

## Design decisions
For Queen An: complete and validate existing compact design first. Deferred: elaborate fortress-image redesign. Module title TRANSFER SCOUTING; subtitle Powered by PYLON IX. Keep Whale shield and compact three headline power tiles (Total Power, True Power, Castle/TG); do not add separate Master/Hero/Pet Power tiles.

## Restoration procedure (NOT EXECUTED)
1. Freeze writes and inspect current development and deployment branch heads and current backend before any restore.
2. Compare snapshot tree/commit to intended target; inspect changed files and data dependencies.
3. Create another backup of the current target before replacing anything.
4. On explicit approval, restore only affected files or use the saved branch as source for a controlled rollback; do not blindly force-reset or merge.
5. Verify syntax, deployment, player ID lookup, ranking bars, comparisons, Android layout, navigation, exports and auth.
6. Record exact deployment URL, test outcomes and commit SHA.

## Protection and limitations
- Supabase project `hcjrdofkdkasznywvcxo`, region eu-central-1: observed ACTIVE_HEALTHY on 2026-11-02.
- These GitHub branches back up repository code and assets, NOT Supabase database rows, secrets, auth state, storage objects or deployed Edge Function versions.
- Backend backup: NOT CREATED; database integrity/restore: NOT TESTED.
- Restoration test: NOT TESTED. Android end-to-end regression: NOT TESTED.
- Never claim full application backup or restored data based solely on GitHub snapshots.
