# PHALANX backup release gate — 2026-10-16

Status: **BLOCKED for production release** until an independently stored, restorable database backup is verified.

## Verified
- Code snapshot: `backup/phalanx-isolated-20261016-2bf23e44` points to commit `2bf23e44ef22c848d98193da8057a644098db275` (same repository, not an independent offsite copy).
- Supabase project: `kingdom-1885-app`, ref `hcjrdofkdkasznywvcxo`, eu-central-1, ACTIVE_HEALTHY when inspected.
- Database inventory: 23 public base tables, RLS enabled on all 23; 23 policies total, with several tables having no individual policies. This is inventory, not an RLS security certification.
- Supabase dashboard Free plan explicitly reports no scheduled project backups.
- GitHub Actions isolated preflight run #87 for `2bf23e44` concluded success; not an authentication, restoration, or mobile UI certification.

## Not completed
- [ ] Full PostgreSQL logical dump of schema AND data, including required non-public schemas and roles/auth considerations as applicable.
- [ ] Encrypted independent/offsite copy, protected from public repository access.
- [ ] Checksum and backup creation timestamp recorded.
- [ ] Restore in a disposable, isolated target; verify table counts and app-critical reads, without touching production.
- [ ] Record tested restore procedure, time, and operator.
- [ ] Separate repository export outside GitHub for repository-loss recovery.
- [ ] Auth/RLS audit for test pages that still point to production Supabase.

## Safe procedure for laptop session
1. Confirm trusted machine, PostgreSQL tools, available disk space, and a secure private destination. Never paste a database password into chat, source files, screenshots, or a public repository.
2. Use the Supabase dashboard's current connection guidance and official backup documentation to select the supported `pg_dump` method; do not guess connection strings or expose credentials.
3. Export with appropriate options for the project's PostgreSQL version, then verify the resulting file is nonempty and readable with `pg_restore --list` when custom format is used.
4. Store encrypted, separately from the production project and GitHub, and verify a checksum.
5. Restore to a **disposable isolated database**, compare schema/table contents, and document outcome. Never run a restore against production.
6. Only mark the release gate PASS after an actual restore test.

## Safety boundaries
- No schema changes, SQL writes, secret changes, production deployment, or GitHub main merge authorized by this document.
- Do not export user records through chat or public GitHub as a workaround for a database dump.
- Zero-cost preference: no Supabase paid upgrade without explicit user approval.
