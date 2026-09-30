# Nexus App — Help Center & User Guide
Status: **V1 test preview** · 2026-09-30 · UI English only

## User promise
A player who knows *what they want to achieve* can discover *how to do it* without asking FaQu, an officer, or a tester. Search by goal, not only by feature name. A complete guide must be short enough for a phone and grounded in the application's actual behavior.

## Existing structure examined
The existing shell already contains one shared ☰ utility menu, About NEXUS, Contact & Feedback, protected feature tabs, public Outpost Map and a separate report dialog. **Do not introduce another header, another global search bar, or overlapping help menus.**

## V1 delivered (isolated preview; original shell untouched)
- `preview/nexus-user-guide-v1.html`: English-only, responsive, local full-text matching across title, feature, keywords, descriptions, steps and caveats.
- `preview/nexus-help-menu-v1.html`: copy of the current test shell with exactly one `? Help & User Guide` menu entry linking to the isolated guide.
- Guide sections: first steps; public map and refresh; alliance and quadrant reports; Kingshot/Discord share formats; verification and timestamps; editing privileges; KvK Prep; True Power Intelligence; demo/live Transfer Scouting; feedback; smartphone usage.
- Search contains no network calls, account lookups or hidden data. Every help entry is explicit and written for beginners.
- Initial integration has **no modifications to the original** `preview/kingdom-hub-menu-test.html` and does not alter established layouts, data, access controls, map or export features.

## Planned V2 — validate before integration
1. **User test:** Five new users: find an outpost, generate FRA report, copy Kingshot part, copy complete Discord report, report incorrect data. Measure whether each succeeds without external help, where they get stuck, and which wording they search for.
2. **Content audit:** Verify screenshots, exact labels and live behavior with published Nexus App builds. Record versions for protected UI; don't teach buttons without checking their actual availability.
3. **Context-aware help:** A help launch from Map, Report, Scouting or KvK can open the corresponding guide by URL topic id. Only add after confirming it won't crowd or break the approved screens.
4. **Deep linking:** Where authorized, optionally open the relevant section from a guide. Never bypass login or permissions. No automatic Kingshot interaction.
5. **Keyboard and rotation:** Test on Android landscape/portrait, 320px width, safe areas, keyboard open, fullscreen and PWA mode. Focus remains visible and controls are at least comfortable touch targets.
6. **Maintenance:** Each feature change includes a guide update, proofread by a tester before claiming that instructions work.

## Security and truthfulness
Public help metadata must not disclose private player records, privileged URLs, account data, or editing workflows that require access. Never treat `published` as `verified`. Quadrants are currently provisional alliance-based labels, not officially verified coordinate sectors. The report generator's Kingshot safety ceiling is 480 characters and detailed Discord export may become a text attachment. The in-game message limits are not considered formally established.

## Acceptance criteria for future production deployment
- A new player completes the top five journeys with no private coaching.
- Search finds articles for common intent wording, misspellings and synonyms.
- Protected destinations remain protected, including deep links.
- Search has a useful no-results state directing players to feedback.
- Back/close and keyboard use work in both orientations and fullscreen.
- Existing Nexus App screenshots, page layout, permissions and workflows are unchanged except for the explicitly approved single menu entry.
