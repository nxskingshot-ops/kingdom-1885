# NEXUS PHALANX — Navigation V1 (working specification)
Date: 2026-10-15
Status: provisional, not a design freeze.

## Main menu and submenus
1. Command Center
   - Dashboard
   - Head-to-Head
   - Tactical Alerts
   - Briefing
2. KvK Operations
   - KvK Prep
   - Opponent Intelligence
   - Threat Intelligence / Players to Watch
   - Battle Readiness
   - Combat Intelligence
   - Operations
3. Kingdom Intelligence
   - Player Intelligence (True Power, player profiles, search)
   - Kingdom Intelligence (Kingdom Scout, history)
   - Alliance Intelligence (NXS/FRA/OoO/MYM comparison)
   - Rankings (16 boards, top 20/40/100)
   - History & Comparison
4. Territory Control
   - Outpost Map (frozen Alpha35)
   - Quadrants & Filters
   - Outpost Details
   - Outpost Transfer Planning
   - Reports & History
5. Transfer Command
   - Candidate Board
   - Player Scouting
   - Invitations
   - Transfer Planning
6. PHALANX Lab
   - Hero Intelligence
   - Smart March Optimizer
   - Troop Ratio Calculator
   - Combat Simulator
   - PHALANX Assistant
7. Reports & Data
   - Report Center
   - Export & Sharing
   - Data Updates
   - Account Data (local-first)
   - History & Backups
8. Settings & About
   - My PHALANX Account
   - Preferences
   - App & Updates
   - About NEXUS
   - Help & Contact

## Navigation principles
- Main drawer shows eight categories. Submenus expand in place; no additional hamburger.
- Each function has one canonical destination. Dashboard shortcuts link there.
- Ranking Top 40 is a filter/view, not a standalone top-level module.
- Labels remain English; translated display labels can follow the existing language setting.
- Preserve existing HOME, frozen artwork, original header, Alpha35 Outpost Map, productive app, database policies, and Edge functions.
- Integrate first through a separate isolated preview; verify browser rendering and navigation before asking for Android testing.
- Do not display placeholder functionality as live.
- PHALANX-branded user-facing data views; disclose upstream provenance where required by terms.

## Integration status
- Standalone native ranking preview: previously confirmed working on Android.
- HOME-to-ranking navigation: NOT validated; previous isolated preview is broken.
- This specification does not imply a working integrated navigation.
