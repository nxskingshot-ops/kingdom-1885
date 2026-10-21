# PHX-PYLON-FOUNDATION-V1 — PYLON IX capability-first architecture

Date: 2026-10-21
Decision status: PROPOSED / DOCUMENTED. User welcomed the concept and asked to preserve it for immediate and future development. **Not an approved design/security FREEZE; not implemented, tested, or released.**
Depends on approved `PHX-ARCH-FREEZE-20261021-01`: HOME is a connector, modules are independent.

## Mission
PYLON IX should progressively discover, explain, analyze, prepare, and safely execute *actually available* PHALANX capabilities. Build the integration metadata now without requiring paid model services. Never claim a feature works merely because it is documented.

## Architecture
1. **Module Registry**: stable feature ID, module version, route, owner, governing FREEZE, dependencies, active/superseded state, implementation evidence.
2. **Capability Registry**: stable action ID, localized description (DE/EN/FR), input/output JSON schema, data source, permitted operations, error cases, cost class, idempotency, availability evidence, and interface version.
3. **Context/Data Registry**: provenance, source timestamp, retrieval timestamp, kingdom/alliance scope, confidence/verification, retention, sensitivity, history; distinguish observed facts from inferences.
4. **Knowledge Graph**: relationships between kingdoms, alliances, players, outposts, events, reports and time periods; never imply unverified relationships.
5. **Action Gateway**: enforce real server-side authentication/authorization and RLS where applicable; default read-only; explicit confirmation for consequential writes; audit outcomes without secrets; protect GOD MODE as owner-only independent of Kingshot.
6. **Tool Router / Orchestrator**: resolve user intent against active, verified capability contracts; validate arguments; call through gateway; handle failures, unavailable data and partial results honestly. Imported content must never become executable instructions.
7. **Evaluation Suite**: route resolution, schema validation, stale data, denied permissions, malicious content, no-source cases, multilingual intent, regressions and device tests.
8. **PYLON IX UI**: integrated epic PHALANX design, appropriate header rules and language selection; no separate competing navigation.

## Capability availability
Distinguish PLANNED, DOCUMENTED, IMPLEMENTED, TECHNICALLY TESTED, DEVICE TESTED, APPROVED, PRODUCTION. Runtime availability requires both actual deployed implementation and current permission; design or static test alone is not sufficient. Never expose an unavailable action as executable.

## Incremental stages
- PHX-PYL-001 Module Registry — PLANNED
- PHX-PYL-002 Capability Contracts — PLANNED
- PHX-PYL-003 Context/Data Registry — PLANNED
- PHX-PYL-004 Security Gateway — PLANNED
- PHX-PYL-005 Tool Router — PLANNED
- PHX-PYL-006 Evaluation Suite — PLANNED
- PHX-PYL-007 PYLON IX Interface — PLANNED

## Development rule effective as project proposal
Whenever a module is developed, prepare its registry metadata in the same isolated work package: stable IDs, valid entry route, supported inputs, outputs, permissions, provenance, failure states and evidence level. Do not delay ordinary module work or introduce costs solely to build AI features. The approved architectural FREEZE remains authoritative.

## Example future intent
"Show NXS outposts in the north" => resolve active Outpost filter capability, check permitted scope, validate alliance/quadrant, retrieve verified data, show timestamp/source, open correct module route. This is a target behavior, **not current functionality**.

## Acceptance
Schema-valid registry; stale/superseded capabilities rejected; route changes detected; server-side access enforced; no secrets in manifests; missing data disclosed; permission denials safe; no action executed without implementation, authorization and confirmation where required.

## Safeguards
No production changes, main merge, deployment, permission changes, paid AI/model services, or GOD MODE expansion without explicit approval. Existing design FREEZEs and Alpha24 original remain protected.
