# A039-R8 source compatibility finding — 2026-10-22

Status: source-inspected, not browser-tested.

Library original: PHX_A039_R8_WAR_ROOM_ANDROID_20261021.html.

The integrated R8 HTML contains a legacy embedded map document titled 'NEXUS PHALANX | Outpost Map Alpha 19'. This is a source-level legacy marker; it does not prove which map implementation is active at runtime. Therefore do not label R8's embedded map as Atlas CORE V2 or replace the frozen OUT-024 source on this evidence alone.

The R8 navigation defines navigate(view) and exposes window.phxNavigate=navigate. War Room openTarget uses location.hash for targets including home, pylon, map and report. Reuse the existing navigation contract; avoid a second router.

Next isolated implementation gate: locate the exact active map iframe/source and confirm its version; then define a permission-checked PYLON read-only adapter for navigation and outpost context. No privileged or unrestricted data bridge. Preserve R8 original. No production changes.
