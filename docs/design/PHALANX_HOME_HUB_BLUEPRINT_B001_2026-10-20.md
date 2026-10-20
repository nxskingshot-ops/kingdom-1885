# PHALANX HOME HUB — implementation blueprint B001
Date: 2026-10-20
Status: DESIGN / ARCHITECTURE ONLY. Not a release, not a new freeze.

## Verified inputs
- HOME visual freeze: PHX-HOME-VISUAL-FREEZE-20261020-01. Preserve original top hero, player strip, gold navigation and four Command Center cards pixel-for-pixel; do not regenerate or crop original image.
- Epic entity cards: PHX-ENTITY-CARDS-EPIC-FREEZE-20261020-01, three sections heroes / animals / masters. Names, unit types, generation or applicable level; do not copy Kingshot portraits. Generated sample data is not authoritative.
- docs/PHALANX_NAVIGATION_V1_2026-10-15.md lists eight navigation domains; its drawer specification is provisional and may be superseded only after approval.
- Previous HOME direct bridge and Outpost Map Alpha35 must not be replaced or rewritten.

## HOME as hub (proposal, NOT approved freeze)
- Top: retain original approved artwork and existing gold navigation unchanged until separate explicit design approval.
- Four frozen Command Center cards stay unchanged, including ordering.
- Underneath: propose sections for Tools & Calculators, Intelligence & Reports, PYLON IX; actual order and card sizes await visual approval.
- No second visually distinct Epic Navigation menu; retain canonical routes for all existing functions.
- Profile emblem -> personal WAR ROOM is a proposed interaction; emblem size and visual effects require explicit HOME freeze amendment.
- PYLON IX visible from HOME; its location and component are unapproved.
- Gold nav as favorites / quick access remains brainstorming, not implementation instruction.

## Information architecture
- Command Center: Dashboard / KvK Prep / Outpost Map and Reports / Transfer Scouting / Alliance Comparison, using existing canonical routes.
- Tools: Hero Intelligence, Troop Ratio, March Optimizer; other Lab functions retained.
- Intelligence & Reports: Opponent Intelligence, Kingdom Scout, Rankings, Report Center.
- WAR ROOM: profile, personal account intelligence, comparison, reports, preferences; private/local-first data rules preserved.
- PYLON IX: entry point, with no claim of live intelligence without actual data integration.
- Remaining domains in Navigation V1 remain accessible in planned information architecture; no route deletion.

## Delivery gates
1. Audit exact original HOME asset and current entry HTML, canonical links and existing routes. Never substitute a flattened screenshot as the functional app.
2. Prepare visual-only composition based on original art. Do not alter the frozen top or four cards.
3. Request user approval of layout and interactions before coding them.
4. Implement in isolated branch, without merging or deployment. Respect security, privacy, costs and Android-only practical testing.
5. Test only essential navigation paths and verify preserved original layout; distinguish mockup, coded, tested, approved.

## Current status
This document records a proposed integration architecture, not a working app. No UI changes, deployment, main merge, data migration or new costs authorized.
