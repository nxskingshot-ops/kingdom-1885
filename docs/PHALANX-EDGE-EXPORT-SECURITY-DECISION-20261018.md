# PHALANX — Edge Export security gate (2026-10-18)

## Newly confirmed
GitHub repository `nxskingshot-ops/kingdom-1885` has **PUBLIC** visibility. The existing `phalanx-edge-functions-backup.yml` downloads deployed source and commits it into this repository. **Do not dispatch it**: source code would become public and the scan only detects a private-key header.

The new `phalanx-edge-functions-secure-export-20261018.yml` is manual-dispatch only, uses `contents: read`, and produces a 1-day artifact rather than committing source. **Do not dispatch it yet either**: GitHub Actions artifacts on a public repository are not an appropriate independent confidential source archive. Its limited regex scan cannot establish that source contains no credentials or proprietary content.

## Required safer approach
1. Choose access-controlled private storage with verified encryption at rest, separated from the public repository, and prove authorized access.
2. Download the 26 functions using a credential scoped for that purpose without printing source or tokens to logs.
3. Verify exact slug set against the live 26-function inventory, file hashes and complete source tree, not only count.
4. Perform a broader secret review; handle any exposed credential through revocation/rotation, not by publishing it.
5. Encrypt the complete export before transfer; verify stored object hash and restore its contents in an isolated environment.
6. Never copy unencrypted function sources, credentials, user data or secret-bearing archives into this public repository or public CI artifacts.
7. Confirm independent DB backup and actual isolated database restore separately.

## Execution state
The existing and new export workflows were **not executed** in this audit. This is a security hold, not an export PASS. No main/production/FREEZE modifications.
