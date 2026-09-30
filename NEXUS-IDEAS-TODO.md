# NEXUS · Ideas & To-do Board 👑

**Owner:** FaQu · **Project:** Kingdom #1885 / NEXUS · **Created:** 2026-09-28

This document is the shared, persistent backlog of ideas and follow-up work. **An idea is not authorization to change the app.** Discuss and obtain FaQu's approval before implementation. Preserve the approved design, data, permissions and working features. Distinguish *code implemented* from *verified on device*. Never alter the stable backup branch.

## Open / needs verification

- [ ] **PWA fullscreen and launch:** Confirm that the *new NEXUS NXS installation* opens the Outpost Map, not standalone KvK, and check Android status/navigation bars on FaQu's phone.
- [ ] **End-to-end internal test:** Test each app tab and transitions, login/logout, member versus R4/admin permissions, map/editor navigation, scouting demo vs protected live data, editing/save, phone and desktop.
- [ ] **Scouting board on phone:** Verify compact non-horizontal-scroll candidate table and that profile retains columns hidden at narrow widths. Adjust only after feedback.
- [ ] **Invitation categories:** Keep **170M only as an illustrative planning cap** until official transfer power cap, kingdom classification, special-invite eligibility and slot details are confirmed for the actual event. Review provisional wording and manual override before production use.
- [ ] **Protected scouting access:** Verify and finish intended access/permission rules for Transfer Scouting; demo/test data must never be confused with production records.
- [ ] **Automatic GitHub backups:** Check that the daily scheduled GitHub Action actually runs and generates dated backups; workflow creation alone is not run verification.
- [ ] **Supabase/database backups:** Design and verify a separate, access-controlled data backup and restore procedure; GitHub code snapshots do not back up the database.
- [ ] **Data refresh rhythm:** Evaluate an imported player snapshot approximately every **three days** (user says manual updates take a few minutes); possibly more often in KvK Prep.
- [ ] **KvK matchmaking model:** Accumulate snapshots, review warning thresholds using actual change history and full KvK cycles; do not claim it is the official game matchmaking formula.
- [ ] **Invitation threshold administration:** Allow an authorized admin to update the officially confirmed transfer-window cap and distinguish Ordinary/Leading Kingdom rules when known.
- [ ] **FaQuAI heraldic artwork:** Produce optional variants of the approved personalized FaQu/Eddy/robot crest: majestic, humorous, darker Kingshot aesthetic, more Eddy, wallpaper/banner/avatar, transparent background. Keep existing image as reference.
- [ ] **Onboarding and documentation:** After app tests, write simple member/tester instructions for mobile PWA and desktop usage, access, and demo-vs-live sections.
- [ ] **Keyboard dismissal:** Check the Hide Keyboard control across all editable mobile tabs.

- [ ] **Alliance-chat report system:** Prepare a reusable **Create Report → Copy All** pattern for useful Nexus App queries (map/outposts first, later rankings, comparisons, scouting and operational summaries). Reports must be concise, mobile-readable, directly pasteable into alliance chat, respect source-view permissions, and require no manual reformatting. First concrete use case: An's request for all outposts in the northern quadrant. Map reports depend on a reliable, verified current map data source / baseline; Linus' help is valuable for establishing that source of truth. Specification: `docs/ALLIANCE_CHAT_REPORT_STANDARD.md`.

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
