# PHALANX recovery gap audit — 2026-10-18

Scope: isolated branch `alpha/android-integrated-freeze-20261017`; read-only checks of GitHub and Supabase. This report does not certify recovery.

## Verified observations
- Git tree at commit `80a2ff240ac2f1e3b92ac416a5f2df278f7ce0f8`: 538 entries, not truncated.
- `data/phalanx-edge-functions-live-20261018.json` inventories 26 ACTIVE functions and provider-supplied hashes; `source_parity` and `restore_status` explicitly `NOT_VERIFIED`.
- `docs/PHALANX-EDGE-SOURCE-SECURITY-SCAN-20261018.md` reports 26 individual source retrievals and limited token-pattern checks. It explicitly says no independent source archive exists and that no full secret scan was done.
- `.github/workflows/phalanx-edge-functions-backup.yml` exists. It requires `SUPABASE_ACCESS_TOKEN`, downloads deployed functions, then commits source into `recovery/supabase/functions` and pushes. That directory is absent from the inspected alpha tree. Do not run this workflow without confirming private-repository access controls and conducting a broader secret review.
- `.github/workflows/phalanx-db-restore-validation.yml` downloads a specific encrypted B2 object, checks SHA-256, decrypts and parses the PostgreSQL dump. It **does not restore into a database**, so passing would not demonstrate a full recovery.
- GitHub Actions on alpha: canonical integrity, feature inventory and RC5 OUT024 isolation all succeeded for commit `80a2ff2` (run IDs 39151084137, 39151084103, 39151084161). OUT024 no-deploy package succeeded for `f934fed` (run ID 39150898554). These do not establish database recovery.
- Historical archive deep audit: `docs/PHALANX-ARCHIVE-DEEP-AUDIT-20261018.md` verifies six ZIP CRC checks and some embedded checksums; it explicitly does not claim cold restore.

## Recovery acceptance criteria (not yet passed)
1. Export all 26 deployed function sources and relevant configuration to restricted independent storage; count, names, version and checksums reconciled with the live inventory. Scan for credentials before storage; never publish credentials or private user data.
2. Verify encrypted independent database backup object exists, is recent enough, decrypts and passes checksum/archive validation. Verify recovery of auth, storage, RLS and extensions separately.
3. Restore to a disposable isolated target **without any production writes** and verify schema, row counts, migration state, access/RLS, outpost history and sample application queries.
4. Demonstrate a clean checkout and isolated Android/PWA smoke test against non-production services with the approved FREEZEs intact.
5. Record dated commands/logs/artifact hashes and independently inspect them. Do not label any unexecuted step PASS.

## Constraints
No main, no production writes/deploy, no paid infrastructure, no FREEZE changes. Existing workflow presence is not execution evidence. The previous ServerError remains undiagnosed.
