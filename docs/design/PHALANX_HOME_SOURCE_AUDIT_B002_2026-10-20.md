# PHALANX HOME source audit — B002 (2026-10-20)

Status: SOURCE IDENTIFICATION COMPLETED; no code changes.

## Authoritative visual reference
Library /NEXUS PHALANX/PHX-HOME-VISUAL-FREEZE-20261020-01-REFERENZ.png (2,542,024 bytes)
Library /NEXUS PHALANX/PHX-HOME-VISUAL-FREEZE-20261020-01-BACKUP.zip (5,103,224 bytes)
Library /NEXUS PHALANX/PHX-HOME-VISUAL-FREEZE-20261020-01.md
The 20-Oct HOME freeze supersedes older 11-Oct visual HOME as current top-section reference. Do not conflate them.

## Existing integration candidate
Library /NEXUS PHALANX/PHALANX-FIRST-STRIKE-HOME-DIRECT-BRIDGE-20261020.html (2,080,138 bytes; Library version 2). Prior Android navigation confirmations in conversation; re-inspect actual bytes before code modification.
Library /NEXUS PHALANX/PHALANX-FIRST-STRIKE-HOME-EPIC-NAVIGATION-LAYOUT-20261020.html (633,012 bytes). This is a historical study, not an approved current master.
Library /NEXUS PHALANX/PHALANX-EPIC-V2-ICON-REFERENZ-VERIFIZIERT-20261020.png and /NEXUS PHALANX/PHALANX-EPIC-NAVIGATION-V2-ORIGINAL-ASSETS-OVERVIEW-20261020.png are historical navigation assets, not permission to crop/reskin.
Existing functional Alpha35 reference: SHA256 22336f5ec5cd438b1dbf3058f3820d4038df5f3e8f94061d8f15932cc74fc6ba, 1,912,593 bytes; frozen independently.

## Source priority
1. 20-Oct original visual HOME freeze image + archive.
2. 20-Oct direct bridge, if source inspection confirms its structure.
3. Independently frozen working modules, e.g. Alpha35.
4. Older previews for reference only, never silently replace newer freeze.

## Required next action
Materialize current HOME backup + bridge, inspect internal filenames/structure and check SHA256 of actual extracted originals, map DOM links and route targets. Keep all work isolated. No mock screenshot overlay as app implementation. No production edits, deployment, or merge.

## Design status
The HOME hub, profile -> WAR ROOM, PYLON location, top quick access and module ordering remain unapproved proposals. The Epic entity card design freeze is approved.
