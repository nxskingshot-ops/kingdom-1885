# Nexus App — Go-live hardening audit
## 04.10.2026

Goal: perform every safe, non-device-dependent go-live task without changing the approved visual design.

## Completed

### Safety / backups
- Created GitHub pre-hardening backup branch: `backup-2026-10-04-pre-golive-hardening`.
- Verified the scheduled GitHub source-backup workflow has successful scheduled runs, including 03.10 and 04.10.
- Created a private Supabase rollback snapshot in schema `nexus_backup` for 14 application-data tables.
- Verified the snapshot manifest and row counts.

### Access & roles
A schema mismatch was found: the app offered Kingdom, Outpost Manager and R5 concepts, but the database membership constraint only accepted `member`, `r4`, `admin`.

Fixed:
- membership roles now support `kingdom`, `member`, `outpost_manager`, `r4`, `r5`, `admin`;
- role hierarchy function aligned with those roles;
- access-request RLS optimized and aligned for R4/R5/Admin review;
- Outpost update RLS now permits Outpost Manager, R4/R5 and Admin;
- browser Outpost Editor authorization aligned with the same role set;
- active Supabase Outpost Editor edge page aligned with the same role set.

Current access-request table has no unreviewed request requiring an automatic decision. Existing approved test entries were left untouched.

### Database security/performance
Supabase advisors were run before and after the migration.
Resolved:
- unindexed foreign-key warnings;
- auth RLS init-plan warnings on the changed policies;
- duplicate outpost indexes.

Remaining security warning:
- leaked-password protection is disabled in Supabase Auth. This requires an Auth configuration change and should be enabled before broad rollout where available.

Tables with RLS enabled and no client policies are intentionally private/service-only; no public policy was added just to silence the informational advisor.

### Help & Search
Expanded the existing DE/EN/FR searchable user guide without changing its layout. Added:
- access-request workflow;
- role/permission explanation;
- Opponent Intelligence vs Battle Readiness;
- update/cache/PWA troubleshooting;
- What's new / current go-live hardening state.

### PWA/update static audit
Verified in source:
- PWA starts at `preview/kingdom-hub-menu-test.html?view=map`;
- fullscreen display and landscape orientation are configured;
- service worker is network-first and uses cached content primarily offline;
- update checker compares deployed shell content and checks for service-worker updates;
- unsaved-input warning exists before applying an update.

## Outpost source-of-truth audit — BLOCKER, no automatic overwrite

Live `public_outposts` currently contains 68 published rows, all marked `verified=false`.
The separate verified 02.10 snapshot contains 74 published/verified rows.

Coordinate reconciliation:
- 22 coordinates exist in both sets;
- 12 are exact matches for owner/type/level;
- 10 have the same structure/level but a different owner;
- 46 live coordinates are absent from the verified snapshot;
- 52 verified-snapshot coordinates are absent from live;
- no same-coordinate structure/level mismatches were found among the 22 overlaps.

Because the two datasets clearly represent different baselines rather than a simple six-row extension, the live table was **not** overwritten automatically. A human choice of canonical map baseline is required before destructive synchronization.

## Still requires a person/device

- Real-user login/logout test for each intended role.
- Physical phone testing in portrait/landscape, PWA launch, Full Screen, Map Focus and keyboard behavior.
- Confirm which outpost dataset is the canonical current truth before replacing live data.
- Enable Supabase leaked-password protection if available for the plan.
- Confirm provider-level/off-project database disaster-recovery backup.
- Visual pass for remaining layout issues that only reproduce on a tester device.

## Freeze rule

No approved visual layout was redesigned in this hardening pass. Changes were limited to permissions, help content, database hardening, backup safety and auditing.
