# RC5 isolated Chromium smoke test — 2026-10-15

Input: local NEXUS_PHALANX_RC5_STATUS_CONSISTENCY_20261015.html. Browser: headless Chromium via Playwright. Rendered via page.set_content because file:// navigation was blocked by administrator. All external network requests blocked.

Tests at 390x844 and 1440x900:
- 39/39 anchor elements present at each viewport.
- 15 linked anchors; none prevented by existing click listeners.
- 24 '#' placeholder anchors; all prevented by existing click listeners.
- 0 pageerror events during smoke test.
- document.documentElement.scrollWidth > innerWidth: false at both widths.

Implementation note: synthetic cancelable MouseEvent dispatched for each anchor. A temporary document bubble listener observed whether app handlers had already called preventDefault, then prevented the default browser navigation to keep tests offline. This checks click interception, not actual destination loading or real pointer hit targets.

Scope limits: no live GitHub Pages navigation, module execution, authentication, network/API access, data writes, accessibility audit, or full visual pixel diff. No production or freeze changes.

Machine-readable local result: NEXUS_PHALANX_RC5_BROWSER_SMOKE_20261015.json.
Next: isolated local mirror of the 12 target HTML pages and controlled module runtime tests.
