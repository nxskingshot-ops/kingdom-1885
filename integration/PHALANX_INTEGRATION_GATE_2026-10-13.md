# PHALANX — integration gate (13 Oct 2026)

## Current gate
- Source rosters: NXS 98, OoO 100, MYM 99, FRA 98; total 395.
- Latest overview expected: four alliance rows, dated 2026-10-13.
- Top 40 expected: 40 per alliance, 160 total.
- Supabase read gate: signed-in, active, unexpired NXS membership with role member/outpost_manager/r4/r5/admin. Kingdom-only, anonymous, expired and inactive are not authorized.
- No write access is required for the app.
- Existing approved UI is frozen; no production deployment.

## Live acceptance
1. Open a genuine signed-in NXS test session and call checkAllianceAccess(existingSupabaseClient).
2. Expect signedIn true, overview READ_OK and allianceCount 4, top40 READ_OK and top40Count 160.
3. Check denied roles, expired/inactive users and anonymous sessions separately. Do not use a service-role credential in the browser.
4. Confirm the four power totals and membership counts against the 2026-10-13 snapshot.
5. Confirm Android portrait rendering and existing module regressions before any merge.

**Important:** A mock test does not prove live database authorization. No user access tokens or player rosters should appear in logs.
