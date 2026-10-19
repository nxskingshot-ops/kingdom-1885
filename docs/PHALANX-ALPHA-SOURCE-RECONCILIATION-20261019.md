# Integration reconciliation — 2026-10-19

## Latest source decision
- Current approved OUT-024 is **Alpha24**, canonical ID `PHX-OUT-024-MAP2-FROZEN-20261018`, not historical Alpha23. Original SHA-256 `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`, 1,105,961 bytes. Lock: `data/outpost-map-alpha24-canonical-lock-20261018.json` on `work/reports-out024-readonly-20261019`.
- Existing working RC5/OUT-024/Reports wrapper: `preview/PHALANX_RC5_OUT024_REPORTS_ISOLATED_NAV_20261019.html` on `work/reports-out024-readonly-20261019`. **Reuse; do not duplicate or overwrite.**
- Reports prototype: `preview/phalanx-reports-out024-local-adapter-20261019.html`; manual JSON input only, not live map synchronization.
- Explicit data-export gate: `docs/PHALANX-OUT024-REPORTS-EXPORT-GATE-20261019.md` blocks automatic map-to-report data transfer until a versioned read-only export contract exists. No scraping frozen HTML or guessing embedded data.
- Design audit: `docs/PHALANX-DESIGN-AUDIT-20261019.md`. HOME gold/large, module red/medium, function blue/compact; visual candidate B is provisional, not a replacement freeze.

## Work already done elsewhere (do not repeat)
- Isolated RC5 to map/reports navigation wrapper exists with route tests.
- Reports adapter tests exist and should be reused.
- Deploy manifest exists, marked PREPARED NOT DEPLOYED.

## Remaining before user-facing integrated alpha
1. Confirm current original Alpha24 byte checksum against Library and canonical lock.
2. Confirm wrapper and dependency closure on reports branch; run existing tests on the exact revision.
3. Resolve the HOME -> Territory Control link without modifying canonical HOME or RC5 originals.
4. Introduce a separately versioned read-only map export only with a validated schema; otherwise explicitly keep manual Reports mode.
5. Verify isolated deploy configuration/cost, then Android smoke test. No release claims.

This document is a cross-branch inventory and decision log, not a functional code merge.
