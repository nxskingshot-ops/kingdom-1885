# PHALANX — Supabase Restore Readiness, 2026-10-14

## Verification status
Read-only Supabase inspection completed. Project kingdom-1885-app, region eu-central-1, healthy at inspection. Public schema contains 37 named relations including views. pg_stat_user_tables exposed 23 physical tables with statistics. Migration history contains 54 entries (count must be rechecked before relying on this count). Edge Functions inventory: 25 ACTIVE, recorded separately in docs/PHALANX-SUPABASE-BACKUP-READINESS-20261014.json.

## Existing data categories requiring protected backup
- Player and access data: app_profiles, nxs_memberships, nexus_access_requests, nxs_guest_access_config.
- KvK: kvk_player_changes, kvk_roster_history, kvk_snapshots, kvk_sync_status.
- Outposts: public_outposts, public_outposts_verified_20261002, public_outposts_backup_20261002, outpost_ownership_history.
- PHALANX: phalanx_alliance_players, phalanx_alliance_snapshots, phalanx_mightpulse_poll_runs, phalanx_mightpulse_rank_snapshots.
- Mystic Trial: observations and power references, plus derived views.
- Other: nxs_audit_log, battle readiness, transfer candidates.
Note: relation names and estimated rows are not a data export. Row estimates may be stale.

## What is NOT yet verified
1. Supabase provider backup entitlement, backup schedule, retention and most recent successful snapshot.
2. Ability to download a complete encrypted database dump including schema, data, roles, extensions, RLS and auth-related objects.
3. Storage buckets/objects and authentication accounts if relevant.
4. Edge Function source archive and secure environment-secret recovery process.
5. Tested restore into a disposable isolated project with data-integrity and permission checks.
6. GitHub Actions backup job's actual successful execution.

## Recovery procedure (plan only; NOT executed)
1. Check Supabase Dashboard > Database > Backups for availability, last success, retention and PITR.
2. With authorized credentials, export encrypted full database dump to PRIVATE access-controlled offsite storage. Never commit actual user data or secrets to GitHub.
3. Archive function source and configuration in restricted storage; document secret names but not values in GitHub.
4. Restore to a disposable project; verify table counts, migration state, functions, auth/RLS, outpost history and ranking snapshots.
5. Record a restore-test date and hash. Never test restore on production.

## Constraints
No production schema changes, no writes to user tables, no new credentials requested or exposed, no backup success claimed.
