# PHALANX access-request privileges: dependency and rollback review

Status: READ-ONLY INSPECTION; NO PRODUCTION CHANGE.

## Verified dependencies
- Default-branch `preview/kingdom-hub-menu-test.html`: admin list performs SELECT on `nexus_access_requests`; public applicant flow performs INSERT of `gamer_tag`, `player_id`, `alliance`, `status=pending`.
- The same frontend sends approve/reject/reset through authenticated `nexus-access-review` Edge Function; therefore direct browser UPDATE is not necessary for the inspected UI path. Other branches and consumers NOT exhaustively checked.
- Live database: authenticated has table UPDATE plus UPDATE on all 11 columns. `officers_review_access_requests` permits UPDATE for active r4/r5/admin memberships. Anonymous also has table UPDATE grant, though no corresponding UPDATE RLS policy was found. These grants should be reviewed under least privilege.
- Current `nexus-access-review` version 7 is ACTIVE; owner reset guard exists, but Auth target metadata binding is not yet implemented.

## Backup / rollback
- Existing `docs/SUPABASE_BACKUP_RESTORE.md` records a 2026-10-04 in-project snapshot of `nexus_access_requests` and 13 other tables. It is historical and NOT a current backup. Provider backup/PITR and off-project restore remain unverified.
- Before production DDL, export exact current ACL grants, policies, dependencies and current data backup to a secure independent location. Validate restore in nonproduction. Never infer rollback GRANT permissions from defaults.
- Restore grants from captured catalog state only if rollback needed, and verify with an authenticated R4/R5 client, a normal user and a service-role Edge Function.

## Change order
1. Finish inventory of all consumers, including branch-specific previews, RPC, triggers and Edge Functions.
2. Obtain current backup, integrity and nonproduction restore evidence.
3. Isolated tests: authenticated INSERT/SELECT preserved; direct UPDATE rejected; service-role approve/reject/reset still works; owner cannot be reset; malicious Auth-ID remapping rejected; no leaks to R4/R5.
4. Only with explicit production authorization apply narrow grants/policies, then validate and monitor.

Result: dependency inspection PARTIAL; current backup NOT VERIFIED; restore NOT TESTED; migration NOT APPLIED; end-to-end NOT TESTED.
