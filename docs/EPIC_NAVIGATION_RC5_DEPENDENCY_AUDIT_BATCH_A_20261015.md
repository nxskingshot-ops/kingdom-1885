# RC5 dependency audit — phase 1, batch A (2026-10-15)

Read-only source inspection on GitHub default branch; isolated integration branch only for documentation. No execution, credentials, deployment or data mutation.

| Target | Observed dependency / behavior | Dependency existence | Gate |
|---|---|---|---|
| preview/outpost-report-v11.html | iframe ../index.html?kingdom-preview=an-viewer-v1&single-header=3; script injection for outpost viewer; location navigation | index.html and preview/outpost-viewer-an-v1.js exist | Runtime iframe / origin / viewer routing test required |
| preview/phalanx-kingdom-scout-report-v1-20261014.html | fetch calls, Supabase reference, password form | Network/auth path not exercised | Authentication and API access review required |
| preview/phalanx-ranking-integration-rc-20261015.html | fetch calls, Supabase reference, link to phalanx-home-auth-rc9-20261014.html | Linked HTML exists | Read-only network and auth review required |
| preview/transfer-scouting-integrated-v10.html | external script ./transfer-scouting-integrated-v10.js | Script exists | Browser script execution and input test required |
| preview/phalanx-robust-optimizer-alpha28-2026-10-12.html | external script ../src/phalanx-robust-engine-v1.js | Script exists | Browser engine initialization and deterministic test required |

Findings: 5/12 unique targets inspected for dependencies; 5/5 inspected local dependencies resolve (count: index, viewer, auth, transfer JS, optimizer JS). This is a source-level audit, NOT a successful functional test. No claims about safety or functionality of uninspected code.

Next unique work: inspect remaining 7 targets; then run isolated browser tests for the 12 targets, prioritizing Outpost, Kingdom Scout, Rankings. Shared destination URLs may not select distinct submenu functions.

Freeze untouched; main untouched.
