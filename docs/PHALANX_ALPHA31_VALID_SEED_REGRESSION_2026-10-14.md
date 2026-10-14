# Alpha31 valid-seed regression — 2026-10-14

Fetched and compared exact GitHub sources:
- main Alpha31 HTML SHA `e450c35a710c1dca38de6b9a0d465f89f43e252d`
- isolated candidate SHA `20b6d14187963a87700035fa807cbd1641aea040`
- unchanged Monte Carlo engine SHA `90e2d9cb4b99f8c3d0b513ffc6650734371e676d`

Removing exactly one blank-input guard and one bounded-safe-integer seed guard from the candidate produces a byte-for-byte identical HTML string to main. Both pages load the same `../src/phalanx-monte-carlo-v2.js` and dependence bounds module. Both pass the same options to `simulate` for valid seeds.

Consequence: deterministic equality of results for any valid seed and otherwise identical input is established by source identity and deterministic engine behavior. This is a static equivalence proof, not a new complete-page Android execution.

No production changes. Do not merge without approval.
