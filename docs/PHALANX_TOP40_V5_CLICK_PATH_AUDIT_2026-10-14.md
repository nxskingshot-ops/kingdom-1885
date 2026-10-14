# Top-40 v5 click-path audit — 2026-10-14

Scope: read-only inspection of `preview/phalanx-top40-v5.html` and `integration/phalanx-access-diagnostic.mjs`.

## Confirmed
- Button `#phalanxLiveTop40Button` exists and is not initially disabled.
- A click handler is attached synchronously, before Supabase client initialization.
- Clicking immediately updates `#phalanxLiveTop40Status` (even if client is not ready).
- Handler queries `phalanx_alliance_top40`, filters `kingdom=1885`, selected alliance, **fixed** `snapshot_date=2026-10-13`, and orders by `position`.
- It rejects any response other than exactly 40 rows.
- Errors are surfaced in status text and hide the table.
- `phalanx-access-diagnostic.mjs` similarly counts rows for a fixed date and expects 160 across four alliances.

## Risks / boundaries
1. Hardcoded snapshot date will reject newer snapshots or missing historical data. A future candidate should discover latest *complete* common snapshot server-side or from verified metadata, not silently mix dates.
2. The existence of a handler does not prove it fires in the Android browser; runtime execution not tested.
3. The HTML uses a Supabase publishable key and relies on database RLS for actual authorization.
4. The v5 module is separate from RC9; integration/navigation from frozen home is not demonstrated.
5. A client can be initialized while authentication is absent. In that case clicking may yield a permission error, which is not equivalent to an unresponsive button.
6. Never display partial/incomplete leaderboards as verified. Preserve freeze and add diagnostic handling only in isolated candidates.

## Acceptance test matrix
- Button before SDK ready: visible feedback.
- Authenticated member: exactly 40 rows from one verified complete snapshot per alliance.
- Signed-out/expired membership: explicit access status, no private rows.
- Empty/incomplete/newer snapshot: explain freshness/completeness without mixing dates.
- Network failure: clear retryable status.
- Android portrait: click, scroll, alliance change and table layout.
