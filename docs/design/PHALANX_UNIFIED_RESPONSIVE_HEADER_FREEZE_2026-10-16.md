# PHALANX — Unified Responsive Header FREEZE

Approved 2026-10-16 by user. Scope: visual header behavior only; does not authorize production deployment or replacement of unrelated freezes.

## Single canonical visual source
Use the approved PHALANX EPIC HOME V3 combined master view and its source precedence: outward-blowing red/blue lion flags from original flag reference; approved gold medallion icons and layout from icon reference. Do not regenerate or reinterpret flags, helmet, PHALANX lettering, gold styling or landscape.

## One responsive header, not three designs
- HOME: full-size epic master header, no hamburger and no vertical page scroll.
- Modules: same art, proportionally scaled/cropped into a shorter header; module content scrolls.
- Detail/rechner: same art, compact crop, page title/back affordance as needed; content scrolls.
- Responsive to viewport width/height; maintain aspect ratio and readable controls; do not clip central helmet or PHALANX wordmark. On very short screens prioritize usability, not distorted art.
- Single reusable component and shared asset tokens, no duplicated custom header variants.

## Unchanged behavior
Preserve all existing navigation routes, modules, functions, data, permissions, account switcher, language and kingdom selection. Account avatar placeholder when absent; all game accounts have full feature capabilities subject to user permissions. NXS identity and Queen An remain in Alliance/About. Third-party provider branding absent from primary UI; required attribution remains accessible under Info/Credits.

## Integration gates
Implement and validate in isolated test branch first; screenshot-test HOME/module/detail across small and large mobile viewports, verify controls and navigation, compare against exact frozen artwork, request user visual acceptance before any production merge. Existing FREEZEs remain unchanged outside the explicitly approved new header scope.
