# PHX-OUT-024 — GitHub Source Test Gate, 2026-10-21

**Status: TECHNICALLY TESTED (isolated), not device-tested, approved or deployed.**

Verified Git blob SHA-1 parity against the work branch for canonical `index.html`, `map-core.js`, `map-layout.js`, `map.css`, `core/provider.js`, `tests/source-integrity.test.mjs`, `package.json`. Original JPGs are present in the isolated source package. Reconstructed the three changed GitHub files with verified Git blob hashes:

- `core/data-contract.js`: `bd60f755b9e4fcfc52915b5727af5813851079d5`
- `tests/data-contract.test.mjs`: `124fb4ec93617c0bce86258a9ea1c4166bdb6664`
- `tests/integration.test.mjs`: `b52e6c8a1a3e228cf494ec63c40d7cba816387c4`

Ran `npm test` in separate local verification directory with these GitHub-equivalent sources, without modifying the immutable B004 ZIP.

Result: **3 tests, 3 pass, 0 fail**:
1. Data contract (including invalid field types).
2. Module references, all DOM element references, and authorized provider hook.
3. Seven canonical source and asset SHA-256 checksums.

**Boundaries:** No real provider, permission audit, Android device test, Alpha24 full functional parity, or HOME → Territory Control → Reports navigation test. No deployment, main merge, or production change. These must be handled separately before approval.

This report supersedes the outstanding map-core discrepancy in the earlier reconciliation note: `map-core.js` now has canonical Git blob `bbf81402d018735dd38fd3cbcc00139450faac4f`.
