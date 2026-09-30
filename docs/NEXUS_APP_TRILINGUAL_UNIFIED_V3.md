# Nexus App unified trilingual preview — V3
Date: 2026-09-30
Status: **TEST ONLY; production and approved previews untouched.**

## Test entry point
`preview/nexus-i18n-unified-v3.html`

An EN/DE/FR choice appears only in the existing ☰ menu. In the integrated test shell:
- Menu, main section labels and fixed outer-shell controls use the selected language.
- `preview/outpost-i18n-layout-v3.html?embedded=1` displays the public map and existing reports, with its duplicate test-language controls hidden when embedded.
- The parent sends same-origin `nexus-test-language` messages into the map preview, including after the frame loads, to keep the map/report labels aligned with the shell.
- `preview/nexus-user-guide-i18n-v1.html` reads the saved preview language and provides 13 complete help topics in all 3 languages, with cross-language search.

## Explicit non-goals for V3
- Do not translate exports or change Kingshot 480-character safety segmentation, Discord complete export, outpost coordinates, source verification status, alliance assignments, or underlying game terminology.
- Do not translate or open private dashboards outside their normal authorization.
- Do not add any additional button to the published map or approved header.
- Do not change any file other than newly named isolated test pages and this note.

## Checklist for phone acceptance
1. Open unified V3, ☰ → DE, open public Map → Report; choose alliance, check Kingshot Copy Part and Discord Copy Full. Repeat in FR.
2. Switch from Report back to Map; check that the language stays consistent with the shell. The integrated map has no second language selector.
3. ☰ → Help & User Guide; check chosen language, text search, search hits for `außenposten` / `avant-postes` / `outposts`, steps, scrolling, keyboard, Back.
4. Compare the approved design pixel-for-pixel at representative Android landscape and portrait widths. Check no clipped headers, buttons, dialog footers, unsafe overlapping, or undesirable viewport growth.
5. Confirm protected features still have the same access and data. Confirm marker search, refresh and map interactions still work.

## Technical verification
11/11 static code/integration checks passed for syntax, same-origin message contract, one visible language selector in the integrated view, complete guide content, unchanged map data formatter and preservation of previous preview sources. **Browser behavior, actual phone layout and language switch while a report is open still require on-device testing.**
