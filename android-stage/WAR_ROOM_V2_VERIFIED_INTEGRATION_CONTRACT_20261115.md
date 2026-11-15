# War Room V2 — verified integration contract (read-only source inventory)

## Source
- Isolated Android source: android-stage/www/index.html, SHA256 b675a78957893f13bb9708f604310ccba27774a0087d788605cede40bd690604
- GitHub Actions run 43741755044, read-only DOM inventory, SUCCESS.

## Actual existing DOM and route
- #phx-r8-war is the current War Room screen. It has #phx-r8-war-back, #phx-r8-war-cards, and #phx-r10-settings.
- Entry #phx-r8-war-entry sets location.hash='war-room'; back sets location.hash='phalanx-home'.
- Existing router toggles body.phx-r8-war-open, aria-hidden and inert state; do not replace.
- Existing shortcuts: choices territory/map/report/pylon; default territory/report/pylon.
- Existing storage keys: phx-war-room-slot-0, -1, -2. Select change saves and Open button navigates. Preserve the exact keys and behavior.
- Current profile editor is embedded inside War Room: #phx-r10-settings; existing fields #phx-r10-input-name, -level, -file, -scale, -x, -y, #phx-r11-input-kingdom, -alliance; actions #phx-r10-save and #phx-r10-reset.
- Existing profile storage key phx-personal-profile-r10. Current defaults FaQu / 27 / NXS / 1885 are placeholders, not verified live account data.
- Existing PYLON modal contains an embedded base64 image labelled as approved original; the embedded asset's visual correspondence to frozen emblem remains NOT VERIFIED.
- Main HTML is ~11.7 MB, contains embedded media and source. Never replace with 7 KB design prototype.

## Required integration strategy
1. Use an additive, scoped War Room V2 layer or minimal anchored patch against the exact checked source hash; keep existing router, profile editor, shortcuts and keys.
2. Keep HOME and Territory Control markup/assets and 74 OP data untouched. Verify their hashes or exact source ranges before/after patch.
3. New UI sections: Commander Profile including Power (only verified data), Account Intelligence, Alliance Position, Player Development (no invented history), Command Access using existing three configurable shortcuts.
4. Make profile editor accessible from Settings; do not delete/move until its dependencies are inspected.
5. PYLON IX must keep its original existing destination and emblem; no fabricated graphic or new permissions.
6. Build in isolated test package and verify navigation, stored shortcuts, profile persistence, 74 OP, Reports, HOME and Android screen against approved image before acceptance.

## Status
- BESTANDEN: source inventory, existing DOM/router/keys and profile editor identified.
- NICHT GETESTET: new visual layer, pixel parity, actual player-ID API, persistence after integration, PYLON integration and Android regression.
- NO SOURCE MODIFICATION: this document does not change android-stage/www/index.html or user data.
