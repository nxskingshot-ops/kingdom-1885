# OUT-024 canonical Git blob independent verification — 2026-10-18

- Branch: `alpha/android-integrated-freeze-20261017`
- Path: `preview/PHX-OUT-024-MAP2-FROZEN-20261018.html`
- Git blob: `80cb3565ac8d12ea82a425e106096091e85878e8`
- Retrieval: GitHub Git blob API, not truncated file-content API.
- UTF-8 byte count independently computed from returned source: **1,105,961**; matches canonical lock.
- SHA-256 independently calculated over UTF-8 source bytes: `1a87afde964f8eacc730f8a2cd52d7067ebe06b40cc7fc1388c16ee59e3a043d`; **MATCH** with immutable Library original and canonical lock.
- This confirms exact source-byte identity of the Git blob at the observed ref. It does not prove that GitHub Actions executed successfully, nor deployed Cloudflare bytes, runtime behavior, or all 74 feature routes.

The frozen source was not modified. Production and FREEZEs remain unchanged.
