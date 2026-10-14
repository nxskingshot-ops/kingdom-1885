# Top-40 V2 executed static test — 2026-10-14

Source: `preview/phalanx-top40-v5-membership-gate-race-v2-candidate-20261014.html`, blob SHA `c49c09c04e453b1128d4cbf392114fda8375d0ac`.

## Executed checks
- Extracted the inline `type=module` JavaScript and compiled it using the JavaScript `Function` constructor in a V8 runtime: **PASS**. This confirms parseability of the extracted script as a function body, not browser execution or Supabase connectivity.
- Retrieved `integration/phalanx-top40-v2-static-regression-20261014.mjs`, extracted its eleven named regex assertions and executed each against the extracted script in V8: **11/11 PASS**.
- The Node script itself was not executed as a Node process against a checked-out repository; assertions were reproduced from its source in V8.

## Limitations / follow-up
- Browser DOM and event lifecycle not executed.
- Signed-out, membership-expired, sign-out-during-fetch and user-switch scenarios not runtime tested.
- UI access checks are not security controls; database view SELECT grants/RLS still unverified.
- The hardcoded snapshot date `2026-10-13` remains.
- Potential remaining edge: user switch during initial authorization before `authorizedUserId` is set should be tested.

No live deployment, main branch edit, or database change.
