# PHALANX OUT-024 / Reports – isolated deploy gate (2026-10-19)

Status: **PREPARED, NOT DEPLOYED**. This document is not production authorization.

## Immutable source manifest (Git blob SHA-1)
All paths are relative to the repository root and must retain their relative `preview/` layout in the test deployment.

| File | Git blob SHA-1 |
| --- | --- |
| `preview/PHALANX_RC5_OUT024_REPORTS_ISOLATED_NAV_20261019.html` | `740c74b8a6c713ee62c7c19e4eef013fc2f69c72` |
| `preview/PHALANX_RC5_ALPHA_DERIVED_20261017.html` | `491a89a2a1ea5aa13ec6150d8f78fa8e93b6fb14` |
| `preview/PHX-OUT-024-MAP2-FROZEN-20261018.html` | `80cb3565ac8d12ea82a425e106096091e85878e8` |
| `preview/phalanx-reports-out024-local-adapter-20261019.html` | `db6abf090cb98a756d15d0e22e956c0a31d1813d` |
| `preview/phalanx-out024-report-normalizer-20261019.js` | `e07d07dca339260782d9553161174bf33340491c` |

Entry point: `preview/PHALANX_RC5_OUT024_REPORTS_ISOLATED_NAV_20261019.html`.

## Deployment preconditions
1. Verify an **isolated** Cloudflare Pages test project, destination branch, build output directory and free usage allowance. Do not infer these from an existing URL.
2. Confirm the selected branch's files match the manifest; abort on mismatches.
3. Preserve relative paths and all dependencies; this list identifies direct navigation dependencies, not a verified complete static asset closure.
4. Do **not** touch production, `main`, frozen map content, Supabase, credentials, backup snapshots, or canonical FREEZEs.
5. Deploy only after verifying the actual target and permission. No deployment is recorded by this document.

## Acceptance after deployment
- Confirm the exact isolated wrapper URL returns the wrapper, not a legacy navigation V1 page.
- Wrapper displays `ISOLIERTER TEST · RC5 → OUT-024`.
- Open Territory Control → Outpost Map; verify the frozen OUT-024 map and back navigation.
- Open Reports & History; verify manual-only JSON import, `[]` rejection and back navigation.
- Check Android viewport, scroll, touch controls, error status, and no unintended redirects.
- Record the deployed build identifier and tested URL. Do not label browser or Android acceptance as passed before observation.

## Known limits
- GitHub source tests and static navigation checks passed, but Android acceptance and Cloudflare deployment have **not** been verified.
- Reports uses manual input, not automatic map export or live synchronization.
- Cloudflare configuration/permissions have not been confirmed; no upload or build has been started.
