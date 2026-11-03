# PHALANX · Central Ranking Ingestion — Stage Specification
Date: 2026-11-03
Status: DESIGN / NOT DEPLOYED
Scope: Kingdom 1885; read-only upstream ingestion. Preserve existing scheduled poller v7 and cron.

## Verified baseline
- Existing `phalanx-mightpulse-scheduled` v2 runs every 2 hours via active pg_cron job 1.
- Existing `phalanx-mightpulse-poll` v7 requests 16 named boards and requires 100 rows, distinct ranks 1–100, ordered numeric scores and valid identifiers. Valid results are appended to `phalanx_mightpulse_rank_snapshots`, poll runs to `phalanx_mightpulse_poll_runs`.
- Existing transfer intelligence v6 uses 24 named player boards, preferring provider data with saved snapshots as fallback. It is not a complete kingdom census.
- The union is 26 boards: 24 player boards plus `alliance_power` and `alliance_kills`. Do not infer provider support for a board from its presence in code.

## Stage plan (no production mutation)
1. Copy and hash poller v7 source before any replacement; retain rollback to v7.
2. Implement a separate v8 candidate or isolated stage endpoint using the 26-board union; no changes to existing scheduled endpoint or cron.
3. Query each board independently with bounded concurrency, timeout, retry limits, and no exposed API key.
4. Validate player and alliance boards separately (alliance boards have aid, not uid). Preserve source-specific identity, captured_at, kingdom and score units.
5. Permit fewer than 100 rows only when the upstream explicitly identifies a complete shorter board; otherwise mark INCOMPLETE and do not publish as verified.
6. Append immutable snapshots only after validation. Deduplicate by board + source capture timestamp + source content hash. Do not delete or overwrite history.
7. Record per-board states VERIFIED, UNCHANGED, INCOMPLETE, STALE, ERROR, UNSUPPORTED, with captured_at vs checked_at separately; never turn missing values into zero.
8. Publish a single latest-verified-per-board read contract with coverage, freshness, source and player identity; consumers must tolerate absent boards.
9. Compare stage results against v7 for all original 16 boards, including historical snapshot integrity and access controls. Test scheduled invocation, rollback, cost/rate limits, and consumers before any promotion.
10. Only after separate authorization, schedule and production cutover. No new costs without approval.

## Open gates
- Provider-supported board catalog and per-board row-count contracts NOT VERIFIED.
- Live stage integration, authenticated access, retention/storage and performance NOT TESTED.
- Cron changes, database migrations and deployment NOT AUTHORIZED by this specification.
- Do not claim Rally/Garrison leader rankings without comparable same-period player-level battle evidence.
