# OUT-024 Reports adapter verification contract (2026-10-19)
Branch: work/reports-out024-readonly-20261019
Target: preview/phalanx-reports-out024-local-adapter-20261019.html

Scope: local-only prototype, no automatic OUT-024 extraction. This test validates the HTML/JS contract and executes its inline script with simulated DOM events; it is not an Android acceptance test.

Run: python3 tests/alpha/test_reports_out024_local_adapter.py

Required:
- canonical OUT-024 reference only; no old V11 viewer, no network request
- valid input groups by alliance and quadrant
- duplicate/missing IDs and invalid quadrant fail closed
- invalid JSON and >1000 rows fail closed
- failed generation clears previous report and disables copying
- no production writes, no modification of frozen assets

The current report is a manual, unverified data import and must never be labeled live map data.
