# PHX-OUT-024 — B004 Source Reconciliation (2026-10-21)

Status: **PARTIAL / NOT RELEASED**. GitHub source was compared against the immutable B004 test-gate ZIP using Git blob SHA-1 (blob header + bytes).

| File | B004 Git blob | GitHub work branch | Finding |
|---|---|---|---|
| index.html | ad27c49b20b02de245d3173aa0481f95fc43ac32 | same | BYTE IDENTICAL |
| map-layout.js | 10fc5db8c1cef3ee871e31b42061aa292024e4d3 | same | BYTE IDENTICAL |
| map.css | a397f35ec5446921793b42b120069fe09ad58994 | same | BYTE IDENTICAL |
| core/provider.js | fd3dd4a9fc37d907d5f5d756454c57a642a19742 | same | BYTE IDENTICAL |
| map-core.js | bbf81402d018735dd38fd3cbcc00139450faac4f | 0d5a0fdd9be8f2f3424ce15b728464ac7cce84e1 | **DIFFERENT**; must reconcile and retest |
| core/data-contract.js | 2a7f4e1a0bd1101f6175d190f2afc2535de4f45e | bd60f755b9e4fcfc52915b5727af5813851079d5 | **INTENTIONALLY MODIFIED** to reject invalid field types; test this change |

The original three JPG assets were independently preserved and verified in commit 8586548. Original frozen Alpha24 is unchanged.

**Test interpretation:** The existing B004 `tests/source-integrity.test.mjs` pins B004 SHA-256 checksums. It will fail on the modified `map-core.js`; do not silently change the baseline hashes. Review the functional delta, retain validated improvements, then create a separate reviewed revision manifest and run tests against the actual repository checkout. Local B004 test passes do **not** constitute GitHub test passes.

No main merge, production deployment, live provider connection, or release approval is implied.
