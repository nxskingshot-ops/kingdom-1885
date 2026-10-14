# PHALANX Top-40 V3 extended mock runtime — 2026-10-15

Target: `preview/phalanx-top40-v5-membership-gate-race-v3-candidate-20261014.html`, blob SHA `e655e543c29190c852e57adc25586631413b24ec`.

Executed the inline script in V8 with mock DOM, deferred promises and Supabase SDK stub. Six additional cases passed:
1. Expired membership keeps Top-40 disabled.
2. Missing/inactive membership keeps Top-40 disabled.
3. Membership query error keeps Top-40 disabled.
4. Alliance overview query error keeps Top-40 disabled.
5. Different user SIGNED_IN after successful verification revokes Top-40.
6. Top-40 view query error is displayed without incorrectly locking out a still-authorized member.

Together with five earlier scenarios in `docs/PHALANX_TOP40_V3_EXECUTED_MOCK_RUNTIME_2026-10-15.md`, 11/11 mock runtime scenarios passed.

Remaining limitations:
- Mocked V8 execution, **not** a real browser/Android test or a Node run of the committed harness.
- Server-side view grants, RLS and role authorization are not proven.
- Hardcoded 2026-10-13 snapshot remains.
- A UI test cannot establish actual security against crafted HTTP requests.
- Need review of auth events, especially token refresh, session changes and late responses before integration.

No production or database changes.
