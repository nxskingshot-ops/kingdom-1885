# PHALANX Alpha — version and integration register
Date: 2026-10-20
Status: WORKING REGISTER / NOT A DESIGN FREEZE
Scope: isolated development only; no production deployment, merge, permissions or cost changes.

## Authority and precedence
- Existing approved design FREEZEs are immutable without explicit user approval.
- A later implementation identifier does not automatically supersede an earlier design FREEZE.
- The navigation specification docs/PHALANX_NAVIGATION_V1_2026-10-15.md is provisional.
- On conflicting approvals, stop and request a decision rather than silently choosing.
- This register records evidence, not approval.

## Known artifacts
| Component | Reference | Evidence | Integration status |
|---|---|---|---|
| HOME | docs/NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md | Approved visual FREEZE; source binary may reside in Library | Do not modify |
| Outpost Map visual | docs/NEXUS-PHALANX-OUTPOST-MAP-V2-DESIGN-FREEZE-2026-10-12.md | Approved visual design, not a functional QA sign-off | Preserve |
| Outpost Map Alpha23 | docs/freezes/NEXUS-PHALANX-OUTPOST-MAP-ALPHA23-FREEZE-2026-10-13.md | Earlier frozen artifact | Preserve |
| Outpost Map Alpha24 | OUTPOST_MAP_ALPHA24.html referenced by preview/nexus-phalanx-command-center-alpha27-offline-navigation-test-2026-10-13.html and alpha28 local-pair preview | Reference only; current canonical file and content hash NOT verified | BLOCKED pending source/hash comparison |
| Alpha35 | docs/freezes/NEXUS-PHALANX-ALPHA35-FUNCTION-FREEZE-2026-10-13.md | Frozen functionality | Preserve |
| Navigation V1 | docs/PHALANX_NAVIGATION_V1_2026-10-15.md | Provisional, references Alpha35 for map | Not a release contract |
| Android integrated alpha | alpha/android-integrated-freeze-20261017 | Existing branch; content/QA not yet audited | Not release-approved |
| Territory integration | work/alpha-territory-integration-20261019 | Isolated working branch | Not release-approved |

## Verification gates before wiring navigation
1. Resolve canonical source file, commit, hash and user approval for every destination.
2. Inspect HOME -> Territory Control -> Outpost Map / Reports routes in the isolated branch.
3. Confirm one destination per function, correct header tier, back navigation and no dead clicks.
4. Confirm published 74-outpost dataset, filter behavior and report provenance without claiming live sync.
5. Run static/synthetic tests, then browser/mobile tests. Record outcomes separately.
6. No main merge, production deployment, secret export or paid resource changes without approval.

## Status on 2026-10-20
REGISTER DOCUMENTATION ONLY. No source implementation changed; no test success claimed.
