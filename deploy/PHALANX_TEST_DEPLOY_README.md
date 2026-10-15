# PHALANX Cloudflare test deploy (isolated)

This branch is separate from main. Production and approved FREEZE designs must not be modified.

Workflow: .github/workflows/phalanx-cloudflare-test.yml
Trigger: manual workflow_dispatch only. No automatic pushes.
Target: Cloudflare Pages project nexus-phalanx-kvk-test, preview branch phalanx-cloudflare-test-deploy.
Only files under deploy/phalanx-kvk-test/ are deployed. No files have been copied into that directory yet.
Required reviewed files: index.html, index-kvk.html, kvk-prep-v13.html.
Required GitHub repository secrets: CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.
Validation fails closed when files or secrets are absent. Never commit tokens or Supabase service credentials.
Cloudflare Pages and production frontend may still use the same Supabase backend; do not test live authentication before policies are reviewed.
Do not merge this branch into main until approved.
