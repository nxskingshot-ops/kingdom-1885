# PHALANX DB cold-restore execution gate — 2026-10-18

## Read-only review of existing workflows
- `.github/workflows/phalanx-db-backup.yml`: daily 02:17 UTC; encrypted PostgreSQL custom dump uploaded to B2 `postgres/daily/`; remote byte comparison; 35-day pruning. **Existence of the YAML is not proof of a successful backup run or that the B2 bucket currently contains recoverable data.** The pruning step performs remote deletions, so do not dispatch this workflow for validation.
- `.github/workflows/phalanx-db-backup-manual.yml`: writes a new B2 object. Not a restore test.
- `.github/workflows/phalanx-db-restore-validation.yml`: downloads the 2026-10-14 encrypted B2 object, verifies stored checksum, decrypts and runs `pg_restore --list`. **It never runs `pg_restore --dbname`**, so it cannot establish schema/data/RLS restore success.
- All three workflows use `contents: read`. Their database connection details and secrets are stored in GitHub Actions configuration; values were not retrieved in this audit.

## Isolated cold restore acceptance criteria
1. Verify recent B2 object availability and immutable checksum from an authorized read-only listing.
2. Download the encrypted object into temporary protected storage; decrypt without echoing passphrase; verify archive list.
3. Restore into a disposable local PostgreSQL instance with no network route to Supabase production; record PostgreSQL and extension versions.
4. Verify representative table counts, migrations, functions, RLS policies, grants and application read queries. Identify objects excluded by pg_dump and all restore errors.
5. Securely discard local plaintext and disposable database; retain sanitized command log, source-object key, hash and timestamp.
6. Test application entrypoints independently with synthetic data, never production secrets.
7. Validate Auth configuration, Storage objects, Edge source, Cloudflare config and original FREEZE assets separately; none is guaranteed by a PostgreSQL dump.

## Stop conditions
Do not create paid Supabase branches, write to production, dispatch pruning or publicly upload decrypted dumps. If isolated PostgreSQL version/extension compatibility is unknown, halt before restoration rather than guess. Mark the overall recovery `NOT_VERIFIED` until all evidence is collected.
