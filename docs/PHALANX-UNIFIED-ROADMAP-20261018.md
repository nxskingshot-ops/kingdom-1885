# NEXUS PHALANX — Unified Roadmap (index, 2026-10-18)

**Status:** Canonical navigation index for ideas, work, feature identity, and evidence. **Not** a declaration that all features are complete. No production/main changes, no new feature authorization, no design FREEZE override. The original source lists remain unchanged and authoritative for their respective histories.

## Source hierarchy and non-destructive rules

1. **User-approved design/FREEZE originals** govern visual and functional commitments; resolve conflicts explicitly with FaQu. This roadmap never overrides them.
2. **Feature IDs / identity:** `data/phalanx-feature-id-baseline-20261018.json` — 74 feature IDs across 16 modules; historic statuses only. `data/phalanx-feature-register-baseline-audit-20261018.json` is the associated audit. Current alpha verification is marked `UNVERIFIED_CURRENT_ALPHA` until separately tested.
3. **Ideas:** `NEXUS-IDEAS-TODO.md` (original created 2026-09-28). Keep all proposals and their original context; an idea is **not** implementation permission.
4. **Operational tasks:** `TODO.md`. Do not silently mark historical checkboxes done based on new code or unrelated CI.
5. **Recovery and provenance:** `docs/PHALANX-RECOVERY-MASTER-REGISTER-20261018.md`, `docs/PHALANX-PROJECT-MEMORY-2026-10-14.md`. These contain time-scoped evidence; older gaps may have been addressed after their writing.

## Current execution order

| Priority | Workstream | Status / evidence | Completion gate |
| --- | --- | --- | --- |
| P0 | Independent PostgreSQL backup | GitHub Actions run 39153463727 succeeded: remote download, checksum, decrypt, PG18 archive list | Full isolated database restore and validation **OPEN** |
| P0 | 26 Edge Functions off-project archive | GitHub Actions run 39153935072 **success**, commit 1326fdea: 26 functions downloaded, encrypted B2 upload, remote byte comparison, decrypt and archive inspection | Functional isolated recovery and deployment test **OPEN**; periodic Edge backup schedule **OPEN** |
| P1 | Android integrated alpha | Existing isolated alpha branch; historical Android checks are not proof of current integrated release | Current build, navigation, permissions, functionality, and FREEZE fidelity on Android **OPEN** |
| P2 | Features and proposals | 74 IDs / 16 modules inventoried; original ideas and TODO retained | Per-feature current-alpha evidence; explicit approval for any new implementation |

## Status vocabulary (mandatory)

- **IDEA** — proposal only; never automatic authorization.
- **PLANNED** — accepted scope, not implemented.
- **CODE_PRESENT** — verified in branch source, not necessarily built or usable.
- **CI_VERIFIED** — named test and run succeeded; specify exactly what it proves.
- **DEVICE_VERIFIED** — tested on target Android build with date/build evidence.
- **RESTORE_VERIFIED** — recovered in isolated environment and validated, not merely decrypted/listed.
- **FROZEN** — approved immutable reference; conflicts need a new user decision.
- **UNKNOWN / STALE** — source is old or evidence incomplete.

## Next checkpoints

1. Isolated database full restore, object/row checks, and recovery notes. No production writes.
2. Isolated Edge source restoration, 26-slug completeness and safe functional verification. Never publish source to public GitHub or public CI artifacts.
3. Reconcile latest HOME/header/RC5/OUT-024 freezes before Android integrated build; never substitute old OUT-023 map.
4. Build and test Android alpha; verify login/logout, roles, navigation, map/editor, KvK, scouting demo/live boundaries and PWA behavior.
5. After device checks, attach dated evidence to each feature ID and update statuses without deleting idea history.

## Change discipline

Every future feature should have a stable ID, original idea reference, owner/approval, code path, test evidence and state. No checkbox or feature may be marked done merely because a file exists. Existing source lists are preserved; this document is a unified entry point, not a destructive migration.
