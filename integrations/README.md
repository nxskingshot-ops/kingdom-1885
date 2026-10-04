# NXS #1885 – Data synchronization

## Verified Outpost Data → Map

The public map, Outpost Editor and map reports now use the same canonical Supabase table: `public_outposts_verified_20261002` (74 verified records at the 02.10.2026 baseline).

Canonical collaborative sheet:
- **Kingdom 1885 – Verified Outposts – Nexus App**
- tab: `Outposts #1885`
- expected columns A:G: Outpost, Level, X, Y, Bonus, Owner #1885, Status

A transactional backend sync is available at the protected `verified-outpost-sync` Edge Function. It accepts only the authenticated shared-secret webhook, validates every row, rejects datasets below the safety threshold, rejects duplicate coordinates, requires every imported row to be marked `Verified`, records exact-coordinate ownership changes, and replaces the canonical table in one database transaction.

To enable automatic changes made **inside the verified Google Sheet** to reach Supabase, the sheet owner must perform a one-time Apps Script authorization:

1. Open **Kingdom 1885 – Verified Outposts – Nexus App**.
2. Extensions → Apps Script → add the code from `integrations/verified-outpost-sheet-sync.gs`.
3. Project Settings → Script properties → set `NXS_OUTPOST_SYNC_SECRET` equal to the protected server-side `OUTPOST_SYNC_SECRET`. **Never commit, paste into cells, or post the secret.**
4. Run `nexusInstallVerifiedOutpostTrigger`, approve Google permissions, and verify that the result reports 74 rows.
5. Make one controlled test edit, confirm the map/editor/report show the same result, then revert the test edit if it was only for validation.

The installable trigger responds to manual edits. Changes made through APIs, formulas or other automations may not fire an `onEdit` trigger; run `nexusSyncVerifiedOutposts` explicitly after such changes.

### Legacy source

The older `Kingdom 1885 – Live Outpost Map` / `Outpost Data` flow and `integrations/outpost-sheet-sync.gs` write to the legacy `public_outposts` table. The production map no longer reads that legacy table. Do not use the legacy flow as the canonical map source.


## KvK Prep

The app reads protected `kvk_snapshots`, `kvk_player_changes`, and `kvk_roster_history` records from Supabase and reloads the database while visible. New Kingshot results do not automatically appear. A separate secure `kvk-sync` webhook exists, but its scheduled Sheets trigger and canonical release payload are **not yet configured**. Import only committed `ARCHIVED – COMPLETE` releases conforming to the v1.9 contract; never sync unreviewed `Snapshot Input` rows.

## Transfer Scouting

The protected candidate board reads `transfer_candidates`, refreshes periodically, and lets verified R4/R5/Admin members add or edit real candidates. All database writes remain governed by Supabase row-level security. Ordinary members and temporary guests are read-only. The separately linked scouting demo contains fictional browser-local profiles and is not written to the live table.

## Quality gate

Confirm real-user sign-in on two devices, verify guest access and expiry, and manually test an R4/R5 candidate edit before announcing automatic operation. Never publish private API credentials in GitHub Pages, Discord or browser source.
