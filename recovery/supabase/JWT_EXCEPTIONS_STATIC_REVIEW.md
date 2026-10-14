# JWT-disabled Edge Functions – static control-flow review

Date: 2026-10-14. Read-only source inspection, not a penetration test.

| Function | Observed application-level gate | Current conclusion |
|---|---|---|
| `kvk-sync` | POST only; compares `x-nxs-sync-token` against configured token; rejects mismatch with 401 before sync | Static gate identified |
| `outpost-sync` | POST only; compares `x-outpost-sync-secret` against configured secret; rejects mismatch with 401 before upsert | Static gate identified |
| `verified-outpost-sync` | POST only; same secret-header pattern and rejection before upsert | Static gate identified |
| `phalanx-mightpulse-scheduled` | POST only; `x-phalanx-cron-auth` verified by `phalanx_verify_cron_secret` RPC; rejects failed check with 401 before poll call | Static gate identified |
| `outpost-editor` | GET serves HTML without server-side login; browser uses Supabase Auth and membership role check; direct updates rely on database RLS | DB policy enforcement not verified |

## Boundaries
- These are **observations from deployed source**, not proof of resistance to all bypasses.
- `outpost-editor` browser role check reads `role,active` but not `expires_at`; historical migrations suggest expiry enforcement was implemented, yet actual policies remain unverified.
- Both editor-related tables have RLS enabled; actual UPDATE/SELECT policies and any SECURITY DEFINER dependencies remain unverified.
- No live requests, policy changes, or production deployments were performed.

## Next tests
1. Inspect exact RLS policy definitions using approved read-only administrative access.
2. Confirm cron verification RPC rejects invalid credentials without leaking values.
3. Run negative authorization tests in isolated staging, including expired-but-active membership.
4. Preserve `verify_jwt` flags and document expected authorization behavior during restore.
