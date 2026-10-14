# PHALANX staging readiness – 2026-10-14

Status: **NO SUPABASE DEVELOPMENT BRANCH EXISTS** (read-only `list_branches` returned `[]`).

## Why staging is needed
The current production project cannot safely be used for negative authorization tests, destructive restore drills, cron/webhook execution tests, or migrations intended solely for verification.

## Proposed safe staging setup – requires owner approval
1. Confirm available Supabase branching capability, billing implications and test project access.
2. Create an isolated development branch or a separate test project, without exposing production secrets or customer data.
3. Apply reviewed schema/migrations and seed only synthetic test users: unauthenticated, normal member, inactive officer, expired-but-active officer, active officer.
4. Configure test-only integration endpoints and credentials; disable external side effects.
5. Deploy only verified source and preserve intended JWT settings.
6. Test deny/allow behavior and membership expiry at database policy level, not merely UI.
7. Validate `phalanx_can_read_alliances()` exposure and `phalanx_verify_cron_secret` access paths.
8. Run restoration rehearsal and record evidence; do not merge staging to production automatically.

## Current blockers
- Missing 20 Edge Function source backups.
- No staging Supabase branch.
- Exact production policy definitions not verified.
- Secret values must come from approved secure storage, never GitHub.

No branch or project was created; production was not modified.
