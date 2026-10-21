# GOD MODE — Integration gate checklist V2 (2026-10-21)

## Verified today
- Existing local policy test `/mnt/data/phx_security/test_owner_policy.py` executed with Python; five test groups PASS.
- No local `psql`, `postgres` or `docker` executable found in current runtime.
- Supabase development branches: none (read-only query). Do not create a potentially billable branch under the zero-budget policy.
- These are **model tests only**, not real RLS/Auth/API integration tests.

## Required next executable work
1. Run the existing SQL fixture in a disposable PostgreSQL instance (local Docker/PostgreSQL on private Windows laptop or an explicitly approved free test environment). Capture SQL stdout and PostgreSQL version.
2. Test the real `nxs_memberships` schema and policies in a disposable clone. Never create/modify production objects for testing.
3. Extend coverage to auth.users and management API account bans/deletion, not just membership mutations.
4. Enforce separate owner principal, auth binding, and mutable game link; game ID and game rank must never confer ownership.
5. Review RLS, SECURITY DEFINER functions, service_role, Edge Functions, Cloudflare, GitHub CI and infrastructure privileges.
6. Add tests for An's operational admin permissions, lock/unlock, owner recovery, audit and sale-only transfer.
7. Gate production activation behind verified owner identity, reviewed migration, backup/restore, and explicit approval.

## Important
A database trigger cannot guarantee immutability against database owners or infrastructure administrators. No backdoor or master password. Use separate protected infrastructure credentials, MFA, audits, review and backups. Do not claim full GOD MODE protection before deployment and verified integration tests.
