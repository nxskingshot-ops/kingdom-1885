# PHX-SEC-037: existing backup integration assessment

Date: 2026-10-19
Status: read-only GitHub workflow inspection; no live storage calls.

## Existing implementation
- .github/workflows/phalanx-db-backup.yml uses Backblaze B2 endpoint eu-central-003 and the existing nexus-phalanx-backup bucket.
- The database workflow encrypts with OpenSSL AES-256-CBC and PBKDF2, validates local decrypt roundtrip and downloads remote ciphertext for byte comparison.
- The read-only archive-inventory workflow downloads only the existing database archive and checks its SHA-256. It does not verify Edge Function source backup.
- The database backup passphrase is configured via GitHub secret. Its value, key rotation and independent recovery availability were not inspected.

## Safe reuse constraints
- Reuse the already configured private B2 destination only after confirming that an Edge Function prefix is allowed under current permissions and storage budget.
- Do not reuse the database passphrase by default; establish an independently recoverable Edge Function encryption key.
- Do not copy the database AES-CBC encryption format into the Edge Function proof of concept: the synthetic fixture uses authenticated AES-256-GCM. Interoperability is not established.
- Never commit raw downloaded sources, decrypted archives, secret scan output or encryption keys.
- Do not run the legacy main-branch Edge Function backup workflow; it can push downloaded sources to the repository.
- Existing workflows use remote services and could incur resource usage. No remote test was performed here.

## Status
The CI run 39318317428 passed. No private B2 upload, remote readback, production-source retrieval or disaster-recovery test has been completed for Edge Functions.
