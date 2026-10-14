# Edge Backup – safe candidate (not executable)
Date: 2026-10-14. Scope: review only, no workflow dispatch or production modification.

## Concrete issue in existing workflow
`supabase functions download` is invoked without a slug. The CLI command generally targets an individual function; the syntax and version must be verified against the installed CLI before any run. As written, the step may fail, and no success logs have been retrieved.

## Safe remediation design
1. First enumerate the live Edge Functions using authenticated Supabase Management API; capture slug, version, verify_jwt, and deployment hash.
2. For each slug, run a **version-pinned** Supabase CLI download command in an ephemeral workspace. Fail if any expected function is missing.
3. Before archiving, scan for credential-like strings beyond private keys (provider tokens, authorization headers containing literals, connection URLs, passwords). Use review gates; scanners are not a guarantee.
4. Archive sources to restricted encrypted storage, not to public GitHub. Store only sanitized manifest and non-sensitive hashes in GitHub.
5. Validate parity (25 of 25 currently), checksum archive, then conduct a restore rehearsal in a disposable isolated project.
6. Make schedule opt-in only after first successful manual execution and secret storage review. No direct push to main from an unreviewed export job.

## Separate security review
`outpost-editor` v6 is a GET-served HTML UI that uses a publishable Supabase key and authenticated user sessions to update `public_outposts_verified_20261002`. Its client-side role check is **not** an authorization boundary. RLS is enabled on the table (74 estimated rows), but policy SQL could not be retrieved through the current connector. Therefore server-side authorization remains **unverified**. Do not classify this endpoint as vulnerable solely because `verify_jwt=false`: it serves a public login page. Confirm UPDATE policies and any SECURITY DEFINER helpers before approving changes.

The other four `verify_jwt=false` functions have explicit token checks in deployed source:
- `kvk-sync`: POST, 32+ character webhook token, timing-resistant comparison, payload validation.
- `outpost-sync`: POST, 32+ character shared secret, SHA-256 comparison, row validation.
- `verified-outpost-sync`: POST, shared-secret check, RPC for replacement; inspect RPC's validation and permissions separately.
- `phalanx-mightpulse-scheduled`: POST, cron token validated through `phalanx_verify_cron_secret` RPC before invoking poll.

Static review is not an end-to-end authorization test.
