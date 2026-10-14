# Top-40 membership policy source review — 2026-10-14

Sources on main:
- `preview/phalanx-home-auth-rc3-20261014.html`: validates `nxs_memberships.active` and `expires_at` for logged-in user, without officer role filter.
- `preview/phalanx-readonly-access-check-20261014.html`: selects `role,active,expires_at`, shows active and unexpired status; does not itself enforce access to Top-40 views.
- `preview/outpost-editor-v5.js`: restricts editor to `r4`, `r5`, `admin`, `outpost_manager`. This is a WRITE-oriented editor policy and must not be copied blindly to READ-only Top-40.
- `preview/phalanx-top40-v5.html`: only checks `auth.getUser()` for overview, and button can query before that check finishes or after failure.

## Candidate UI gate for read-only Top-40
Require `getUser()` success and at least one active unexpired membership before enabling the button. Verify any further required role restrictions against authoritative policy, not inference from editor. On sign-out disable immediately and discard stale data. Server-side grants/RLS/view security remain decisive.

## Unresolved
- Whether active NXS membership alone is the intended Top-40 policy.
- Whether effective SELECT grants and RLS/view semantics enforce it.
- Runtime role matrix (signed out, inactive, expired, active, admin).
- Latest complete snapshot selection.

No production code or database changed.
