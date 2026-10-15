# PHALANX Edge Function backup destination gate

Date: 2026-10-15. Read-only inspection, no production modifications.

## Verified facts
- Supabase project kingdom-1885-app is ACTIVE_HEALTHY in eu-central-1.
- Supabase API lists 25 ACTIVE Edge Functions. A read-only retrieval of one function succeeded, establishing an available authorized inspection path; its source is not reproduced here.
- GitHub workflow `.github/workflows/phalanx-edge-functions-backup.yml` uses `SUPABASE_ACCESS_TOKEN`, downloads deployed functions and then stages `recovery/supabase/functions`, commits and pushes to its Git repository.
- Main GitHub repository is PUBLIC. Thus successful execution of the existing backup workflow could publish backend source to the public repository.
- The workflow has a guard against PEM private key strings; that guard alone is not a comprehensive credential, private data or intellectual-property review.
- Most recent inspected Edge backup runs (2026-10-14) failed at download due to missing `api_gateway_keys_read` permission.
- A GitHub API check shows database backup on 2026-10-15 succeeded with external private B2 upload and verification.

## Decision gate
Do **not** rerun the current Edge source backup workflow or broaden credentials until its destination is changed to a verified private, access-controlled store. Never place function source or credentials in public audit notes.

## Proposed non-destructive sequence
1. Inventory function names and versions privately; exclude source and secrets from public docs.
2. Confirm a private target and retention policy (private repo or encrypted object storage) that meets zero-budget constraints.
3. Prepare backup workflow on an isolated branch with private destination and no public source commits; review for accidental log disclosure.
4. Verify backup and integrity with a controlled test, then validate a non-production restore.
5. Explicit owner approval required before changing production workflow, permissions, secrets or hosting.

## Limitations
Current live function source retrieval works for a sampled function, not a verified complete backup of all 25. No actual backups, restores or migrations performed here.
