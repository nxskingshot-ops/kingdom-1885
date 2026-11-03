# PHALANX reset binding V3 — isolated verification

A pure offline Node.js model checks request ID, Auth user ID and player ID against an assumed independently protected server-side binding. 14/14 tests passed, including denial of a dual-field tampered access request. This is NOT an integration test or evidence that the live database has such a protected binding.

Required before integration: create a genuinely server-controlled binding with least privilege; verify legacy approved records and backfill; preserve all existing authorized administrator capabilities; capture current backup and test restoration; stage positive and negative role tests. Do not deploy or alter production rights until explicit authorization and evidence.

Production state: unchanged. Current Edge Function v7 ACTIVE, without this binding check.
