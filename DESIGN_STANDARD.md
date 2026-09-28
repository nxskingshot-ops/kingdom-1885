# Kingdom #1885 — binding shared header standard

**Approved by Matthias on 2026-09-28.** This is the UI baseline for **all existing and future tabs** of the unified Kingdom #1885 PWA.

## Canonical implementation

- Approved preview/app shell: `preview/kingdom-hub-branded-v2.html`
- **Do not redesign or replace its shared header.** New tabs belong inside this common shell, using the same top-level header and navigation.
- Source of the genuine green-and-gold Nexus crest: embedded image in the approved shared header. **Do not substitute `icon-192.png` / the knight-helmet app icon.**
- Main brand: **Nexus · NXS**.
- Secondary identifier: **KINGDOM #1885 · ALLIANCE OPERATIONS**.
- Exact motto: **Nexus — every path matters, every strength counts, from all of us, one force.**
- Motto: semi-bold, lightly italic Georgia in its gold-bordered box. **Do not add an “ALLIANCE MOTTO” label.**
- Palette: dark brown header, parchment/beige-and-gold body, gold navigation details; preserve spacing, crest scale, typography, background, and overall layout approved in the screenshot.
- The right-hand **CURRENT SECTION** field alone changes with tab selection. The header itself remains fixed and identical on every tab.
- Tabs including Outpost Map, KvK Prep, Growth Radar, Identity Reviews, R4/R5 operations, and future sections must share this shell. Do not insert another visible competing header inside a tab.
- Preserve existing Supabase role protections and the working public outpost view; appearance changes must not expose internal data.
- Preserve the working previous URLs and avoid changing approved visuals without explicit user instruction.

## Acceptance check for a new tab

1. Same NXS green/gold crest, brand name, exact motto, font and colors as `preview/kingdom-hub-branded-v2.html`.
2. Same fixed header size and navigation position; only CURRENT SECTION label changes.
3. No second interior header and no page-level horizontal scrolling; only wide data tables may scroll within themselves.
4. Public map remains public; internal KvK and operations data remain behind member authorization.
5. Inspect on Android/mobile and desktop before promoting; keep prior working version available.

**Note:** This file documents the standard. The currently approved branded v2 app shell is the visual source of truth, not the app icon or an older KvK prototype.
