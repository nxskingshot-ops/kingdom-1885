# PHALANX Access V2 – server-side GOD protection integration gap (2026-11-09)

Scope: **read-only inspection** of actual `public.phx_set_app_role_v2` in isolated Supabase `yuyvmbdybwpwpqsipfjt`. No production or isolated database modifications.

## Verified current behavior
- Authenticated actor must have active `administrator` app role.
- Target must exist in `auth.users`; self-edit is rejected; existing **active** administrators cannot be demoted; mutations are audited.
- Function has **no immutable owner/GOD principal check**.
- Current protection uses target's `active` role. For a previously inactive administrator, `select ... where ... and active` yields no previous role, so another admin can reactivate or change the role. This is a **code-path finding**, not an exploited test.
- The isolated database's inspected schema exposes `phx_private.access_account_bindings` (player/account association), but the read-only owner/principal table search found **no established owner registry**. Do not infer owner from Kingshot player ID, rank, or first admin.

## Required non-destructive remediation plan
1. Identify and verify the canonical GOD auth principal in existing governance and actual application. Do **not** auto-bootstrap from game ID or email alone.
2. Introduce a protected server-side owner identity registry only after explicit approval, backup and restore path, and review of write privileges. The owner registry must be independent of mutable game identity.
3. In `phx_set_app_role_v2`, reject **all** changes to owner principal regardless of active status, before any role write; preserve protected admin rules and avoid bypass by inactive status. Enforce in other approval/invitation/revocation flows as appropriate.
4. Test owner update/deactivate/delete and nonowner changes against the **real integrated schema**; add auth.users/admin API/infrastructure controls separately.
5. Integrate role checks into actual PHALANX modules, with focused regression testing only for changed authorization paths.

## Release gate
**BLOCKED:** No trusted owner registry, server-side GOD guard, end-to-end browser approval, or real module access integration has been verified. The isolated PostgreSQL fixture pass documented separately does not resolve this gap.

No patch applied to the frozen governance file or production. No duplicate test run.
