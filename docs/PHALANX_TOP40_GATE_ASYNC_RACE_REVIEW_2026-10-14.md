# Top-40 candidate asynchronous race review — 2026-10-14

Reviewed isolated candidate `preview/phalanx-top40-v5-membership-gate-candidate-20261014.html` SHA `09f87d0f3d536b3423675b482a231d3f8de69adb`.

## Confirmed source-level gaps
1. `accessReady=true` is set after several awaited auth/membership/overview requests without comparing a captured epoch. If a SIGNED_OUT event occurs during those awaits, `revokeAccess()` can run, then the old initialization may later re-enable Top-40. **Race in UI gate**.
2. The Top-40 response checks epoch only after the database query succeeds. A rejected query after logout enters `catch` and can overwrite the logged-out status. **Stale error display**.
3. `onAuthStateChange` invalidates only SIGNED_OUT and USER_DELETED. User switch or token/auth events require deliberate policy; do not add a broad event listener that blocks normal token refresh.
4. The original fixed snapshot date and unverified server grants remain unchanged.

## Next isolated fix
- Capture an initialization generation; on any invalidating auth change, increment it and clear state; after every awaited operation and before enabling the button, check generation and current user identity.
- For Top-40 requests, compare generation in both success and catch; do not render stale results/errors.
- Preserve fail-closed UI on errors; re-enable only after re-verification.
- Test event sequences: logout during getUser, membership query, overview query, and Top-40 fetch; auth user switch; token refresh; network error; legitimate ready state.
- Treat all client-side checks as UX defense only. Server-side grants/RLS/views remain decisive.

No live code, database or deployment changed.
