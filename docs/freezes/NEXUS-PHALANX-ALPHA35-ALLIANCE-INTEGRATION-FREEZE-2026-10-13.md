# NEXUS PHALANX — Alpha35 Alliance Integration Function Freeze

Date: 2026-10-13
Status: USER-VERIFIED Android Chrome, portrait
Frozen integration: preview/phalanx-alpha35-alliance-top40-stage-v3-20261013.html
Public test URL: https://nxskingshot-ops.github.io/kingdom-1885/preview/phalanx-alpha35-alliance-top40-stage-v3-20261013.html
Source baseline: NEXUS_PHALANX_ALPHA35_FUNCTION_FROZEN.html (Library: /NEXUS PHALANX/Design Freeze/Alpha35 Function Freeze/)
Integration commit: 1790e60620375a9fac369dd0b0799f1a263823bb

## Confirmed by user screenshots and response
- Alliance Comparison opens without the old Alpha31 placeholder alert.
- NXS, FRA, OoO and MYM alliance cards are visible.
- Private live data and NXS Top40 list load; 40 entries shown.
- Back navigation to Command Center works (explicit user confirmation).
- Outpost Intelligence remains accessible with 74/74 outposts and map/filter controls visible.
- Portrait layout is usable.

## Implementation boundary
The Alpha35 baseline was copied to a new preview HTML. An isolated capture-phase click bridge routes the existing Alliance Comparison navigation and Alliances home tile to the already tested Top40 v5 iframe. The original Alpha35 file, its Outpost feature, and production index.html were not modified.

## Freeze rules
- Preserve the V3 preview as the verified integration milestone.
- Preserve existing frozen artwork, layout, navigation and Outpost behavior.
- No deployment to production index.html is implied by this freeze.
- Any later integration changes require separate preview validation and user approval.
- Screenshot checks confirm tested flows only, not every module or every alliance Top40 list.
