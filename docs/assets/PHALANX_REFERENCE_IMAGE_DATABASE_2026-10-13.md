# NEXUS PHALANX — Reference Image Database (FREEZE, 2026-10-13)

The user's approved visual assets were preserved as **13 named, checksum-verified image references** in a single archive, with a Markdown and JSON catalogue. Source files were copied unchanged. This is the canonical lookup index, **not a license to regenerate them**.

## Permanent Library location

`/NEXUS PHALANX/Design Freeze/Zentrale Referenzbilder-Datenbank/REFERENZBILDER_FREEZE_2026-10-13.zip`
`/NEXUS PHALANX/Design Freeze/Zentrale Referenzbilder-Datenbank/REFERENZ_INDEX.md`

The archive contains `REFERENZ_INDEX.md` and `REFERENZ_INDEX.json` with SHA-256 digests, descriptions, and paths. The zip integrity test passed.

## Fixed four master card assets

| Alliance | Asset path in ZIP | Approved color and symbol |
|---|---|---|
| NXS | `assets/NXS_MASTER.png` | Emerald green, white NXS emblem |
| FRA | `assets/FRA_MASTER.png` | Red, white tower |
| OoO | `assets/OoO_MASTER.png` | Pink, own white emblem |
| MYM | `assets/MYM_MASTER.png` | Violet, white tower |

**Freeze:** preserve identical layout, gold trim, effects, and proportions. Do not regenerate or replace.

## Other preserved references

- `reference/dashboard_implemented.png`: the integrated dashboard image
- `reference/dashboard_visual_without_corner_button.png`: approved image-only visualization without the unwanted corner button
- `reference/original_kingshot_four_alliance_banners.png`: source screenshot
- `reference/dashboard_original_gold_blue_layout_freeze.png`: old approved fantasy dashboard style
- `reference/dashboard_previous_android_screenshot.png`: predecessor mobile state
- `reference/user_confirmation_four_card_thumbnails.png`: explicit selection screenshot
- `reference/android_actual_master_cards_1251.png`: real Android state before corner button removal
- `reference/dashboard_master_cards_integration_clean.png`: composite after master insertion
- `reference/approved_visual_without_corner_button.png`: latest concept without the distracting button

**Important:** The no-corner-button image is a visual freeze, but removing it from the functional HTML is NOT verified. Current runnable HTML remains a separate archived item.

The consolidated project/source backup is stored in:
`/NEXUS PHALANX/Backups/2026-10-13 Projektstand/NEXUS_PHALANX_PROJEKT_BACKUP_2026-10-13_FINAL.zip`.

Next time, fetch these library objects and the catalogue first rather than reconstruct from memory or create new art.


## HEADER-20261016 — unified header asset register (added 2026-10-19)

**Search here first** for any PHALANX header decision. Read [system-wide audit](../PHALANX-DESIGN-AUDIT-20261019.md) before implementing. This register records both the approved rules and the exact provenance of candidates; it does **not** supersede older frozen originals.

| Stable ID | Original Library filename | Library file ID | State |
|---|---|---|---|
| PHX-HDR-REF-B-20261016 | `PHALANX: Gold, Rot und Blau.png` (2026-10-16 20:04 UTC) | `file_0000000001a882109fa1d88336fc2451` | **Preferred by user 2026-10-19; not final master/freeze** |
| PHX-HDR-REF-A-20261016 | `Dreifacher Phalanx-Appbildschirm mit Farbaugen.png` (2026-10-16 20:07 UTC) | `file_00000000866c8210b171d2de3f1a1d05` | Alternative; retain |
| PHX-HOME-FROZEN-20261011 | `NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html` | Library (see [canonical HOME freeze](../NEXUS-PHALANX-CANONICAL-HOME-FREEZE-2026-10-12.md)) | Frozen; SHA-256 `f8e8a4c4a61cdaf89b9b6de8a8c8c906c0cace084e9b54ae6ac5ed4b90fa8031` |
| PHX-OUTPOST-ALPHA35 | `NEXUS_PHALANX_ALPHA35_FUNCTION_FROZEN.html` | `/NEXUS PHALANX/Design Freeze/Alpha35 Function Freeze/` | Frozen; see [Alpha35 freeze](../freezes/NEXUS-PHALANX-ALPHA35-FUNCTION-FREEZE-2026-10-13.md) |

### Mandatory shared-header behavior (all modules/functions)

- HOME: **largest** epic header, **gold** helmet eyes, no hamburger.
- MODULE: **medium** header, **red** eyes, hamburger, back button, gold title.
- FUNCTION: **smallest/compact** header, **blue** eyes, hamburger, back button, gold title. Preserve map/table/report/calculator viewport.
- Same approved helmet silhouette (narrow mohawk crest) and wide lion flags. No regeneration, substitution, or pixel-size invention.
- OUT-024 Reports belongs to **Territory Control → Reports & History**, function tier, **not** a standalone module.
- Responsive/mobile and DE/EN/FR must be checked against representative screens; no universal certification yet.

### Deterministic lookup / no-loop protocol

1. Open **this register** and the [design audit](../PHALANX-DESIGN-AUDIT-20261019.md); read statuses, do not restart searches for previously identified candidates.
2. Retrieve original Library objects by the **exact file IDs above**, not image-search queries or similarly named internet pictures.
3. Before creating the reusable header, verify that an actual original *asset* exists separately from a triptych/mockup. If only mockups exist, mark **ASSET BLOCKED**, preserve them, and do not invent artwork.
4. Integrate **only** in isolated preview/test code; never modify frozen HTML, existing freezes, production, or main without explicit authorization.
5. Run a representative HOME/MODULE/FUNCTION browser test, then mobile verification when necessary; report separately: documented / implemented / tested / user-approved.
6. For any new approved master, record exact Library/GitHub path, SHA-256, user approval, date, and previous-master link **before** claiming permanent canonical status.

**Known blocker:** No verified standalone export of the 2026-10-16 original header artwork; images A/B are full triptych mockups. B is a user preference, not a new freeze. Do not ask the user to repeat the preference or retest OUT-024 filters/TXT downloads.
