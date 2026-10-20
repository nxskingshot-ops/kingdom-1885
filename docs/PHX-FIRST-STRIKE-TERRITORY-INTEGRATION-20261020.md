# FIRST STRIKE · Territory Control integration (2026-10-20)

**Status:** CODE_PRESENT; not browser/device verified; not deployed.

## Entry
`preview/PHX-FIRST-STRIKE-TERRITORY-ALPHA-20261020.html` loads the **existing** isolated `PHALANX_RC5_OUT024_REPORTS_ISOLATED_NAV_20261019.html`, which already routes to:
- `PHALANX_RC5_ALPHA_DERIVED_20261017.html` (RC5)
- `PHX-OUT-024-MAP2-FROZEN-20261018.html` (frozen OUT-024)
- `phalanx-reports-out024-local-adapter-20261019.html` (manual JSON only)

All are sibling files in `preview/`. No new API, no map→report automatic transfer, no permissions or production changes. No replacement header artwork. The final October 16 HOME/header asset remains unverified, so this entry is explicitly **Territory-only** and does not claim HOME is connected.

## Minimal release gate
1. Confirm entry and all four referenced files are present at the same relative location.
2. Open entry on Android and tap RC5 → Outpost Map → Back → Reports → Back, once.
3. Do not deploy or merge without separate authorization.

**Never** substitute Alpha23, Alpha35 or historical HOME as the current frozen source.
