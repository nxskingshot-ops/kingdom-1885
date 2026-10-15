# PHALANX Edge backup: reuse existing private B2 encryption pattern

Read-only inspection of existing database backup workflow on 2026-10-15.

## Existing working pattern
The database backup workflow uses:
- `BACKUP_PASSPHRASE` GitHub secret, OpenSSL AES-256-CBC with PBKDF2 and 200,000 iterations.
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` GitHub secrets to access private B2 S3-compatible endpoint.
- B2 bucket `nexus-phalanx-backup` with object upload and checksum sidecar.
- Remote download byte comparison and local decrypt validation.
- Retention cleanup for PostgreSQL daily backup prefix.

## Proposed Edge backup
Reuse the existing reviewed private B2 destination and secret configuration rather than create a second storage account. Use a separate `edge-functions/` prefix, encrypt source archives before upload, verify remote bytes and decrypt locally, and implement independent retention with a separate prefix. Do not copy source into git commits or Actions artifacts. Do not log source content, keys or secret values.

**Do not enable yet.** Confirm the required Supabase access-token permission and whether its token scope can be narrowed. Ensure that the chosen encryption method, restore test, retention and complete function count have been reviewed. Existing database backup method is operational, but not necessarily ideal modern authenticated encryption for new workflows; consider AEAD before production adoption.

## Limits
No B2 credentials or source contents inspected or reproduced. No change to existing workflow, bucket or secrets. No assertion of complete disaster recovery.
