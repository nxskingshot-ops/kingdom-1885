# Outpost Atlas CORE V2 — B003 browser smoke (local only)

Test object: local B004 package, not the current GitHub work branch.
Environment: local Chromium browser, synthetic test data provided through the explicit `window.PHALANX_OUTPOST_DATA_PROVIDER` hook. No live Kingshot, Supabase or production data.

## Observed pass
- HTML/JS load without runtime JavaScript errors
- Test dataset appears and count updates
- Zoom controls and fullscreen operate
- Escape closes fullscreen
- Search and filter reset work

## Limits
- This is **not** a GitHub branch browser test.
- Not a device test or Alpha24 parity/regression certification.
- No permission-backed production provider was connected.
- GitHub `map-core.js` differs from the B004 local tested source. Do not transfer this PASS to that file without running it.

Source integrity baseline remains in `tests/source-integrity.test.mjs`. The baseline should not be overwritten to hide differences.
