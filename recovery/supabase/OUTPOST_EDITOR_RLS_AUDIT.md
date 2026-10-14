# Outpost editor – authorization and RLS audit

Date: 2026-10-14. Read-only observations; **policy definitions NOT verified**.

## Confirmed
- `outpost-editor` serves a public HTML page via GET; its server handler does not enforce user authentication before serving the page.
- The embedded browser client uses Supabase Auth and checks `auth.getUser()`.
- The browser queries `nxs_memberships` for `role, active`, permitting the editor UI for active `outpost_manager`, `r4`, `r5`, and `admin` roles.
- The browser issues direct updates to `public_outposts_verified_20261002` using the Supabase client.
- Supabase table metadata reports `rls_enabled=true` for both `public_outposts_verified_20261002` (74 rows) and `nxs_memberships` (5 rows).

## NOT confirmed
- Actual `pg_policies` rules, especially UPDATE `USING` and `WITH CHECK`.
- Whether an authenticated non-officer can bypass the browser UI and directly update rows.
- Whether a member can elevate their own role or change `active` through a direct API request.
- Whether the `public_outposts_verified_20261002` SELECT policy exposes only intended data.
- Whether security-definer functions or grants introduce additional paths.

## Required verification (authorized read-only policy review)
1. Review `pg_policies` for both tables and inspect all `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies.
2. Verify that UPDATE checks officer membership from trusted data, not merely a client-provided role.
3. Verify `nxs_memberships` writes cannot be used for self-promotion.
4. Conduct denial tests in an isolated test project as unauthenticated, normal member, inactive officer, and active officer.
5. Do not modify production or assert that RLS is secure until these tests pass.

## Evidence limitations
The policy-inspection SQL attempt was blocked by platform safety checks. Table-level RLS flags were retrieved through the supported Supabase table metadata listing. No writes or live authorization probes were performed.
