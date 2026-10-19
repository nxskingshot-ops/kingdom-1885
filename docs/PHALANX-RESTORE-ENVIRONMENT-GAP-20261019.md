# PHALANX recovery drill — compatibility finding, 2026-10-19

## Confirmed by GitHub Actions screenshots
- Run #1: test PostgreSQL 17 cluster `17/main` absent; test harness failure.
- Run #2: isolated PostgreSQL 17 server and encrypted B2 backup validation succeeded; `pg_restore` failed. Raw SQL logs deliberately private.
- Run #3: archive retrieval, checksum, decryption and listing succeeded; sanitized failure classification `MISSING_EXTENSION`, secondary `SQL_ERROR_OTHER`.
- **Database restore has NOT passed. No complete Supabase recovery claim.**

## Read-only Supabase source inventory (19 October)
`pg_cron` 1.6.4 (`pg_catalog`); `pg_net` 0.20.4 (`extensions`); `pg_stat_statements` 1.11 (`extensions`); `pgcrypto` 1.3 (`extensions`); `plpgsql` 1.0 (`pg_catalog`); `supabase_vault` 0.3.1 (`vault`); `uuid-ossp` 1.1 (`extensions`).

## Decision / next engineering route
**Stop retrying restores into bare PostgreSQL 17 as though it represented Supabase.** The compatible test environment must have the requisite extensions and matching role/schema semantics. First evaluate a disposable Supabase-compatible local stack/image using supported versions, no externally exposed ports, no production DB credentials. Validate that it can boot with required extensions using dummy data *before* downloading/decrypting the real backup. If that cannot be done on existing free infrastructure, do not create chargeable resources.

A public-schema-only partial restore can separately validate portions of application data, but MUST be labelled `PARTIAL_APP_SCHEMA_RESTORE`, never `RESTORE_VERIFIED` for full Supabase. Neither GitHub Actions green status nor `pg_restore --list` alone proves disaster recovery. No logs, secrets, private source or database records belong in the public repository.

Existing recovery workflow `.github/workflows/phalanx-isolated-db-restore-drill.yml` stays manual-only; don't trigger again until the compatibility gate has been established.
