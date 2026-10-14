# PHALANX Top-40 v5 authentication gating review — 2026-10-14

Read-only inspection of main `preview/phalanx-top40-v5.html` SHA `6a9fc9b2afab5f4bf3075da180b0687c3c678416`.

## Confirmed
- Top-40 click listener is bound before async SDK initialization; a missing click handler is not supported by this source.
- Button checks `if(!client)` but **does not itself check an authenticated user or valid membership**.
- `client` is assigned immediately after `createClient`, **before** `auth.getUser()` and before the overview query; clicking in that window can query the Top-40 view.
- After failed authentication or overview query, the click handler remains available and may query `phalanx_alliance_top40` if `client` exists.
- Effective security therefore must come from server-side grants/RLS/view policies, not from the visual login state. No unauthorized read is proven by code review.
- Snapshot date `2026-10-13` is hardcoded in both overview completeness check and Top-40 query; future snapshots will not automatically display.
- Existing read-only access check probes underlying tables using `head:true` but does not probe the actual two views, and cannot establish 40-row completeness.

## Safe remediation design (not implemented)
1. Separate explicit authenticated-and-authorized UI state from mere client initialization.
2. Disable Top-40 button until identity, membership, and overview checks complete; on failure remain disabled and display a clear status.
3. Still require server-side authorization for views and underlying tables; never use UI checks as the sole control.
4. Replace hardcoded snapshot date only after defining and verifying latest **complete** four-alliance snapshot semantics.
5. Verify signed-out, expired member, normal member, and admin roles with approved test accounts; do not change grants blindly.

## Status
No live permission proof, no browser runtime test, no code/deploy changes. FREEZE preserved.
