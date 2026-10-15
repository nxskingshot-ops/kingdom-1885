# NEXUS PHALANX – isolated Cloudflare Pages test deployment
Date: 2026-10-15
Scope: preview only. Do not deploy to production or modify main.

## Target
Repository: nxskingshot-ops/kingdom-1885
Branch: work/rc5-outpost-readonly-audit-20261015
Static test entry: /preview/phalanx-test-hub.html
Cloudflare Pages output directory: /
Framework preset: None
Build command: leave blank (no build)
Root directory: repository root (leave blank)

## Steps in Cloudflare Dashboard
1. Workers & Pages > Create application > Pages > Connect to Git.
2. Authorize GitHub repository nxskingshot-ops/kingdom-1885 if required.
3. Choose a NEW Pages project, e.g. phalanx-rc5-test. Never attach this workflow to the existing production Pages project.
4. Choose branch work/rc5-outpost-readonly-audit-20261015 as the production branch OF THIS NEW TEST PROJECT ONLY.
5. Framework: None; build command: blank; output directory: /; root directory: blank.
6. Deploy and wait for a successful deployment.
7. Open https://<test-project>.pages.dev/preview/phalanx-test-hub.html in Chrome.
8. Verify both cards; verify map displays only published records; inspect error messages and mobile viewport.
9. Do not treat this as a release or promote to production.

## Important constraints
- This is a separate test project. The label 'production branch' in Cloudflare means the branch used for the test project's main deployment, not PHALANX production.
- The existing outer RC5 preview still does NOT forward outpost_id; the deep-link integration test should remain failing until corrected.
- A Cloudflare Pages URL is not known until the user creates the project; never invent one.
- The existing page uses remote Supabase public data. Do not add service-role secrets or privileged tokens.
- Existing FREEZE design and production infrastructure must remain unchanged.

## Test checklist
- [ ] Pages project created independently
- [ ] Correct repository and branch selected
- [ ] Build completes without errors
- [ ] Hub opens directly in Android Chrome
- [ ] Both links open without 404
- [ ] Map shows published records only or an explicit data error
- [ ] No console errors blocking navigation
- [ ] Existing production URL and main unchanged
