# PHALANX Top-40 v5 UI gate: isolated patch plan — 2026-10-14

Baseline: `preview/phalanx-top40-v5.html` SHA `6a9fc9b2afab5f4bf3075da180b0687c3c678416`.

## Objective
Prevent a user from requesting Top-40 through the UI until an authenticated identity, active authorized NXS membership, and complete alliance overview are confirmed. This is **defense in depth**, not a substitute for server authorization.

## Minimal state machine
- `initializing`: button disabled, status checking.
- `signed_out` / `membership_denied` / `overview_unavailable`: button disabled with explicit reason.
- `ready`: button enabled; `client` initialized, `auth.getUser()` succeeds, membership query confirms `active===true`, `expires_at` absent or in future, role belongs to approved role list, overview contains four expected alliances for selected snapshot date.
- `loading`: button disabled during Top-40 fetch; re-enable only if state remains `ready`.

## Suggested implementation sequence (no live changes)
1. Initialize `let client, accessReady=false`; set `topButton.disabled=true` before binding handler.
2. Handler first checks `accessReady && client`, then performs read.
3. After `auth.getUser()`, query `nxs_memberships` by `user_id` with `role,active,expires_at`; verify approved role list using the app's existing authoritative membership policy. Avoid guessing the exact list.
4. After complete overview, set `accessReady=true`, enable button. On any auth/member/data error keep it disabled.
5. On sign-out/auth state change invalidate `accessReady`, clear stale data, disable button.
6. Server-side SELECT grants, RLS, and view behavior must be separately reviewed. Client-side membership checks alone never establish security.

## Test matrix
- Signed-out: no Top-40 request; button disabled.
- Signed-in non-member: no Top-40 request; button disabled.
- Expired or inactive member: disabled.
- Active authorized member: enabled only after overview completeness check.
- Auth changes while fetching: stale results not shown.
- SDK/network failure: disabled and diagnostic error.
- Fixed-date snapshot absence: report missing snapshot without inventing data.

## Status
Plan only, no code or database modification, no deploy, no approval requested.
