# NEXUS PHALANX — Alliance emblems & map colors

Status: **PARTIALLY VERIFIED** · documented 2026-10-13 · Kingdom #1885

## Confirmed map-color assignments

| Alliance | Approved marker color | Hex | Status |
|---|---|---|---|
| NXS | Green | `#4FA36A` | Confirmed Outpost Map palette |
| FRA | Coral red | `#E57876` | Confirmed Outpost Map palette |
| OoO | Pink | `#D94D93` | Confirmed Outpost Map palette |
| MYM | Violet | `#8871ED` | Confirmed Outpost Map palette |

Academies share parent color and are distinguished with hollow-ring markers in the frozen Outpost Map.

## Emblem asset validation

| Alliance | Original user-supplied emblem recovered as distinct image? | State |
|---|---|---|
| NXS | Yes — one original embedded WebP image is present in `preview/kingdom-hub-branded-v2.html` (data URI, `img` tag), although the image has not yet been independently extracted and visually cross-checked against the user's original upload | **EMBEDDED IMAGE LOCATED; VISUAL MATCH PENDING** |
| FRA | No | **NOT YET VERIFIED** |
| OoO | No | **NOT YET VERIFIED** |
| MYM | No | **NOT YET VERIFIED** |

Important: The ornate helmet, fleur-de-lis shield, pink ornament and purple bird in the generated Alliance Intelligence dashboard image are **visual design artwork, not proven official alliance emblems**. Do not substitute them for original source files or claim they are verified.

## Source references and guardrails

- Earlier documented NXS crest: `DESIGN_STANDARD.md` (embedded in previously approved shared header; not identical to generic PWA helmet icon).
- Approved Alliance Intelligence visual reference and global header are separately design-frozen; do not redesign while doing asset verification.
- Historical Kingshot/Outpost Map screenshots used to agree marker palette establish *colors*, not necessarily emblem source images.
- Keep approved Outpost Map marker colors unchanged.
- Before replacing any emblem, obtain a matching original source asset or direct verified screenshot crop, attach provenance, verify the correct alliance, and obtain user approval.
- Future verified originals should be stored as `assets/alliances/NXS.png`, `FRA.png`, `OoO.png`, `MYM.png` (or transparent SVG/WEBP if available), with corresponding source and acquisition date in this document.

## What is *not* complete

No actual emblem PNG/SVG/WEBP is added or verified here. This manifest prevents future confusion; it is not a finished graphics asset library.

## Source inspection (2026-10-13)

- Actual preserved embedded WebP found in the approved repository preview: [`preview/kingdom-hub-branded-v2.html`](../../preview/kingdom-hub-branded-v2.html) (blob SHA `ae55f639b8777cc822b558b38088ed6247d0d4c8`).
- Contains exactly one `<img src="data:image/webp;base64,...">` according to source inspection. This is the first tangible prior emblem asset source and should be inspected visually before asserting it is the original NXS upload.
- The design standard explicitly forbids replacing this crest with the generic `icon-192.png` helmet icon.
- No individually identifiable source images for FRA, OoO, MYM were found by repository code search for `crest`, `wappen`, `alliance_emblem`, or `alliance_logo`. This is not proof they were never uploaded elsewhere.

## Visual verification — 2026-10-13

The embedded WebP from `preview/kingdom-hub-branded-v2.html` was successfully rendered and visually inspected: a square **green-and-gold NXS/NEXUS crest, with a central white stylized motif**. This is distinct from the generated **golden knight helmet on green** shown in the current Alliance Intelligence dashboard. The earlier GitHub `DESIGN_STANDARD.md` specifically names that embedded image as the genuine NXS crest; accordingly, for the historical project design reference it is the canonical NXS asset, whereas the later helmet is not an interchangeable original.

Caution: this establishes the earlier approved header source, not an independent proof of the in-game emblem at every historical date. FRA, OoO and MYM original icons are still outstanding. Do not replace the frozen visual dashboard until the integration is reviewed and image-based interactive hit regions are accounted for.

## Definitive Kingshot reference located — 2026-10-13

The user-confirmed single Kingshot **Alliance Ranking** screenshot was recovered from their uploaded project image **`43514.png`**, originally uploaded **2026-10-13 05:39:10 UTC**. It shows all four authentic **in-game alliance banners together** (not the generated fantasy dashboard shields):

| Alliance | In-game banner | Visible symbol |
|---|---|---|
| NXS | Green | White stylized flourish/crest |
| OoO | Pink | White stylized flourish/crest |
| MYM | Violet | White castle tower |
| FRA | Coral red | White castle tower |

**Source identity:** File Library image `43514.png`, file ID `file_00000000e91481f4ac9ab7132942d89e`. Preserve the original image and crop each rectangular banner from it if implementing literal in-game symbols.

**Important distinction:** The legacy embedded gold-and-green *NXS/NEXUS identity crest* in `preview/kingdom-hub-branded-v2.html` is a separate older approved **branding image**. The green NXS banner in the Kingshot ranking screenshot is the **in-game alliance insignia**. They serve different purposes. The generated alliance tiles in the frozen graphic are illustrative fantasy icons, not exact Kingshot in-game banners. Source precedence for alliance-map coloration and literal in-game emblem reproduction: **`43514.png`**. Do not alter the overall dashboard composition unless approved.
