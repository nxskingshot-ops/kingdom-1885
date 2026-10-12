# NEXUS PHALANX — Outpost Map Alpha 1 design audit
Status: comparison only; no changes to approved Home, deployed pages, or database.

## Definitive reference
User-approved Home Alpha12 (Library): `/NEXUS PHALANX/Design Freeze/NEXUS_PHALANX_HOME_APPROVED_ALPHA12_2026-10-12.html`.
Independent SHA256 of raw file: `489aa01b8124d603fa73d2472cf3ac46be8488566c2761e75a1ca50349e8b798` (matches documented freeze).
Canonical Home has the Phalanx art header and own CSS/navigation structure; the upstream old KvK HTML is **not** the canonical Home.

## User Android screenshot inspection (Alpha 1)
- Successfully fetched 74 verified records; diamond orientation, axes, pins, legend, search and four selectors visible in portrait.
- Functional test not yet complete (especially filtering, zoom, tap/close/return, permissions).
- **Design is not approved**. Text-only castle glyph/header, improvised styling and unfamiliar controls violate Home Alpha12 visual unity.
- Controls/legend consume space above the map; academy legend small and crowded.
- Tapped detail appears below map instead of always visibly within the phone view.
- `verified-009` source keys should not be the title of a public-facing outpost item; show building type/level/owner/coords.
- Retain the correct dataset and geometry; change presentation rather than rewriting data logic.

## Plan / non-negotiable guardrails
1. Build **an isolated derived test page** only, using actual CSS/design elements extracted directly from approved Alpha12; do not simulate the home header from recollection.
2. Preserve the exact approved Home, existing navigation, identity, DE/EN/FR, existing tiles and status sections.
3. Use same visual component tokens, button language, gold/navy frame and spacing. Responsive Android portrait first.
4. Limit legend to four color families plus academy glyph and Others, with a user-friendly expandable legend where practical.
5. Keep search visible, four combinable filters, legend, map and first results in a compact vertically balanced hierarchy.
6. Bottom-sheet detail should be visible on tap without losing map context; all controls finger-friendly.
7. No ownership conflation between main alliance and academy; families for color only.
8. Source is `public_outposts_verified_20261002` with 74 published+verified records. No legacy `public_outposts` source.
9. Do not deploy/rewrite existing app; get explicit user review of isolated next alpha before any freeze/deploy.
