# Nexus · Kingdom #1885 — To-do

## After the current app test

- [ ] **Outpost Editor (mobile):** Code/data source is aligned to the canonical 74-row verified table and authorized roles are Outpost Manager / R4 / R5 / Admin. Remaining: verify a real authorized login on Android, save one controlled change and confirm it appears on the public Outpost Map. Do not change the approved Nexus design.
- [ ] **Verified Google Sheet synchronization:** Transactional Sheet → Supabase sync is implemented in code (`integrations/verified-outpost-sheet-sync.gs` + `verified-outpost-sync`). Remaining: one-time Apps Script authorization in the canonical verified sheet and one controlled sync test. App/editor → Sheet reverse-sync is intentionally not enabled.
- [ ] **KvK snapshot import:** Complete the authorized import of newly committed, reviewed Google Sheets snapshots into Supabase; the existing dashboard currently reads imported historical data.
- [x] **Automatic backup audit:** Daily GitHub source backup schedule verified running successfully on 04.10.2026. Private Supabase rollback snapshot also captured; provider-level/off-project disaster recovery still requires confirmation.

## Test-app priority

- [ ] Verify all current tabs are visible to testers on mobile and desktop.
- [ ] Verify guest login provides read-only access to protected KvK data and expires as intended.
- [ ] Keep fictional Transfer Scouting profiles separate from genuine candidate records.
