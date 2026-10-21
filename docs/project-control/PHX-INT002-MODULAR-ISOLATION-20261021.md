# PHX-INT002 — Modular isolated Territory Control (2026-10-21)

Status: IMPLEMENTED LOCALLY; STATICALLY VERIFIED; browser/device test outstanding. Not approved HOME, not released.

Modular package created with separate `index.html`, `core/shell.css`, `core/router.js`, `modules/outpost/map-alpha24.html`, and README. The map remains an unchanged standalone HTML source with SHA256 `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`. No giant base64 iframe payload is needed; router loads the separate map HTML when selected. Shell is explicitly a Territory Control test harness, not a replacement for the approved HOME design.

Static checks passed: exact original map hash, map path referenced in router, Reports disabled. Runtime navigation, API access, Android, and pixel-level design have not been verified for this new package. HOME bridge remains Library-only and unavailable as an authorized full raw source; no Reports functionality has been recreated or asserted.

Package: `PHX-INT002-MODULAR-PACKAGE.zip` as a conversation artifact. Not yet stored in GitHub. No production changes, merge, deployment, or extra costs.

Next: verify modular navigation with a browser; secure the canonical HOME asset and authorized Reports source; then integrate without losing approved FREEZEs.
