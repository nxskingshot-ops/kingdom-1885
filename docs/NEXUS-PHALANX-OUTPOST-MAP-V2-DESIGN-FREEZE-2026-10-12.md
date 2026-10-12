# NEXUS PHALANX — OUTPOST MAP 2.0 — APPROVED DESIGN FREEZE
**User approval:** 2026-10-12 ("Herzlichen Glückwunsch, wir haben ein freeeeeeeeze").
**Status:** DESIGN APPROVED / FREEZE. Not a production deploy or functional QA sign-off.

## Canonical approved visual
The **latest user-approved image mockup** in conversation, generated after the request "Zeig mir deine Empfehlung": filter chips with gold outlines and glow, full-width search, compact reset/filter, original NEXUS PHALANX royal header, dark navy fantasy map background, diamond coordinates and gold border, four color families and ringed academy symbols, status/legend, map zoom/fit/fullscreen tools, and lower outpost detail preview. Visual reference is the image the user explicitly approved immediately before this freeze. Preserve reference; do not substitute earlier alpha screenshots or invent alternate design directions.

### Reference image
Conversation-generated image: `/mnt/data/nexus_phalanx_aussenpostenkarte.png` (transient artifact path; may not be accessible in future sessions). Preserve it in persistent storage before implementation or rely on the conversation image; path alone is not permanent.

## Fixed design features
- Original approved Alpha12 Phalanx Home header/banner and frozen overall design language; do not alter the actual Home.
- Navy/gold fantasy with controlled atmospheric glow, not heavy particle clutter over markers.
- Prominent but concise search input.
- Four **compact chip/dropdown** controls: Allianz, **Quadrant**, Gebäudetyp, Level. Selected filter gets modest glow; reset accessible.
- Same 74 real published/verified Outposts; no fabricated data, no changing X/Y or ownership.
- Same working diamond coordinate transform, diagonal coordinate grid and quadrants, tiny central castle glyph/icon.
- 4 alliance families with color coding; main = filled dot, academy = ring with center. Academy identities remain distinct. Others neutral but not conflated.
- Map fills available mobile viewport as generously as possible; zoom, fit and fullscreen.
- Small bottom information card/sheet, never crowd or obscure the whole map.
- Preserve specific approved proportions/styles rather than recreating a new UI.
- Labels in mockup may be illustrative; preserve DE/EN/FR language support, true app data and source naming when implementing.

## Implementation guardrails
The current functioning tested version was Alpha4. The approved image is **a static concept** for its future visual refinement; it is not the finished HTML/app. **Freeze applies to the visual design**, while functional bugs, accessibility/portrait issues and real data integrations still need verification. Only an isolated next test version may be built, not edits to the approved Home or production. Explicit user permission before any changes to frozen design.
