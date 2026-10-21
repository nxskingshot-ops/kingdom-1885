# PHX Integration source gate — 2026-10-21

Status: SOURCE VERIFIED / INTEGRATION BLOCKED. No production changes.

## Verified
- Canonical Outpost Map 2.0 Alpha24 original: 1,105,961 bytes, SHA256 `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`. Raw bytes retrieved from project Library and checksum matches `data/outpost-map-alpha24-canonical-lock-20261018.json`.
- Embedded document title Alpha19 is explicitly recognized in canonical lock as a historical internal title; do not reject/replace the Alpha24 source because of this.
- HOME screenshot crop exists locally as 1260 × 1940 reference, not canonical art or functioning UI.
- 20 Oct HOME direct bridge is listed in Library, but raw byte materialization was denied; structure and navigation remain unverified.

## Next integration gate
- Retrieve authorized latest HOME bridge source and verify provenance; inspect exact Epic Navigation targets and current Reports source. Do not substitute historical preview versions.
- Then wire HOME → Territory Control → Outpost Map / Reports in one isolated integration, keeping original Outpost HTML immutable and dynamic HOME controls separate from image.
- No main merge, deployment, production changes, or costs.
