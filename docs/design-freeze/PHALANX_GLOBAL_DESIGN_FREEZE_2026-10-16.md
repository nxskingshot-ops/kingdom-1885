# NEXUS PHALANX — GLOBAL VISUAL DESIGN FREEZE

**Status: USER-CONFIRMED, MANDATORY — 2026-10-16.**

## Scope — entire application, not only HOME

The user explicitly clarified: **EVERY tile, feature, function, module, calculator, dashboard, menu, report and screen must follow the exact same approved epic PHALANX visual design language as the HOME reference.** This is a GLOBAL app-wide design freeze, not a HOME-only requirement.

The user-approved reference is the image from the current conversation documented in `PHALANX_HOME_FREEZE_REFERENCE_2026-10-16.md`. That image is the master visual style reference; it is not a literal demand to reuse identical content or layouts on every screen.

### Mandatory shared design language

- Cohesive high-detail cinematic fantasy / kingdom environment, dark rich background and dramatic lighting.
- Ornate, polished gold metallic borders, separators, decorative flourishes and premium typography.
- Illustrated, thematic module cards and meaningful iconography; no generic unillustrated navy rectangles as the final design.
- Consistent account identity, navigation, hierarchy, spacing and interactive states across all screens.
- Every module and function should look as if it belongs to the same PHALANX world, while retaining its own content and usability.
- Existing visual state FREEZEs remain authoritative: HOME gold, MODULE red glowing eyes, DETAIL blue glowing eyes.

### Governance

1. Do not redesign, reinterpret or substitute simpler UI as final.
2. Do not overwrite existing separately approved FREEZEs; when two approved references conflict, surface the conflict visually and ask the user to choose.
3. Keep functioning business logic, routes, permissions, data and historical/live status indicators unchanged unless separately authorized.
4. Implement and test only on isolated branch; no production deployment, merge or release without user approval.
5. Document per-screen design compliance and test responsive mobile rendering before declaring complete.
6. The currently working isolated test UI is a technical proof of navigation, **not** a finished design-compliant release.

## Relation to HOME freeze

The HOME freeze file describes the specific HOME composition. This GLOBAL freeze governs the entire app's design language. Both apply simultaneously; the HOME-specific composition remains mandatory for HOME.
