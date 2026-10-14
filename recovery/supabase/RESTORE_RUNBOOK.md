# PHALANX Edge Functions – Recovery Runbook

Status: **PARTIAL / NOT RESTORE-READY**. This document is a procedure, not evidence of a successful restore.

## Source of truth
- Project: `hcjrdofkdkasznywvcxo` (`kingdom-1885-app`)
- Inventory: `recovery/supabase/edge-functions-inventory.json`
- Expected active functions: **25**
- Source files verified against deployed content: **5**
- Source files still missing from the recovery branch: **20**
- Do not deploy to production as part of a recovery rehearsal.

## Secure prerequisites
1. Use a separate, isolated Supabase test project and authorized credentials.
2. Recover required environment-variable **values** from an approved secrets manager or an authorized administrator, never from this repository.
3. Check all 7 environment-variable **names** in the inventory: `DISCORD_FEEDBACK_WEBHOOK_URL`, `KVK_SYNC_WEBHOOK_TOKEN`, `MIGHTPULSE_API_KEY`, `OUTPOST_SYNC_SECRET`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`.
4. Review access controls and ensure test integrations cannot send real Discord messages, mutate production data, or invoke real scheduled jobs.
5. Retrieve all 20 missing function source files using an approved export route before claiming full source coverage.

## Restore rehearsal (isolated test environment only)
1. Reconcile inventory against current Supabase function list; flag any version, status, JWT setting or hash drift.
2. Verify each backed-up source file byte-for-byte against the corresponding deployed source.
3. Restore the database separately from the verified encrypted database backup, using the documented database restore procedure.
4. Configure test-only secrets securely, never commit or print secret values.
5. Deploy each function to the **test project**, preserving its `verify_jwt` setting and other required configuration.
6. Test authorized and unauthorized requests, CORS, allowed HTTP methods, webhook verification, scheduled calls, data access and error handling.
7. Record evidence, results and remediation actions for all 25 functions.
8. Keep production unchanged; only declare recovery-ready after all 25 sources and functional restore tests pass.

## Current limitations
- Inventory hashes are reported deployment hashes; they are not themselves a replacement for backed-up source files.
- Environment-variable names are found by static `Deno.env.get(...)` scanning and may omit dynamic lookups.
- No secret values are backed up in GitHub.
- No complete Edge Function restore has been demonstrated.
- Five `verify_jwt=false` functions require manual review of their own authorization logic.
