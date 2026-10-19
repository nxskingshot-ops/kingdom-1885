# PHALANX Alpha Territory Integration — 2026-10-19

Status: isolated integration planning; no production changes and no release approval.

## Source controls
- Base: alpha/android-integrated-freeze-20261017 (read-only baseline).
- HOME: canonical frozen Library HTML NEXUS_PHALANX_HOME_FROZEN_2026-10-11.html; SHA-256 f8e8a4c4a61cdaf89b9b6de8a8c8c906c0cace084e9b54ae6ac5ed4b90fa8031. Must retrieve and verify original before deriving any integrated HOME.
- Map: approved Outpost Map V2 visual FREEZE 2026-10-12; do not replace with older outpost viewer.
- Reports: work/reports-out024-readonly-20261019 needs source inspection before wiring; preview/outpost-report-v11.html is older and embeds index.html, not canonical integration source.
- Header contract: HOME gold/large, Territory Control red/medium, Outpost Map and Reports blue/compact. Later approved FREEZE overrides legacy DESIGN_STANDARD.md for this isolated PHALANX alpha only.

## Intended route
HOME -> Territory Control -> Outpost Map V2 / Outpost Reports -> back to Territory Control -> HOME.

## Integration gates
1. Retrieve and hash-verify frozen HOME from Library.
2. Inspect latest map V2 and OUT-024 report artifacts on their branches, determine immutable source files and exact data dependencies.
3. Wire in isolated derivative only, preserving data, access checks, language support and original functionality.
4. Run static navigation and regression checks; Android user confirmation separate.
5. No main merge, production deployment, database changes, secrets or paid services.

No claim of implemented navigation or tested UI until code and checks exist.
