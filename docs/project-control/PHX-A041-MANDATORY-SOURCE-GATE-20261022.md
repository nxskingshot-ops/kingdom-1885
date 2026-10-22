# PHX-A041 — Mandatory Source Gate (2026-10-22)
Status: documented mandatory workflow for every PHALANX development session on this branch; not a CI-enforced check.

## Start gate
Read canonical governance START-HERE, current relevant FREEZEs, version register and latest actual source before coding. Search all relevant branches and Library, not only filename matches in the current branch.

## Single-source gate
Record feature ID, exact source path, branch/commit, version, hash if verified, dependencies and evidence state. Select one active integration candidate; preserve original FREEZEs. Never confuse design approval with tested code.

## Legacy gate
Mark previous routes and files as active, frozen reference, superseded, defective, or unknown. Remove only proven superseded runtime references after replacement passes tests. Keep Git history and backups; do not delete original assets.

## Execution gate
Prefer existing modules and one cohesive integration patch. No new shells, wrappers, documents or adapters when an existing module solves the task. After two failed attempts change approach. Avoid GO loops.

## Verification gate
Run focused syntax and regression tests for changed paths. Report separately DOCUMENTED, IMPLEMENTED, TECHNICALLY TESTED, DEVICE TESTED, APPROVED, PRODUCTION. Never claim unrun tests.

## Save gate
On milestone commit code and concise register update to isolated branch; update/link canonical START-HERE when authorized and confirmed. If GitHub write is blocked, do not claim saved; keep local artifact and report blocker.

## Security gate
No main merge, production deployment, permission changes, destructive deletes or added costs without explicit approval. Keep GOD MODE and PYLON IX backend authorization constraints.

## Current sources
A039-R11: current full-app candidate; Atlas PHX-OUT-024 CORE V2: work/phx-version-hygiene-20261021/src/phalanx/outpost-atlas; OUT-024 Alpha24 frozen reference; Epic Navigation V2 retired. See PHX-A040.

## Limits
This document makes the workflow discoverable and repeatable, but cannot itself force future assistants or CI to follow it. Enforce in repo automation only after separately implementing and testing a non-destructive check.