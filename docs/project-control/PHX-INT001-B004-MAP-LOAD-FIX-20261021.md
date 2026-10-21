# PHX-INT001 B004 — embedded map load fix (2026-10-21)

Status: IMPLEMENTED LOCALLY, TECHNICALLY SMOKE-TESTED, NOT DEVICE-TESTED, NOT RELEASED.

Problem reproduced: B003 used a very large `data:text/html;base64,...` URL as iframe `src`. Chromium navigated the child frame to `chrome-error://chromewebdata/` instead of rendering the map. B003's shell navigation had previously passed, but that did not prove map load.

Isolated B004 fix: keep the same embedded original Alpha24 base64 payload, decode with `atob`, `Uint8Array`, `TextDecoder('utf-8')`, and set iframe `srcdoc` instead of a large data URL. Both map-open paths use the same logic; no change to original map bytes.

Local verification: Chromium Playwright `page.set_content` 390x844, click Map, child frame URL `about:srcdoc`, child document title `NEXUS PHALANX | Outpost Map Alpha 19` (historical title inside Alpha24 original), child body populated, zero top-level JS errors. Original map SHA256 `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d` matched decoded payload exactly. B004 SHA256 `fbe46c255704dada391754baf5f1f163bcdec3729665905ccaacb6084c003e94`.

Limitations: map UI functionality, public data request, Android and 21 Oct HOME visual are NOT verified. Reports remain intentionally disabled in this wrapper. The complete B004 HTML is a local artifact, not committed to GitHub. B003 is SUPERSEDED as active integration candidate; retain for provenance, do not delete frozen originals. No production changes.
