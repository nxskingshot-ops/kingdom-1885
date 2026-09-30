# Nexus App — trilingual UI and help, isolated test phase 2
Date: 2026-09-30
Languages: EN (default), DE, FR. **Preview only; not deployed to the accepted public Nexus App.**

## Preview files
- `preview/nexus-i18n-help-v2.html` — copy of accepted header/menu test, linking the new help guide.
- `preview/nexus-user-guide-i18n-v1.html` — 13 fully translated how-to topics, 39 localized articles; search matches all three languages, regardless of displayed language.
- `preview/outpost-i18n-layout-v2.html` — isolated V11 public map/report wrapper with three language buttons; adds translation of known fixed labels only.

## Immutable-by-default
- Existing `preview/nexus-i18n-layout-v1.html`, `preview/outpost-i18n-layout-v1.html`, `preview/outpost-report-v11.html` and the original `preview/nexus-user-guide-v1.html` are unchanged.
- The underlying map data, publication/verification status, outpost coordinates, building names and source timestamps are unchanged.
- The original chat formatter and Kingshot 480-character message splitting are unchanged. Discord still copies the entire source report. Report text stays in English until its translations can preserve chat length and source attribution safely.
- Protected pages and permissions are unchanged. A translated label must never override a button action or a source data field.

## Smartphone acceptance check (not yet tested on-device)
1. On the map preview choose EN, DE, FR. Verify toolbar, filter labels and search field in both orientations. Some fixed map labels may remain English until identified and approved.
2. Open the report dialogue in each language, select all outposts, choose Kingshot, switch to Discord, copy. Check long labels fit without moving controls.
3. In the translated hub menu choose Help & User Guide, switch EN/DE/FR, search for `außenposten`, `avant-postes`, `Discord`, and `Kingshot`. Verify full instructions, Back button, input keyboard and scrolling.
4. Verify refreshing, the map tool bar, protected navigation and access controls still work.
5. Approve production integration only after screenshots and functional checks on actual smartphones; never change a frozen layout to accommodate translated text.

## Automated checks carried out
All tested HTML inline scripts parse successfully; 13 guide topics exist in each language with matching step counts; sample English, German and French search terms find the intended topic; underlying approved files were not overwritten.

## Known test limitations
- Preview wrapper translates known fixed strings on the live page. It does not translate arbitrary dynamic data, player strings, exact-game terminology, private screens, or reports.
- Static syntax and data completeness checks are not substitutes for actual visual and end-to-end phone testing.
