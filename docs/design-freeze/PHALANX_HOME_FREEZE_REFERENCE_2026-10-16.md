# NEXUS PHALANX — HOME DESIGN FREEZE (VERBINDLICH)

Status: **FROZEN / USER-CONFIRMED**, 2026-10-16.
Scope: HOME screen visual implementation. No approval to alter other FREEZEs, merge, or deploy to production.

## Exact reference image

The user explicitly identified the most recently provided image in the conversation as the **mandatory** HOME visual reference, not a concept or optional direction.

- Source: user-provided image in ChatGPT conversation on 2026-10-16 (original attachment; not yet copied into this repository).
- Original local filename at verification: `44774.jpg`
- Image dimensions: **1024 × 1536 px** (portrait)
- SHA-256: `d23305e3631fe5065ae4e3665c1567883aad4dbaa47a6f2ce350a2260cfbfe9d`

**Do not treat this markdown file as a substitute for the reference image.** The actual reference must be made available in the repository before automated pixel-comparison tests can run; never replace it with a generated approximation. Verify the SHA-256 when copying the exact file.

## Frozen visible elements

- Profile block: circular armored avatar, **FaQu**, level, edit affordance.
- Language selector and **Kingdom #1885** at top.
- Monumental PHALANX gold helmet with red mohawk crest, red and blue lion banners, fantasy landscape and gold PHALANX wordmark.
- Gold-framed seven-icon HOME navigation: HOME, KRIEG, ALLIANZ, WERKZEUGE, GUIDES, STATISTIKEN, INFO. HOME active.
- **COMMAND CENTER**: four illustrated cards in 2 columns — KvK Vorbereitung, Aussenposten, Transfer Scouting, Allianz Vergleich.
- **WERKZEUGE & RECHNER**: three illustrated cards — Heldenrechner, Truppenratio, Marsch Optimierung.
- **INTELLIGENZ & BERICHTE**: three illustrated cards — Gegner Analyse, Königreich Scout, Datenberichte.
- Ornate gold frames, individual fantasy illustrations, typographic hierarchy, spacing and proportions as shown in the exact reference.

## Implementation constraints

1. Implement the visual appearance as close to the exact approved image as technically possible, accounting for responsive device dimensions; do not invent a new design or substitute generic navy cards.
2. Preserve separate approved header state FREEZEs: HOME gold, MODULE red eyes, DETAIL blue eyes.
3. Keep functioning modules and data labels intact; in particular do not remove **ARCHIVE / TEST DATA — NOT LIVE** indicators.
4. Existing production routes and previous FREEZEs remain unchanged without explicit user approval.
5. If conflicting FREEZEs are encountered, show the visual conflict and request the user's decision; do not silently choose.
6. The current isolated simple-card test app is **not** the approved HOME design and must not be declared pixel-perfect.

## Acceptance criteria

- Exact source image available and SHA-256 verified.
- Visual comparison at the 1024×1536 reference aspect ratio plus representative mobile widths.
- All seven nav controls and module links functional or explicitly flagged as not yet connected.
- User screenshot acceptance before declaring HOME implementation complete.
