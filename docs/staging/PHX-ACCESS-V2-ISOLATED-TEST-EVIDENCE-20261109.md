# PHALANX Access V2 isolated verification — 2026-11-09
Branch: work/phx-access-v2-safe-plan-20261109
No production deployment, no merge.

## Evidence
- Isolated Supabase yuyvmbdybwpwpqsipfjt: phx_app_roles, phx_app_role_events, phx_set_app_role_v2 and phx_list_app_members_v2 installed.
- PostgreSQL introspection: both functions authenticated EXECUTE=true, anon EXECUTE=false.
- Positive role grant: temporary administrator assigned Observer to another existing isolated auth UUID; returned {"role":"observer","changed":true}; transaction rolled back.
- Negative role grant: authenticated user without PHALANX administrator returned SQLSTATE 42501 "PHALANX administrator required".
- Directory without admin: 0 rows; temporary admin with 2 temporary roles: 2 rows; both transactions rolled back.
- Post-test counts: 0 app roles and 0 role events. No persistent bootstrap grant.
- UI files: phx-member-permissions-v2.html/js and phx-role-editor-v2.js committed on isolated branch.

## Release blockers
1. No verified app administrator bootstrap or invitation/approval atomic grant. Existing isolated review function still returns access_granted:false.
2. UI browser/Android tests NOT TESTED. No isolated HTTPS deployment of this branch confirmed.
3. Git-linked Vercel project phalanx-r11-atlas-preview exists but is a different preview purpose; do not repurpose or deploy this branch there without project isolation verification.
4. No tested current backup/restore, no end-to-end identity/role mapping, no email verification.
5. Privileged functions exposed to authenticated callers require full authorization review and security advisors.
6. No production change permitted until explicit release gate and full regression.

## Results
Role grant positive: PASSED (rollback only)
Role grant unauthorized: PASSED
Member directory authorization: PASSED (rollback only)
Persistent role grant: NOT TESTED
UI integration: CODE COMMITTED; NOT TESTED
Production release: NOT DONE
