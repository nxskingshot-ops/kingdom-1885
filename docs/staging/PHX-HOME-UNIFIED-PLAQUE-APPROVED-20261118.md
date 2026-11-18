# PHALANX HOME — Unified Profile Plaque · 18.11.2026

Status: USER DESIGN APPROVED; IMPLEMENTATION PENDING. This is a scoped design handoff, not a deployment or functional test.

## Approved visual reference
User-approved generated mockup from the conversation dated 2026-11-18: a single full-width black/bronze/gold ornate plaque ABOVE the existing PHALANX artwork. Two-line responsive arrangement:
- Left: gold-framed circular Spartan helmet/avatar, tappable to open the EXISTING War Room.
- Main upper row: prominent centered dynamic player name (long names must fit).
- Lower row: dynamic kingdom and alliance with their original iconography, separated elegantly.
- No level line, no baked-in profile data, no new authentication.
- Move the EXISTING Queen-An/PHALANX artwork down in the layout; do not regenerate or alter original image bytes, crop the logo, or replace the frozen visual.
- Keep existing HOME navigation, four command-center banners, session/reload, profile source, routes and other modules intact.
- No backend, roles, Supabase or production changes.

## Verified starting point
Branch: work/phx-home-compact-layout-20261118
Commit: d11dc158efcadd9d527e45ca14887ab43a0224d0
Source inventory: android-stage/www/index.html (large monolithic HTML), android-stage/www/PHX_HOME_QUEEN_AN_APPROVED.png, existing phx-war-room-live.css/js and HOME plaque styles.
Previous backup ref: backup/phx-home-before-compact-20261118 (exists; not newly created or restored).
Existing completion/test record: docs/staging/PHX-HOME-COMPACT-DESIGN-20261118.md. Do not rerun unrelated prior successful checks.

## Implementation boundary
Only HOME header/plaque CSS and minimal markup/event integration. Preserve dynamic player identity source, DOM routing and existing login. No changes to War Room, Territory, Reports, PYLON, transfers or exports.

## Acceptance
- User-approved plaque visually matches reference on Android.
- Original HOME artwork preserved and shifted below plaque.
- Avatar enters existing War Room.
- Player name, kingdom and alliance remain bound to authorized player ID.
- No level row.
- No regressions in affected HOME interactions.
- Existing completed tests are reused as evidence, not repeated without impact.

## Current evidence
Design approval: YES.
Code change: NOT YET IMPLEMENTED.
Build/deployment: NOT TESTED.
New Android visual acceptance: NOT TESTED.
Production: UNCHANGED.
