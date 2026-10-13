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
