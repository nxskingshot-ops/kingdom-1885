# PHX-HOME-HEADER-FREEZE-20261021-01

Approved by user on 2026-10-21. This FREEZE governs the HOME header visual direction and profile behavior, **not** an assertion that the generated mockup is a functioning app asset.

## Approved visual
- Latest user-approved PHALANX HOME design **without phone status bar, battery, signal, clock, or screenshot controls**.
- Original epic Spartan helmet avatar in circular ornate gold frame at upper left; avatar opens War Room.
- Gold, prominent player name, responsive to very long names (test `CommanderFaQuTheGreat`), level subordinate.
- Kingdom and alliance combined in ornate gold shield with lion heads at upper right.
- Language selector in the HOME navigation strip, not over INFO or another item.
- Preserve approved PHALANX helmet, banners, HOME categories, Command Center tiles and layout. No extra overlay boxes.

## Personalization
- Player avatar is **never** fetched using Kingshot player ID. Default Spartan helmet or **manual image upload**, crop/zoom/position within unchanged gold frame, local-first persistence.
- Player ID may be used for name, level, kingdom and alliance **only if a real permitted data source is verified**. ID is not authentication.
- Profile values are dynamic UI elements, never baked into the final background asset.
- Language selection is personal; full localization must be implemented separately.

## Implementation gates
- Do not substitute earlier R9/R10/R11 header overlays or retired Epic Navigation V2.
- Separate static artwork from live avatar/name/level/kingdom/alliance/language controls, with no baked duplicate data.
- Test long names, no alliance, missing image, image upload and narrow Android viewport.
- No merge, deployment, main branch change, new cost or production permission implied by this design FREEZE.

## Asset provenance
- Approved visual reference is the image from the conversation on 2026-10-21 following the user's request to remove phone information. The image file has **not yet been committed as a canonical binary asset**. Before implementation, archive and checksum the exact approved original; do not regenerate it as a substitute.
