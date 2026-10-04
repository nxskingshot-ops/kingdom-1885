# Nexus App — Supabase backup & restore procedure

## Scope

GitHub backups protect source code. They do **not** protect Supabase application data.

On 04.10.2026 a private in-database rollback snapshot was created in schema `nexus_backup`. The schema is not exposed to `anon` or `authenticated` clients.

### Snapshot set

Prefix: `nexus_backup.snapshot_20261004_`

Captured tables:
- `public_outposts`
- `outpost_ownership_history`
- `kvk_snapshots`
- `kvk_player_changes`
- `kvk_roster_history`
- `transfer_candidates`
- `mystic_trial_observations`
- `mystic_trial_power_references`
- `mystic_trial_categories`
- `nexus_access_requests`
- `nxs_memberships`
- `app_profiles`
- `kvk_sync_status`
- `nxs_guest_access_config`

The row-count manifest is stored in `nexus_backup.snapshot_20261004_manifest`.

This snapshot is a **rollback checkpoint inside the same Supabase project**. It is useful for accidental data changes but is not a substitute for a provider-level/off-project disaster-recovery backup.

## Restore rule

Never restore a whole table blindly while the app is live.

1. Identify the affected table and exact records.
2. Compare current rows to the dated snapshot.
3. Back up the current rows before any restore.
4. Restore only the confirmed records in a transaction.
5. Verify row counts, constraints, RLS behavior and app output.
6. Record the action in the go-live/audit notes.

Example pattern (illustrative only):

```sql
begin;

-- Compare first.
select * from public.public_outposts where id = <confirmed_id>;
select * from nexus_backup.snapshot_20261004_public_outposts where id = <confirmed_id>;

-- Restore only after human verification.
-- update public.public_outposts p
-- set ...
-- from nexus_backup.snapshot_20261004_public_outposts b
-- where p.id = b.id and p.id = <confirmed_id>;

rollback; -- replace with COMMIT only after verification
```

## Verification recorded 04.10.2026

The snapshot manifest was queried after creation and contains row counts for all 14 captured application tables.

## Still required before final production sign-off

- Confirm the Supabase project's provider-level backup/PITR availability in the Supabase dashboard for the active plan.
- If provider-level backup is unavailable, establish a separate off-project logical export schedule.
- Test a restore procedure on a non-production copy before relying on it for disaster recovery.

Do not store service-role keys, webhook secrets or user passwords in GitHub.
