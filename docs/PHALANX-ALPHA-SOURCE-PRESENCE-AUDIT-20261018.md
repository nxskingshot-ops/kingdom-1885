# PHALANX Alpha source-file presence audit — 2026-10-18

Scope: existence on isolated branch only; **not** functional, design, navigation or Android acceptance.

All eight routes cited by `docs/PHALANX-INVENTORY-EVIDENCE-20261018.md` were fetched from the current alpha branch. GitHub returned a blob ID for each:

| Module/reference | File | Blob SHA |
|---|---|---|
| RC5 navigation | `preview/PHALANX_RC5_ALPHA_DERIVED_20261017.html` | `491a89a2a1ea5aa13ec6150d8f78fa8e93b6fb14` |
| Command Center historical | `preview/nexus-phalanx-command-center-alpha28-local-pair-test-2026-10-13.html` | `3ba8c9eca424081682aae0947a8dc5c35ccb0144` |
| KvK historical | `preview/kvk-prep-five-contrast-v13.html` | `20752b2d831efb8969e39f9cd75d4aa8d1f6f038` |
| Battle Readiness historical | `preview/nexus-phalanx-battle-readiness-verified-status-test-2026-10-12.html` | `65e02940731ad8fe6b3fa132d5bc0784ca474d15` |
| Ranking historical | `preview/phalanx-ranking-integration-rc-20261015.html` | `76c0f457c212bbd7c86d23b0265228108cd2d932` |
| Reports historical | `preview/outpost-report-v11.html` | `0f6eb192adfab5ea07397c06af4ba531c789fa89` |
| Transfer demo | `preview/transfer-scouting-demo-v5.html` | `7672f967c4f2cf4638ac33be1614d806b0a07207` |
| Hero historical | `preview/hero-intelligence-evidence-advisor-v15-2026-10-12.html` | `f4ae1f429a5d582a64d399e4f64b7674c2ebf2f6` |

OUT-024 independently verified by SHA-256 in `docs/PHALANX-OUT024-INDEPENDENT-GIT-BLOB-VERIFICATION-20261018.md`, and is not interchangeable with historical OUT-023. All 74 feature records remain **UNVERIFIED_CURRENT_ALPHA** until route-by-route and functional tests. No FREEZE or production change.
