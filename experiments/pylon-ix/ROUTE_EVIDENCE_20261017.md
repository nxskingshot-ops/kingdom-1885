# PYLON IX route evidence – 2026-10-17

Source reviewed: `deploy/phalanx-kvk-test/epic-navigation-v2-kvk-test.html` on this isolated branch.

## Confirmed static anchors
- KvK Prep: `./kvk-prep-v13-epic-v2-test.html` — connected test page; do not automatically route users there because backend/auth isolation has not been verified.
- KvK Offline UI: `./kvk-prep-v13-offline-ui-smoke.html` — explicitly marked NO LOGIN / NO LIVE DATA in the navigation.

## Not established by this review
- PYLON's semantic identifiers `hero-calculator`, `account-intelligence` and `alliance-comparison` have no verified matching literal href in the reviewed navigation file.
- No route adapter is committed; no production navigation has been changed.
- Do not infer that the absence of literal identifiers means these modules do not exist elsewhere.

## Freeze-safe implementation constraints
- Keep PYLON responses informational until the actual route contracts are inspected.
- Never link PYLON to the connected KvK test as a default; the offline smoke page is the safer candidate for a future explicit, reviewed action.
- Do not modify the frozen HOME, module headers, or Epic Navigation V2.
- Browser and RLS/auth tests remain unverified.
