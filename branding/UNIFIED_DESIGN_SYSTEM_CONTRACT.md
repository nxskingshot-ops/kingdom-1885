# NEXUS PHALANX — Unified Design System Contract
Status: **BINDING FOR NEW WORK** · 2026-10-16
Scope: Entire PHALANX app, all new features and test modules. Existing approved FREEZEs are preserved.

## Goal
One coherent application, not 20 loosely similar themes. Every new feature must inherit the same visual tokens, components, asset provenance and navigation grammar. No freehand restyling.

## Authority and precedence
1. Explicitly approved, surface-specific FREEZE wins for that existing surface.
2. Verified original asset in `branding/BRANDING_REGISTRY_2026-10-16.json` wins over lookalikes.
3. This shared design contract governs all NEW components and unapproved variants.
4. A proposal or test is never automatically an approved replacement.
5. If two approved references conflict, log the conflict and request a single explicit decision before changing either.

## Design tokens — initial canonical names
The following names are mandatory. Values are provisional until reconciled against the frozen HOME and Epic Navigation V2; do NOT infer exact colors from posters or silently overwrite frozen CSS.

| Token | Purpose |
| --- | --- |
| `--px-bg-canvas` | Deep navy/near-black app background |
| `--px-bg-surface` | Main panel background |
| `--px-bg-raised` | Interactive elevated tile |
| `--px-gold-primary` | Brand identity and active highlights |
| `--px-gold-muted` | Borders and secondary accents |
| `--px-text-primary` | Readable primary text |
| `--px-text-secondary` | Labels and metadata |
| `--px-state-own` | Own kingdom/side |
| `--px-state-opponent` | Opponent/critical comparison |
| `--px-border-panel` | Standard panel outline |
| `--px-radius-panel` | Shared panel radius |
| `--px-space-unit` | Spacing rhythm |
| `--px-font-ui` | Data and controls typography |
| `--px-font-display` | Approved epic brand/display typography |

**Do not hardcode invented numeric values into frozen screens.** First extract verified token values from canonical FREEZE HTML and compare on Android.

## Shared component catalogue (design ownership)
- `AppHeader`: one shared identity and controls, no double headers.
- `PrimaryNavigation`: one approved navigation pattern; mobile portrait first.
- `CommanderIdentity`: verified account identity and original crest; do not duplicate player name in same visual hierarchy.
- `ActionTile`: same geometry, selected/hover/focus states.
- `IntelligencePanel`: same panel frame, title, metadata and content spacing.
- `DataTable`: consistent row density, hierarchy, ranking emphasis.
- `StatusBadge`: shared warning/success/unknown meanings, not decorative colors.
- `ReportActions`: same copy/export affordances.
- `EmptyState`: distinguish missing, historic and unverified data.
- `ModalDialog`: consistent accessibility, focus and dismiss patterns.

## Asset policy
- The exact official source is identified by asset ID, source locator, status, and, where available, checksum.
- No generic helmet or generated emblem may replace the approved NXS crest or official PHALANX helmet.
- A cinematic poster is not automatically a UI icon or a source of exact CSS font metrics.
- Unverified alliance symbols are not official.
- No new image or font enters a released module without explicit provenance and approval.

## Consistency gate for every feature
1. Which frozen surface or shared component does this feature belong to?
2. Does it use canonical design tokens instead of ad-hoc colors/spacing?
3. Are all images verified originals with recorded asset IDs?
4. Are typography, navigation, borders and responsive behavior consistent?
5. Is the account name shown once at the right hierarchy?
6. Are empty, loading, error, historic/demo, and access states visually consistent?
7. Has the design been compared to the frozen reference at mobile portrait width?
8. Does the change preserve existing functionality and all other FREEZEs?
9. Is a screenshot/acceptance record attached before promotion?

If any check fails, keep the work isolated; do not merge or publish.

## Migration strategy (no big-bang redesign)
**Phase A — Inventory:** map every page, stylesheet and component to its visual source; log deviations.
**Phase B — Extract:** establish exact tokens from verified frozen reference(s), with conflict resolution.
**Phase C — Components:** build reusable components in a test-only namespace, with regression snapshots.
**Phase D — Incremental adoption:** migrate only unapproved/new modules first. Frozen screens change solely by explicit user approval.
**Phase E — Release gate:** compare mobile screenshots and interactions, then seek approval.

## Current authority references
- `branding/BRANDING_REGISTRY_2026-10-16.json`
- `docs/NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md`
- `docs/nexus-app-2-design-freeze.md`
- `docs/KVK_INTELLIGENCE_LAYOUT_FREEZE_2026-10-03.md`
- `docs/assets/ALLIANCE_EMBLEMS_REFERENCE.md`

## Explicit exclusions
This document does not change production, main, existing frozen screens, or release status. It is a contract and migration plan, not proof that the entire application already shares one CSS implementation.
