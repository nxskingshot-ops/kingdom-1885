# PHALANX: private development / public result transparency — migration plan

Date: 2026-10-15. Status: **plan only**, no visibility, production, hosting, permissions, data or secret changes.

## Confirmed (GitHub API read-only)
- Main repo public, GitHub Pages enabled, 442 files in main tree.
- 254 `preview/`, 64 `data/`, 42 `docs/`, 15 `.github/`, 15 `tests/`, 9 `src/`, 8 `backups/`.
- `src/` includes nine model, joiner, ranking and probability scripts; these are readable in public Git history.
- Sample `src/phalanx-robust-engine-v1.js` explicitly describes itself as research-only, dimensionless combat proxy, not actual Kingshot damage.
- `staging/phalanx-mightpulse-manual-refresh.js` appears to use authenticated Supabase client, not service-role client, but this is not a full security audit.
- `README.md` publishes a GitHub Pages preview link and `integrations/README.md` describes internal synchronization and backend architecture.
- Workflow `.github/workflows/daily-code-backup.yml` uses GitHub-provided token, not evidence of an exposed personal token.
- Filename-only scan found no obvious .env/secret-named file; **does not clear file contents or commit history**.

## Classification proposal (provisional; requires content-level review)
- PUBLIC RUNTIME: necessary HTML/CSS/JS, public icons and manifest, user-facing documentation of input assumptions, outputs, uncertainty and provenance.
- INTERNAL DEV: `src/` research/optimizers, `tests/`, `.github/workflows/`, `backups/`, `staging/`, `integration/`, internal `docs/`, unpublished `preview/`.
- CASE BY CASE: `data/` (game facts/evidence vs private account data, proprietary intermediate models); `integrations/` (public client configuration vs backend setup); `reports/`.
- SECRET/SENSITIVE: any actual credentials, service-role keys, user-identifying records or access policies; investigate before publishing further.

## Migration sequence and gates
1. Freeze *new* internal research publication to public repo; no deletion yet.
2. Full content and Git history secret scan without revealing values; rotate any confirmed exposed credentials.
3. Create independent verified backup of source, branches, tags and deployment configuration.
4. Verify live Pages source, linked previews, PWA service-worker scope and update flow, Supabase auth/Edge Function dependencies, and external integrations.
5. Set up access-controlled private development repository, copy complete history there, limit collaborators, use MFA and least privilege.
6. Build **minimal public distribution** from approved assets only; retain explanations of inputs, assumptions, calculations and uncertainty necessary to evaluate results. Do not misrepresent black-box outputs as verified.
7. Keep proprietary computations server-side **only if** justified by security and 0€ operating budget; local-first client calculations remain inspectable.
8. Test mobile navigation, 74-outpost map, alliance Top-40, login, PWA updates, and report flows on staging.
9. Obtain explicit approval for repo visibility/hosting/deployment changes. Only then switch and verify no outage. Public clones/history/caches cannot be recalled.

## Stop conditions
Do not change repository visibility before Pages/deployment verification; do not delete historical data before verified backup; do not claim code is protected merely by minification; do not publish secret scan findings verbatim.

## Next audit
Inspect content-level security exposure in configuration, deployed HTML, workflows and historical commits, without emitting any credential values. Evaluate GitHub Pages continuity and alternatives.
