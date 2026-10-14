# PHALANX backup coverage inventory — 2026-10-14

## Verified today
- Supabase project: kingdom-1885-app (hcjrdofkdkasznywvcxo), ACTIVE_HEALTHY, eu-central-1.
- PostgreSQL database backup: encrypted, uploaded to private Backblaze B2, remote copy verified.
- Read-only restore validation: successful.
- Automatic daily workflow: tested successfully.
- GitHub repository/history remains the source for application code and repository documentation.

## Database content covered by pg_dump
The database currently contains PHALANX application tables including profiles/memberships, outposts and ownership history, KvK snapshots/history/change tracking, access requests, battle-readiness data, Mystic Trial private data, alliance snapshots/player history, and MightPulse polling/ranking snapshots.

Auth schema currently contains 5 users/identities. These database records are in the database dump, but a full Supabase Auth service recovery can also depend on project-level Auth configuration that is not represented by ordinary application tables.

## Supabase Storage
Checked live on 2026-10-14:
- storage.buckets: 0 rows
- storage.objects: 0 rows
Therefore there are currently no Supabase Storage object files requiring a separate object-backup job. Re-check this if Storage is introduced later.

## Edge Functions — live deployment inventory
24 ACTIVE functions were found:
kvk-sync v4; outpost-sync v4; outpost-editor v6; nxs-guest-setup v5; nexus-feedback v3; nexus-true-power v6; nexus-access-review v6; verified-outpost-sync v3; mightpulse-ranking-test v2; mightpulse-ranking-audit v3; mightpulse-ranking-identity-audit v2; mightpulse-board-coverage-audit v2; mightpulse-coverage-round2-fixed v2; mightpulse-freshness-quality-audit v2; mightpulse-quality-batch-audit v2; mightpulse-quality-batch-4-7 v2; mightpulse-quality-overview-16 v5; mightpulse-alliance-schema-diagnostic v2; mightpulse-kills-diagnostic v3; phalanx-mightpulse-poll v7; phalanx-mightpulse-status v4; phalanx-mightpulse-scheduled v2; phalanx-mightpulse-value-diff-test v2; phalanx-kingdom-1913-scout-test v2; phalanx-kingdom-scout-report-test v3.

Note: this list is a live deployment inventory, not proof that every deployed source revision is already represented in GitHub. That source parity should be audited separately before claiming complete disaster recovery.

## Database migrations / extensions
53 project migrations were reported through 2026-10-14.
Installed non-core extensions observed include pg_cron, supabase_vault, pg_stat_statements, uuid-ossp, pgcrypto, pg_net and PL/pgSQL. A database dump protects database objects/data, but disaster-recovery documentation should retain the expected extension/configuration inventory too.

## Not safely recoverable from the database dump alone
These require explicit inventory or recreation instructions and MUST NOT be committed as plaintext:
- Supabase Edge Function secret values (e.g. external API credentials).
- GitHub Actions secret values.
- Backblaze application-key secret.
- Database password.
- Backup encryption passphrase.
- Supabase dashboard/project-level Auth settings and provider configuration.
- Any future Storage object bytes.

## Current recovery layers
1. GitHub: source code, workflows, history, documentation.
2. Backblaze B2: encrypted PostgreSQL backup + checksum.
3. GitHub repository secrets: runtime credentials for automated workflows (values intentionally unreadable after creation).
4. Supabase live project: Edge Function deployments and project-level configuration.

## Remaining gap / next action
Highest-priority remaining task: verify that every live Edge Function's current source/version is durably represented in GitHub, without exporting any secret values. Then write a recovery runbook covering a clean Supabase rebuild and secret re-entry checklist.
