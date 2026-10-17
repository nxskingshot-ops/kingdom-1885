# PHALANX Header V2 — existing HOME surfaces: integration risk

Review date: 2026-10-16. Branch: `fix/battle-readiness-navigation-isolated-20261015`.

## Inspected surfaces

- `deploy/phalanx-kvk-test/home-custom-001-isolated.html`: isolated personalized Command Center, links to `epic-navigation-v2-kvk-test.html`.
- `deploy/phalanx-kvk-test/home-freeze-pinned-preview.html`: preview wrapper that fetches a **commit-pinned remote HTML document** from `raw.githubusercontent.com`, injects artwork and then renders a full Command Center. This is not a stable local header component.
- `deploy/phalanx-kvk-test/epic-navigation-v2-kvk-test.html`: existing eight-group Epic Navigation V2.
- `deploy/phalanx-kvk-test/header-v2-isolated.html`: separate three-mode header demo with seven HOME buttons and callbacks, no actual routing.

## Integration safety conclusions

1. **Do not modify the pinned HOME preview** or its remote source: its behavior and visual FREEZE cannot be validated by checking only local header code.
2. **Do not replace the eight-group navigation** with the seven-button HOME mockup: their information architecture is different.
3. Preserve the existing `home-custom-001-isolated.html` to Epic Navigation link until the actual app router and auth model are established.
4. The seven HOME labels/icons in the isolated header are **provisional functional scaffolding**, not approved icon artwork or final route mapping.
5. Pixel parity remains blocked until the original FREEZE is compared to rendered mobile screenshots. No production promotion without user signoff.

## Next independent work

Build a **read-only route inventory** of real href destinations in the isolated Epic Navigation, and a route adapter specification with explicit mappings and permission checks. Keep default navigation disabled for unresolved destinations; never silently point them at guessed routes.
