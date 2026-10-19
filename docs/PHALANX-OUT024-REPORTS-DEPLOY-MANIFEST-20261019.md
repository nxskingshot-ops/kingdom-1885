# PHALANX isolated OUT-024 + Reports deployment manifest

Status: **PREPARED — NOT DEPLOYED**. Scope: test only. No production release, no main merge, no paid resources.

## Source of truth
Repository: `nxskingshot-ops/kingdom-1885`
Branch: `work/reports-out024-readonly-20261019`

| Relative source path | Git blob SHA |
|---|---|
| `preview/PHALANX_RC5_OUT024_REPORTS_ISOLATED_NAV_20261019.html` | `740c74b8a6c713ee62c7c19e4eef013fc2f69c72` |
| `preview/PHALANX_RC5_ALPHA_DERIVED_20261017.html` | `491a89a2a1ea5aa13ec6150d8f78fa8e93b6fb14` |
| `preview/PHX-OUT-024-MAP2-FROZEN-20261018.html` | `80cb3565ac8d12ea82a425e106096091e85878e8` |
| `preview/phalanx-reports-out024-local-adapter-20261019.html` | `db6abf090cb98a756d15d0e22e956c0a31d1813d` |
| `preview/phalanx-out024-report-normalizer-20261019.js` | `e07d07dca339260782d9553161174bf33340491c` |

## Deployment boundary
Use an **isolated test** Pages deployment only after confirming the existing no-cost Cloudflare configuration. Do not change production domain, deployment configuration, credentials, Supabase, frozen assets, or any source file listed above.

The HTML uses relative `./` links. Preserve these five filenames together at the same published directory level (e.g. copy the *contents* of `preview/` into the test publish root, not a nested directory). The canonical frozen map must remain byte-identical.

## Acceptance gate
1. Confirm the deployed URL returns the isolated wrapper containing `ISOLIERTER TEST` and the back button; a page showing only `Navigation V1` is **not sufficient**.
2. Open the RC5 menu: Territory Control > Outpost Map; verify OUT-024 map and back navigation.
3. Open Reports & History; verify local adapter, empty `[]` rejected, sample JSON report generated, back navigation.
4. Verify no production changes, no extra cost, and record the exact deployed commit and URL.

No deployment or mobile acceptance is claimed in this document.
