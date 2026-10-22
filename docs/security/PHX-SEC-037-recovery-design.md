# PHX-SEC-037: Edge Function recovery architecture

Date: 2026-10-19
Status: design only; no archival implementation or live execution.

## Objective
Preserve exact deployed Edge Function source and metadata for disaster recovery without exposing embedded credentials or changing production.

## Separation of duties
1. Retrieval job: read-only repository permissions, ephemeral private workspace, no source upload to GitHub artifacts, no git commit or push.
2. Validation job: inventory every active function, scan source using a pinned maintained secret scanner; treat scanner errors, incomplete downloads and ambiguous results as failure.
3. Encryption: create a single encrypted archive locally with a separately managed recovery key; never print plaintext or include key material in logs.
4. Offsite storage: use an existing private encrypted backup bucket only after permissions, capacity and cost are verified. Avoid granting public read permissions.
5. Manifest: record backup timestamp, archive SHA-256, function slug, deployed version and deployment bundle digest. Do not equate deployment bundle digest with a source-file digest.
6. Recovery test: verify download, checksum, decryption and archive completeness in an isolated network-disabled workspace; do not deploy or restore to production.
7. Promotion: a source snapshot may enter Git only after independent review, sanitization and explicit authorization. Prefer keeping raw sources solely in encrypted restricted backup storage.

## Synthetic regression gates
- Known fake credentials are detected and block archival.
- PEM key fixture is blocked.
- Harmless environment-variable references do not trigger disclosure.
- Missing function, empty archive or scanner unavailable fails closed.
- No logs include source contents, secret values or raw scanner matches.
- The manifest covers all live function slugs and versions.
- Encryption and decryption round-trip works with disposable test-only keys.

## Current constraints
The isolated branch currently has a fail-closed workflow safety hold. The original main-branch workflow still exists and is not automatically protected by this branch change. Do not run it until reviewed. No GitHub Actions execution has been verified for this design. No complete disaster-recovery proof exists.

## Release gates
Implementation, synthetic tests, read-only archive verification, security review, cost review and explicit merge authorization are separate required steps.
