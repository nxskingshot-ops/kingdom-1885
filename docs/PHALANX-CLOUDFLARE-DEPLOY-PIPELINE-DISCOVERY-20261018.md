# Cloudflare deployment pipeline discovery — 2026-10-18

## Confirmed historical configuration
GitHub default-branch code search located `.github/workflows/phalanx-cloudflare-test.yml` at historical commit `8cd9fdd87dc46ff4f54775e992250e2b0ec6fd40`. Its source was read and inspected.

- Trigger: manual `workflow_dispatch`.
- Branch gate: `github.ref == 'refs/heads/phalanx-cloudflare-test-deploy'`.
- Checkout: `phalanx-cloudflare-test-deploy`.
- Required secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (values not accessed).
- Requires three existing files under `deploy/phalanx-kvk-test/`.
- Deploy target: Cloudflare Pages project `nexus-phalanx-kvk-test` using `cloudflare/wrangler-action@v3`.

## Current alpha branch
The historical workflow **does not exist** at `alpha/android-integrated-freeze-20261017` (GitHub 404). It is not a deployment route for current V2 as written, because both branch and deployment directory differ.

## Decision
Do **not** copy or trigger this historical workflow unchanged. It would target an unrelated existing project and a different branch. A new isolated deployment route must have confirmed Cloudflare project, branch and permissions, and must deploy the three V2 peer files without modifying originals. No deployment attempted. No costs incurred.
