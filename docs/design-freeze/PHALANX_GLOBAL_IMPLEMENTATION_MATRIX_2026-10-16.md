# PHALANX — Global FREEZE implementation matrix

**Status:** working audit / not visual acceptance. **Scope:** isolated preview branch only. **Approved reference:** `PHALANX_HOME_FREEZE_REFERENCE_2026-10-16.md`, global style authority: `PHALANX_GLOBAL_DESIGN_FREEZE_2026-10-16.md`.

## Mandatory screens and components

| Surface | FREEZE requirement | Current isolated status | Acceptance gate |
|---|---|---|---|
| HOME hero | Original cinematic helmet, outward lion flags, gold PHALANX, account/kingdom controls | Header image exists; account/kingdom overlay not integrated | Screenshot vs original on mobile |
| HOME navigation | Seven gold icon destinations: HOME / KRIEG / ALLIANZ / WERKZEUGE / GUIDES / STATISTIKEN / INFO | Interactive navigation exists | Icons, spacing, borders, responsive test |
| Command Center | Four **illustrated** cards: KvK Vorbereitung, Außenposten, Transfer Scouting, Allianz Vergleich | Titles and section ordering scaffolded; some routes unavailable | Exact artwork, usable live routes, accessible labels |
| Werkzeuge & Rechner | Three **illustrated** cards: Heldenrechner, Truppenratio, Marsch Optimierung | Titles scaffolded; missing verified routes | Art and correct existing calculator behavior |
| Intelligenz & Berichte | Three **illustrated** cards: Gegner Analyse, Königreich Scout, Datenberichte | Titles scaffolded; missing verified routes | Art, real module integration, data-state checks |
| Module header | Red glowing eyes, existing ornate fantasy brand, working back and menu | Header artwork and callbacks integrated | Visual mobile comparison, menu test |
| Detail header | Blue glowing eyes, same branding, working back and menu | Header artwork and callbacks integrated | Visual mobile comparison, back test |
| Battle Readiness | Epic illustrated style **inside** module; avoid duplicated header; preserve existing data/logic | Existing isolated module embedded | Full module audit; live/archive labeling preserved |
| Other modules | Same gold ornate borders, art, iconography, typography, spacing, interaction | Not globally audited or migrated | Screen-by-screen visual and functional checks |

## Engineering guardrails

- HOME, MODULE and DETAIL have different approved glowing-eye states; do not collapse them into a single generic artwork.
- The HOME reference establishes a **global visual language**, not permission to paint static non-functional images over buttons.
- A title-only gradient card is a temporary implementation scaffold, **not FREEZE compliance**.
- Missing route: disabled card with explicit status is preferable to a fabricated URL.
- No modifications to production, previously approved FREEZEs, permissions or application data.
- No final release until original source image is stored in repository and pixel-level / responsive visual tests pass, followed by explicit user approval.

## Next engineering order

1. Make approved reference binary accessible in the isolated repo with hash verification.
2. Create reusable ornate illustrated card component with proper click and keyboard handling; use genuine approved assets rather than inventing substitutes.
3. Build account and kingdom controls using real app state, not hard-coded demo values.
4. Integrate existing module routes incrementally; preserve functionality.
5. Capture 360 / 390 / 430px screenshots, compare to FREEZE and review all interactive states.
