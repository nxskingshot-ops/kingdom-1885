# PYLON IX — CHARACTER FREEZE 001
Status: APPROVED by product owner, 2026-10-17.
Scope: PYLON IX character identity only. Does not supersede any pre-existing NEXUS PHALANX HOME, header, navigation or branding FREEZE.

## Identity
- Official name: PYLON IX. Short form: PYLON.
- Role: the intelligence and guardian of NEXUS PHALANX.
- Visual reference: user-approved three-column PYLON IX concept image from the design conversation (dark Spartan warrior, central PYLON IX view, HOME tile, WAR ROOM, Hero Calculator, KvK panels).
- Appearance: dark ancient-metal Spartan armor and helmet, gold highlights, dramatic warm backlight, majestic/mysterious but recognizable character.
- Preserve the exact character appearance; do not regenerate or reinterpret the helmet/armor as a replacement for the approved original.
- Asset handoff: the approved original image must be added to the repository as a separately tracked asset before pixel-accurate implementation. This document does NOT claim the reference image is present in GitHub.

## UX
- HOME entry labeled "PYLON IX", subject to existing HOME layout FREEZE; no production HOME changes without explicit separate approval.
- PYLON is also available contextually within existing WAR ROOM, hero, KvK and alliance modules.
- Do not use "Frag PYLON" as an entry label.
- No new navigation tier or duplicate WAR ROOM.
- Language follows PHALANX selection: English, German, French.
- Mocked recommendations must be explicitly labeled and must never be represented as real account data.

## Engineering boundaries
- Isolated experiment only: experiments/pylon-ix/.
- No merge to main, no production deploy, no alterations to existing FREEZE assets.
- Zero incremental cost: offline rules and local data first; no paid AI APIs, hosting upgrades, telemetry or third-party credentials.
- Protect personal account data locally; do not transmit data without separate approval.
- Before integration: verify character asset provenance, perform UI tests, accessibility checks and FREEZE conflict review.

## Next steps
1. Import the approved original character asset without re-generation.
2. Align the isolated UI to the existing approved PHALANX design tokens and header.
3. Test offline interactions in browser and mobile.
4. Connect to real modules only after reviewing actual module interfaces and permissions.
