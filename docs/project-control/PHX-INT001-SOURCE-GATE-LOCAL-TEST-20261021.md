# PHX-INT001 source gate — local verification 2026-10-21

Status: TECHNICALLY TESTED locally, not CI integrated, not deployed.

Inputs: unchanged local Outpost Alpha24 source (SHA256 `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`) and B003 wrapper (SHA256 `9a875d44a704c2930534a7f2b632582dfee70ee735d2eeee2c21d4a888f4abd0`).

Local test of `scripts/phx_source_gate.py` with a temporary manifest:
- Positive test PASS: both files exist and match pinned hashes, permitted isolated route to B003 accepted.
- Negative test PASS: adding a route to SUPERSEDED Reports V11 returns `BLOCKED ROUTE: reports/old -> REPORTS-V11 (SUPERSEDED)`.

This is not evidence that the current HOME source has been recovered, that Reports works, that browser Map content loads, or that CI protects every route. The manifest was only local during this test; no production changes.

Next gate: commit the version manifest on a safe branch once permitted, connect CI without adding costs, then source-verify the HOME direct bridge and existing Reports.
