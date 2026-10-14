# PHALANX — Supabase Free Plan Backup Decision | 2026-10-14

## Confirmed
- User screenshot from Supabase Dashboard > Database Backups explicitly states: Free Plan does not include project backups; Pro Plan offers up to 7 days of scheduled backups.
- Therefore provider-managed scheduled database backups are unavailable on the current Free plan.
- Existing GitHub daily backup workflow protects Git repository revisions, not Supabase PostgreSQL data, auth data, secrets, or Storage objects.

## Safe free backup design (proposal, not activated)
1. Use an isolated scheduled GitHub Actions workflow or another trusted runner with a restricted database connection stored exclusively as encrypted Actions secrets.
2. Run pg_dump in PostgreSQL custom format using compatible client version; include application schema/data and separately document roles, auth/storage coverage and extensions.
3. Encrypt the backup before upload; keep encryption passphrase/key separately from backup storage, in private secrets.
4. Upload to a private storage destination with retention and restricted access; NEVER publish database dumps in the repository or as public artifacts.
5. Verify file hashes, scheduled success/failure notifications and restore a sample into a disposable isolated PostgreSQL instance.
6. Define retention and periodic recovery drills; test restoring RLS policies, migrations and user data without touching production.

## Blockers
- Destination for encrypted backup and its retention/access policy have not been selected.
- Runner-to-database network connectivity and appropriate least-privilege export credentials have not been verified.
- No encrypted database export or successful restore has yet occurred.
- Backup of Edge Functions, Auth/Storage, and secrets must be handled separately.

## Safety and freeze
- No production schema/data changes.
- No changes to index.html or Alpha35.
- No secrets stored in GitHub source.
- This document is a recovery plan, NOT proof of a working backup.