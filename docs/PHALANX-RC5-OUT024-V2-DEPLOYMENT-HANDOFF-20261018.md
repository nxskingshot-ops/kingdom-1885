# RC5 → OUT-024 V2: isolated deployment handoff — 2026-10-18

## Exact source
- Repository: `nxskingshot-ops/kingdom-1885`
- Branch: `alpha/android-integrated-freeze-20261017`
- Test entrypoint: `preview/PHALANX_RC5_OUT024_ISOLATED_NAV_TEST_V2_20261018.html`
- RC5 original: `preview/PHALANX_RC5_ALPHA_DERIVED_20261017.html`
- Frozen map: `preview/PHX-OUT-024-MAP2-FROZEN-20261018.html`
- All three files must be deployed **in the same directory** because V2 uses relative URLs.
- Original OUT-024 SHA-256: `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`.

## Deployment status
- GitHub files present. V2 test source and its static integrity guard committed.
- Public URL `https://phalanx-alpha-rc5.nexus-phalanx-rc5-test.pages.dev/PHALANX_RC5_OUT024_ISOLATED_NAV_TEST_V2_20261018.html` was attempted through web retrieval; not accessible via that retrieval method. This does **not** establish a Cloudflare 404 or deployment failure.
- No verified deployment pipeline/config was found at common root paths `.github/workflows/cloudflare-pages.yml`, `.github/workflows/deploy.yml`, `wrangler.toml`, `wrangler.jsonc` or `package.json`. Other deployment configurations may exist.
- Do not claim the new test page is live until its exact URL and content are independently verified.

## Android acceptance (pending)
1. Open the deployed V2 entrypoint in Chrome Android.
2. Expand the Outpost section and tap `Outpost Map`.
3. Confirm OUT-024 (not historical Alpha23 or internal Alpha19 label), zoom, filters, fullscreen.
4. Tap `Zur Navigation`; confirm RC5 is displayed again and other pending items remain disabled.
5. Capture evidence and only then mark route accepted.

## Constraints
No main/production changes, no original FREEZE changes, no paid services, no manual upload loop. A test URL alone is not evidence of a working integration.
