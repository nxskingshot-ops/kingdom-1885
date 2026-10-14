# Alpha31 remaining risk triage — 2026-10-14

Source: isolated seed-guard candidate SHA `20b6d14187963a87700035fa807cbd1641aea040`.

## Findings
1. **Confirmed and addressed in isolated candidate:** blank numeric fields formerly converted to zero; guard added.
2. **Confirmed and addressed in isolated candidate:** 32-bit RNG aliases; UI seed range restricted to safe integers 0..4294967295.
3. **Low-priority UX inconsistency, no math defect proven:** HTML chance `step=1` while click handler accepts 40.5%; HTML trials `step=100` while handler accepts 101. There is no `<form>` submit or `checkValidity()` call; the button handler directly parses values.
4. **Stress-only mobile overflow:** long unbroken numeric strings may overflow two-column tiles in isolated CSS reproduction. Normal result strings tested did not overflow; no production CSS change recommended without full-page verification.

## Recommendation
Keep candidate isolated. Prioritize exact complete-page Chromium execution, Android touch/portrait, and real Kingshot data calibration. Do not restrict mathematically valid fractional chance or trial counts without a product decision. No merge/deploy or frozen UI change.
