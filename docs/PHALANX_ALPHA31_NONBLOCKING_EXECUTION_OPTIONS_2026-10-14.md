# Alpha31 nonblocking execution decision note — 2026-10-14

Read-only source verification of the isolated candidate SHA `20b6d14187963a87700035fa807cbd1641aea040`.

## Confirmed
- The click handler calls `PhalanxMonteCarlo.simulate` twice synchronously, first independent, then shared.
- No `Worker` instantiation, run-button disabling, or progress indicator is present.
- UI permits up to 100,000 trials and 1,000 rounds; engine permits up to eight UI-selected skills.
- Heavy settings may stall the browser main thread. Exact Android time and whether users encounter this are not yet measured.

## Options
A. Keep current synchronous implementation; restrict UI limits or provide a warning (simple but sacrifices existing flexibility).
B. Isolated Web Worker wrapper that imports unchanged engine source via `importScripts`, runs both models off main thread, posts results/errors. Preserve all formulas and seeds. Add request identifier, disable/enable run control, and worker error handling. Validate hosting paths, CSP, browser compatibility, and performance before considering integration.
C. Chunked main-thread calculation requires refactoring the engine and is higher-risk for reproducibility.

**Recommendation:** Explore B in an isolated test only; do not merge/deploy. A Worker will preserve UI responsiveness but does not itself reduce CPU time or prove game accuracy. No production changes.
