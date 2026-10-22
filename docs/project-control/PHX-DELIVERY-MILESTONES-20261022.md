# PHALANX 1.0 — Delivery milestones (2026-10-22)
Status: working delivery plan, not a design FREEZE and not release approval.

**Rule:** a milestone is not complete when a document, adapter, static gate, or commit exists. Completion requires an integrated runnable product flow and the evidence stated below. Work in one integration candidate; retain original assets and existing HOME/War Room/Reports. Do not add new A-numbered shells for each correction.

## M1 — PHALANX FOUNDATION (ACTIVE / NOT COMPLETE)
Deliver HOME → Territory Control → Outpost Map CORE V2 / Reports; avatar → War Room; preserve approved HOME/header design and back navigation.
Exit evidence:
- R11 and all canonical Atlas assets resolve from the same runnable artifact.
- Existing authorized data-provider contract works; missing provider fails visibly and safely; never claim live data without a source.
- Navigation, back, reports and War Room exercised in a real browser; mobile viewport checked.
- No regression against existing R11 and canonical Atlas tests.
- Legacy Alpha19 removed from active route **only after** Atlas replacement works and rollback exists.
Current blocker: R11 full app is only a local/Library HTML candidate; GitHub has Atlas sources and an isolated adapter, not a validated runnable integrated app. Previous browser claims need reproducible test logs; do not count as milestone evidence.

## M2 — INTELLIGENCE ENGINE (PLANNED)
Deliver integrated permitted Outpost/KvK/comparison/report flows from verified feature register, with source provenance, access controls and explicit stale/offline states.
Exit: functional end-to-end flows, data provenance, negative access tests and regression evidence.

## M3 — SECURE COMMAND (PLANNED)
Deliver verified email signup → pending approval → approved access, roles/RLS, owner-independent GOD MODE protection and PYLON IX server-side authorization.
Exit: isolated real database tests including negative privileges, audited recovery and permissions, approved security review. Draft SQL/policy model alone do not count.

## M4 — RELEASE CANDIDATE (PLANNED)
Integrated Android-ready app, frozen artwork, accessibility, DE/EN/FR coverage, backups and restore evidence, device and regression tests.
Exit: reproducible RC build, device-test matrix, documented defects resolved.

## M5 — FIRST STRIKE 1.0 (PLANNED)
Explicit owner approval, controlled release, monitoring and rollback.
Exit: production evidence, only after approval. No auto-deploy, main merge, permission changes or new costs.

## Immediate M1 work order
1. Build a single reproducible R11+Atlas artifact (no new wrapper); preserve R11 original as rollback.
2. Make the existing provider interface work in Atlas context with authorized source, without fake data.
3. Run existing Atlas tests and browser flows with captured evidence; change strategy after two failed attempts.
4. Only then mark M1 complete and advance.

Source of truth: governance START-HERE; PHX-A040/A041; PHX-OUT-024 CORE V2 manifest; latest applicable design FREEZEs. Conflicts must be recorded rather than silently resolved.
