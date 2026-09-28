# Nexus · Kingdom #1885 — To-do

## After the current app test

- [ ] **Outpost Editor (mobile):** Verify R4/admin login on an Android phone, test saving a coordinate change to Supabase and confirm it appears on the public Outpost Map. The editor is not required for the current tester rollout. Current candidate: `preview/outpost-editor-v4.html`. Do not change the approved Nexus design.
- [ ] **Google Sheets synchronization:** Decide whether Outpost edits in the app should also update the source Google Sheet; currently they do not.
- [ ] **KvK snapshot import:** Complete the authorized import of newly committed, reviewed Google Sheets snapshots into Supabase; the existing dashboard currently reads imported historical data.

## Test-app priority

- [ ] Verify all current tabs are visible to testers on mobile and desktop.
- [ ] Verify guest login provides read-only access to protected KvK data and expires as intended.
- [ ] Keep fictional Transfer Scouting profiles separate from genuine candidate records.
