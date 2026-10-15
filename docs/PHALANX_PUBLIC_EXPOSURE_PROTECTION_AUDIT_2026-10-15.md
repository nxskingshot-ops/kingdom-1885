# NEXUS PHALANX — Public Exposure / IP Protection Audit (read-only)

Date: 2026-10-15. Scope: GitHub repository metadata and main branch file-tree only. No contents inspected for secrets; no deployment or visibility changes.

## Verified findings
- Repository `nxskingshot-ops/kingdom-1885`: GitHub API reports `private=false`, `visibility=public`, `has_pages=true`, default branch `main`.
- Recursive `main` tree: 442 files (non-truncated): `preview/` 254; `data/` 64; `docs/` 42; `.github/` 15; `tests/` 15; `src/` 9; `backups/` 8; `integration/` 8; remaining paths 27.
- Public tree includes descriptive research and algorithm-related filenames (e.g. `data/phalanx-combat-formulas-v1-2026-10-12.json`, `data/phalanx-robust-optimizer-policy-v1-2026-10-12.json`), HTML previews, freeze backups, and workflows.
- This is exposure of file paths and potentially repository contents, **not proof of copying, credential leakage, or published production secrets**. GitHub Pages publication source and public URLs not yet verified.

## Immediate no-change policy
1. Do not add new proprietary models, unreleased roadmaps, internal research or private datasets to this public repo.
2. Never commit tokens, service role keys, credentials, account identifiers or private records. Do not print sensitive values into audit logs.
3. Do not rename/remove files, force-push, change visibility or disable Pages without impact analysis, full backup, and explicit approval.
4. Preserve transparency of user-facing outcomes: inputs, relevant assumptions, evidence, calculation rationale, uncertainty, comparison results and limits.

## Required before changing visibility
- Verify GitHub Pages source/hosting and deployed URLs, current authentication, deployment and PWA update chain.
- Classify each path: (A) public UI/necessary client assets; (B) public explanatory evidence; (C) proprietary research/source and unpublished features; (D) private or sensitive data; (E) potential secrets requiring immediate remediation.
- Audit content safely for actual secrets without exposing values; rotate any confirmed leaked credentials.
- Create an independent, access-controlled backup including history; validate restore. Consider historical clones/caches cannot be retracted.
- Design a **private development repo** and minimal public distribution (or alternative hosting) with a verified deployment path. GitHub Pages availability on private repositories depends on plan/settings; do not assume existing public URLs survive a visibility switch.
- Decide which computations must remain server-side vs locally executable under zero-budget target; avoid claiming server-only confidentiality for browser-shipped code.
- Obtain user approval for concrete migration and release steps.

## Result transparency boundary
**Beweise das Ergebnis. Schütze die Entwicklung.** Publish enough to independently understand and challenge each result; do not publish full proprietary implementation or research merely for marketing.

## Status
Inventory/metadata checked. Full content/secret scan, Pages verification, backup, architecture migration and privacy changes: NOT DONE.
