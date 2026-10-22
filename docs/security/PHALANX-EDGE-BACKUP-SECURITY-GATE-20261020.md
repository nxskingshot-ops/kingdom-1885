# PHALANX Edge Backup Security Gate — 2026-10-20

Status: AUDITED / NOT RELEASED. Read-only review of live Supabase and GitHub main. No workflow executed.

## Confirmed
- Supabase project kingdom-1885-app: 26 ACTIVE Edge Functions.
- data/phalanx-edge-functions-backup-inventory.json lists 26 deployed slugs, versions and provider bundle hashes; source_parity and restore_status are NOT_VERIFIED.
- .github/workflows/phalanx-edge-functions-backup.yml is manual (workflow_dispatch) but grants contents:write, downloads deployed code, then commits and pushes to the repository.
- The workflow checks only the string PRIVATE KEY-----, not general credentials or embedded secrets.
- The repository's documented approved backup architecture requires encrypted private offsite storage and forbids unprotected secrets.

## Release-blocking issues
1. Do not execute the existing workflow: source may include embedded credentials, and its push is automatic.
2. Avoid direct commits of downloaded deployed source before comprehensive secret scanning and human review.
3. Ensure encrypted archives are produced before any remote transfer; never upload plaintext dumps or secrets to GitHub.
4. Preserve exact source bytes, manifest, function versions, JWT configuration, dependency/import files, SHA-256 for every archived file; provider ezbr_sha256 is a bundle digest and is not automatically comparable to an individual source file digest.
5. Prove all 26 deployed function slugs are included, test decryption and isolated recovery, then record evidence.
6. Keep production untouched. No deploy, merge, credential rotation, paid resources or production restore without separate authorization.

## Recommended isolated implementation
- Replace repository-push behavior with a manual-only export into a local temporary directory.
- Inventory expected 26 slugs from Supabase at execution time, fail closed on missing/extra files.
- Run credential detection with multiple patterns and a dedicated secret scanner; block export on findings.
- Encrypt using the approved private offsite destination and a securely managed key, then upload with least-privilege credentials.
- Independently download, decrypt, validate manifest and source hashes in an isolated environment.
- Require review and explicit approval before enabling any recurring job.

## Evidence limitations
This audit does not prove that an archive was newly created, encrypted, uploaded, or restored on 2026-10-20. Prior 2026-10-14 database-backup records are historical evidence, not a fresh snapshot.
