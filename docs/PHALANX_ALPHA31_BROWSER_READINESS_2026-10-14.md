# PHALANX Alpha31 Browser readiness review — 2026-10-14

Source review only; no Android or real browser execution in this GitHub connector session.

## Verified from main
- Alpha31 references `../src/phalanx-monte-carlo-v2.js` and `../src/phalanx-dependence-bounds-v1.js`.
- Both referenced paths exist and were fetched successfully.
- Bounds module current blob SHA: `241b4bc0a98b6bfd29d462172c87cab662e301cb`; its CommonJS/browser export expression is syntactically correct. The earlier syntax-error claim is withdrawn.
- Monte Carlo module blob SHA: `90e2d9cb4b99f8c3d0b513ffc6650734371e676d`.
- Alpha31 page blob SHA: `e450c35a710c1dca38de6b9a0d465f89f43e252d`.
- The page runs an initial calculation via `$('run').click()`; any script load failure should be caught by the button handler and shown as an error, not assumed to work.

## Still required
- Execute the exact files in a browser at their real relative paths, check console and output values, then Android portrait behavior.
- Cross-check seeded Monte Carlo values and analytic dependence bounds independently.
- Preserve frozen production UI; keep test fixes isolated.
