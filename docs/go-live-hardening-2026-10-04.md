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

Fixed end-to-end:
- membership roles now support `kingdom`, `member`, `outpost_manager`, `r4`, `r5`, `admin`;
- role hierarchy function aligned with those roles;
- access-request RLS optimized and aligned for R4/R5/Admin review;
- access-review Edge Function now supports a distinct R5 grant;
- main Access Requests UI exposes separate R4 and R5 grant choices;
- central **Member Sign-in** entry added to the existing Access & Support menu;
- Outpost update RLS permits Outpost Manager, R4/R5 and Admin;
- browser Outpost Editor authorization aligned with the same role set;
- active Supabase Outpost Editor edge page aligned with the same role set;
- current KvK client recognizes R5 as protected member access;
- current Transfer Scouting LIVE client recognizes R5 as member access and R5 as editor/officer access.

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

## Outpost source-of-truth audit and alignment

The canonical current dataset is now confirmed as **Kingdom 1885 – Verified Outposts – Nexus App** / `Outposts #1885`.

Direct comparison on 04.10.2026 confirmed:
- Google Sheet: 74 verified rows;
- Supabase `public_outposts_verified_20261002`: 74 rows;
- zero sheet-only rows;
- zero database-only rows;
- zero mismatches in structure, level, coordinates, owner, bonus, Verified status or Published status.

The older `public_outposts` table contains a different 68-row legacy baseline and is no longer treated as the production map source.

Aligned in code:
- public map reads `public_outposts_verified_20261002`;
- map reports use exactly the rows currently displayed by that map;
- Outpost Editor now reads/writes `public_outposts_verified_20261002`;
- editor RLS allows Outpost Manager, R4, R5 and Admin;
- standalone Outpost Editor edge page was aligned to the same canonical table.

A transactional verified-sheet synchronization path was added:
- Edge Function: `verified-outpost-sync`;
- database RPC validates the full verified dataset and replaces it atomically;
- duplicate coordinates, invalid rows, unverified rows and implausibly small datasets are rejected;
- exact-coordinate owner changes are logged before replacement;
- integration script: `integrations/verified-outpost-sheet-sync.gs`.

The only remaining step for automatic Sheet → Supabase propagation is the one-time Google Apps Script authorization by the sheet owner.

## Still requires a person/device

- Real-user login/logout test for each intended role (Kingdom / Member / Outpost Manager / R4 / R5 / Admin).
- Physical phone testing in portrait/landscape, PWA launch, Full Screen, Map Focus and keyboard behavior.
- Run the one-time Google Apps Script authorization in the verified Outposts sheet, then perform one controlled edit/sync verification.
- Enable Supabase leaked-password protection if available for the plan.
- Confirm provider-level/off-project database disaster-recovery backup.
- Visual pass for remaining layout issues that only reproduce on a tester device.

## Freeze rule

No approved visual layout was redesigned in this hardening pass. Changes were limited to permissions, help content, database hardening, backup safety and auditing.
