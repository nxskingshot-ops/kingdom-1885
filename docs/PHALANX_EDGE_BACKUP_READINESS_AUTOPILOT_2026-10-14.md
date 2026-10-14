# PHALANX Edge Function backup readiness — isolated audit
Date: 2026-10-14
Status: NOT YET VERIFIED — do not merge/deploy without review.

## Evidence
- Live Supabase inventory: 25 ACTIVE Edge Functions (not 24 as in earlier coverage report).
- GitHub main currently has a workflow at `.github/workflows/phalanx-edge-functions-backup.yml`.
- Expected output directory `recovery/supabase/functions` was not found on main (GitHub contents API returned 404).
- No matching source-backup commit was found by commit search. This does **not** establish whether Actions was never run, failed, or completed without changes.
- The current connector cannot retrieve the Actions run listing. Run outcome and logs remain unverified.
- Deployed source of `mightpulse-ranking-identity-audit` v2 was successfully fetched read-only from Supabase; its existence is not proof of durable recovery.

## Workflow review (source only)
1. Workflow uses `workflow_dispatch`, i.e. manual invocation; no daily schedule is configured.
2. Workflow installs unpinned latest Supabase CLI globally; version drift is possible.
3. It runs `supabase functions download` without enumerating/validating expected 25 slugs.
4. Credential guard searches only for `PRIVATE KEY-----`; hardcoded tokens/passwords or other sensitive values may evade it.
5. It pushes directly to the triggering branch; do not execute before reviewing repository write permissions and destination.
6. It does not record per-function version and deployment hash or verify downloaded sources against the live inventory.

## Safe acceptance criteria
- Run logs show a successful authenticated export.
- Every live slug has its source snapshot and version/hash inventory, with explicit parity checks.
- Sensitive values scanned and reviewed before any commit; only env-var names retained.
- Recovery files stored in a suitably restricted location, with an isolated restore test.
- No production Edge Function deployments or database mutations are part of this audit.

## Next steps
1. Inspect the workflow run in GitHub Actions and capture its job result/error.
2. Prepare a hardened candidate workflow in an isolated branch; require explicit approval before executing anything that writes backup source into a public repository.
3. Independently audit the five `verify_jwt=false` functions' internal authorization controls.
