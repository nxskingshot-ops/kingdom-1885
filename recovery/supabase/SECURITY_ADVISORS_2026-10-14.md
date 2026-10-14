# Supabase security advisors – 2026-10-14

Source: Supabase security advisors, project `hcjrdofkdkasznywvcxo`. Read-only assessment; no production changes.

## Findings
1. **INFO, 8 tables**: RLS enabled but no policies. Tables: `mystic_trial_categories`, `mystic_trial_observations`, `mystic_trial_power_references`, `nxs_audit_log`, `nxs_guest_access_config`, `phalanx_mightpulse_poll_runs`, `phalanx_mightpulse_rank_snapshots`, `public_outposts_backup_20261002`. This commonly denies client-role access, but verify intended access patterns before adding policies. [Supabase guidance](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)
2. **WARN**: `public.phalanx_can_read_alliances()` is executable by `anon` and `authenticated` as a `SECURITY DEFINER` function. Review the function's implementation, intended exposure and grants before any change. [Anonymous role guidance](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) / [Authenticated role guidance](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable)
3. **WARN**: leaked password protection is disabled. Evaluate enabling in Auth settings after confirming availability and impact. [Supabase guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

## Outpost editor interpretation
`nxs_memberships` and `public_outposts_verified_20261002` are not among the eight no-policy findings. This does **not** verify that their policies are correctly scoped or enforce expiry.

## Next safe actions
- Inspect `phalanx_can_read_alliances()` definition via an approved read-only path; determine whether anonymous invocation is intentional.
- Inspect UPDATE/SELECT RLS policy definitions and membership expiry logic through approved access.
- Review the eight no-policy tables for expected service-role-only vs client access.
- No direct changes to production policies, grants, auth configuration, or deployed functions without authorization and staged validation.
