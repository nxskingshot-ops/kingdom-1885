# Top-40 V3 executed mock runtime — 2026-10-15

Test target: `preview/phalanx-top40-v5-membership-gate-race-v3-candidate-20261014.html` on audit branch, blob SHA `e655e543c29190c852e57adc25586631413b24ec`.

## Execution
The inline JavaScript was extracted from GitHub and executed in V8 with a minimal mock DOM, deferred promises, a mocked Supabase client, and a stubbed SDK import. These are **actual executed asynchronous behavior checks**, not static string matching.

All five scenarios passed:
1. SIGNED_OUT while `getUser()` is pending keeps button disabled.
2. SIGNED_IN with a different user while membership query is pending keeps button disabled.
3. Switching alliance while Top-40 query is pending suppresses stale results.
4. SIGNED_OUT during Top-40 query keeps button disabled and table hidden.
5. Active unexpired member with complete four-alliance overview enables button.

## Scope
- No real browser, network or Supabase session used.
- Not proof of server-side authorization or UI rendering correctness.
- Additional tests needed: inactive/expired membership, database failures, auth switch after ready, and actual Android/browser execution.
- Existing hardcoded snapshot `2026-10-13` unchanged.
- The repository's standalone Node harness has not yet been run as a Node process; these five scenarios were executed in the tool's V8 runtime.

No main branch, database or production deploy changes.
