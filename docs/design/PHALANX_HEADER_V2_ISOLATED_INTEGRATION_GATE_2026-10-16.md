# PHALANX UNIFIED HEADER V2 — isolated integration gate

Status: **NOT READY TO MERGE**. Design FREEZE remains immutable. No production modifications authorized.

## Verified inputs
- Approved original reference PNG: 1536 × 1024, SHA-256 `16d1091c0c862e8bc1a6b8b7361ec202b96055911d90e4b48c5afad99d8371f3`.
- Three local crops named `header-home.png`, `header-module.png`, `header-detail.png`; each 506 × 217 pixels. **Implementation candidates, not approved final standalone assets**.
- Isolated component: `src/phalanx-unified-header-v2-isolated.js` and corresponding CSS.
- Test harness: `deploy/phalanx-kvk-test/header-v2-isolated.html`.

## Missing binary dependencies
- `assets/header-v2/header-home.png`
- `assets/header-v2/header-module.png`
- `assets/header-v2/header-detail.png`
- `assets/header-v2/PHALANX_HEADER_V2_APPROVED_REFERENCE.png`

Do not replace missing files with generated approximations. Until committed, the GitHub-hosted test harness is expected to show missing-artwork errors. Keep the original PNG and its SHA-256 intact. The three crops require visual inspection: mockup artwork may contain baked-in controls, which cannot substitute for working DOM controls.

## Mandatory release gates
1. Commit binary assets to this **isolated branch** and recheck SHA-256 of original.
2. Load all three modes with no 404s and ensure only one functional header/menu exists.
3. Check responsive viewports 360×740, 390×844, 430×932 in an actual browser.
4. Verify all navigation, back, menu, account, language, kingdom and permission flows against current app; no data changes.
5. Compare screenshots against approved FREEZE; record discrepancies and obtain user signoff.
6. Merge/deploy to production **only after explicit user authorization**.
