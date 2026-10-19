# PHALANX OUT-024 → Reports: source-of-truth gate (2026-10-19)

## Verified in repository
- Canonical module lock: `data/outpost-map-alpha24-canonical-lock-20261018.json`
- Canonical id: `PHX-OUT-024-MAP2-FROZEN-20261018`
- Frozen preview: `preview/PHX-OUT-024-MAP2-FROZEN-20261018.html`
- Original SHA-256: `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`
- Display version: Alpha 24 (internal historical title Alpha 19 is NOT a current-version indicator).
- Full functional acceptance is explicitly FALSE in the canonical lock.
- RC5 currently links `Reports & History` to legacy `outpost-report-v11.html`; only the isolated wrapper intercepts this link.
- Isolated reports prototype takes manually supplied JSON; it is NOT connected to map state.

## Stop conditions for automatic integration
1. Do not read, scrape, or mutate the frozen HTML as an integration contract.
2. Do not assume that DOM text, internal embedded JSON, or legacy V11 scripts are authoritative.
3. Require a documented, versioned, read-only export interface from the canonical OUT-024 module, with schema and sample fixtures.
4. Confirm identity and SHA-256 of the original against the lock before accepting any export adapter.
5. Keep user data local; no Supabase, network transport, new paid infrastructure, or production changes.
6. Validate outpost ID uniqueness, coordinates/quadrants, alliance identifiers, input limits, and report provenance; fail closed.
7. Preserve original map, RC5, FREEZEs, and backups byte-for-byte. Implement bridge only in a separate integration layer.
8. Run both contract and runtime tests, then verify Android navigation and data parity before release acceptance.

## Current outcome
Automatic data transfer remains BLOCKED pending a verified export contract and a testable copy of the canonical module. The existing local Reports adapter is only a manual-import prototype.

## Test execution
`python3 tests/alpha/test_reports_out024_local_adapter.py`
`python3 tests/alpha/test_reports_out024_route_contract.py`
`node tests/alpha/test_reports_out024_runtime.cjs`

These commands are instructions, not evidence of successful GitHub CI execution.
