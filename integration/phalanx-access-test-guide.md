# PHALANX access smoke test

1. Open an authenticated test session using the existing app login.
2. Call `checkAllianceAccess(existingSupabaseClient)` from `integration/phalanx-access-diagnostic.mjs`.
3. Expect four alliance summaries and 160 top-40 rows for an authorized active member.
4. Repeat with inactive, expired and kingdom-only accounts; expect no private rows.
5. Never publish access tokens or full player rosters in logs.
6. Do not merge or deploy until tests are confirmed.
