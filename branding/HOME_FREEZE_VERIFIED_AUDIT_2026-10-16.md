# PHALANX HOME — Verified freeze extraction and comparison
Date: 2026-10-16 · Static source inspection only

## Integrity
- Source: Library `NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html`
- Verified size: **435650 bytes**
- Verified SHA-256: `f8e8a4c4a61cdaf89b9b6de8a8c8c906c0cace084e9b54ae6ac5ed4b90fa8031`
- Result: **EXACT MATCH** to `docs/NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md`
- The file is an integration wrapper which loads older KvK markup remotely at runtime. Static CSS extraction does not represent all rendered styles.

## Observed CSS color values
HOME file (source occurrences; not visual-area percentages):
- Background/deep navy: `#03111e` (2), `#061827` (3), `#061725` (1), `#0b2a40` (1)
- Gold/light gold: `#f4d178` (4), `#f6d36b` (3), `#f5d26e` (2), `#f0d78c` (1), `#a98a44` (2), `#cfa443` (2)
- Secondary cool text: `#9cb2c5` (4)
- Multiple other individual values exist; this is not a complete computed-style inventory.

Epic Navigation V2:
- Canvas `#020b15`, middle `#03111e`, gradient highlight `#173047`
- Panel `#041320`
- Gold title `#ffe0a0`; border `#bd9142`
- Metadata `#a9b6c3`

## Interpretation
- **Shared identity:** deep navy/black + warm gold + cool muted text.
- **Difference:** HOME gold palette differs from Epic Navigation's. Do not infer that one is wrong or override either frozen surface.
- **Design token strategy:** separate semantic roles (brand accent, bright display title, panel border, muted metadata) from surface-specific implementation. Candidate common values require comparison with real rendered screenshots.
- **No new FREEZE arbitration requested:** observed differences are within distinct frozen surfaces. Escalate only if one shared component must use conflicting approved definitions.

## Important limitations
- No browser rendering or Android screenshot comparison performed.
- Original cinematic logo font is not established by the CSS scan.
- Frozen HOME depends on a remotely fetched older KvK HTML; therefore raw source color counts are incomplete.
- This report does not change HOME, Epic Navigation, Player Intelligence, or production.

## Next safe work
1. Build non-invasive semantic mapping from HOME and Epic Navigation tokens.
2. Catalogue shared component responsibilities and surface exceptions.
3. Prepare actual side-by-side screenshot/live preview for any future design decision.
