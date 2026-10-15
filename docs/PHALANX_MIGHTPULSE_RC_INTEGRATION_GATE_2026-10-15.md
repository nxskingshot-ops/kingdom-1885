# PHALANX RC integration gate — MightPulse and frozen HOME
Date: 2026-10-15
Scope: read-only source inspection and live database read-only evidence. NOT a production release.

## Verified
- Supabase cron job `phalanx-mightpulse-every-2h` is active, schedule `0 */2 * * *`.
- Last eight scheduled poll records through 2026-10-15 04:00 UTC report successful 16/16 board checks.
- At 02:00 UTC the poll reported changed source data for 16 boards; at 04:00 UTC it reported no further changes.
- GitHub freeze checkpoint documents successful isolated Android menu opening and back navigation.
- The existing menu test lives at `preview/phalanx-command-center-mightpulse-menu-test-20261014.html`; the standalone test and reusable staging module already exist. Reuse; do not recreate the UI.

## Unresolved release gates
1. Validate the RC route uses the approved frozen HOME and Alpha35 Outpost Map, not the older generic Command Center or an intermediate integration landing page.
2. Confirm access and login/expired-session behavior with least privilege; avoid leaking credentials to frontend or public GitHub.
3. Test offline/timeout, stale-source timestamps and API failure states. A successful cron invocation does not establish freshness or correctness of game values.
4. Inspect data rendering paths for untrusted content before promoting; the existing Command Center source contains `innerHTML` string concatenation involving data fields.
5. Check Android portrait layout, menu/back navigation and restoration of the original HOME without any design changes.
6. Obtain explicit owner approval before production changes or merging.

## Freeze and safety
- No changes to production, main branch, Supabase, deployed Pages, frozen assets or workflows in this checkpoint.
- This document contains no credentials or proprietary algorithm details.
- Any new RC implementation must be isolated, reversible, and separately tested.
