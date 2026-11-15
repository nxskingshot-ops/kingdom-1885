# PYLON IX original asset and integration audit — 2026-11-15

## Read-only verified sources
- deploy/phalanx-kvk-test/pylon-ix/pylon-ix-v2-safe-loader.js and preview/pylon-ix-v2-safe-loader.js are identical 588-character scripts. They reference './PYLON_IX_V2_FINAL_ORIGINAL.jpg' and only load './pylon-ix-v2-staging.css' when the image loads and its natural size is exactly 1536x1536. On failure they make no changes to existing UI.
- Git tree snapshot at commit 02eef1e8282071c43c2af4533206f5fded89f62d contains neither 'PYLON_IX_V2_FINAL_ORIGINAL.jpg' nor 'pylon-ix-v2-staging.css'. This proves absence in the checked snapshot, not in external deployments or archives.
- docs/staging/backups/pylon-ix-cloudflare-js-before-dossier-20261102.js is a transfer-scoping JS backup with Supabase client and transfer assessment imports; it is not proof of a PYLON IX knowledge persistence service.
- docs/decisions/PHX-PYLON-IX-CONTINUITY-ADR-20261111.md explicitly marks central PYLON IX connectivity as unimplemented or untested; authenticated Supabase Auth remains the single auth system.

## Consequences
- Preserve PYLON IX emblem freeze and existing visual shell; do not fabricate a replacement logo.
- Do not add a new PYLON knowledge database, sync endpoint, credentials or events until actual implementation and permissions are examined.
- War Room design can use already proven HOME components, but a PYLON branded shortcut must not claim to show the approved original until the image is verified.
- Record every War Room change as a versioned knowledge delta in project register; automatic PYLON ingestion remains NOT TESTED.

## Status
- BESTANDEN: exact original image filename and 1536x1536 validation identified in actual loader.
- BESTANDEN: missing image/CSS confirmed in checked Git tree.
- OFFEN: locate original image in external deployments, user files or archives; verify byte integrity and approved visual.
- NICHT GETESTET: PYLON knowledge read/write, role restrictions, runtime UI activation, War Room integration.
- KEINE: production changes, data changes, replacement image or APK build.
