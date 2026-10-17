# PHALANX Header V1 — Browser Test Gate

Status: NOT PASSED; no production release.

Isolated prototype exists locally in PHALANX_PIXEL_FREEZE/header_v1_isolated_prototype.html with three image crops, but is not yet integrated into the application.

Attempted 2026-10-16: Playwright Chromium test at viewport sizes 360x740, 390x844, 430x932. Chromium navigation was blocked by the execution environment for both `file://` and localhost HTTP (`net::ERR_BLOCKED_BY_ADMINISTRATOR`). Consequently no browser screenshots or visual pixel comparison can be certified from this attempt.

## Required gates before approval
1. Host the isolated prototype and original assets on an accessible preview origin.
2. Capture browser screenshots of HOME/MODULE/DETAIL at 360x740, 390x844, 430x932.
3. Check image loading, responsive sizing, no unintended horizontal overflow, complete helmet and wordmark, menu open/close, back navigation and access to account/language/kingdom.
4. Compare rendered header against user-approved source using overlay and measured differences; user must visually approve.
5. Integrate in actual app only on isolated branch and repeat functional regression checks.
6. No production merge/deploy until explicit approval.

Approved art assets must be preserved, never recreated from text. This file is a test plan and failure record, not evidence of successful pixel parity.
