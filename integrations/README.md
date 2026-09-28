# NXS #1885 – Data synchronization

## Outpost Data → Map

The map reads published records from Supabase automatically about every 15 seconds. The backend `outpost-sync` accepts an authenticated import of the `Outpost Data` Google Sheet. To enable changes made **inside Google Sheets** to reach Supabase, the sheet owner must perform a one-time Apps Script authorization:

1. Open [Kingdom 1885 – Live Outpost Map](https://docs.google.com/spreadsheets/d/1NVT4yzztbduo0B0VwXw6i-Do1HpiKUK6IQe1dHcjcWE/edit).
2. Extensions → Apps Script → add the code from `integrations/outpost-sheet-sync.gs`.
3. Project Settings → Script properties → set `NXS_OUTPOST_SYNC_SECRET` equal to the protected value configured server-side as `OUTPOST_SYNC_SECRET`. **Never commit or post the secret.**
4. Run `nxsInstallOutpostTrigger`, approve Google permissions, and verify that the import reports the expected number of records.

The installable trigger responds to manual edits. Formula recalculation, API writes and row deletions are not automatically reflected by this trigger. The backend upserts rows by spreadsheet row number; avoid sorting/deleting rows until stable IDs and removal semantics are introduced.

## KvK Prep

The app reads protected `kvk_snapshots`, `kvk_player_changes`, and `kvk_roster_history` records from Supabase and reloads the database while visible. New Kingshot results do not automatically appear. A separate secure `kvk-sync` webhook exists, but its scheduled Sheets trigger and canonical release payload are **not yet configured**. Import only committed `ARCHIVED – COMPLETE` releases conforming to the v1.9 contract; never sync unreviewed `Snapshot Input` rows.

## Transfer Scouting

The protected candidate board reads `transfer_candidates`, refreshes periodically, and lets verified R4/admin members add or edit real candidates. All database writes remain governed by Supabase row-level security. Ordinary members and temporary guests are read-only. The separately linked scouting demo contains fictional browser-local profiles and is not written to the live table.

## Quality gate

Confirm real-user sign-in on two devices, verify guest access and expiry, and manually test an R4 candidate edit before announcing automatic operation. Never publish private API credentials in GitHub Pages, Discord or browser source.
