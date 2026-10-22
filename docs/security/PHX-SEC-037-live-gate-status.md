# PHX-SEC-037 – Controlled live backup gate

Date: 2026-10-19
Authorization: controlled encrypted backup of the existing 26 Edge Functions to existing private storage, without added costs, permission changes, deployment, merge or production restore.

## Verified
- Read-only Supabase source retrieval: 26/26 active functions; one nonempty file each, matching version and bundle digest.
- GitHub Actions run 39319647574: synthetic archive -> AES-256-GCM encryption -> simulated storage readback -> authenticated decryption -> exact archive verification PASS.
- Database backup workflow demonstrates an existing B2 integration for PostgreSQL only.
- Main-branch Edge Function workflow remains unsafe to execute because it can push sources into Git.

## Not verified / not authorized to assume
- A reviewed executable runner for private live Edge Function backups (not implemented).
- Whether existing B2 key grants scoped write/read to edge-functions/encrypted/.
- Whether B2 usage remains inside the zero-additional-cost constraint.
- Independently recoverable Edge Function encryption key and documented custody.
- Pinned maintained secret scanner integrated into live retrieval.
- Actual B2 encrypted upload, remote readback and isolated decrypt of 26 real functions.

## Decision
Do not execute main workflow or copy raw source into GitHub, logs, artifacts or shared storage.
Do not claim backup complete. Current authorization is sufficient for safe implementation, but not for bypassing unresolved security or cost conditions.
Next change must be one reviewed live workflow, not more synthetic fixtures. Verify storage and key prerequisites before triggering.
