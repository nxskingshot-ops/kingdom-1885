# Existing Edge Function backup workflow – read-only review

Date: 2026-10-14. Source: `.github/workflows/phalanx-edge-functions-backup.yml` on production `main`.

## Verified
- A manual-only (`workflow_dispatch`) GitHub Actions workflow already exists for downloading Supabase Edge Function source using Supabase CLI.
- It requires GitHub secret `SUPABASE_ACCESS_TOKEN`, checks it is non-empty, links project `hcjrdofkdkasznywvcxo`, runs `supabase functions download`, and attempts to commit `recovery/supabase/functions`.
- The workflow targets the checked-out branch, so dispatching on `main` would attempt to commit backup files to production `main`.
- It executes `rm -rf recovery/supabase/functions` before downloading, so a failed or incomplete download must not be treated as an authoritative full backup.
- The only source-content guard checks for the literal substring `PRIVATE KEY-----`. It does **not** establish that arbitrary secrets, tokens, or credentials are absent.
- There is currently no `recovery/supabase/functions` directory on `main` (GitHub contents API returned 404).
- Workflow run history could not be retrieved using the currently available approved GitHub read endpoints; no success or failure of prior runs is asserted.

## Decision
**Do not dispatch this workflow as-is.** First review the CLI command against the installed CLI version, strengthen source secret detection, ensure non-empty and complete export of all 25 deployed functions, preserve the existing five confirmed source backups, and target the dedicated audit branch or an artifact rather than production `main`.

## Potential free path
Use GitHub Actions within the available free quota as a controlled exporter after workflow hardening and user approval. It could eliminate the need for a paid Supabase branch for source backup, but it does not replace isolated database/RLS testing or full restore drills.

No workflow was executed or modified in this audit.
