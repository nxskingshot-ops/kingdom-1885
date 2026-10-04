# NEXUS · Ideas & To-do Board 👑

**Owner:** FaQu · **Project:** Kingdom #1885 / NEXUS · **Created:** 2026-09-28

This document is the shared, persistent backlog of ideas and follow-up work. **An idea is not authorization to change the app.** Discuss and obtain FaQu's approval before implementation. Preserve the approved design, data, permissions and working features. Distinguish *code implemented* from *verified on device*. Never alter the stable backup branch.

## Open / needs verification

- [ ] **PWA fullscreen and launch:** Confirm that the *new NEXUS NXS installation* opens the Outpost Map, not standalone KvK, and check Android status/navigation bars on FaQu's phone.
- [ ] **End-to-end internal test:** Test each app tab and transitions, login/logout, Kingdom / Member / Outpost Manager / R4 / R5 / Admin permissions, map/editor navigation, scouting demo vs protected live data, editing/save, phone and desktop.
- [ ] **Scouting board on phone:** Verify compact non-horizontal-scroll candidate table and that profile retains columns hidden at narrow widths. Adjust only after feedback.
- [ ] **Invitation categories:** Keep **170M only as an illustrative planning cap** until official transfer power cap, kingdom classification, special-invite eligibility and slot details are confirmed for the actual event. Review provisional wording and manual override before production use.
- [ ] **Protected scouting access — device verification remaining:** Backend/client role rules are aligned for Member (read) and R4/R5/Admin (edit); verify real-account behavior on a tester device. Demo/test data must never be confused with production records.
- [x] **Automatic GitHub backups:** Verified 04.10.2026: scheduled GitHub Action runs successfully and generates dated source backups (successful scheduled runs confirmed for 29.09, 03.10 and 04.10).
- [x] **Supabase/database rollback backup:** Private in-project rollback snapshot created and row-count verified on 04.10.2026 for 14 application-data tables; restore procedure documented in `docs/SUPABASE_BACKUP_RESTORE.md`. **Still open for final disaster recovery:** verify provider-level/PITR or separate off-project logical export.
- [ ] **Data refresh rhythm:** Evaluate an imported player snapshot approximately every **three days** (user says manual updates take a few minutes); possibly more often in KvK Prep.
- [ ] **KvK matchmaking model:** Accumulate snapshots, review warning thresholds using actual change history and full KvK cycles; do not claim it is the official game matchmaking formula.
- [ ] **KvK terminology:** In the Nexus App, use the exact section labels **Opponent Intelligence** and **Battle Readiness** for the two main KvK analysis layers. Opponent Intelligence = enemy strength/structure analysis; Battle Readiness = our own operational preparation for the fight.
- [ ] **Invitation threshold administration:** Allow an authorized admin to update the officially confirmed transfer-window cap and distinguish Ordinary/Leading Kingdom rules when known.
- [ ] **FaQuAI heraldic artwork:** Produce optional variants of the approved personalized FaQu/Eddy/robot crest: majestic, humorous, darker Kingshot aesthetic, more Eddy, wallpaper/banner/avatar, transparent background. Keep existing image as reference.
- [ ] **Onboarding and documentation:** After app tests, write simple member/tester instructions for mobile PWA and desktop usage, access, and demo-vs-live sections.
- [ ] **Keyboard dismissal:** Check the Hide Keyboard control across all editable mobile tabs.

- [x] **Alliance-chat report system · map/outposts:** Create Report → Copy workflow is implemented against the same 74-row verified canonical map dataset; Kingshot/Discord report output uses the currently displayed map data. Specification: `docs/ALLIANCE_CHAT_REPORT_STANDARD.md`. Extend the same pattern to other app areas only when explicitly approved.

## Implemented in code · still verify live/device behavior

- [x] Integrated NEXUS app shell with Outpost Map, Outpost Editor, KvK Prep, fictional Transfer Scouting Demo, protected Live Scouting.
- [x] Five approved KvK KPI tiles in one row, original styling for first four, white text on red Critical.
- [x] Provisional 170M invitation preview in both scouting sections (not official eligibility).
- [x] Compact candidate board CSS and an explicit 170M demo planning label.
- [x] Fullscreen PWA manifest with unique NEXUS app identity and Outpost Map launch target in source code.
- [x] Stable code snapshot branch `stable-nexus-v13-2026-09-28` and first code-backup branch `backup/nexus-initial-2026-09-28`.
- [x] Daily GitHub Action *configured*; actual scheduled execution remains unverified above.

## Protected project rules

1. **Only implement expressly requested changes.** Collect ideas without silently building them.
2. **Do not change approved UI** (logo, header, motto, map, KvK five KPI tiles, navigation) unless explicitly asked.
3. Preserve login, row-level permissions, data separation and existing records.
4. Read the current actual GitHub files before each change. Change the smallest relevant surface.
5. Back up before substantial work. Report whether code, deployment and device behavior have each been verified.
6. Write messages to An, Maxy and alliance members in **FaQu's own first-person voice**, not as an assistant.
7. Ask when intent is uncertain rather than guessing.
8. New entries in this list are proposals until FaQu authorizes implementation.

## Adding ideas

Append each new idea with its origin/context, priority if stated, and status; mark it done only after verified completion. Do not delete previous ideas without FaQu's direction.
