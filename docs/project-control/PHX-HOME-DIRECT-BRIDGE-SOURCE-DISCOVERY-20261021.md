# PHX HOME direct bridge source discovery — 2026-10-21

Status: SOURCE INSPECTED, NOT RUNTIME TESTED, NOT APPROVED FOR RELEASE.

Library file: PHALANX-FIRST-STRIKE-HOME-DIRECT-BRIDGE-20261020.html (2,080,138 bytes). The file search/read interface permitted examination of its source even though raw file materialization remains unavailable.

The source defines four views: homeOriginal, territory, map and reports. The HOME view embeds an original HOME payload and hooks Outpost entry into Territory Control. Map is loaded from a frozen embedded payload. Reports includes a distinct published-data fetch, alliance/type/quadrant filters and CSV/TXT/copy controls. Navigation includes history and back handlers.

This is materially more complete than the obsolete Reports V11 preview and the newer safe-entry fallback. These are separate sources, not interchangeable implementations. Do not claim Reports are absent merely because the safe-entry preview disables them.

The 20 Oct bridge is NOT evidence that the 21 Oct HOME header design FREEZE has been implemented. Data access, filter correctness, export correctness, origin/security behavior and Android usability are untested. Do not deploy or merge. The next work package is to obtain raw bytes of this exact bridge, inspect dependencies and test its existing functionality before changing it. No substitute old HOME.
