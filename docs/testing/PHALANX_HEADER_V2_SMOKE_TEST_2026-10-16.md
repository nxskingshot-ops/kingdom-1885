# PHALANX Header V2 — isolated functional smoke test

**Scope:** `deploy/phalanx-kvk-test/header-v2-isolated.html`. No production deployment or FREEZE changes.

## Prerequisites
- GitHub asset integrity workflow passes on this branch.
- Browser loads the isolated preview over HTTP(S), not from a local file.
- Developer console and network tab show no missing JS/CSS/PNG.

## Manual acceptance checks
1. Open at 360×740, 390×844 and 430×932 CSS pixels.
2. HOME: gold eyes, original lion banners, approved crest; no burger or back control.
3. MODUL: red eyes, same approved flags/crest; back and menu are keyboard/touch operable; gold title.
4. DETAIL: blue eyes, same approved flags/crest; back and menu are keyboard/touch operable; gold title.
5. Check no duplicate header, no overlap with safe areas, no clipped text, no stretched art.
6. Confirm buttons trigger callbacks; no route change is inferred from the demo menu callback.
7. Compare actual screenshots with approved reference; check image crops for baked-in buttons and status bars. These cannot replace interactive controls.
8. Verify account switching, language, kingdom, permission and navigation behavior **in the actual app**, not just the standalone demo.

## Gate
The isolated HTML is a **component smoke test**, not an app integration. A successful asset workflow alone does not satisfy UI, navigation, accessibility or production release checks. Only user-approved visual parity and real app integration tests permit further promotion. Do not merge to main without explicit authorization.

## Automation coverage (2026-10-16)
- CI validates approved PNG hashes and dimensions.
- CI checks static component/demo wiring, including non-inert callbacks and loaded-image dimension guard.
- CI checks the workflow is scoped to the isolated branch and contains no deployment/merge commands.
- **Not automated:** screenshot comparison, touch behavior in an actual browser, accessibility audit, real app routing/permissions and deployment parity.
- An Actions checkmark is not a visual or release approval. Preserve all FREEZEs until explicit user approval.
