# PHALANX Alpha Android integration gate — 2026-10-17

Branch: `alpha/android-integrated-freeze-20261017`. Based on `integration/epic-navigation-rc5-39-menu-20261015`. No production release.

## Confirmed references
- HOME frozen original: `backups/NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html`; SHA-256 equivalence to canonical Library original **not yet verified**.
- Approved Alpha12 HOME is a separate documented reference: `docs/NEXUS-PHALANX-HOME-APPROVED-ALPHA12-2026-10-12.md`. Do not silently substitute older HOME.
- RC5 navigation: source branch `integration/epic-navigation-rc5-39-menu-20261015`.
- Battle Readiness: draft PR #23; no merge until its checks pass.
- PYLON IX: `feature/pylon-ix-design-spec-20261017`; approved original assets only.
- Unified Header V2: gold eyes HOME, red module, blue detail; never recreate images.
- Command Center routing: existing audit reports missing click handlers; do not claim integrated.
- Password recovery: user-confirmed working. Show-password and confirmation field deferred.

## Alpha gates
1. Inventory every actual entrypoint and all local dependencies, distinguish frozen sources from test wrappers.
2. Verify approved HOME original bytes and assets before routing into it.
3. Implement a **separate** integration shell that links approved files without changing frozen HTML, including Android back navigation and safe offline/error states.
4. Connect War Room, Command Center and available modules only to verified existing entrypoints; do not substitute placeholders for working features.
5. Run link checks, Android portrait/landscape navigation, auth isolation and regression checks.
6. Preview only on explicitly isolated Cloudflare test deployment after source and security gates.
7. No main merge, production deploy, Supabase live writes, new paid resources, or security-gate bypass.

## Status
- Isolated branch: CREATED.
- Alpha shell: NOT YET IMPLEMENTED.
- Module integration: NOT YET TESTED.
- Cloudflare unified preview: NOT YET DEPLOYED.
- Production: UNCHANGED.
