# Transfer Scouting V2 — isolated security test matrix
Status: NOT EXECUTED. Do not run against production or with real candidate data.

## Migration dependency
1. Verify backup CREATED, INTEGRITY CHECKED and RESTORE TESTED separately.
2. Map existing legacy admin/r5 users explicitly to Transfer roles with approval; preserve access until mapping is tested. Do not infer Transfer administrator from NXS rank.
3. Create disposable Supabase test project with synthetic accounts, sessions, and candidates.
4. Run proposal SQL in test project only; capture policy inventory before and after.
5. Confirm exact deployed frontend version and isolate Cloudflare/Vercel preview.
6. Run actual authenticated REST operations, not only SQL impersonation.

| Identity | Read | Insert | Update | Delete |
| --- | --- | --- | --- | --- |
| Anonymous | DENY | DENY | DENY | DENY |
| Inactive member | DENY | DENY | DENY | DENY |
| Expired member | DENY | DENY | DENY | DENY |
| Verified member / observer | ALLOW | DENY | DENY | DENY |
| Verified member / operator | ALLOW | ALLOW | ALLOW | DENY |
| Verified member / administrator | ALLOW | ALLOW | ALLOW | ALLOW |
| Legacy r4/r5 without Transfer role | DENY | DENY | DENY | DENY |
| Invalid/revoked session | DENY | DENY | DENY | DENY |

## Mandatory assertions
- No candidate rows lost, modified or duplicated by migration.
- All policies on transfer_candidates are audited; no legacy permissive bypass remains.
- Frontend hides unauthorized controls AND backend rejects direct REST writes.
- Registration, invitation, approval and member management show same three roles.
- Sign-in, reload, candidate create/edit/delete, comparison, live lookup, Android viewport and back navigation tested.
- Queen An production account and saved candidates untouched until explicit release.
- Any failing test blocks deployment.

Current results: source inspection PASS; migration NOT APPLIED; auth/RLS tests NOT TESTED; browser/Android NOT TESTED; backup NOT VERIFIED.
