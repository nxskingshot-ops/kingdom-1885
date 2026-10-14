# Supabase performance advisors – 2026-10-14

Read-only scan of project `hcjrdofkdkasznywvcxo`. **No database changes authorized or performed.**

## INFO: 15 tables without primary keys
- `public.public_outposts_backup_20261002`
- 14 `nexus_backup.snapshot_20261004_*` tables, covering outposts, ownership, KvK, transfers, mystic trials, access, memberships, profiles and guest configuration.

These appear to be backup/snapshot structures based on names, not proven operational tables. Adding primary keys could affect exact-copy restore semantics. Review before changing anything.

[Supabase guidance](https://supabase.com/docs/guides/database/database-linter?lint=0004_no_primary_key)

## INFO: 5 unused indexes
- `public.nexus_access_requests.nexus_access_requests_status_idx`
- `public.nxs_guest_access_config.nxs_guest_access_config_guest_user_id_idx`
- `public.nxs_guest_access_config.nxs_guest_access_config_created_by_idx`
- `public.nxs_memberships.nxs_memberships_granted_by_idx`
- `public.phalanx_alliance_players.phalanx_players_id_history_idx`

Index usage statistics may be reset or incomplete; do not infer an index is unnecessary solely from this advisory.

[Supabase guidance](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index)

## Recommended next steps
1. Prioritize the outstanding security policy and restore coverage work over low-severity performance suggestions.
2. Before any index removal, review query plans, workload, maintenance needs, and index usage over a representative period.
3. Keep backup snapshot tables unchanged until their restore procedures and constraints are validated.
