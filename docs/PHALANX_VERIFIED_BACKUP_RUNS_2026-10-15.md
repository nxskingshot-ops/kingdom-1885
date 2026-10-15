# PHALANX backup execution evidence — 2026-10-15

Read-only GitHub Actions inspection. No workflows rerun; no secrets, data or production changes.

## Verified workflow executions
- Database backup run **38672754852**, 2026-10-15: success. Steps succeeded: create encrypted PostgreSQL dump and local validation; upload to private Backblaze B2 and verify remote copy; prune old backups.
- Database backup run **38540566183**, 2026-10-14: success (run conclusion).
- Read-only restore-validation run **38539296575**, 2026-10-14: success. Steps succeeded: download encrypted backup and checksum; decrypt and validate PostgreSQL archive.
- Edge Function source backup runs **38548628354** and **38546962235**, 2026-10-14: failed.
- For Edge Function run 38548628354, failed step: `Download deployed functions`. Log says access token and project ref pair missing permission `api_gateway_keys_read` (exit code 1). This is historical evidence only; permission may have changed since then.

## Important limitations
- Archive integrity validation is not a full restore into a separate PostgreSQL instance.
- A successful workflow conclusion does not establish completeness of all desired objects or future restorability.
- No newer successful Edge Function backup was observed in the first 100 recent GitHub Actions runs inspected; this is not an exhaustive history query.
- Do not expose token values, connection strings or backup payloads in documentation.

## Next safe steps
1. Read-only check current Supabase token scopes / workflow references and newer Edge backup runs before changing credentials.
2. Plan an isolated database restore rehearsal; never overwrite production.
3. Independently back up Git repository refs and verify restore.
4. Only after all gates, request approval for private-dev/public-distribution migration.
