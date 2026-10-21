# PHALANX · Supabase public-table GRANT safety gate (2026-10-21)

Status: ISOLATED GUIDANCE ONLY. No deployment, no database mutation, no production approval.

## Why
Supabase's 2026-10-30 change means newly created public-schema tables no longer automatically receive Data API grants. Existing tables keep their grants. A restored/recreated schema may need explicit grants. SQL GRANT is separate from Row Level Security (RLS): both must permit an operation for client access.

## Required process for every future table migration
1. Declare the intended audience per operation (anon / authenticated / service_role / no direct client access).
2. Create the table and enable RLS; define restrictive policies separately and verify them.
3. Add ONLY the required GRANTs in the same migration, not a blanket grant.
4. Verify with read-only privilege queries below. Test with anon and authenticated clients for both allowed and forbidden operations.
5. Repeat this audit after any schema recreation / restore; never assume original grants survive a reconstruction.

## Read-only verification query
```sql
SELECT
  n.nspname AS schema_name,
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled,
  has_table_privilege('anon', c.oid, 'SELECT') AS anon_select,
  has_table_privilege('anon', c.oid, 'INSERT') AS anon_insert,
  has_table_privilege('anon', c.oid, 'UPDATE') AS anon_update,
  has_table_privilege('anon', c.oid, 'DELETE') AS anon_delete,
  has_table_privilege('authenticated', c.oid, 'SELECT') AS auth_select,
  has_table_privilege('authenticated', c.oid, 'INSERT') AS auth_insert,
  has_table_privilege('authenticated', c.oid, 'UPDATE') AS auth_update,
  has_table_privilege('authenticated', c.oid, 'DELETE') AS auth_delete
FROM pg_class AS c
JOIN pg_namespace AS n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r','p')
ORDER BY c.relname;
```

## Illustrative migration fragment — NOT executable as-is
```sql
-- Example ONLY. Replace table and audience after explicit authorization.
-- CREATE TABLE public.example_private (...);
-- ALTER TABLE public.example_private ENABLE ROW LEVEL SECURITY;
-- No anon or authenticated grants by default.
-- For a deliberately public read-only table, after RLS policy review:
-- GRANT SELECT ON TABLE public.example_public_readonly TO anon, authenticated;
-- Do NOT grant INSERT/UPDATE/DELETE without a separate approved use case.
```

## Observed baseline on 2026-10-21 (read-only check)
Project kingdom-1885-app: 23 public tables, all 23 with RLS enabled. Existing public_outposts has SELECT for anon and authenticated. Some older backup/access-request/history tables have broader table-level grants; RLS policies were NOT evaluated in this audit. Their effective access cannot be inferred from GRANT alone. Separate security review required; no automatic revocation or policy changes.

## Acceptance gate
No new production table migration or restore is approved merely by this document. Review migration SQL, intended client roles, RLS policies, actual privileges, and negative access tests before any release. Preserve zero-budget and production-freeze constraints.
