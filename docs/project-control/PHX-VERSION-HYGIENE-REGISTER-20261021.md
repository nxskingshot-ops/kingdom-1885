# PHX-VERSION-HYGIENE-001 — Active-source and retirement policy

Date: 2026-10-21. Status: DOCUMENTED, not a production migration.

## Binding workflow

1. **Inventory before creating**: search feature register, FREEZEs, repository, Library and integration references for an existing implementation.
2. **One active candidate per feature**: record feature ID, version, source path, hash if available, governing FREEZE, dependencies, and evidence level.
3. **Classify explicitly**: ACTIVE-CANDIDATE, FROZEN-REFERENCE, SUPERSEDED, DEFECTIVE, QUARANTINED, UNKNOWN, or RELEASED. A design FREEZE is not proof of working code.
4. **Reuse or retire**: never silently connect a SUPERSEDED, DEFECTIVE or UNKNOWN source. A replaced source stays in version control for provenance and restore; remove only from active routes and menus after dependency audit. Do not delete approved originals, immutable FREEZEs or backups.
5. **Before replacing**: compare source hashes and approved requirements, audit read/write side effects, verify replacement and navigation, then document why the old route is excluded.
6. **After two failed attempts**: stop repeating the same approach; record cause and switch strategy.
7. **Acceptance levels**: PLANNED, DOCUMENTED, IMPLEMENTED, TECHNICALLY TESTED, DEVICE TESTED, APPROVED, PRODUCTION. Do not collapse levels.
8. **No unilateral production actions**: no main merge, deployment, permissions changes, destructive deletion, or additional cost without explicit approval.
9. **Milestone update**: record the decision and evidence in this register and link it from START-HERE; never claim saved until the GitHub commit succeeds.

## Initial version decisions (source audit only)

| Feature | Source | Classification | Reason / next gate |
|---|---|---|---|
| OUT-024 Map 2.0 Alpha24 | `preview/PHX-OUT-024-MAP2-FROZEN-20261018.html` | FROZEN-REFERENCE | Original SHA256 `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`; preserve original, runtime/device acceptance pending |
| Territory wrapper B001/B002 | Local isolated intermediate wrappers dated 2026-10-21 | SUPERSEDED | B003 replaced these local shells; not proof of complete integration |
| Territory wrapper B003 | Local `PHX-TERRITORY-OUTPOST-ALPHA24-ISOLATED-B003-20261021.html` | ACTIVE-CANDIDATE | Static integrity checked; browser/Android test missing; not committed as full HTML |
| Reports V11 | `preview/outpost-report-v11.html` | SUPERSEDED FOR INTEGRATION | 2026-10-18 safe-entry source explicitly isolated V11 due to obsolete viewer dependency; historical RC5 target is not current approval |
| Reports safe entry | `preview/phalanx-reports-out024-safe-entry-20261018.html` | FROZEN-REFERENCE (fallback) | Honest placeholder, explicitly no reports; never label a working reports module |
| HOME direct bridge 2026-10-20 | Library `PHALANX-FIRST-STRIKE-HOME-DIRECT-BRIDGE-20261020.html` | ACTIVE-CANDIDATE, UNVERIFIED | Source includes existing map and filtered Reports; raw file not available for isolated runtime tests; does not prove 2026-10-21 HOME visual |
| HOME visual 2026-10-21 | `docs/project-control/freezes/PHX-HOME-HEADER-FREEZE-20261021-01.md` | FROZEN-REFERENCE | Approved design, original binary not committed; do not substitute legacy overlay |

These classifications apply to **active integration selection**, not authorization to delete historical files or alter deployed routes. Where a newer verified implementation or FREEZE conflicts, record and resolve by authority and evidence, not by guesswork.

## Next action

Recover exact current HOME bridge bytes, validate existing Reports fetch/filter/export and frozen Map identity, and integrate the 21 Oct HOME visual without replacing or duplicating legacy artwork. Use a single isolated integration candidate, not a chain of wrappers.
