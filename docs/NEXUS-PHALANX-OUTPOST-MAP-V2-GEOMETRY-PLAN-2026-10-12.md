# NEXUS PHALANX Outpost Map 2.0 — geometry and pre-build specification
Status: **PLANNING — not implementation authorization / not design release**
Date: 2026-10-12

## User-approved principles
- Preserve the 2026-10-12 approved Home Alpha12 visual freeze unmodified.
- New simple 2D coordinate/diamond map, portrait-first, complete kingdom visible at startup.
- 74 outposts shown from canonical **verified** Outpost dataset, colored dots plus symbols for special/selected sites. Never relocate points merely to improve appearance.
- Exact in-game X/Y values remain unchanged; search on name, coordinates, level and alliance; combined filters Alliance, **Quadrant**, Type, Level.
- Tap opens compact dismissible bottom sheet with name, level, coordinates, owner, quadrant, copy action; map stays visible.
- One small royal castle marker in center. Center target: Kingshot (600,600).
- Four quadrants North, East, South, West; crosshair rotated with the diamond grid.
- Viewer vs selected-authorized editor permissions and change history retained; reports use same canonical data. Do not alter old app.
- Moose screenshot 02-Oct-2026 is orientation evidence, **not current ownership truth**.

## Direct cartographic evidence: Moose's corner labels
North/top (X=0,Y=0), East/right (1199,0), South/bottom (1199,1199), West/left (0,1199).
The diamond edges are coordinate-axis lines, not a flat axis-aligned grid.
This is more decisive for overall map orientation than localized moving game screenshots.

## Tested normalized transform
Define `u=(X-Y)/1199` (positive is screen right) and `v=(X+Y)/1199-1` (positive is screen down).
For center `Cx,Cy`, xScale `sx`, yScale `sy`:
`screenX=Cx+sx*(X-Y)/1199`;
`screenY=Cy+sy*((X+Y)/1199-1)`.
Choose scale to fit the whole diamond within its view box; preserve X/Y positions and proportional diamond geometry as needed.
Useful inverse: `X=1199*(u+v+1)/2`, `Y=1199*(v+1-u)/2`.

Verifiable cases:
- (0,0) -> (u=0,v=-1) top
- (1199,0) -> (1,0) right
- (1199,1199) -> (0,1) bottom
- (0,1199) -> (-1,0) left
- (600,600) -> (0, 1200/1199-1 ~= +0.000834) near center
- (593,591) -> u=2/1199, v=1184/1199-1

## Quadrants and diagonal crosshair
The central lines in the diamond should follow `X=600` and `Y=600` (mathematically diagonal in screen space). For non-boundary points:
- North: X<600 && Y<600
- East: X>600 && Y<600
- South: X>600 && Y>600
- West: X<600 && Y>600
At X=600 or Y=600, use documented tie-break behavior (boundary designation or consistent quadrant precedence); never silently invent owners or assign wrong region.
This categorization is **proposed pending existing-sheet quadrant and map validation**; colors of Moose's region labels do not determine the owner.

## Canonical source
Repository `integrations/README.md` identifies `public_outposts_verified_20261002` as canonical Supabase table at 74 verified records on 02-Oct-2026 baseline; collaborative Sheet 'Kingdom 1885 – Verified Outposts – Nexus App', tab 'Outposts #1885', fields Outpost, Level, X, Y, Bonus, Owner #1885, Status.
Legacy `public_outposts` is NOT canonical.
Verify present-day live table count, record validation, duplication, and owners before populating the new map. Avoid claiming October 2 status is current.
Preserve source timestamps and import validation, permissions and log.

## Checks before building
1. Query current canonical 74 records; check all coordinates finite in 0..1199, no duplicates, all types/levels, and owner labels.
2. Compare quadrant classification and four edge positions to Moose and 2–3 in-game samples.
3. Check home/preview routing and Android portrait rendering.
4. Require tap/zoom, search/filter, overlap handling, report copy, permissions and mutation history tests.
5. Get sign-off on finalized specification before implementing.

No existing Home, Outpost or production file modified by this document.
