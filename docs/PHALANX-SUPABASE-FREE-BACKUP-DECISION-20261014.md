# PHALANX — Supabase Backup Decision 2026-10-14

## Confirmed by dashboard screenshot
Project kingdom-1885-app is on Supabase Free. Database Backups > Scheduled backups displays: "Free Plan does not include project backups. Upgrade to the Pro Plan for up to 7 days of scheduled backups."

## Decision
Do not upgrade merely for this purpose without user approval. Plan a private, encrypted database export with independent restore test. This is NOT yet an executed backup.

## Non-negotiable safety
- No database rows, passwords, service-role keys, tokens or other secrets in the GitHub repository.
- Never overwrite or restore the production database to test.
- GitHub daily tag backup protects source versioning, not Supabase database contents.
- Use dedicated least-privilege backup credentials where possible and encrypted offsite destination.
- Include schema, rows, RLS, functions, storage objects, auth, extensions, and migration metadata in the recovery scope, acknowledging each requires different mechanisms.
- Verify the export can be restored into an isolated environment before calling it a reliable backup.

## Next steps
1. Select a secure private backup destination and execution environment (GitHub Actions encrypted secrets and private artifact or external encrypted storage; avoid public Actions logs/artifacts).
2. Confirm database connection method and permissions without sharing credentials in chat.
3. Design a least-privilege pg_dump pipeline with encryption, retention, integrity hash, failure notifications.
4. Run a manual backup and isolated restore test after explicit user approval.
5. Only then schedule periodic backup and monitor successes.
